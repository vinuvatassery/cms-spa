import { Component, Input, OnInit } from '@angular/core';
import { StatusPeriodFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-status-group-history',
  templateUrl: './status-group-history.component.html',
  styleUrls: ['./status-group-history.component.scss'],
})
export class StatusGroupHistoryComponent implements OnInit {

  @Input() eligibilityId!: string;

  statusGroupHistory$ = this.statusPeriodFacade.statusGroupHistory$;

  constructor(private statusPeriodFacade: StatusPeriodFacade) {
  }

  ngOnInit() {
    this.loadGroupHistory();
  }

  /* Private methods */
  private loadGroupHistory() {
    this.statusPeriodFacade.loadStatusGroupHistory(this.eligibilityId);
  }

}
