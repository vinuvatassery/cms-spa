import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProviderFacade } from '@cms/case-management/domain';
@Component({
  selector: 'cms-financial-clinic-provider-remove',
  templateUrl: './financial-clinic-provider-remove.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClinicProviderRemoveComponent {
  constructor( private readonly ProviderFacade: ProviderFacade)
   {}
  removeproviderEvent(providerId: any) {
    if (providerId!=null)
    this.ProviderFacade.removeprovider(providerId);
  }
}
