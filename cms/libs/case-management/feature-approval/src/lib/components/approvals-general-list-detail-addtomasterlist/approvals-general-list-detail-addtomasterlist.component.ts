import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {
  GeneralApprovalApproveDeny,
  PendingApprovalGeneralTypeCode,
} from '@cms/case-management/domain';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'productivity-tools-approvals-general-list-detail-addtomasterlist',
  templateUrl: './approvals-general-list-detail-addtomasterlist.component.html',
})
export class ApprovalsGeneralListDetailAddtomasterlistComponent
  implements OnInit, OnDestroy
{
  @Input() onUserProfileDetailsHovered: any;
  @Input() approvalId: any;
  @Output() openEditModal = new EventEmitter<any>();
  @Input() subTypeCode: any;
  @Input() selectedMasterDetail$!: Observable<any>;
  ifApproveOrDeny: any;
  isPanelExpanded = false;
  selectedMasterDetailSubscription! : Subscription;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  readonly subTypeConst = PendingApprovalGeneralTypeCode;
  readonly approveOrDenyConst = GeneralApprovalApproveDeny;
  vendorData: any;
  ngOnInit(): void {
    this.getMasterDetailData();
  }

  private getMasterDetailData() {
    this.selectedMasterDetailSubscription = this.selectedMasterDetail$.subscribe((value: any) => {
        this.vendorData = value;
    });
  }

  approveOrDeny(result: any) {
    this.ifApproveOrDeny = result;
  }

  onEditListItemsDetailClicked(): void {
    const detailData = {
      subTypeCode : this.subTypeCode,
      vendorData : this.vendorData
    }
    this.openEditModal.emit(detailData);
  }

  ngOnDestroy(): void {
    this.selectedMasterDetailSubscription?.unsubscribe();
  }
  onCloseEditListItemsDetailClicked() {}
}
