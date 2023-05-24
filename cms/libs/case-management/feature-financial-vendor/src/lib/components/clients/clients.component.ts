import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cms-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsComponent {
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  addressGridView = [];

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
