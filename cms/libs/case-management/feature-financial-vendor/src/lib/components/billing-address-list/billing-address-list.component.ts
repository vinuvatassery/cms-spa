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
  public formUiStyle : UIFormStyle = new UIFormStyle();

  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  addressGridView = [];
  public actions = [
    {
      buttonType: "btn-h-primary",
      text: "Edit Address",
      icon: "edit",
      click: (address:any): void => {
        
        console.log(address);
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "Deactivate Address",
      icon: "block",
      click: (address:any): void => {
        console.log(address);
        
      },
    },
    {
      buttonType: "btn-h-danger",
      text: "Delete Address",
      icon: "delete",
      click: (address:any): void => {
        console.log(address);
        
      },
    },
  ];
}
