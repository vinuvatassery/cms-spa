import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cms-vendor-profile-header',
  templateUrl: './vendor-profile-header.component.html',
  styleUrls: ['./vendor-profile-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorProfileHeaderComponent {
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  showMoreAlert = false;
  public list = [
    {
      item: 'a'
    },
  ]
  public sendActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'New Letter',
      icon: 'markunread_mailbox',
      isVisible: true,
      click: (): void => { 
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New Email',
      icon: 'mail_outline',
      isVisible: false,
      click: (): void => {
     
      },
    },
     
  ];

  public reminderActions = [
    {
      buttonType:"btn-h-primary",
      text: "Done",
      icon: "done",
      click: (): void => {
      
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
      click: (): void => {
 
      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
      click: (): void => {
    
      },
    },
  ];
  reminderActionPopupClass = 'more-action-dropdown app-dropdown-action-list';
  constructor(private route: Router,private activeRoute : ActivatedRoute) {
 
  }
  
  onBackClicked()
  {
    this.route.navigate(['financial-management/vendors'])
  }
}
