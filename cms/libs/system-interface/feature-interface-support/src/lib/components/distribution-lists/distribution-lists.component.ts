import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa' 
@Component({
  selector: 'system-interface-distribution-lists',
  templateUrl: './distribution-lists.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributionListsComponent {
  isMemberDetailPopup = false;

  public formUiStyle : UIFormStyle = new UIFormStyle();
  onMemberDetailsClicked(){
    this.isMemberDetailPopup = true;
  }
  onCloseMemberDetailPopupClicked(){
    this.isMemberDetailPopup = false;
  }
}
