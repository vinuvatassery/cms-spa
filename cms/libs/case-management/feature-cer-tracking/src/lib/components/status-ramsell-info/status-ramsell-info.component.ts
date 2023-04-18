import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'case-management-status-ramsell-info',
  templateUrl: './status-ramsell-info.component.html',
  styleUrls: ['./status-ramsell-info.component.scss'],
})
export class StatusRamsellInfoComponent implements OnInit {

  @Input() clientId!: string;
  ramSellInfo: any;

  constructor(
    private readonly statusPeriodFacade: StatusPeriodFacade
  ) {
  }

  ngOnInit() {
    this.loadRamSellInfo();
  }

  loadRamSellInfo() {
    this.statusPeriodFacade.loadRamSellInfo(this.clientId).subscribe((resp: any) => {
      this.ramSellInfo = resp.data;
    });
  }
}
