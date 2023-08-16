import { ChangeDetectionStrategy, Component ,Input, TemplateRef,} from '@angular/core';
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
  emailAddress$ = this.vendorContactFacade.emailAddress$;
  mailingAddress$ = this.vendorContactFacade.mailingAddress$;
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
    private readonly vendorContactFacade: VendorContactsFacade, private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.vendorId = this.activeRoute.snapshot.queryParams['v_id'];
    this.vendorTypeCode = this.activeRoute.snapshot.queryParams['vendor_type_code'];
    this.initialize();
    this.getVendorTypeCode();
  }

  private initialize() {
    this.loadEmailAddress();
    this.loadMailingAddress();
    this.addEmailSubscription();
    this.refreshButtonList();
  }

  private addEmailSubscription() {
      this.emailSubscription$ = this.emailAddress$.subscribe((x: any) => {
      this.sendActions[1].isVisible = x?.email?.length > 0;
      if(x?.email?.length !== null){
        this.toEmail = [];
        this.toEmail.push(x?.email?.trim());
      }
      this.refreshButtonList();
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
      this.vendorContactFacade.loadEmailAddress(this.vendorId);
    }

    loadMailingAddress() {
      this.vendorContactFacade.loadMailingAddress(this.vendorId);
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
