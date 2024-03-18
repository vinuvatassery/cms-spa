import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseTypesListComponent } from './components/expense-types-list/expense-types-list.component';
import { FundsListComponent } from './components/funds-list/funds-list.component';
import { IncomeTypesListComponent } from './components/income-types-list/income-types-list.component';
import { IndexListComponent } from './components/index-list/index-list.component'; 
import { PcaCodesListComponent } from './components/pca-codes-list/pca-codes-list.component';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { ExpenseTypePageComponent } from './containers/expense-type-page/expense-type-page.component';
import { FundsPageComponent } from './containers/funds-page/funds-page.component';
import { IncomeTypesPageComponent } from './containers/income-types-page/income-types-page.component';
import { PcaCodesPageComponent } from './containers/pca-codes-page/pca-codes-page.component';
import { IndexPageComponent } from './containers/index-page/index-page.component';
import { SystemConfigFeatureFinancialsRoutingModule } from './system-config-feature-financials.routing.module';

@NgModule({
  imports: [CommonModule, SharedUiTpaModule, SharedUiCommonModule, SystemConfigFeatureFinancialsRoutingModule],
  declarations: [
    ExpenseTypesListComponent,
    FundsListComponent,
    IncomeTypesListComponent,
    IndexListComponent, 
    PcaCodesListComponent,
    ExpenseTypePageComponent,
    FundsPageComponent,
    IncomeTypesPageComponent,
    PcaCodesPageComponent,
    IndexPageComponent
  ],
  exports: [
    ExpenseTypePageComponent,
    FundsPageComponent,
    IncomeTypesPageComponent,
    PcaCodesPageComponent,
    IndexPageComponent
  ],
})
export class SystemConfigFeatureFinancialsModule {}
