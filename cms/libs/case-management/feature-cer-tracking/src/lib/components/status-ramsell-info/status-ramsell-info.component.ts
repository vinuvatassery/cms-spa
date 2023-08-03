import { Component, OnInit, Input } from '@angular/core';
import { StatusPeriodFacade } from '@cms/case-management/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-status-ramsell-info',
  templateUrl: './status-ramsell-info.component.html',
})
export class StatusRamsellInfoComponent implements OnInit {

  @Input() clientId!: string;
  @Input() clientCaseEligibilityId!: any;
  ramSellInfo: any;

  constructor(
    private statusPeriodFacade: StatusPeriodFacade
  ) {
  }

  ngOnInit() {
    this.loadRamSellInfo();
  }

  loadRamSellInfo() {
    this.statusPeriodFacade.loadRamSellInfo(this.clientId,this.clientCaseEligibilityId).subscribe({
      next: (data) => {
        this.ramSellInfo = data;
      },
      error: (err) => {
        this.statusPeriodFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }
}
