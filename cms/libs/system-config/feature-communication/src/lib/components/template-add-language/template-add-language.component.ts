import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-template-add-language',
  templateUrl: './template-add-language.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateAddLanguageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();

 
}
