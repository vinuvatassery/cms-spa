import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainsListComponent } from './components/domains-list/domains-list.component';
import { AssisterGroupsListComponent } from './components/assister-groups-list/assister-groups-list.component';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { AssisterGroupsPageComponent } from './containers/assister-groups-page/assister-groups-page.component';
import { DomainPageComponent } from './containers/domain-page/domain-page.component';
import { SystemConfigFeatureOtherListsRoutingModule } from './system-config-feature-other-lists.routing.module';
@NgModule({
  imports: [CommonModule, SharedUiTpaModule, SharedUiCommonModule, SystemConfigFeatureOtherListsRoutingModule],
  declarations: [
    DomainsListComponent,
    AssisterGroupsListComponent,
    AssisterGroupsPageComponent,
    DomainPageComponent,
  ],
  exports: [AssisterGroupsPageComponent, DomainPageComponent],
})
export class SystemConfigFeatureOtherListsModule {}
