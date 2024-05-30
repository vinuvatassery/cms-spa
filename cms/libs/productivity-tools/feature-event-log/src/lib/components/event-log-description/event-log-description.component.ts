import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ChangeDetectorRef, OnDestroy, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EventLogFacade, EventTypeCode } from '@cms/productivity-tools/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'productivity-tools-event-log-description',
  templateUrl: './event-log-description.component.html',
  styleUrls: ['./event-log-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class EventLogDescriptionComponent implements OnDestroy {
  @ViewChild('viewLetterEmailTextDialog', { read: TemplateRef })
  viewLetterEmailTextDialog!: TemplateRef<any>;
  @ViewChild('confirmationDialog', { read: TemplateRef })
  confirmationDialog!: TemplateRef<any>;
  @Input() content: string = '';
  @Input() limit: number = 0;
  @Input() completeWords: boolean = false;
  @Input() eventId: any;
  @Input() userEventFlag: any;
  @Input() eventLogId: any

  @Output() downloadOldAttachmentEvent = new EventEmitter();

  urlSeparator: string = '!~!';
  titleOrlinkSeparator: string = '`';
  baseUrl: string = 'baseurl';
  anchorArray: any[] = [];
  data: any = "";
  hasUrl: boolean = false;
  isViewLetter: boolean = false;
  isViewEmail: boolean = false;
  isViewSmsText: boolean = false;
  viewText: string = '';
  isViewLetterEmailTextDialog: any;
  ViewLetter: string = "{View Letter}";
  ViewEmail: string = "{View Email}";
  ViewSmsText: string = "{View Text}";
  sanitizedHtml: any;
  bodyText: any;
  notificationEmail$ = this.eventLogFacade.notificationEmail$;
  notificationLetter$ = this.eventLogFacade.notificationLetter$;
  smsLog$ = this.eventLogFacade.smsLog$;
  notificationEmail: any;
  previewContent: any;
  toEmailAddress: any;
  ccEmailAddress: any;
  bccEmailAddress: any;
  attachments: any;
  headerText: any;
  buttonText: any;
  createdUser: any
  createdDate: any;
  attachmentType: any;
  mailingAddress: any = null;
  mailCode: any = null;
  entityTypeCode: any;
  sourceEntityTypeCode: any;
  eventTypeCode: any;
  entityId: any;
  creatorId: any;
  smsTo: any;
  notificationEmailSubscription!: Subscription;
  notificationLetterSubscription!: Subscription;
  smsId: any;
  infoText: any;
  subject: any;
  confirmationTitle: string = 'Send Email';
  confirmationModelContent: string = 'This action cannot be undone. The client will receive an SMS text if applicable';
  confirmationButtonText: string = 'Re-Send';
  isConfirmationDialogVisible:any;

  constructor(private sanitizer: DomSanitizer, private dialogService: DialogService, private readonly eventLogFacade: EventLogFacade,
    private readonly cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.notificationEmailSubscriptionInit();
    this.notificationLetterSubscriptionInit();
    this.notificationSmsSubscriptionInit();
    this.formatContent();
    this.content = this.data;
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(this.content);

  }

  ngOnDestroy(): void {
    this.notificationLetterSubscription.unsubscribe();
    this.notificationEmailSubscription.unsubscribe();
  }

  setHasUrl(anchorArray: any) {
    let array = anchorArray.filter((res: any) =>
      res.indexOf(this.baseUrl) !== -1
    );
    return array.length > 0;
  }

  formatContent() {
    if (this.userEventFlag == "Y") {
      this.hasUrl = false;
      this.data = this.content;
    }
    else {
      this.anchorArray = [];
      let anchorArray = this.content.split(this.urlSeparator);
      this.hasUrl = this.setHasUrl(anchorArray);
      if (this.content.indexOf(this.baseUrl) !== -1) {
        this.setHasUrlConstructingData(anchorArray);
      }
      else if (this.content.indexOf(this.urlSeparator) !== -1 && this.content.indexOf(this.baseUrl) == -1) {
        this.setAnchorWithOutBaseUrl(anchorArray);
      }
      else {
        this.setHasViewEmailAddressSMSTextFlag();
      }
    }
  }

  setAnchorWithOutBaseUrl(anchorArray: any) {
    this.data = anchorArray[0];
    anchorArray.forEach((item: any) => {
      let itemDataArray = item.split(this.titleOrlinkSeparator);
      if (itemDataArray.length > 1) {
        let object = {
          url: itemDataArray[0],
          text: itemDataArray[1],
          title: itemDataArray[1],
          sanitizedHtml: this.sanitizer.bypassSecurityTrustHtml(itemDataArray[1]),
          isBaseUrlFlag: false,
          isFilePathUrl: true
        }
        this.anchorArray.push(object);
      }
    });
    this.hasUrl = anchorArray.length > 1;
  }

  setHasUrlConstructingData(anchorArray: any) {
    anchorArray.forEach((item: any) => {
      if (item.indexOf(this.baseUrl) !== -1) {
        let itemDataArray = item.split(this.titleOrlinkSeparator);
        let object = {
          url: itemDataArray[0].replace(this.baseUrl, window.location.origin),
          text: itemDataArray[1],
          title: itemDataArray[1],
          sanitizedHtml: this.sanitizer.bypassSecurityTrustHtml(itemDataArray[1]),
          isBaseUrlFlag: true,
          isFilePathUrl: false
        }
        this.anchorArray.push(object);
        this.data += object.text;
      }
      else {
        let object = {
          url: "",
          text: item,
          title: "",
          sanitizedHtml: this.sanitizer.bypassSecurityTrustHtml(item),
          isBaseUrlFlag: false,
          isFilePathUrl: false
        }
        this.anchorArray.push(object);
        this.data += object.text;
      }
    });
  }

  setHasViewEmailAddressSMSTextFlag() {
    this.isViewLetter = this.content.indexOf(this.ViewLetter) !== -1;
    this.isViewEmail = this.content.indexOf(this.ViewEmail) !== -1;
    this.isViewSmsText = this.content.indexOf(this.ViewSmsText) !== -1;
    this.data = this.content;
    this.data = this.data.replace(this.ViewLetter, '');
    this.data = this.data.replace(this.ViewEmail, '');
    this.data = this.data.replace(this.ViewSmsText, '');
    this.hasUrl = (this.isViewLetter || this.isViewEmail || this.isViewSmsText);
    this.viewText = this.setViewText();
  }
  setViewText() {
    if (this.isViewLetter) {
      return this.ViewLetter.replace('{', '').replace('}', '');
    }
    if (this.isViewEmail) {
      return this.ViewEmail.replace('{', '').replace('}', '');;
    }
    if (this.isViewSmsText) {
      return this.ViewSmsText.replace('{', '').replace('}', '');;
    }
    return "";
  }

  getViewFlag() {
    return (this.isViewEmail || this.isViewLetter || this.ViewSmsText);
  }

  OpenModalPopUp() {
    this.resetValues();
    this.eventLogFacade.loadEventLog(this.eventLogId).subscribe((eventLog: any) => {
      if (eventLog?.entityTypeCode === 'EMAIL_LOG') {
        this.bodyText = 'Click Re-send to send the message again. Attachments will be included in the email.';
        this.headerText = 'View and Re-Send Email';
        this.buttonText = 'RE-SEND'
        this.attachmentType = "email";
        this.infoText = "Sent"
        this.eventLogFacade.loadNotificationEmail(this.eventLogId);
      }
      else if (eventLog?.entityTypeCode === 'LETTER_LOG') {
        this.bodyText = 'Click Re-print to print the letter again. Attachments will be printed in addition to the letter.';
        this.headerText = 'View and Recreate Letter';
        this.buttonText = 'RE-PRINT';
        this.attachmentType = "letter";
        this.infoText = "Printed"
        this.eventLogFacade.loadNotificationLetter(this.eventLogId);
      }
      else if (eventLog?.entityTypeCode === 'SMS_LOG') {
        this.bodyText = 'Click Re-send to send the messages again.';
        this.headerText = 'View and Resend SMS';
        this.buttonText = 'RE-SEND';
        this.attachmentType = null;
        this.infoText = "Sent"
        this.eventLogFacade.loadNotificationSms(this.eventLogId);
      }
     
      this.onViewLetterEmailTextDialogClicked(this.viewLetterEmailTextDialog);
    });
  }

  onViewLetterEmailTextDialogClicked(template: TemplateRef<unknown>): void {
    this.isViewLetterEmailTextDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-np just_start app-c-modal-xlg'
    });
  }
  onCloseLetterEmailSmsTextClicked() {
    this.isViewLetterEmailTextDialog.close();
    this.isConfirmationDialogVisible.close();
    this.cdr.detectChanges();
  }
  downloadOldAttachment(path: any) {
    this.downloadOldAttachmentEvent.emit(path);
  }

  notificationEmailSubscriptionInit() {
    this.notificationEmailSubscription = this.notificationEmail$.subscribe((notificationLog: any) => {
      this.setValuesForNotification(notificationLog);
    });
  }

  notificationLetterSubscriptionInit() {
    this.notificationLetterSubscription = this.notificationLetter$.subscribe((notificationLog: any) => {
      this.setValuesForNotification(notificationLog);
    });
  }

  notificationSmsSubscriptionInit() {
    this.notificationLetterSubscription = this.smsLog$.subscribe((notificationLog: any) => {
      this.setValuesForNotification(notificationLog);
    });
  }

  setValuesForNotification(notificationLog: any) {
    this.eventLogFacade.showLoader()
    this.previewContent = notificationLog?.entityTypeCode != 'SMS_LOG' ? this.getSanitizedHtml(notificationLog?.previewContent) : notificationLog?.previewContent;
    this.attachments = notificationLog?.attachments;
    this.createdUser = notificationLog?.createdUser;
    this.createdDate = notificationLog?.createdDate;
    this.entityTypeCode = notificationLog?.entityTypeCode;
    this.eventTypeCode = notificationLog?.eventTypeCode;
    this.sourceEntityTypeCode = notificationLog?.sourceEntityTypeCode;
    this.entityId = notificationLog?.entityId;
    this.creatorId = notificationLog?.creatorId;
    this.mailingAddress = notificationLog?.mailingAddress;
    this.subject = notificationLog?.subject
    if (notificationLog?.entityTypeCode === 'EMAIL_LOG') {
      this.toEmailAddress = notificationLog?.emailAddress?.TO;
      this.ccEmailAddress = notificationLog?.emailAddress?.CC;
      this.bccEmailAddress = notificationLog?.emailAddress?.BCC;
    }
    else if (notificationLog?.entityTypeCode === 'LETTER_LOG') {
      this.toEmailAddress = null;
      this.ccEmailAddress = null;
      this.bccEmailAddress = null;
      this.subject = null
      this.mailCode = notificationLog?.mailCode;
    }
    else if (notificationLog?.entityTypeCode === 'SMS_LOG') {
      this.smsTo = notificationLog?.to;
      this.smsId = notificationLog?.smsLogId
      this.subject = null
      this.toEmailAddress = null;
      this.ccEmailAddress = null;
      this.bccEmailAddress = null;
    }
    this.cdr.detectChanges();
    this.eventLogFacade.hideLoader();
  }

  resetValues() {
    this.toEmailAddress = null;
    this.ccEmailAddress = null;
    this.bccEmailAddress = null;
    this.toEmailAddress = null;
    this.ccEmailAddress = null;
    this.bccEmailAddress = null;
    this.mailCode = null;
    this.smsTo = null;
    this.smsId = null;
    this.previewContent = null;
    this.attachments = null;
    this.createdUser = null;
    this.createdDate = null;
    this.entityTypeCode = null;
    this.eventTypeCode = null;
    this.sourceEntityTypeCode = null;
    this.entityId = null;
    this.creatorId = null;
    this.mailingAddress = null;
  }

  viewAttachment(item: any) {
    this.eventLogFacade.showLoader()
    this.eventLogFacade.loadAttachmentPreview(item.logAttachmentId, this.attachmentType).subscribe({
      next: (data: any) => {
        if (data) {
          const fileUrl = window.URL.createObjectURL(data);
          window.open(fileUrl, "_blank");
        }
        this.eventLogFacade.hideLoader();
      },
      error: (err: any) => {
        this.eventLogFacade.hideLoader()
        this.eventLogFacade.showHideSnackBar(SnackBarNotificationType.ERROR, "File is not found at location.");
      },
    });
  }

  reSendNotification() {
    if (this.entityTypeCode === "EMAIL_LOG") {
      this.eventLogFacade.showLoader()
      this.eventLogFacade.reSentEmailNotification(this.eventLogId).subscribe({
        next: (data: any) => {
          this.onCloseLetterEmailSmsTextClicked();
          this.eventLogFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, data.message);
          this.eventLogFacade.hideLoader();
        },
        error: (err: any) => {
          this.eventLogFacade.hideLoader();
          this.onCloseLetterEmailSmsTextClicked();
          this.eventLogFacade.showHideSnackBar(SnackBarNotificationType.ERROR, "Error in re-sent-email.");
        },
      });
    }
    else if (this.entityTypeCode === "LETTER_LOG") {
      this.eventLogFacade.showLoader()
      this.eventLogFacade.reSentLetterNotification(this.eventLogId).subscribe({
        next: (data: any) => {
          this.onCloseLetterEmailSmsTextClicked();
          const fileUrl = window.URL.createObjectURL(data);
          const documentName = this.getFileNameFromTypeCode(this.eventTypeCode);
          const downloadLink = document.createElement('a');
          downloadLink.href = fileUrl;
          downloadLink.download = documentName;
          downloadLink.click();
          this.eventLogFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Letter(s) re-sent! An event has been logged');
          this.cdr.detectChanges()
          this.eventLogFacade.hideLoader();
        },
        error: (err: any) => {
          this.eventLogFacade.hideLoader();
          this.onCloseLetterEmailSmsTextClicked();
          this.eventLogFacade.showHideSnackBar(SnackBarNotificationType.ERROR, "Error in re-print-letter.");
        },
      });
    }
    else if (this.entityTypeCode === "SMS_LOG") {
      this.eventLogFacade.showLoader()
      this.eventLogFacade.reSendSmsNotification(this.eventLogId).subscribe({
        next: (data: any) => {
          this.onCloseLetterEmailSmsTextClicked();
          this.eventLogFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, data.message);
          this.cdr.detectChanges()
          this.eventLogFacade.hideLoader();
        },
        error: (err: any) => {
          this.eventLogFacade.hideLoader();
          this.onCloseLetterEmailSmsTextClicked();
          this.eventLogFacade.showHideSnackBar(SnackBarNotificationType.ERROR, "Error in sms sent.");
        },
      });
    }
  }

  getFileNameFromTypeCode(typeCode: string): string {
    switch (typeCode) {
      case EventTypeCode.LetterTypeCode:
        return "Client Letter_" + this.entityId + ".zip";
      case EventTypeCode.VendorLetter:
        return "Vendor Letter+" + this.entityId + ".zip";
      case EventTypeCode.ApplicationAuthorizationLetter:
        return "Application Authorization Letter.zip";
      case EventTypeCode.CerAuthorizationLetter:
        return "CER Authorization Letter.zip";
      case EventTypeCode.PendingLetterGenerated:
        return "Pending Notice Letter.zip";
      case EventTypeCode.RejectionLetterGenerated:
        return "Rejection Notice Letter.zip";
      case EventTypeCode.ApprovalLetterGenerated:
        return "Approval Notice Letter.zip";
      case EventTypeCode.DisenrollmentLetterGenerated:
        return "Disenrollment Notice Letter.zip";
      default:
        return "Letter_" + this.entityId + ".zip";
    }
  }

  private getSanitizedHtml(currentEmailData: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(currentEmailData);
  }

  openConfirmation() {
    if (this.isViewLetter) {
      this.confirmationTitle = 'Print Letter?';
      this.confirmationModelContent = 'This action cannot be undone. The client will receive an SMS text if applicable.';
      this.confirmationButtonText = 'RE-PRINT';
      this.openConfirmationPopup();
    }
    else if (this.isViewEmail) {
      this.confirmationTitle = 'Send Email?';
      this.confirmationModelContent = 'This action cannot be undone. The client will receive an SMS text if applicable.';
      this.confirmationButtonText = 'RE-SEND';
      this.openConfirmationPopup();
    }
    else if (this.isViewSmsText) {
      this.confirmationTitle = 'Send SMS?';
      this.confirmationModelContent = 'This action cannot be undone.';
      this.confirmationButtonText = 'RE-SEND';
      this.openConfirmationPopup();
    }
  }

  closeConfirmation() {
    this.isConfirmationDialogVisible.close();
    this.cdr.detectChanges();
  }

  openConfirmationPopup(){
    this.isConfirmationDialogVisible = this.dialogService.open({
      content: this.confirmationDialog,
      cssClass: 'app-c-modal app-c-modal-np just_start app-c-modal-xlg'
    });
  }
}
