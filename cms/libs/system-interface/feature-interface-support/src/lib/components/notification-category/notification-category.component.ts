import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa' 
@Component({
  selector: 'system-interface-notification-category',
  templateUrl: './notification-category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCategoryComponent {
  isDistributionDetailPopup = false;

  public formUiStyle : UIFormStyle = new UIFormStyle();
  onNotificationCategoryDetailsClicked(){
    this.isDistributionDetailPopup = true;
  }
  onCloseNotificationCategoryDetailPopupClicked(){
    this.isDistributionDetailPopup = false;
  }
}
