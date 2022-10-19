/** Angular **/
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'system-config-pronouns-detail',
  templateUrl: './pronouns-detail.component.html',
  styleUrls: ['./pronouns-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PronounsDetailComponent implements OnInit {
  /** Constructor **/
  constructor() { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
  }
}
