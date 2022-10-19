/** Angular **/
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: 'system-config-gender-detail',
  templateUrl: './gender-detail.component.html',
  styleUrls: ['./gender-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenderDetailComponent implements OnInit {
  /** Constructor **/
  constructor() { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
  }

}
