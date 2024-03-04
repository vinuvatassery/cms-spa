/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  Input,
  EventEmitter,
  ViewChild,
} from '@angular/core';
/** Internal Libraries **/
import { CommunicationEvents, ScreenType, CommunicationFacade, NotificationTemplateCategoryCode, SmsNotification } from '@cms/case-management/domain';
import { StatusFlag } from '@cms/shared/ui-common';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService, LoggingService, NotificationSnackbarService } from '@cms/shared/util-core';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { TextMessageEditorComponent } from '../text-message-editor/text-message-editor.component';
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

  /** Output properties  **/
  @Output() closeSendMessageEvent = new EventEmitter<CommunicationEvents>();
  @Output() loadInitialData = new EventEmitter();
  @Output() sendMessageEvent = new EventEmitter<SmsNotification>();
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
  documentTemplate!: any;
  messageRecipient!: any;

  /** Constructor **/
  constructor(private readonly communicationFacade: CommunicationFacade,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.updateSendMessageFlag();
    this.loadSmsTemplates();
    this.addPhoneNumbersSubscription();
  }
  ngOnDestroy(): void {
    this.phoneNumbersSubscription$.unsubscribe();
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
      Messages: this.textMessageEditor.messages
    };
    console.log(sms);

    this.sendSms(sms);

  }

  private sendSms(sms: SmsNotification) {
    this.loaderService.show();
    this.communicationFacade.sendSms(sms).subscribe({
      next: (template: any) => {
        this.onCloseSendMessageConfirmClicked();
        this.loaderService.hide();
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
              // this.selectedTemplate = data;
              // this.handleEmailEditor(data);
              // this.emailEditorValueEvent.emit(data);
              // this.isClearEmails =true;
              // this.isShowToEmailLoader$.next(true);
              // this.isOpenDdlEmailDetails = true;
              // this.selectedEmail = [];
              // this.selectedEmail.push(this.toEmail[0]?.trim());
              // this.selectedToEmail = this.selectedEmail;
              // this.emailSubject = data.description;
              // this.showToEmailLoader = false;
              // this.ref.detectChanges();
            }

            this.loaderService.hide();
          },
          error: (err: any) => {
            this.loaderService.hide();
            //this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
          },
        });
    }
  }

  /** External event methods **/
  handleDdlTextMessageValueChange(event: any) {
    this.isOpenMessageTemplate = true;
    this.isClearPhoneNumbers = true;
    this.isShowToPhoneNumbersLoader$.next(true);
    this.loadInitialData.emit();
    this.loadTemplateContent(event.documentTemplateId);
  }
}
