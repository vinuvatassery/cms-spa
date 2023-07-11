import { ChangeDetectionStrategy, Component } from '@angular/core';

import { UIFormStyle } from '@cms/shared/ui-tpa'; 
@Component({
  selector: 'productivity-tools-approvals-edit-items',
  templateUrl: './approvals-edit-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalsEditItemsComponent {
  
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
