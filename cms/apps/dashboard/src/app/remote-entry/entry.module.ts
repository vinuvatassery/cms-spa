import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RemoteEntryComponent } from './entry.component';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiKendoModule } from 'libs/shared/ui-kendo/src';
import { DashboardUiModule } from '@cms/dashboard/ui';
@NgModule({
  declarations: [RemoteEntryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: RemoteEntryComponent,
      },
    ]),
    SharedUiCommonModule,
    SharedUiKendoModule,
    DashboardUiModule,
  ],
  providers: [],
})
export class RemoteEntryModule {}
