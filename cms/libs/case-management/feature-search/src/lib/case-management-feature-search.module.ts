import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { SearchComponent } from './search.component';

import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiKendoModule } from 'libs/shared/ui-kendo/src';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
    data: { title: 'Todo' },
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CaseManagementDomainModule,
    SharedUiCommonModule,
    SharedUiKendoModule
  ],
  declarations: [SearchComponent],
  exports: [SearchComponent],
})
export class CaseManagementFeatureSearchModule {}
