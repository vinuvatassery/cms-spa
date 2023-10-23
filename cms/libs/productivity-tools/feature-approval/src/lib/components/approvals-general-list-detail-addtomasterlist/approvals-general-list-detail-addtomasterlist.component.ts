import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PanelBarCollapseEvent, PanelBarExpandEvent } from '@progress/kendo-angular-layout';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'productivity-tools-approvals-general-list-detail-addtomasterlist',
  templateUrl: './approvals-general-list-detail-addtomasterlist.component.html',
})
export class ApprovalsGeneralListDetailAddtomasterlistComponent {

  @Input() onUserProfileDetailsHovered: any;
  @Input() approvalId: any;
  @Output() openEditModal = new EventEmitter<any>();
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

  onEditListItemsDetailClicked(): void {
    this.openEditModal.emit(this.approvalId);
  }

  onCloseEditListItemsDetailClicked() {
  }
}
