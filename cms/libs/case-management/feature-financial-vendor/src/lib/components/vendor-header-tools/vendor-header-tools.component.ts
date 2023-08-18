import { ChangeDetectionStrategy, ChangeDetectorRef, Component ,Input, TemplateRef,} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationEventTypeCode, CommunicationEvents, FinancialVendorTypeCode, ScreenType, VendorContactsFacade } from '@cms/case-management/domain';
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
  private todoDetailsDialog : any;
  private newReminderDetailsDialog : any;
  emailScreenName = ScreenType.FinancialManagementVendorPageEmail;
  letterScreenName = ScreenType.FinancialManagementVendorPageLetter;
  contacts$ = this.vendorContactFacade.contacts$;
  mailCodes$ = this.vendorContactFacade.mailCodes$;
  emailSubscription$ = new Subscription();
  reloadSubscription$ = new Subscription();
  buttonList!: any[];
  private isSendNewLetterDialog : any;
  private isSendNewEmailOpenedDialog : any;
  isSendNewLetterOpened = false;
  isSendNewEmailOpened = false;
  vendorId: any;
  vendorTypeCode: any;
  emailSubject: any;
  communicationLetterTypeCode: any;
  communicationEmailTypeCode: any;
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
    }
  ];


  constructor(private route: Router,private activeRoute : ActivatedRoute,
    private readonly vendorContactFacade: VendorContactsFacade, private dialogService: DialogService,
    private readonly ref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.vendorId = this.activeRoute.snapshot.queryParams['v_id'];
    this.vendorTypeCode = this.activeRoute.snapshot.queryParams['vendor_type_code'];
    this.initialize();
    this.getVendorTypeCode();
  }

  private initialize() {
    this.loadMailingAddress();
    this.refreshButtonList();
  }

  private addEmailSubscription() {
    this.vendorContactFacade.contacts$.subscribe((resp) => {
      const preferredContact = resp.find((contact: any) => contact.isPreferedContact === "Y" && contact.emailAddress?.trim());
      const contactWithValidEmail = resp.find((contact: any) => contact.emailAddress && contact.emailAddress.trim());
      this.toEmail = [];
      if (preferredContact) {
        this.toEmail = [preferredContact.emailAddress.trim()];
        this.sendActions[1].isVisible = true;
      } else if (contactWithValidEmail) {
        this.toEmail = [contactWithValidEmail.emailAddress.trim()];
        this.sendActions[1].isVisible = true;
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

    loadEmailAddress() {
      this.vendorContactFacade.mailCodes$.subscribe((resp) => {
        if (resp && resp.length > 0) {
          const selectedAddress = resp.find((address:any) => address.preferredFlag === "Y") || resp[0];
          this.vendorAddressId = selectedAddress.vendorAddressId;
          this.vendorContactFacade.loadcontacts(this.vendorAddressId);
          this.addEmailSubscription();
        }
        this.ref.detectChanges();
      });
    }

    loadMailingAddress() {
      this.vendorContactFacade.loadMailCodes(this.vendorId);
      this.loadEmailAddress();
    }

    getVendorTypeCode() {
      switch (this.vendorTypeCode) {
        case FinancialVendorTypeCode.Manufacturers:
          this.emailSubject = CommunicationEventTypeCode.ManufacturerSubject;
          this.communicationEmailTypeCode = CommunicationEventTypeCode.ManufacturerEmail;
          this.communicationLetterTypeCode = CommunicationEventTypeCode.ManufacuterLetter;
          break;
        case FinancialVendorTypeCode.InsuranceVendors:
          this.emailSubject = CommunicationEventTypeCode.InsuranceVendorSubject;
          this.communicationEmailTypeCode = CommunicationEventTypeCode.InsuranceVendorEmail;
          this.communicationLetterTypeCode = CommunicationEventTypeCode.InsuranceVendorLetter;
          break;
        case FinancialVendorTypeCode.MedicalProviders:
          this.emailSubject = CommunicationEventTypeCode.MedicalProviderSubject
          this.communicationEmailTypeCode = CommunicationEventTypeCode.MedicalProviderEmail;
          this.communicationLetterTypeCode = CommunicationEventTypeCode.MedicalProviderLetter;
          break;
      }
    }
}
