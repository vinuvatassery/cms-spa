import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { NotificationSnackbarService,SnackBarNotificationType,ConfigurationProvider} from '@cms/shared/util-core';

@Component({
  selector: 'cms-vendor-header-tools',
  templateUrl: './vendor-header-tools.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorHeaderToolsComponent {
  SpecialHandlingLength = 100;
  public formUiStyle : UIFormStyle = new UIFormStyle();
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
       this.emailSent();
     
      },
    },
     
  ];
  /** Constructor **/
  constructor(
   private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider : ConfigurationProvider
   
  ) {

  }
  emailSent(){
    this.notificationSnackbarService.showHideSnackBar(SnackBarNotificationType.SUCCESS,
      this.configurationProvider.appSettings.messages.emailSent);
  }
}
