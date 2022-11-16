import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'system-config-language-detail',
  templateUrl: './language-detail.component.html',
  styleUrls: ['./language-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
