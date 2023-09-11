import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';  
 

@Component({
  selector: 'cms-financial-clinic-provider-list',
  templateUrl: './financial-clinic-provider-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClinicProviderListComponent {
  isProvidersDetailShow = false;
  isProvidersRemoveShow = false;


  clickOpenAddEditProvidersDetails() {
    this.isProvidersDetailShow = true;
  }

  clickCloseAddEditProvidersDetails() {
    this.isProvidersDetailShow = false;
  }

 

  clickOpenRemoveProviders() {
    this.isProvidersRemoveShow = true;
  }
  clickCloseRemoveProviders() {
    this.isProvidersRemoveShow = false;
  }
}
