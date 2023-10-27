import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { PendingApprovalGeneralTypeCode } from '@cms/productivity-tools/domain';

import { UIFormStyle } from '@cms/shared/ui-tpa'; 
@Component({
  selector: 'productivity-tools-approvals-edit-items',
  templateUrl: './approvals-edit-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalsEditItemsComponent implements OnInit {
  
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Input() selectedSubtypeCode : any;
  readonly subTypeConst = PendingApprovalGeneralTypeCode;

  ngOnInit(): void {  
  }

}
