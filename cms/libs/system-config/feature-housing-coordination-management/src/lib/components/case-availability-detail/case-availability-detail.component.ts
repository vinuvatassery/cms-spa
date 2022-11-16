import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'system-config-case-availability-detail',
  templateUrl: './case-availability-detail.component.html',
  styleUrls: ['./case-availability-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaseAvailabilityDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
