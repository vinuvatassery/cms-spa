import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-financial-drugs-details',
  templateUrl: './financial-drugs-details.component.html',
  styleUrls: ['./financial-drugs-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialDrugsDetailsComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
