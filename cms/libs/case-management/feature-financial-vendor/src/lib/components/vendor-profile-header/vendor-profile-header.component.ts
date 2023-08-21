import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cms-vendor-profile-header',
  templateUrl: './vendor-profile-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorProfileHeaderComponent {
@Input() vendorProfileSpecialHandling$ : any
@Input() vendorProfile$ : any
@Input() clientCaseEligibilityId!: any;
@Input() clientId!: any;
@Output() loadSpecialHandlingEvent =  new EventEmitter();

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

  loadSpecialHandling()
  {
    this.loadSpecialHandlingEvent.emit()
  }

  getHeaderPreferredFlag(vendorProfile : any)
  {    
     return vendorProfile?.preferredFlag === 'Y' ? 'preferred-heading' : ''
  }
}
