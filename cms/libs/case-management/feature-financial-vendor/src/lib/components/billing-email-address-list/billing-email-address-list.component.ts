import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-billing-email-address-list',
  templateUrl: './billing-email-address-list.component.html',
  styleUrls: ['./billing-email-address-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingEmailAddressListComponent {
  SpecialHandlingLength = 100;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isEmailBillingAddressDetailShow = false;
  isEmailBillingAddressDeactivateShow = false;
  isEmailBillingAddressDeleteShow = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  emailAddressGridView = [
    {
      emailAddress: 'Address `',
      startDate:'address2', 
      by: 'by',
    },
  ];
  public emailBillingAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Address',
      icon: 'edit',
      click: (address: any): void => {
        this.clickOpenAddEditEmailBillingAddressDetails();
        console.log(address);
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate Address',
      icon: 'block',
      click: (address: any): void => {
        console.log(address);
        this.clickOpenDeactivateEmailBillingAddressDetails();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Address',
      icon: 'delete',
      click: (address: any): void => {
        console.log(address);
        this.clickOpenDeleteEmailBillingAddressDetails();
      },
    },
  ];

  clickOpenAddEditEmailBillingAddressDetails() {
    this.isEmailBillingAddressDetailShow = true;
  }

  clickCloseAddEditEmailBillingAddressDetails() {
    this.isEmailBillingAddressDetailShow = false;
  }

  clickOpenDeactivateEmailBillingAddressDetails() {
    this.isEmailBillingAddressDeactivateShow = true;
  }
  clickCloseDeactivateEmailBillingAddress() {
    this.isEmailBillingAddressDeactivateShow = false;
  }

  clickOpenDeleteEmailBillingAddressDetails() {
    this.isEmailBillingAddressDeleteShow = true;
  }
  clickCloseDeleteEmailBillingAddress() {
    this.isEmailBillingAddressDeleteShow = false;
  }
}
