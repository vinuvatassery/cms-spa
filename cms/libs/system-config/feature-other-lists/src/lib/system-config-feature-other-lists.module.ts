import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainsListComponent } from './components/domains-list/domains-list.component';
import { AssisterGroupsListComponent } from './components/assister-groups-list/assister-groups-list.component';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
@NgModule({
  imports: [CommonModule, SharedUiTpaModule, SharedUiCommonModule],
  declarations: [
    DomainsListComponent,
    AssisterGroupsListComponent,
  ],
})
export class SystemConfigFeatureOtherListsModule {}
