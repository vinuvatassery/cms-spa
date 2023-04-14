import { Component, Input, OnInit } from '@angular/core';
import { StatusPeriodFacade } from '@cms/case-management/domain';
import { Observable } from 'rxjs';

@Component({
  selector: 'case-management-status-group-history',
  templateUrl: './status-group-history.component.html',
  styleUrls: ['./status-group-history.component.scss'],
})
export class StatusGroupHistoryComponent implements OnInit {

  @Input() eligibilityId!: string;
  currentGroup$!: Observable<any>;
  ddlGroups$!: Observable<any>;
  statusGroupHistory: any = [];

  constructor(private statusPeriodFacade: StatusPeriodFacade) {
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

  onGroupDetailClosed() {

  }

  onGroupChangeCancelClicked(event: any) {
  }

  onGroupChangeUpdateClicked(event: any) { }


}
