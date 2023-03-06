import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'
@Component({
  selector: 'system-config-language-detail',
  templateUrl: './language-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageDetailComponent {
  public formUiStyle : UIFormStyle = new UIFormStyle();
}
