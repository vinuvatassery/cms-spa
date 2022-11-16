import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'system-config-pca-codes-list',
  templateUrl: './pca-codes-list.component.html',
  styleUrls: ['./pca-codes-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PcaCodesListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
