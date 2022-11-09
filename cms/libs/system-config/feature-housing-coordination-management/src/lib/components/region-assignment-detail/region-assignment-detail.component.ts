import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'system-config-region-assignment-detail',
  templateUrl: './region-assignment-detail.component.html',
  styleUrls: ['./region-assignment-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegionAssignmentDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
