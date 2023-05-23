import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cms-financial-vendor-profile',
  templateUrl: './financial-vendor-profile.component.html',
  styleUrls: ['./financial-vendor-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialVendorProfileComponent {
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
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
    {
      buttonType: 'btn-h-primary',
      text: 'New SMS Text',
      icon: 'comment',
      isVisible: false,
      click: (): void => {
       
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New ID Card',
      icon: 'call_to_action',
      isVisible: true,
      click: (): void => {
        
      },
    },
  ];

}
