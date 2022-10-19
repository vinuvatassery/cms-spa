/** Angular **/
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: 'system-config-sexual-orientation-detail',
  templateUrl: './sexual-orientation-detail.component.html',
  styleUrls: ['./sexual-orientation-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SexualOrientationDetailComponent implements OnInit {
  /** Constructor **/
  constructor() { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
  }

}
