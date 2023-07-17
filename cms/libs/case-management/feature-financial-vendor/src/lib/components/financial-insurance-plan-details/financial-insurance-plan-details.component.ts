import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-financial-insurance-plan-details',
  templateUrl: './financial-insurance-plan-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialInsurancePlanDetailsComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
