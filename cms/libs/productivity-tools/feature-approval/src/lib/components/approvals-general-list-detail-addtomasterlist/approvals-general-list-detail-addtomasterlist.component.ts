import { Component, Input } from '@angular/core';
import { PanelBarCollapseEvent, PanelBarExpandEvent } from '@progress/kendo-angular-layout';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'productivity-tools-approvals-general-list-detail-addtomasterlist',
  templateUrl: './approvals-general-list-detail-addtomasterlist.component.html',
})
export class ApprovalsGeneralListDetailAddtomasterlistComponent {

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

  onEditListItemsDetailClicked(template: any): void {
    // this.editListITemsDialog = this.dialogService.open({
    //   content: template,
    //   animation: {
    //     direction: 'left',
    //     type: 'slide',
    //   },
    //   cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    // });
  }

  onCloseEditListItemsDetailClicked() {
  }
}
