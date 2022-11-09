import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'system-config-housing-acuity-level-detail',
  templateUrl: './housing-acuity-level-detail.component.html',
  styleUrls: ['./housing-acuity-level-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HousingAcuityLevelDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
