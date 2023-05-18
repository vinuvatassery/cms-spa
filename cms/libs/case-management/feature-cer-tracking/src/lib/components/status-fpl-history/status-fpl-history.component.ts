import { Component, OnInit, Input } from '@angular/core';
import { StatusPeriodFacade } from '@cms/case-management/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'case-management-status-fpl-history',
  templateUrl: './status-fpl-history.component.html',
})
export class StatusFplHistoryComponent implements OnInit {

  @Input() eligibilityId!: string;

  statusFplHistory$: any = new Subject<any>();
  loader: boolean = false;

  constructor(private statusPeriodFacade: StatusPeriodFacade) {
  }

  ngOnInit() {
    this.loadFplHistory();
  }

  /* Private methods */
  private loadFplHistory() {
    this.loader = true;
    this.statusPeriodFacade.loadStatusFplHistory(this.eligibilityId).subscribe({
      next: (data) => {
        this.statusFplHistory$.next(data);
        this.loader = false;
      },
      error: (err) => {
        this.loader = false;
        this.statusPeriodFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

}
