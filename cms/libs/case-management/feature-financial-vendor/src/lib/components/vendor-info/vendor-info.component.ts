import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-vendor-info',
  templateUrl: './vendor-info.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorInfoComponent {
  SpecialHandlingLength = 100;
  public formUiStyle : UIFormStyle = new UIFormStyle();

  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  addressGridView = [];
  public actions = [
    {
      buttonType: "btn-h-primary",
      text: "Edit Address",
      icon: "edit",
      click: (data:any): void => {
        
        console.log(data);
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "Deactivate Address",
      icon: "block",
      click: (data:any): void => {
        console.log(data);
        
      },
    },
    {
      buttonType: "btn-h-danger",
      text: "Delete Address",
      icon: "delete",
      click: (data:any): void => {
        console.log(data);
        
      },
    },
   
    
 
  ];
}
