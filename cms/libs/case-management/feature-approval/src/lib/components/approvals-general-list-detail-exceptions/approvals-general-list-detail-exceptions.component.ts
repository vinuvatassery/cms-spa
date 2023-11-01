import { Component, Input, OnInit } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { PendingApprovalGeneralFacade } from '@cms/productivity-tools/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
  selector: 'productivity-tools-approvals-general-list-detail-exceptions',
  templateUrl: './approvals-general-list-detail-exceptions.component.html',
})
export class ApprovalsGeneralListDetailExceptionsComponent implements OnInit {
  @Input() onUserProfileDetailsHovered: any;
  @Input() exceptionId: any;
  approvalsExceptionCard$:any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
 
  constructor(
    private readonly pendingApprovalGeneralFacade: PendingApprovalGeneralFacade
  ) {}

  ngOnInit(): void {
    this.pendingApprovalGeneralFacade.loadExceptionCard(this.exceptionId).subscribe({
      next: (response) => {
        this.approvalsExceptionCard$ = response;
      },
      error: (err) => {
        this.pendingApprovalGeneralFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err);
      },
    });
  }
}
