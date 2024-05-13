import { ChangeDetectionStrategy, ChangeDetectorRef, Component ,EventEmitter,Input, Output, TemplateRef, ViewChild,} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationEventTypeCode, CommunicationEvents, CommunicationFacade, EntityTypeCode, ScreenType, VendorContactsFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService, LoggingService, SnackBarNotificationType } from '@cms/shared/util-core';
import { UserDataService } from '@cms/system-config/domain';
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
  communicationLetterTypeCode!: string;
  communicationEmailTypeCode!: string ;
  toEmail: Array<any> = [];
  vendorAddressId:any;
  notificationDraftId!: string;
  draftDropdownCheck: boolean = false;
  currentCommunicationTypeCode!: string;
  selectedTemplateName!: TemplateRef<unknown>;
  notificationGroup!: string;
  isNewNotificationClicked: boolean = false;
  isContinueDraftClicked: boolean = false;
  templateLoadType!:any;
  confirmPopupHeader:any;
  saveForLaterHeadterText:any;
  saveForLaterModelText:any;
  confirmationModelText:any;
  informationalText!:any;
  templateHeader!:any;
  entityType= EntityTypeCode.Vendor;
  triggerFrom= ScreenType.VendorProfile;
  @Output() openAddReminderEvent = new EventEmitter()
  loginUserEmail: any;
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
          this.templateLoadType = CommunicationEventTypeCode.ClientLetter;
          this.currentCommunicationTypeCode = CommunicationEventTypeCode.VendorLetter;
          this.notificationGroup = CommunicationEventTypeCode.LETTER;
          this.informationalText = "Select an existing template or draft a custom letter."
          this.templateHeader = 'Send New Letter';
          this.saveForLaterHeadterText = "Letter Draft Saved";
          this.saveForLaterModelText="To pick up where you left off, click \"New Letter\" from the vendor's profile";
          this.confirmPopupHeader = 'Send Letter to Print?';
          this.confirmationModelText="This action cannot be undone.";
          this.notificationDraftCheck(this.vendorId, this.templateLoadType, this.currentCommunicationTypeCode, this.notificationDraftEmailDialog, templatename);
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
          this.templateLoadType = CommunicationEventTypeCode.ClientEmail;
          this.currentCommunicationTypeCode = CommunicationEventTypeCode.VendorEmail;
          this.notificationGroup = CommunicationEventTypeCode.EMAIL;
          this.informationalText = "Select an existing template or draft a custom email."
          this.templateHeader = 'Send New Email';
          this.saveForLaterHeadterText = "Email Draft Saved";
          this.saveForLaterModelText="To pick up where you left off, click \"New Email\" from the vendor's profile";
          this.confirmPopupHeader = 'Send Email?';
          this.confirmationModelText="This action cannot be undone.";
          this.notificationDraftCheck(this.vendorId, this.templateLoadType, this.currentCommunicationTypeCode, this.notificationDraftEmailDialog, templatename);
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
          this.templateLoadType = CommunicationEventTypeCode.ClientSMS;
          this.currentCommunicationTypeCode = CommunicationEventTypeCode.VendorSMS;
          this.notificationGroup = CommunicationEventTypeCode.SMS;
          this.informationalText = "Select an existing template or draft custom text messages"
          this.templateHeader = 'Send New SMS Text';
          this.saveForLaterHeadterText = "Sms Draft Saved";
          this.saveForLaterModelText="To pick up where you left off, click \"New Sms\" from the vendor's profile";
          this.confirmPopupHeader = 'Send SMS text Message(s)?';
          this.confirmationModelText="This action cannot be undone.";
          this.notificationDraftCheck(this.vendorId, this.templateLoadType, this.currentCommunicationTypeCode, this.notificationDraftEmailDialog, templatename);
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
    private readonly ref: ChangeDetectorRef, private readonly communicationFacade: CommunicationFacade,
    private readonly userDataService: UserDataService,) {
  }

  ngOnInit(): void {
    this.getLoggedInUserProfile();
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
          this.toEmail = [];
          this.sendActions[1].isVisible = true;
        } else if (contactWithValidEmail) {
          this.toEmail = [];
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

  notificationDraftCheck(vendorId: any, typeCode: string, subTypeCode:string, notificationDraftEmailDialog: TemplateRef<unknown>, templateName: TemplateRef<unknown>) {
    this.loaderService.show();
    this.communicationFacade.loadDraftNotificationRequest(vendorId, this.entityType, typeCode, '')
    .subscribe({
      next: (data: any) =>{
        if (data?.length > 0) {
          for (let template of data){
            this.notificationDraftId = template.notificationDraftId;
           }
          if(subTypeCode == CommunicationEventTypeCode.VendorEmail){
            this.notificationGroup = CommunicationEventTypeCode.EMAIL;
          }
          if(subTypeCode == CommunicationEventTypeCode.VendorLetter){
            this.notificationGroup = CommunicationEventTypeCode.LETTER;
          }
          if(subTypeCode === CommunicationEventTypeCode.VendorSMS){
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

    onNewReminderClicked(){
   this.openAddReminderEvent.emit()
    }

    getLoggedInUserProfile(){
      this.loaderService.show();
      this.userDataService.getProfile$.subscribe((profile:any)=>{
        if(profile?.length>0){
         if(profile[0]?.email){
          const ccEmail ={
            email: profile[0]?.email,
            isDefault: true
          };
            this.loginUserEmail = ccEmail;
         }
        }
      });
      this.loaderService.hide();
    }

}
