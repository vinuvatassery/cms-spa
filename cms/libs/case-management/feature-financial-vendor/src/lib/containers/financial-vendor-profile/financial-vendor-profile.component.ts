import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cms-financial-vendor-profile',
  templateUrl: './financial-vendor-profile.component.html',
  styleUrls: ['./financial-vendor-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialVendorProfileComponent {
  addressGridView = [];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType: "btn-h-primary",
      text: "Edit Address",
      icon: "edit",
      click: (address:any): void => {
        
        
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "Deactivate Address",
      icon: "block",
      click: (address:any): void => {
        
      },
    },
    {
      buttonType: "btn-h-danger",
      text: "Delete Address",
      icon: "delete",
      click: (address:any): void => {
        
      },
    },
   
    
 
  ];
}
