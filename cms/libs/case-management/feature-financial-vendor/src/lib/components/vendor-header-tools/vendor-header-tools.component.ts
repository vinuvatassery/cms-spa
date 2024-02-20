import { ChangeDetectionStrategy, ChangeDetectorRef, Component ,Input, TemplateRef,} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationEventTypeCode, CommunicationEvents, ScreenType, VendorContactsFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import { Subscription } from 'rxjs';
@Component({
  selector: 'cms-vendor-header-tools',
  templateUrl: './vendor-header-tools.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorHeaderToolsComponent {
  SpecialHandlingLength = 100;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  @Input() vendorProfile$:any;

  isIdCardOpened = false;
  isSendNewLetterOpened = false;
  isSendNewEmailOpened = false;
  isNewSMSTextOpened = false;
  private todoDetailsDialog : any;
  private newReminderDetailsDialog : any;
  screenName = ScreenType.VendorProfile;
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
  vendorId: any;
  vendorTypeCode: any;
  emailSubject: any;
  communicationLetterTypeCode: any = CommunicationEventTypeCode.VendorLetter;
  communicationEmailTypeCode: string = CommunicationEventTypeCode.VendorEmail;
  toEmail: Array<any> = [];
  vendorAddressId:any;

  public sendActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'New Letter',
      icon: 'markunread_mailbox',
      isVisible: true,
      id: 'new_letter',
      click: (templatename: any): void => {
        this.onSendNewLetterClicked(templatename);
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New Email',
      icon: 'mail_outline',
      id: 'new_email',
      isVisible: false,
      click: (templatename: any): void => {
        this.onSendNewEmailClicked(templatename);
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New SMS Text',
      icon: 'comment',
      id: 'new_sms_text',
      isVisible: false,
      click: (templatename: any): void => {
        this.onNewSMSTextClicked(templatename);
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
    private readonly ref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.vendorId = this.activeRoute.snapshot.queryParams['v_id'];
    this.vendorTypeCode = this.activeRoute.snapshot.queryParams['tab_code'];
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
        cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np'
      });
    }

    handleSendNewLetterClosed(value: CommunicationEvents) {
      if (value === CommunicationEvents.Close) {
        this.isSendNewLetterDialog.close(value);
        this.isSendNewLetterOpened = false;
      }
    }

    onSendNewEmailClicked(template: TemplateRef<unknown>): void {
      this.isSendNewEmailOpenedDialog = this.dialogService.open({
        content: template,
        cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
      });
    }
    handleSendNewEmailClosed(value: CommunicationEvents) {
      if (value === CommunicationEvents.Close) {
        this.isSendNewEmailOpened = false;
        this.isSendNewEmailOpenedDialog.close();
      }
    }

    onNewSMSTextClicked(template: TemplateRef<unknown>): void {
      this.isNewSMSTextOpenedDialog = this.dialogService.open({
        content: template,
        cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
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
}
