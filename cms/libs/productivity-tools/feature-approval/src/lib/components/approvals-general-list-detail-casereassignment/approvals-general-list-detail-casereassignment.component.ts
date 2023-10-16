import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef} from '@angular/core';
import { PanelBarCollapseEvent, PanelBarExpandEvent } from '@progress/kendo-angular-layout';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Router } from '@angular/router';

@Component({
  selector: 'productivity-tools-approvals-general-list-detail-reassignment',
  templateUrl: './approvals-general-list-detail-casereassignment.component.html',
})
export class ApprovalsGeneralListDetailCaseReassignmentComponent implements OnInit {

  @Input() onUserProfileDetailsHovered: any;
  @Input() approvalId: any;
  @Input() casereassignmentExpandedInfo$: any;
  @Output() loadCasereassignmentExpanedInfoEvent = new EventEmitter<any>();
  casereassignmentExpandedInfoData: any;

  ifApproveOrDeny: any;
  isPanelExpanded = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();

  constructor(private readonly  cdr :ChangeDetectorRef,
    private readonly router: Router,
    ) {}

  ngOnInit(): any {
    this.casereassignmentExpandedInfo$.subscribe((response: any) => {
      if (response) {
        this.casereassignmentExpandedInfoData = response;
      }
      this.isPanelExpanded = false;
      this.cdr.detectChanges();
    });
  }

  approveOrDeny(result:any){
    this.ifApproveOrDeny = result;
  }

  public onPanelCollapse(event: PanelBarCollapseEvent): void {
    this.isPanelExpanded = false;
  }

  public onPanelExpand(event: PanelBarExpandEvent): void {
    this.approvalId = '5657ff07-e5a2-463c-98bd-6edd1b774f3a';
    if(this.approvalId)
    {
      this.isPanelExpanded = true;
      this.loadCasereassignmentExpanedInfoEvent.emit(this.approvalId);
    }
  }

  onClientNameClicked() {
    if (this.casereassignmentExpandedInfoData?.clientId) {
      this.router.navigate([`/case-management/cases/case360/${this.casereassignmentExpandedInfoData?.clientId}`]);
    }
  }

}
