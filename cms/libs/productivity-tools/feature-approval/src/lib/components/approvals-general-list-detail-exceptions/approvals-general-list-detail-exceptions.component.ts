import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { PanelBarCollapseEvent, PanelBarExpandEvent } from '@progress/kendo-angular-layout';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Router } from '@angular/router';
import { PendingApprovalGeneralFacade } from '@cms/productivity-tools/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';


@Component({
  selector: 'productivity-tools-approvals-general-list-detail-exceptions',
  templateUrl: './approvals-general-list-detail-exceptions.component.html',
})
export class ApprovalsGeneralListDetailExceptionsComponent implements OnInit{
  @Input() onUserProfileDetailsHovered: any;
  @Input() approvalId: any;
  @Input() exceptionId: any;
  approvalsExceptionCard$:any;
  ifApproveOrDeny: any;
  isPanelExpanded = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();

  ngOnInit(): any {
    this.loadApprovalsExceptionCard();
  }

  constructor(
      private readonly  cdr :ChangeDetectorRef,
      private readonly router: Router, 
      private readonly pendingApprovalGeneralFacade: PendingApprovalGeneralFacade
    ) {}
    
  loadApprovalsExceptionCard():any
  {
    this.pendingApprovalGeneralFacade.loadExceptionCard(this.exceptionId).subscribe({
      next: (response) => {
        this.approvalsExceptionCard$ = response;
        this.isPanelExpanded = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.pendingApprovalGeneralFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err);
      },
    });
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
}
