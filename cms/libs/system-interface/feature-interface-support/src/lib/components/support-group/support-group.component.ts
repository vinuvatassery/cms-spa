import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa' 
@Component({
  selector: 'system-interface-support-group',
  templateUrl: './support-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportGroupComponent {
  isGroupDetailPopup = false;

  public formUiStyle : UIFormStyle = new UIFormStyle();
  onGroupDetailsClicked(){
    this.isGroupDetailPopup = true;
  }
  onCloseGroupDetailPopupClicked(){
    this.isGroupDetailPopup = false;
  }
}
