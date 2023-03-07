import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-service-provider-detail',
  templateUrl: './service-provider-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceProviderDetailComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
