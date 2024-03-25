/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  Input,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
/** Internal Libraries **/
import { CommunicationEvents, ScreenType, CommunicationFacade, NotificationTemplateCategoryCode, SmsNotification, CommunicationEventTypeCode } from '@cms/case-management/domain';
import { StatusFlag } from '@cms/shared/ui-common';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { TextMessageEditorComponent } from '../text-message-editor/text-message-editor.component';
import { UserDataService } from '@cms/system-config/domain';
@Component({
  selector: 'case-management-send-text-message',
  templateUrl: './send-text-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendTextMessageComponent implements OnInit {

  @ViewChild(TextMessageEditorComponent) textMessageEditor!: TextMessageEditorComponent;
  /** Input properties **/
  @Input() notificationGroup!: any;
  @Input() entityId!: any;
  @Input() ddlMessageRecipients$!: Observable<any>;
  @Input() notificationDraftId!: string;
  @Input() clientCaseEligibilityId!: string;
  @Input() communicationSmsTypeCode!: string;
  @Input() isContinueDraftClicked!: boolean;
  @Input() isNewNotificationClicked!: boolean;

  /** Output properties  **/
  @Output() closeSendMessageEvent = new EventEmitter<CommunicationEvents>();
  @Output() loadInitialData = new EventEmitter();
  @Output() sendMessageEvent = new EventEmitter<SmsNotification>();
  @Output() smsEditorValueEvent = new EventEmitter<any>();
  /** Public properties **/
  ddlLetterTemplates$ = this.communicationFacade.ddlLetterTemplates$;
  ddlTemplates: any;
  isOpenSendMessageClicked!: boolean;
  isOpenMessageTemplate = false;
  isShowSendMessageConfirmPopupClicked = false;
  isShowSaveForLaterPopupClicked = false;
  formUiStyle: UIFormStyle = new UIFormStyle();
  isShowToPhoneNumbersLoader$ = new BehaviorSubject<boolean>(false);
  phoneNumbersSubscription$ = new Subscription();
  phoneNumbers!: any[];
  isClearPhoneNumbers = false;
  templateContent = '';
  smsMessages!: string[];
  documentTemplate!: any;
  messageRecipient!: any;
  templateTypeCode!: string;
  currentSmsData:any;
  selectedSmsTemplate!: any;
  loginUserId!: any;

  /** Constructor **/
  constructor(private readonly communicationFacade: CommunicationFacade,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly userDataService: UserDataService,
    private readonly ref: ChangeDetectorRef,) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.getLoggedInUserProfile();
    this.updateSendMessageFlag();
    this.addPhoneNumbersSubscription();
    if(this.isContinueDraftClicked){
      this.loadClientAndVendorDraftSmsTemplates();
    }else if(this.isNewNotificationClicked){
      this.openNewSmsClicked();
    }else{
      this.loadSmsTemplates();
    }
  }
  ngOnDestroy(): void {
    this.phoneNumbersSubscription$.unsubscribe();
  }

  loadClientAndVendorDraftSmsTemplates() {
    this.loaderService.show();
    this.communicationFacade.loadDraftNotificationRequest(this.entityId, this.communicationSmsTypeCode)
    .subscribe({
      next: (data: any) =>{
        if (data?.length > 0) {
          this.ddlTemplates = data;
            this.handleDdlTextMessageValueChange(data[0]);
          this.ref.detectChanges();
        }else{
          this.loadSmsTemplates();
        }
      this.loaderService.hide();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.loggingService.logException(err);
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
    },
  });
  }

  openNewSmsClicked(){
    this.loaderService.show();
    this.communicationFacade.deleteNotificationDraft(this.notificationDraftId)
        .subscribe({
          next: (data: any) =>{
          if (data === true) {
            this.loadSmsTemplates();
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
        },
      });
  }

  /** Private methods **/
  private addPhoneNumbersSubscription() {
    this.phoneNumbersSubscription$ = this.ddlMessageRecipients$
      .pipe(
        map((ph) => ph.map((p: any) => ({ ...p, formattedPhoneNbr: `${this.formatPhoneNumber(p.phoneNbr)} - ${p.deviceTypeCode} ` })))
      )
      .subscribe((phoneResp: any) => {
        if (this.isClearPhoneNumbers) {
          this.phoneNumbers = [];
        } else {
          this.phoneNumbers = phoneResp.filter((phone: any) => phone.smsTextConsentFlag === StatusFlag.Yes);
          this.isShowToPhoneNumbersLoader$.next(false);
        }
        this.isClearPhoneNumbers = false;
      });
  }

  private formatPhoneNumber(phoneNumberString: string) {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned?.match(/^(1)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      const intlCode = (match[1] ? '+1 ' : '');
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return '';
  }

  private loadSmsTemplates() {
    this.loaderService.show();
    this.communicationFacade.loadNotificationTemplates(this.notificationGroup, NotificationTemplateCategoryCode.SMS) // define an enum for category
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.ddlTemplates = data;
            this.ref.detectChanges();
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
        },
      });
  }

  private updateSendMessageFlag() {
    if (this.notificationGroup) {
      this.isOpenSendMessageClicked = true;
    } else {
      this.isOpenSendMessageClicked = false;
    }
  }

  /** Internal event methods **/
  onSaveForLaterClicked() {
    this.isOpenSendMessageClicked = false;
    this.isShowSaveForLaterPopupClicked = true;
  }

  onEditMessagesClicked() {
    this.isShowSendMessageConfirmPopupClicked = false;
    this.isOpenSendMessageClicked = true;
  }

  onSendMessageConfirmClicked() {
    this.isOpenSendMessageClicked = false;
    this.isShowSendMessageConfirmPopupClicked = true;
  }

  onCloseSendMessageClicked() {
    this.isShowSaveForLaterPopupClicked = false;
    this.closeSendMessageEvent.emit(CommunicationEvents.Close);
  }

  onCloseSendMessageConfirmClicked() {
    this.isShowSendMessageConfirmPopupClicked = false;
    if (this.notificationGroup === ScreenType.Authorization) {
      this.closeSendMessageEvent.emit(CommunicationEvents.Print);
    } else if (this.notificationGroup === ScreenType.Case360PageSMS) {
      this.isShowSendMessageConfirmPopupClicked = false;
    }
  }

  onSendMessagesClick() {
    const sms: SmsNotification = {
      templateId: this.documentTemplate?.documentTemplateId ?? this.selectedSmsTemplate.notifcationDraftId,
      entity: this.notificationGroup,
      entityId: this.entityId,
      recepients: this.messageRecipient?.phoneNbr ? [('+1' + this.messageRecipient?.phoneNbr)] : null,
      Messages: this.textMessageEditor.messages,
      clientCaseEligibilityId: this.clientCaseEligibilityId,
      typeCode: CommunicationEventTypeCode.ClientSMS
    };
    this.sendSms(sms);
  }

  private sendSms(sms: SmsNotification) {
    this.loaderService.show();
    this.communicationFacade.sendSms(sms).subscribe({
      next: (template: any) => {
        this.onCloseSendMessageConfirmClicked();
        this.onCloseSendMessageClicked();
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Sms sent.');
        this.loaderService.hide();
      },
      error: (err: any) => {
        this.loaderService.hide();
        this.loggingService.logException(err);
        this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
      },
    });
  }

  onCloseSaveForLaterClicked() {
    this.isShowSaveForLaterPopupClicked = false;
  }

  onSaveSmsForLaterClicked(){
    this.isShowSaveForLaterPopupClicked = true;
    this.smsEditorValueEvent.emit(this.currentSmsData);
    this.selectedSmsTemplate.messages = this.textMessageEditor.messages;
    this.saveClientAndVendorNotificationForLater(this.selectedSmsTemplate);
  }

  saveClientAndVendorNotificationForLater(draftTemplate: any) {
    this.loaderService.show();
    let smsRequestFormdata = this.communicationFacade.prepareClientAndVendorLetterFormData(this.entityId, this.loginUserId);
    let draftNotificationRequest = this.communicationFacade.prepareClientAndVendorSmsData(smsRequestFormdata, draftTemplate, this.messageRecipient, []);
        this.communicationFacade.saveClientAndVendorNotificationForLater(draftNotificationRequest)
        .subscribe({
          next: (data: any) =>{
          if (data) {
            this.onCloseSaveForLaterClicked();
            this.onCloseSendMessageClicked();
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Sms Saved As Draft');
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.isShowSaveForLaterPopupClicked = true;
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
        },
      });
  }

  loadTemplateContent(documentTemplateId: string) {
    if (documentTemplateId) {
      this.loaderService.show();
      this.communicationFacade.loadTemplateById(documentTemplateId)
        .subscribe({
          next: (template: any) => {
            if (template) {
              this.templateContent = template.templateContent;
              this.selectedSmsTemplate = template;
              this.handleSmsEditor(template);
              this.isOpenMessageTemplate=true;
              this.smsEditorValueEvent.emit(template);
              this.ref.detectChanges();
            }
            this.loaderService.hide();
          },
          error: (err: any) => {
            this.loaderService.hide();
            this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
          },
        });
    }
  }

  /** External event methods **/
  handleDdlTextMessageValueChange(event: any) {
    this.isOpenMessageTemplate = true;
    this.isClearPhoneNumbers = true;
    this.isShowToPhoneNumbersLoader$.next(true);
    if(event.documentTemplateId){
        this.loaderService.show();
        this.communicationFacade.loadTemplateById(event.documentTemplateId)
          .subscribe({
            next: (template: any) => {
              if (template) {
                this.templateContent = template.templateContent;
                this.selectedSmsTemplate = template;
                this.handleSmsEditor(template);
                this.isOpenMessageTemplate=true;
                this.smsEditorValueEvent.emit(template);
                this.ref.detectChanges();
              }
              this.loaderService.hide();
            },
            error: (err: any) => {
              this.loaderService.hide();
              this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
            },
          });
      }else{
      this.templateContent = event.templateContent;
      this.smsMessages = event.messages?.map((item: any)=> item);
      this.messageRecipient = {
        'formattedPhoneNbr': this.formatPhoneNumber(event?.recepients),
        'phoneNbr': event.recepients
      };
      this.selectedSmsTemplate = event;
      this.handleSmsEditor(event);
      this.smsEditorValueEvent.emit(event);
      this.documentTemplate = {
        'description': event.description,
        'documentTemplateId': event.notificationTemplateId
      };
      this.ref.detectChanges();
    }
    this.isShowToPhoneNumbersLoader$.next(false);
  }

  handleSmsEditor(event: any) {
    this.currentSmsData = event;
  }

  showHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {
      if(type == SnackBarNotificationType.ERROR)
      {
        const err= subtitle;
        this.loggingService.logException(err)
      }
        this.notificationSnackbarService.manageSnackBar(type,subtitle)
        this.hideLoader();
  }

  hideLoader()
  {
    this.loaderService.hide();
  }

  getLoggedInUserProfile(){
    this.loaderService.show();
    this.userDataService.getProfile$.subscribe((profile:any)=>{
      if(profile?.length>0){
        this.loginUserId= profile[0]?.loginUserId;
      }
    })
    this.loaderService.hide();
  }
}
