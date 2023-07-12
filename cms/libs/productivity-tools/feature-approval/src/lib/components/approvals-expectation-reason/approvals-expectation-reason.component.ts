import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
@Component({
  selector: 'productivity-tools-approvals-expectation-reason',
  templateUrl: './approvals-expectation-reason.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalsExpectationReasonComponent {
  
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
