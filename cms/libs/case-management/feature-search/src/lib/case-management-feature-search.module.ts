/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { CaseManagementFeatureSearchRoutingModule } from './case-management-feature-search-routing.module';
/** Components **/
import { SearchPageComponent } from './containers/search-page/search-page.component';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SearchComponent } from './components/search/search.component';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementFeatureSearchRoutingModule,
    CaseManagementDomainModule,

    SharedUiTpaModule,
  ],
  declarations: [SearchPageComponent, SearchComponent],
  exports: [SearchComponent],
})
export class CaseManagementFeatureSearchModule {}
