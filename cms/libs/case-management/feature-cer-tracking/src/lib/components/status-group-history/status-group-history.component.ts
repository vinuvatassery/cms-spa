import { Component, Input, OnInit } from '@angular/core';
import { CaseFacade, StatusPeriodFacade } from '@cms/case-management/domain';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'case-management-status-group-history',
  templateUrl: './status-group-history.component.html',
})
export class StatusGroupHistoryComponent implements OnInit {

  @Input() eligibilityId!: string;
  currentGroup$ = this.caseFacade.currentGroup$;
  ddlGroups$ = this.caseFacade.ddlGroups$;
  statusGroupHistory$: any = new BehaviorSubject<any>([]);
  isGroupDetailOpened: boolean = false;
  isGroupDeleteModalOpened: boolean = false;
  selectedGroupId!: string;
  loader: boolean = false;

  constructor(
    private statusPeriodFacade: StatusPeriodFacade,
    private caseFacade: CaseFacade) {
  }

  ngOnInit() {
    this.loadGroupHistory();
  }

  /* Private methods */
  private loadGroupHistory() {
    this.loader = true;
    this.statusPeriodFacade.loadStatusGroupHistory(this.eligibilityId).subscribe({
      next: (data) => {
        this.statusGroupHistory$.next(data);
        this.loader = false;
      },
      error: (err) => {
        this.loader = false;
        console.error('err', err);
      },
    });
  }

  loadEligibilityChangeModal(event: any) {
    this.caseFacade.loadEligibilityChangeGroups(this.eligibilityId);
    this.isGroupDetailOpened = true;
    this.selectedGroupId = event.groupId;
  }

  onGroupDetailClosed() {
    this.isGroupDetailOpened = false;
    this.selectedGroupId = "";
  }

  onGroupChangeUpdateClicked(group: any) {
    let newGroup = {
      eligibilityId: this.eligibilityId,
      groupCodeId: group.groupCodeId,
      groupStartDate: group.groupStartDate
    };
    this.caseFacade.updateEligibilityGroup(newGroup);
    this.isGroupDetailOpened = false;
    this.selectedGroupId = "";
  }

  onGroupChangeCancelClicked(event: any) {
    this.isGroupDetailOpened = false;
    this.selectedGroupId = "";
  }

  onDeleteGroupClicked(event: any) {
    this.isGroupDeleteModalOpened = true;
  }

  onConfirmGroupDelete() {
    if (!!this.selectedGroupId) {
      this.caseFacade.deleteEligibilityGroup(this.selectedGroupId);
    }
    this.isGroupDeleteModalOpened = false;
    this.isGroupDetailOpened = false;
  }

  onCancelDelete() {
    this.isGroupDeleteModalOpened = false;
    this.selectedGroupId = "";
  }

}
