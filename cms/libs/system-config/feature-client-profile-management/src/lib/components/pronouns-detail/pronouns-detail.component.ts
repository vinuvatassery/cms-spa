import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-pronouns-detail',
  templateUrl: './pronouns-detail.component.html',
  styleUrls: ['./pronouns-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PronounsDetailComponent implements OnInit {
  public formUiStyle : UIFormStyle = new UIFormStyle();
  constructor() { }

  ngOnInit(): void {
  }

}
