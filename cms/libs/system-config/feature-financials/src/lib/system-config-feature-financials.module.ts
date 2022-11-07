import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FundsListComponent } from './components/funds-list/funds-list.component';
import { ExpenseTypesListComponent } from './components/expense-types-list/expense-types-list.component';
import { IncomeTypesListComponent } from './components/income-types-list/income-types-list.component';
import { IndexListComponent } from './components/index-list/index-list.component';
import { PcaCodesListComponent } from './components/pca-codes/pca-codes-list.component';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';

@NgModule({
  imports: [CommonModule, SharedUiTpaModule, SharedUiCommonModule],
  declarations: [
    FundsListComponent,
    ExpenseTypesListComponent,
    IncomeTypesListComponent,
    IndexListComponent,
    PcaCodesListComponent
  ],
  exports: [
    FundsListComponent,
    ExpenseTypesListComponent,
    IncomeTypesListComponent,
    IndexListComponent,
    PcaCodesListComponent
  ],
})
export class SystemConfigFeatureFinancialsModule {}
