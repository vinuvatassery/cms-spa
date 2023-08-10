import { ChangeDetectionStrategy, Component ,Input, TemplateRef,} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationEventTypeCode, CommunicationEvents, ContactFacade, ScreenType } from '@cms/case-management/domain';
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
  @Input() clientId: any
  @Input() clientCaseEligibilityId: any
  private todoDetailsDialog : any;
  private newReminderDetailsDialog : any;
  emailScreenName = ScreenType.FinancialManagementVendorPageEmail;
  letterScreenName = ScreenType.FinancialManagementVendorPageLetter;
  emailAddress$ = this.contactFacade.emailAddress$;
  mailingAddress$ = this.contactFacade.mailingAddress$;
  emailSubscription$ = new Subscription();
  reloadSubscription$ = new Subscription();
  buttonList!: any[];
  private isSendNewLetterDialog : any;
  private isSendNewEmailOpenedDialog : any;
  isSendNewLetterOpened = false;
  isSendNewEmailOpened = false;
  communicationTypeCode = CommunicationEventTypeCode.ManufacuterLetter;

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
    private readonly contactFacade: ContactFacade, private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.initialize();
  }

  private initialize() {
    this.loadEmailAddress();
    this.addEmailSubscription();
    this.refreshButtonList();
  }

  private addEmailSubscription() {
    this.emailSubscription$ = this.emailAddress$.subscribe((email: any) => {
      this.sendActions[1].isVisible = email?.length > 0;
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
      debugger;
      this.contactFacade.loadEmailAddress(this.clientId, this.clientCaseEligibilityId);
    }

    loadMailingAddress() {
      this.contactFacade.loadMailingAddress(this.clientId);
    }
}
