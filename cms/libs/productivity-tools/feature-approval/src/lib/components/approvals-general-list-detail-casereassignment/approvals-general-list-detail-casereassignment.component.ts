import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Router } from '@angular/router';
import { PendingApprovalGeneralFacade } from '@cms/productivity-tools/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';



@Component({
  selector: 'productivity-tools-approvals-general-list-detail-reassignment',
  templateUrl: './approvals-general-list-detail-casereassignment.component.html',
})
export class ApprovalsGeneralListDetailCaseReassignmentComponent implements OnInit {

  @Input() approvalId: any;
  @Output() loadCasereassignmentExpanedInfoEvent = new EventEmitter<any>();
  casereassignmentExpandedInfoData: any;
  isPanelExpanded = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();

  constructor(private readonly  cdr :ChangeDetectorRef,
    private readonly router: Router, private readonly pendingApprovalGeneralFacade: PendingApprovalGeneralFacade,

    ) {}

  ngOnInit(): any {
    if(this.approvalId)
    {
      this.isPanelExpanded = true;
      this.pendingApprovalGeneralFacade.loadCasereassignmentExpandedInfo(this.approvalId).subscribe({
        next: (response) => {
          this.casereassignmentExpandedInfoData = response;
          this.isPanelExpanded = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.pendingApprovalGeneralFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err);
        },
      });
    }
  }

  onClientNameClicked() {
    if (this.casereassignmentExpandedInfoData?.clientId) {
      this.router.navigate([`/case-management/cases/case360/${this.casereassignmentExpandedInfoData?.clientId}`]);
    }
  }

}
