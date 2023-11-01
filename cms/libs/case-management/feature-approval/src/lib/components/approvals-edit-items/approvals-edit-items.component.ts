import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PendingApprovalGeneralTypeCode } from '@cms/productivity-tools/domain';

import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Observable } from 'rxjs';
@Component({
  selector: 'productivity-tools-approvals-edit-items',
  templateUrl: './approvals-edit-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalsEditItemsComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Input() selectedSubtypeCode: any;
  @Input() selectedVendor$!: Observable<any>;
  readonly subTypeConst = PendingApprovalGeneralTypeCode;
}
