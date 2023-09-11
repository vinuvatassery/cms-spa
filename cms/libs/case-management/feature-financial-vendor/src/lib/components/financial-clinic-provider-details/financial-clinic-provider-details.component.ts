import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-clinic-provider-details',
  templateUrl: './financial-clinic-provider-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClinicProviderDetailsComponent {
  @Output() clickCloseAddEditProvidersDetails = new EventEmitter();
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
