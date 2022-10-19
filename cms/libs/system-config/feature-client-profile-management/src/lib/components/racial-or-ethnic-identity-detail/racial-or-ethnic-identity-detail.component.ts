/** Angular **/
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'system-config-racial-or-ethnic-identity-detail',
  templateUrl: './racial-or-ethnic-identity-detail.component.html',
  styleUrls: ['./racial-or-ethnic-identity-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RacialOrEthnicIdentityDetailComponent implements OnInit {
  /** Public properties **/
  ddlIdentityCategory: Array<string> = ["Value 1", "Value 2", "Value 3", "Value 4",];

  /** Constructor **/
  constructor() { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
  }
}
