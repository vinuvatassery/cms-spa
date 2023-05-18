import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-financial-navigation',
  templateUrl: './financial-navigation.component.html',
  styleUrls: ['./financial-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialNavigationComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
