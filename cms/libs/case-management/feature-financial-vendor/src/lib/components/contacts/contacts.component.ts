import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsComponent {
  SpecialHandlingLength = 100;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isContactsDetailShow = false;
  isContactsDeactivateShow = false;
  isContactsDeleteShow = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  contactsGridView = [
    {
      name: 'Address `',
      jobTitle:'address2', 
      phoneNumber:'address2', 
      emailAddress:'address2', 
      startDate:'address2', 
      by: 'by',
    },
  ];
  public contactsActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Address',
      icon: 'edit',
      click: (address: any): void => {
        this.clickOpenAddEditContactsDetails();
        console.log(address);
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate Address',
      icon: 'block',
      click: (address: any): void => {
        console.log(address);
        this.clickOpenDeactivateContactsDetails();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Address',
      icon: 'delete',
      click: (address: any): void => {
        console.log(address);
        this.clickOpenDeleteContactsDetails();
      },
    },
  ];

  clickOpenAddEditContactsDetails() {
    this.isContactsDetailShow = true;
  }

  clickCloseAddEditContactsDetails() {
    this.isContactsDetailShow = false;
  }

  clickOpenDeactivateContactsDetails() {
    this.isContactsDeactivateShow = true;
  }
  clickCloseDeactivateContacts() {
    this.isContactsDeactivateShow = false;
  }

  clickOpenDeleteContactsDetails() {
    this.isContactsDeleteShow = true;
  }
  clickCloseDeleteContacts() {
    this.isContactsDeleteShow = false;
  }
}
