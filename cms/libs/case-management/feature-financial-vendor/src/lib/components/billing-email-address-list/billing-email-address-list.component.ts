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
