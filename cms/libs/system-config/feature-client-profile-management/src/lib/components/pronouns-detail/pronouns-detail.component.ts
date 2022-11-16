import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'system-config-pronouns-detail',
  templateUrl: './pronouns-detail.component.html',
  styleUrls: ['./pronouns-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PronounsDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
