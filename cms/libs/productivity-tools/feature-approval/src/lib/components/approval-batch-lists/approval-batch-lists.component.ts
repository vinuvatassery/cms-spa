import { Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
@Component({
  selector: 'productivity-tools-approval-batch-lists',
  templateUrl: './approval-batch-lists.component.html', 
})
export class ApprovalBatchListsComponent {
  public width = "100%";
  public height = "100%";
  public formUiStyle: UIFormStyle = new UIFormStyle();
  items = [
    {},{}
  ]
}
