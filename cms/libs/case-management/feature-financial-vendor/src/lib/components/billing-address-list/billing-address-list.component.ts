import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-billing-address-list',
  templateUrl: './billing-address-list.component.html',
  styleUrls: ['./billing-address-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingAddressListComponent {
  SpecialHandlingLength = 100;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isBillingAddressDetailShow = false;
  isBillingAddressDeactivateShow = false;
  isBillingAddressDeleteShow = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  addressGridView = [
    {
      address1: 'Address `',
      address2:'address2',
      city:'city',
      stateDesc:'stateDesc',
      zip:'zip',
      startDate: 'startDate',
      by: 'by',
    },
  ];
  public billingAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Address',
      icon: 'edit',
      click: (address: any): void => {
        this.clickOpenAddEditBillingAddressDetails();
        console.log(address);
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate Address',
      icon: 'block',
      click: (address: any): void => {
        console.log(address);
        this.clickOpenDeactivateBillingAddressDetails();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Address',
      icon: 'delete',
      click: (address: any): void => {
        console.log(address);
        this.clickOpenDeleteBillingAddressDetails();
      },
    },
  ];

  clickOpenAddEditBillingAddressDetails() {
    this.isBillingAddressDetailShow = true;
  }

  clickCloseAddEditBillingAddressDetails() {
    this.isBillingAddressDetailShow = false;
  }

  clickOpenDeactivateBillingAddressDetails() {
    this.isBillingAddressDeactivateShow = true;
  }
  clickCloseDeactivateBillingAddress() {
    this.isBillingAddressDeactivateShow = false;
  }

  clickOpenDeleteBillingAddressDetails() {
    this.isBillingAddressDeleteShow = true;
  }
  clickCloseDeleteBillingAddress() {
    this.isBillingAddressDeleteShow = false;
  }
}
