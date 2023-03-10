/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** facades **/
import { ContactFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-email-list',
  templateUrl: './email-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailListComponent implements OnInit {
  /** Public properties   **/
  emailAddress$ = this.contactFacade.emailAddress$;
  isEditEmailAddress!: boolean;
  isEmailAddressDetailPopup = false;
  isDeactivateEmailAddressPopup = false;
  // gridOptionData: Array<any> = [{ text: 'Options' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';

  public gridOptionData = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Address",
      icon: "edit",
      click: (): void => {
        this.onEmailAddressDetailClicked(true);
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Deactivate Address",
      icon: "block",
      click: (): void => {
       this.onDeactivateEmailAddressClicked()
      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Delete Address",
      icon: "delete",
      click: (): void => {
      //  this.onDeactivateAddressClicked()
      },
    },
   
    
 
  ];

  /** Constructor **/
  constructor(private readonly contactFacade: ContactFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadEmailAddresses();
  }

  /** Private methods **/
  private loadEmailAddresses() {
    this.contactFacade.loadEmailAddress();
  }

  /** Internal event methods **/
  onEmailAddressDetailClosed() {
    this.isEmailAddressDetailPopup = false;
  }

  onEmailAddressDetailClicked(editValue: boolean) {
    this.isEmailAddressDetailPopup = true;
    this.isEditEmailAddress = editValue;
  }

  onDeactivateEmailAddressClosed() {
    this.isDeactivateEmailAddressPopup = false;
  }

  onDeactivateEmailAddressClicked() {
    this.isDeactivateEmailAddressPopup = true;
  }
}
