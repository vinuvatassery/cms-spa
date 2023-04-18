import { Component, OnInit, Input } from '@angular/core';
import { StatusPeriodFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-status-ramsell-info',
  templateUrl: './status-ramsell-info.component.html',
  styleUrls: ['./status-ramsell-info.component.scss'],
})
export class StatusRamsellInfoComponent implements OnInit {

  @Input() clientId!: string;
  ramSellInfo: any;

  constructor(
    private statusPeriodFacade: StatusPeriodFacade
  ) {
  }

  ngOnInit() {
    this.loadRamSellInfo();
  }

  loadRamSellInfo() {
    this.statusPeriodFacade.loadRamSellInfo(this.clientId).subscribe({
      next: (data) => {
        this.ramSellInfo = data;
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
