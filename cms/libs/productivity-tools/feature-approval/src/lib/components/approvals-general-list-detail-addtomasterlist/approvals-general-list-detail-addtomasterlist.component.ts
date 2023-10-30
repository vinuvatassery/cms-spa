import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PanelBarCollapseEvent, PanelBarExpandEvent } from '@progress/kendo-angular-layout';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { GeneralApprovalApproveDeny, PendingApprovalGeneralTypeCode } from '@cms/productivity-tools/domain';
import { Observable } from 'rxjs';

@Component({
  selector: 'productivity-tools-approvals-general-list-detail-addtomasterlist',
  templateUrl: './approvals-general-list-detail-addtomasterlist.component.html',
})
export class ApprovalsGeneralListDetailAddtomasterlistComponent implements OnInit{


  @Input() onUserProfileDetailsHovered: any;
  @Input() approvalId: any;
  @Output() openEditModal = new EventEmitter<any>();
  @Input() subTypeCode: any;
  @Input() selectedVendor$:any;
  ifApproveOrDeny: any;
  isPanelExpanded = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  readonly subTypeConst = PendingApprovalGeneralTypeCode;
  readonly approveOrDenyConst = GeneralApprovalApproveDeny;
  ngOnInit(): void {   
  }

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
