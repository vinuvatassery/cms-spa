import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { EventLogFacade, EventTypeCode } from '@cms/productivity-tools/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';

@Component({
  selector: 'productivity-tools-event-log-description',
  templateUrl: './event-log-description.component.html',
  styleUrls: ['./event-log-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventLogDescriptionComponent {
  @Input() content: string = '';
  @Input() limit: number = 0;
  @Input() completeWords: boolean = false;
  @Input() eventId:any;
  @Input() userEventFlag:any;
  @Input() eventLogId:any

  @Output() downloadOldAttachmentEvent = new EventEmitter();

  urlSeparator:string= '!~!';
  titleOrlinkSeparator:string= '`';
  baseUrl:string='baseurl';
  anchorArray:any[]=[];
  data:any="";
  hasUrl:boolean=false;
  isViewLetter:boolean = false;
  isViewEmail:boolean = false;
  isViewSmsText:boolean = false;
  viewText:string = '';
  isViewLetterEmailTextDialog:boolean = false;
  ViewLetter:string = "{View Letter}";
  ViewEmail:string = "{View Email}";
  ViewSmsText:string = "{View Text(s)}";
  sanitizedHtml:any;
  bodyText:any;
  notificationEmail$  = this.eventLogFacade.notificationEmail$;
  notificationLetter$  = this.eventLogFacade.notificationLetter$;
  notificationEmail:any;
  previewContent:any;
  toEmailAddress:any;
  ccEmailAddress:any;
  bccEmailAddress:any;
  attachments:any;
  headerText:any;
  buttonText:any;
  createdUser:any
  createdDate:any;
  attachmentType:any;
  mailingAddress:any = null;
  mailCode:any=null;
  entityTypeCode:any;
  eventTypeCode:any;
  entityId:any;

  constructor(private sanitizer : DomSanitizer, private readonly eventLogFacade: EventLogFacade,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.notificationEmailSubscriptionInit();
    this.notificationLetterSubscriptionInit();
    this.formatContent();
    this.content = this.data;
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(this.content);
  }

  setHasUrl(anchorArray:any)
  {
    let array = anchorArray.filter((res: any) =>
      res.indexOf(this.baseUrl) !== -1
    );
    return array.length > 0;
  }

  formatContent()
  {
    if(this.userEventFlag=="Y")
    {
      this.hasUrl = false;
      this.data = this.content;
    }
    else
    {
      this.anchorArray=[];
      let anchorArray = this.content.split(this.urlSeparator);
      this.hasUrl = this.setHasUrl(anchorArray);
      if(this.content.indexOf(this.baseUrl) !== -1){
        this.setHasUrlConstructingData(anchorArray);
      }
      else if(this.content.indexOf(this.urlSeparator) !== -1 && this.content.indexOf(this.baseUrl) == -1)
      {
        this.setAnchorWithOutBaseUrl(anchorArray);
      }
      else
      {
        this.setHasViewEmailAddressSMSTextFlag();
      }
    }
  }

  setAnchorWithOutBaseUrl(anchorArray:any)
  {
    this.data = anchorArray[0];
    anchorArray.forEach((item: any) => {
        let itemDataArray = item.split(this.titleOrlinkSeparator);
        if(itemDataArray.length>1)
        {
          let object = {
            url : itemDataArray[0],
            text : itemDataArray[1],
            title : itemDataArray[1],
            sanitizedHtml : this.sanitizer.bypassSecurityTrustHtml(itemDataArray[1]),
            isBaseUrlFlag : false ,
            isFilePathUrl : true
          }
          this.anchorArray.push(object);
        }
    });
    this.hasUrl = anchorArray.length >1;
  }

  setHasUrlConstructingData(anchorArray:any)
  {
    anchorArray.forEach((item: any) => {
      if(item.indexOf(this.baseUrl) !== -1){
        let itemDataArray = item.split(this.titleOrlinkSeparator);
        let object = {
          url : itemDataArray[0].replace(this.baseUrl,window.location.origin),
          text : itemDataArray[1],
          title : itemDataArray[1],
          sanitizedHtml : this.sanitizer.bypassSecurityTrustHtml(itemDataArray[1]),
          isBaseUrlFlag : true ,
          isFilePathUrl : false
        }
        this.anchorArray.push(object);
        this.data += object.text;
      }
      else{
        let object = {
          url : "",
          text : item,
          title : "",
          sanitizedHtml : this.sanitizer.bypassSecurityTrustHtml(item),
          isBaseUrlFlag : false,
          isFilePathUrl : false
        }
        this.anchorArray.push(object);
        this.data += object.text;
      }
    });
  }

  setHasViewEmailAddressSMSTextFlag()
  {
    this.isViewLetter = this.content.indexOf(this.ViewLetter) !== -1;
    this.isViewEmail = this.content.indexOf(this.ViewEmail) !== -1;
    this.isViewSmsText = this.content.indexOf(this.ViewSmsText) !== -1;
    this.data=this.content;
    this.data = this.data.replace(this.ViewLetter,'');
    this.data = this.data.replace(this.ViewEmail,'');
    this.data = this.data.replace(this.ViewSmsText,'');
    this.hasUrl = (this.isViewLetter || this.isViewEmail || this.isViewSmsText);
    this.viewText = this.setViewText();
  }
  setViewText()
  {
    if(this.isViewLetter)
    {
      return this.ViewLetter.replace('{','').replace('}','');
    }
    if(this.isViewEmail)
    {
      return this.ViewEmail.replace('{','').replace('}','');;
    }
    if(this.isViewSmsText)
    {
      return this.ViewSmsText.replace('{','').replace('}','');;
    }
    return "";
  }

  getViewFlag()
  {
    return (this.isViewEmail || this.isViewLetter || this.ViewSmsText);
  }

  OpenModalPopUp() {

    if (this.viewText.toLowerCase().includes('email')) { 
      this.eventLogId = 'ACC2A6DF-3B10-484E-A701-0E037CB37BC3';
      this.bodyText = 'Click Re-send to send the message again. Attachments will be included in the email.';
      this.headerText = 'View and Re-Send Email modal';
      this.buttonText = 'RE-SEND'
      this.attachmentType = "email";
      this.eventLogFacade.loadNotificationEmail(this.eventLogId);
    }
    else if (this.viewText.toLowerCase().includes('letter')) { 
      this.eventLogId = '0073CB72-5B47-494F-B962-906DEFD10248';
      this.bodyText = 'Click Re-print to print the letter again. Attachments will be printed in addition to the letter.';
      this.headerText='View and Recreate Letter modal';
      this.buttonText = 'RE-PRINT';
      this.attachmentType = "letter";
      this.eventLogFacade.loadNotificationLetter(this.eventLogId);
    }
    this.isViewLetterEmailTextDialog = true;

  }
  onCloseLetterEmailSmsTextClicked()
  {
    this.isViewLetterEmailTextDialog = false;
    this.cdr.detectChanges();
  }
  downloadOldAttachment(path : any)
  {
    this.downloadOldAttachmentEvent.emit(path);
  }

  notificationEmailSubscriptionInit(){
    this.notificationEmail$.subscribe((notificationLog:any)=>{
      this.setForNotification(notificationLog);
    });
  }

  notificationLetterSubscriptionInit() {
    this.notificationLetter$.subscribe((notificationLog: any) => {
      this.setForNotification(notificationLog);
    });
  }

  setForNotification(notificationLog: any) {
    this.eventLogFacade.showLoader()
    this.previewContent = notificationLog?.previewContent;
    if (this.buttonText === "RE-SEND") {
      this.toEmailAddress = notificationLog?.emailAddress?.TO;
      this.ccEmailAddress = notificationLog?.emailAddress?.CC;
      this.bccEmailAddress = notificationLog?.emailAddress?.BCC;
    }
    this.attachments = notificationLog?.attachments;
    this.createdUser = notificationLog?.createdUser;
    this.createdDate = notificationLog?.createdDate;
    this.entityTypeCode = notificationLog?.entityTypeCode;
    this.eventTypeCode = notificationLog?.eventTypeCode;
    this.entityId = notificationLog?.entityId;


    if (this.buttonText === "RE-PRINT") {
      this.toEmailAddress = null;
      this.ccEmailAddress = null;
      this.bccEmailAddress = null;
      this.mailingAddress = notificationLog?.mailingAddress;
      this.mailCode = notificationLog?.mailCode;
    }
    this.cdr.detectChanges();
    this.eventLogFacade.hideLoader();
  }

  viewAttachment(item: any) {
    this.eventLogFacade.showLoader()
    this.eventLogFacade.loadAttachmentPreview(item.logAttachmentId,this.attachmentType).subscribe({
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
    if (this.buttonText === "RE-SEND") {
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
    else if (this.buttonText === "RE-PRINT") {
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
          this.eventLogFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Letter generated successfully.');
          this.cdr.detectChanges()
          this.eventLogFacade.hideLoader();
        },
        error: (err: any) => {
          this.eventLogFacade.hideLoader();
          this.onCloseLetterEmailSmsTextClicked();
          this.eventLogFacade.showHideSnackBar(SnackBarNotificationType.ERROR, "Error in re-print-email.");
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
      case EventTypeCode.PendingNoticeLetter:
        return "Pending Notice Letter.zip";
      case EventTypeCode.RejectionNoticeLetter:
        return "Rejection Notice Letter.zip";
      case EventTypeCode.ApprovalNoticeLetter:
        return "Approval Notice Letter.zip";
      case EventTypeCode.DisenrollmentNoticeLetter:
        return "Disenrollment Notice Letter.zip";
      default:
        return "Letter_" + this.entityId + ".zip";
    }
  }

}
