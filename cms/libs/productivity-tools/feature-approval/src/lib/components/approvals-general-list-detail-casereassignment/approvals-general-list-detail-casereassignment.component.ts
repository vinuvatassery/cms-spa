import { Component, Input } from '@angular/core';
import { PanelBarCollapseEvent, PanelBarExpandEvent } from '@progress/kendo-angular-layout';
import { UIFormStyle } from '@cms/shared/ui-tpa';


@Component({
  selector: 'productivity-tools-approvals-general-list-detail-reassignment',
  templateUrl: './approvals-general-list-detail-casereassignment.component.html',
})
export class ApprovalsGeneralListDetailCaseReassignmentComponent {

  @Input() onUserProfileDetailsHovered: any;
  @Input() approvalId: any;
  
  ifApproveOrDeny: any;
  isPanelExpanded = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();

  approveOrDeny(result:any){
    this.ifApproveOrDeny = result;
  }

  public onPanelCollapse(event: PanelBarCollapseEvent): void {
    this.isPanelExpanded = false;
  }

  public onPanelExpand(event: PanelBarExpandEvent): void {
    this.isPanelExpanded = true;
  }

}
