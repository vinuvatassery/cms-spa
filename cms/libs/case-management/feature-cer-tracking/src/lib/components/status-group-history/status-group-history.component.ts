import { Component, Input, OnInit } from '@angular/core';
import { CaseFacade, StatusPeriodFacade } from '@cms/case-management/domain';
import { Observable } from 'rxjs';

@Component({
  selector: 'case-management-status-group-history',
  templateUrl: './status-group-history.component.html',
  styleUrls: ['./status-group-history.component.scss'],
})
export class StatusGroupHistoryComponent implements OnInit {

  @Input() eligibilityId!: string;
  currentGroup$ = this.caseFacade.currentGroup$;
  ddlGroups$ = this.caseFacade.ddlGroups$;
  statusGroupHistory: any = [];
  isGroupDetailOpened: boolean = false;
  isGroupDeleteOpened: boolean = false;

  constructor(
    private statusPeriodFacade: StatusPeriodFacade,
    private caseFacade: CaseFacade) {
  }

  ngOnInit() {
    this.loadGroupHistory();
  }

  /* Private methods */
  private loadGroupHistory() {
    this.statusPeriodFacade.loadStatusGroupHistory(this.eligibilityId).subscribe({
      next: (data) => {
        this.statusGroupHistory = data;
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadEligibilityChangeModal(event: any){
    this.caseFacade.loadEligibilityChangeGroups(this.eligibilityId);
    this.isGroupDetailOpened = true;
  }

  onGroupDetailClosed() {
    this.isGroupDetailOpened = false;
  }

  onGroupChangeUpdateClicked(group: any) {
    let newGroup = {
      eligibilityId: this.eligibilityId,
      groupCodeId: group.groupCodeId,
      groupStartDate: group.groupStartDate
    };
    this.caseFacade.updateEligibilityGroup(newGroup);
    this.isGroupDetailOpened = false;
  }

  onGroupChangeCancelClicked(event: any) {
    this.isGroupDetailOpened = false;
  }

  onDeleteGroupClicked(event: any) {
    this.isGroupDeleteOpened = true;
  }
  
  onConfirmGroupDelete() {
    this.caseFacade.deleteEligibilityGroup(this.eligibilityId);
    this.isGroupDetailOpened = false;
  }

  onCancelDelete() {
    this.isGroupDeleteOpened = false;
  }

}
