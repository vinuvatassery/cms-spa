import { Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-pcas-group-list',
  templateUrl: './financial-pcas-group-list.component.html',
})
export class FinancialPcasGroupListComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  groupGridActions =[
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Group',
      icon: 'edit', 
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Active Group',
      icon: 'check', 
    },
    {
      buttonType: 'btn-h-primary',
      text: 'De-active Group',
      icon: 'block', 
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Group',
      icon: 'delete', 
    },

  ];
  bbbbbb = [
    {
      id: 1,  
      group: '123123`',  
      isActive: true,
    },
    {
      id: 2,
      group: '123123`',  
      isActive: true,
    },
    
  ];

}
