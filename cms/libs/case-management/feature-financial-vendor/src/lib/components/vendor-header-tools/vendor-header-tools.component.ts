import { ChangeDetectionStrategy, ChangeDetectorRef, Component ,Input, TemplateRef, ViewChild,} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationEventTypeCode, CommunicationEvents, CommunicationFacade, ScreenType, VendorContactsFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService, LoggingService, SnackBarNotificationType } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'cms-vendor-header-tools',
  templateUrl: './vendor-header-tools.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorHeaderToolsComponent {
  @ViewChild('notificationDraftEmailDialog', { read: TemplateRef })
  notificationDraftEmailDialog!: TemplateRef<any>;
  @ViewChild('sendLetterDialog', { read: TemplateRef })
  sendLetterDialog!: TemplateRef<any>;
  @ViewChild('sendNewEmailDialog', { read: TemplateRef })
  sendNewEmailDialog!: TemplateRef<any>;
  SpecialHandlingLength = 100;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  @Input() vendorProfile$!:Observable<any>;

  isIdCardOpened = false;
  isSendNewLetterOpened = false;
  isSendNewEmailOpened = false;
  isNewSMSTextOpened = false;
  private todoDetailsDialog : any;
  private newReminderDetailsDialog : any;
  screenName = ScreenType.VendorProfile;
  vendorProfile:any
  emailScreenName = ScreenType.VendorEmail;
  letterScreenName = ScreenType.VendorLetter;
  contacts$ = this.vendorContactFacade.allContacts$;
  mailCodes$ = this.vendorContactFacade.mailCodes$;
  emailSubscription$ = new Subscription();
  reloadSubscription$ = new Subscription();
  buttonList!: any[];
  private isSendNewLetterDialog : any;
  private isSendNewEmailOpenedDialog : any;
  private isNewSMSTextOpenedDialog : any;
  private isIdCardOpenedDialog : any;
  private isDraftNotificationOpenedDialog: any;
  vendorId: any;
  vendorTypeCode: any;
  emailSubject: any;
  communicationLetterTypeCode: any = CommunicationEventTypeCode.VendorLetter;
  communicationEmailTypeCode: string = CommunicationEventTypeCode.VendorEmail;
  toEmail: Array<any> = [];
  vendorAddressId:any;
  notificationDraftId!: string;
  draftDropdownCheck: boolean = false;
  currentCommunicationTypeCode!: string;
  selectedTemplateName!: TemplateRef<unknown>;
  notificationGroup!: string;
  isNewNotificationClicked: boolean = false;
  isContinueDraftClicked: boolean = false;

  public sendActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'New Letter',
      icon: 'markunread_mailbox',
      isVisible: true,
      id: 'new_letter',
      click: (templatename: any): void => {
        if(this.draftDropdownCheck === false){
          this.draftDropdownCheck = true;
          this.selectedTemplateName = templatename;
          this.currentCommunicationTypeCode = this.communicationLetterTypeCode;
          this.notificationDraftCheck(this.vendorId, this.currentCommunicationTypeCode, this.notificationDraftEmailDialog, templatename);
          }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New Email',
      icon: 'mail_outline',
      id: 'new_email',
      isVisible: false,
      click: (templatename: any): void => {
        if(this.draftDropdownCheck === false){
          this.draftDropdownCheck = true;
          this.selectedTemplateName = templatename;
          this.currentCommunicationTypeCode = this.communicationEmailTypeCode;
          this.notificationDraftCheck(this.vendorId, this.currentCommunicationTypeCode, this.notificationDraftEmailDialog, templatename);
          }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New SMS Text',
      icon: 'comment',
      id: 'new_sms_text',
      isVisible: false,
      click: (templatename: any): void => {
        if(this.draftDropdownCheck === false){
          this.draftDropdownCheck = true;
          this.selectedTemplateName = templatename;
          this.currentCommunicationTypeCode = this.communicationLetterTypeCode;
          this.notificationDraftCheck(this.vendorId, this.currentCommunicationTypeCode, this.notificationDraftEmailDialog, templatename);
          }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New ID Card',
      icon: 'call_to_action',
      id:'new_id_card',
      isVisible: false,
      click: (templatename: any): void => {
        this.onIdCardClicked(templatename);
      }
    }
  ];


  constructor(private route: Router,private activeRoute : ActivatedRoute,
    private readonly vendorContactFacade: VendorContactsFacade, private dialogService: DialogService,
    private readonly loaderService: LoaderService, private readonly loggingService: LoggingService,
    private readonly ref: ChangeDetectorRef, private readonly communicationFacade: CommunicationFacade,) {
  }

  ngOnInit(): void {
    this.vendorId = this.activeRoute.snapshot.queryParams['v_id'];
    this.vendorTypeCode = this.activeRoute.snapshot.queryParams['tab_code'];
    this.vendorProfile$.subscribe(vp =>{
      this.vendorProfile = vp
    })
    this.initialize();
    this.addEmailSubscription();
  }

  private initialize() {
    this.loadMailingAddress();
    this.loadEmailAddress();
    this.refreshButtonList();
  }

  loadEmailAddress(){
    this.vendorContactFacade.loadVendorAllContacts(this.vendorId);
  }

  addEmailSubscription() {
    this.vendorContactFacade.allContacts$.subscribe((resp) => {
      if(resp.length!=0){
        const preferredContact = resp.find((contact: any) => contact?.activeFlag === "Y" && contact.preferredFlag === "Y" && contact.emailAddress?.trim());
        const contactWithValidEmail = resp.find((contact: any) => contact?.activeFlag === "Y" && contact.emailAddress && contact.emailAddress.trim());
        this.toEmail = [];
        if (preferredContact) {
          this.toEmail = [preferredContact.emailAddress.trim()];
          this.sendActions[1].isVisible = true;
        } else if (contactWithValidEmail) {
          this.toEmail = [contactWithValidEmail.emailAddress.trim()];
          this.sendActions[1].isVisible = true;
        }
      }
      else {
        this.toEmail = [];
        this.sendActions[1].isVisible = false;
      }
      this.refreshButtonList();
      this.ref.detectChanges();
    });
  }

  private refreshButtonList() {
    this.buttonList = this.sendActions?.filter((action: any) => action.isVisible === true);
  }

  notificationDraftCheck(vendorId: any, typeCode: string, notificationDraftEmailDialog: TemplateRef<unknown>, templateName: TemplateRef<unknown>) {
    this.loaderService.show();
    this.communicationFacade.loadDraftNotificationRequest(vendorId, typeCode)
    .subscribe({
      next: (data: any) =>{
        if (data?.length > 0) {
          for (let template of data){
            this.notificationDraftId = template.notifcationDraftId;
           }
          if(typeCode == CommunicationEventTypeCode.VendorEmail){
            this.notificationGroup = CommunicationEventTypeCode.EMAIL;
          }
          if(typeCode == CommunicationEventTypeCode.VendorLetter){
            this.notificationGroup = CommunicationEventTypeCode.LETTER;
          }
          if(typeCode === CommunicationEventTypeCode.VendorSMS){
            this.notificationGroup = CommunicationEventTypeCode.SMS;
          }
          this.onDraftNotificationExistsConfirmation(notificationDraftEmailDialog);
          this.ref.detectChanges();
        }else{
          this.loadNotificationTemplates(this.currentCommunicationTypeCode, templateName);
        }
      this.loaderService.hide();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.loggingService.logException(err);
      this.vendorContactFacade.showHideSnackBar(SnackBarNotificationType.ERROR,err);
    },
  });
  }

  loadNotificationTemplates(typeCode: string, templateName: TemplateRef<unknown>) {
    if(typeCode == CommunicationEventTypeCode.VendorEmail){
      templateName = this.sendNewEmailDialog;
      this.onSendNewEmailClicked(templateName);
    }
    if(typeCode == CommunicationEventTypeCode.VendorLetter){
      templateName = this.sendLetterDialog;
      this.onSendNewLetterClicked(templateName);
    }
  }

  onDraftNotificationExistsConfirmation(notificationDraftEmailDialog: TemplateRef<unknown>): void {
    this.isDraftNotificationOpenedDialog = this.dialogService.open({
      content: notificationDraftEmailDialog,
      cssClass: 'app-c-modal app-c-modal-md app-c-modal-np',
    });
  }

  onDraftNotificationCloseClicked(result: any) {
    if (result) {
      this.draftDropdownCheck = false;
      this.isDraftNotificationOpenedDialog.close();
    }
  }


  onTodoDetailsClosed(result: any) {
    if(result){
      this.todoDetailsDialog.close();
    }
  }

  onTodoDetailsClicked( template: TemplateRef<unknown>): void {
    this.todoDetailsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onNewReminderClosed(result: any) {
    if(result){
      this.newReminderDetailsDialog.close()
    }}

    onNewReminderClicked(template: TemplateRef<unknown>): void {
      this.newReminderDetailsDialog = this.dialogService.open({
        content: template,
        cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
      });
    }
    onSendNewLetterClicked(template: TemplateRef<unknown>): void {
      this.isSendNewLetterDialog = this.dialogService.open({
        content: template,
        cssClass: 'app-c-modal app-c-modal-xl just_start app-c-modal-np'
      });
    }

    handleSendNewLetterClosed(value: CommunicationEvents) {
      if (value === CommunicationEvents.Close) {
        this.draftDropdownCheck = false;
        this.isSendNewLetterDialog.close(value);
        this.isSendNewLetterOpened = false;
      }
    }

    onSendNewEmailClicked(template: TemplateRef<unknown>): void {
      this.isSendNewEmailOpenedDialog = this.dialogService.open({
        content: template,
        cssClass: 'app-c-modal app-c-modal-xl just_start app-c-modal-np',
      });
    }
    handleSendNewEmailClosed(value: CommunicationEvents) {
      if (value === CommunicationEvents.Close) {
        this.draftDropdownCheck = false;
        this.isSendNewEmailOpened = false;
        this.isSendNewEmailOpenedDialog.close();
      }
    }

    onNewSMSTextClicked(template: TemplateRef<unknown>): void {
      this.isNewSMSTextOpenedDialog = this.dialogService.open({
        content: template,
        cssClass: 'app-c-modal app-c-modal-xl just_start app-c-modal-np',
      });
    }
    handleNewSMSTextClosed(value: CommunicationEvents) {
      if (value === CommunicationEvents.Close) {
        this.isNewSMSTextOpenedDialog.close();
        this.isNewSMSTextOpened = false;
      }
    }
    onIdCardClicked(template: TemplateRef<unknown>): void {
      this.isIdCardOpenedDialog = this.dialogService.open({
        title: 'Send New ID Card',
        content: template,
        cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
      });
    }
    handleIdCardClosed(result: any) {
      if(result){
        this.isIdCardOpened = false;
        this.isIdCardOpenedDialog.close();
      }
    }

    loadMailingAddress() {
      this.vendorContactFacade.loadMailCodes(this.vendorId);
    }

    onSendMenuClick(){
    }

    onNewNotificationClicked(){
      this.isNewNotificationClicked = true;
      this.isContinueDraftClicked = false;
      this.onDraftNotificationCloseClicked(CommunicationEvents.Close);
      this.loadNotificationTemplates(this.currentCommunicationTypeCode, this.selectedTemplateName);
    }

    onContinueDraftClicked(){
      this.isContinueDraftClicked = true;
      this.isNewNotificationClicked = false;
      this.onDraftNotificationCloseClicked(CommunicationEvents.Close);
      this.loadNotificationTemplates(this.currentCommunicationTypeCode, this.sendNewEmailDialog);
    }
}
