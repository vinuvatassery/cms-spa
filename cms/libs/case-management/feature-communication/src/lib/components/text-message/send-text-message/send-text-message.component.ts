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
import { CommunicationEvents, ScreenType, CommunicationFacade, NotificationTemplateCategoryCode, SmsNotification } from '@cms/case-management/domain';
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
  @Input() isContinueDraftClicked!: boolean;
  @Input() isNewNotificationClicked!: boolean;
  @Input() notificationDraftId!: string;
  @Input() clientCaseEligibilityId!: string;
  @Input() communicationSmsTypeCode!: string;

  /** Output properties  **/
  @Output() closeSendMessageEvent = new EventEmitter<CommunicationEvents>();
  @Output() loadInitialData = new EventEmitter();
  @Output() sendMessageEvent = new EventEmitter<SmsNotification>();
  @Output() smsEditorValueEvent = new EventEmitter<any>();
  @Output() editorValue = new EventEmitter<any>();
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
  templateTypeCode!: string;
  documentTemplate!: any;
  messageRecipient!: any;
  selectedTemplate!: any;
  currentSmsData:any;
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
    this.loadSmsTemplates();
    if(this.isContinueDraftClicked){
      this.loadClientAndVendorDraftSmsTemplates();
    }else if(this.isNewNotificationClicked){
      this.openNewSmsClicked();
    }else{
      this.loadSmsTemplates();
    }
    this.addPhoneNumbersSubscription();
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
           this.handleDdlEmailValueChange(data[0]);
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

  handleDdlEmailValueChange(event: any) {
    this.selectedTemplate = event;
    if(event.documentTemplateId){
    this.loaderService.show();
    this.communicationFacade.loadTemplateById(event.documentTemplateId)
    .subscribe({
      next: (data: any) =>{
      if (data) {
        this.selectedTemplate = data;
        this.handleSmsEditor(data);
        this.smsEditorValueEvent.emit(data);
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
else{
  this.selectedTemplate = event;
  this.handleSmsEditor(event);
  // this.openDdlLetterEvent.emit();
  this.ref.detectChanges();
  }
  }

  handleSmsEditor(smsData: any) {
    this.currentSmsData = smsData;
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

  // private loadDdlLetterTemplates() {
  //   this.communicationFacade.loadDdlLetterTemplates();
  //   this.ddlLetterTemplates$.subscribe({
  //     next: (ddlTemplates) => {
  //       this.ddlTemplates = ddlTemplates.filter((templates: any) => {
  //         return templates.screenName === this.data;
  //       });
  //     },
  //     error: (err: any) => {
  //       console.log(err);
  //     },
  //   });
  // }

  private loadSmsTemplates() {
    //this.loaderService.show();
    this.communicationFacade.loadNotificationTemplates(this.notificationGroup, NotificationTemplateCategoryCode.SMS) // define an enum for category
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.ddlTemplates = data;
            //this.ref.detectChanges();
          }
          //this.loaderService.hide();
        },
        error: (err: any) => {
          //this.loaderService.hide();
          //this.loggingService.logException(err);
          //this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
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
    var sms: SmsNotification = {
      templateId: this.documentTemplate?.documentTemplateId,
      entity: this.notificationGroup,
      entityId: this.entityId,
      recepients: [('+1' + this.messageRecipient?.phoneNbr)],
      Messages: this.textMessageEditor.messages,
      clientCaseEligibilityId: this.clientCaseEligibilityId,
      typeCode: this.templateTypeCode
    };
    this.sendSms(sms);
  }

  private sendSms(sms: SmsNotification) {
    this.loaderService.show();
    this.communicationFacade.sendSms(sms).subscribe({
      next: (template: any) => {
        if(template == true){
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'SMS Text Sent.');
        this.onCloseSendMessageConfirmClicked();
        this.loaderService.hide();
        }
      },
      error: (err: any) => {
        this.loaderService.hide();
      },
    });
  }

  onCloseSaveForLaterClicked() {
    this.isShowSaveForLaterPopupClicked = false;
  }

  loadTemplateContent(documentTemplateId: string) {
    if (documentTemplateId) {
      this.loaderService.show();
      this.communicationFacade.loadTemplateById(documentTemplateId)
        .subscribe({
          next: (template: any) => {
            if (template) {
              console.log(template);
              this.templateContent = template.templateContent;
              this.templateTypeCode = template.templateTypeCode;
              this.selectedTemplate = template;
              this.handleSMSEditor(template);
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

  handleSMSEditor(event: any) {
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

  /** External event methods **/
  handleDdlTextMessageValueChange(event: any) {
    this.isOpenMessageTemplate = true;
    this.isClearPhoneNumbers = true;
    this.isShowToPhoneNumbersLoader$.next(true);
    this.loadInitialData.emit();
    this.loadTemplateContent(event.documentTemplateId);
  }

  onSaveForLaterTemplateClicked() {
    this.isShowSaveForLaterPopupClicked = true;
    this.smsEditorValueEvent.emit(this.currentSmsData);
    this.selectedTemplate.templateContent = this.currentSmsData.templateContent;
      this.saveClientAndVendorNotificationForLater(this.selectedTemplate);
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

  saveClientAndVendorNotificationForLater(draftTemplate: any) {
    this.loaderService.show();
    let smsRequestFormdata = this.communicationFacade.prepareClientAndVendorLetterFormData(this.entityId, this.loginUserId);
    let draftNotificationRequest = this.communicationFacade.prepareClientAndVendorEmailData(smsRequestFormdata, draftTemplate, []);
      if(draftTemplate?.notifcationDraftId == undefined || draftTemplate?.notifcationDraftId == null){
        this.communicationFacade.saveClientAndVendorNotificationForLater(draftNotificationRequest)
        .subscribe({
          next: (data: any) =>{
          if (data) {
            this.onCloseSaveForLaterClicked();
            this.onCloseSendMessageClicked()
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Email Saved As Draft');
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
  }
}
