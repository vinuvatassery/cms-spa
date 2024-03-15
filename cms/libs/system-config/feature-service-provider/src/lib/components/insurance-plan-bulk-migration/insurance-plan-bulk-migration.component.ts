import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-insurance-plan-bulk-migration',
  templateUrl: './insurance-plan-bulk-migration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsurancePlanBulkMigrationComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
