import { Component, OnInit, Input } from '@angular/core';
import { StatusPeriodFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-status-fpl-history',
  templateUrl: './status-fpl-history.component.html',
  styleUrls: ['./status-fpl-history.component.scss'],
})
export class StatusFplHistoryComponent implements OnInit {

  @Input() eligibilityId!: string;

  statusFplHistory: any = [];

  constructor(private statusPeriodFacade: StatusPeriodFacade) {
  }

  ngOnInit() {
    this.loadFplHistory();
  }

  /* Private methods */
  private loadFplHistory() {
    this.statusPeriodFacade.loadStatusFplHistory(this.eligibilityId).subscribe({
      next: (data) => {
        this.statusFplHistory = data;
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

}
