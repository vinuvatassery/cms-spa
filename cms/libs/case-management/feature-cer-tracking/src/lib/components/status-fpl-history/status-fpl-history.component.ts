import { Component, OnInit, Input } from '@angular/core';
import { StatusPeriodFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-status-fpl-history',
  templateUrl: './status-fpl-history.component.html',
  styleUrls: ['./status-fpl-history.component.scss'],
})
export class StatusFplHistoryComponent implements OnInit {

  @Input() eligibilityId!: string;

  statusFplHistory$ = this.statusPeriodFacade.statusFplHistory$;

  constructor(private statusPeriodFacade: StatusPeriodFacade) {
  }

  ngOnInit() {
    this.loadFplHistory();
  }

  /* Private methods */
  private loadFplHistory() {
    this.statusPeriodFacade.loadStatusFplHistory(this.eligibilityId);
  }

}
