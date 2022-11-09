import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'system-config-housing-coordination-page',
  templateUrl: './housing-coordination-page.component.html',
  styleUrls: ['./housing-coordination-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HousingCoordinationPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
