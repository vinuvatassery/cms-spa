import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-service-provider-detail',
  templateUrl: './service-provider-detail.component.html',
  styleUrls: ['./service-provider-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceProviderDetailComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
