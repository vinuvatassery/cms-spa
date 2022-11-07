/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SystemConfigFeatureUserManagementModule } from '@cms/system-config/feature-user-management';
import { CaseManagementFeatureClientRoutingModule } from './case-management-feature-client-routing.module';
/** Components  **/
import { ClientPageComponent } from './containers/client-page/client-page.component';
import { ClientEditViewComponent } from './components/client-edit-view/client-edit-view.component';
import { ClientReadOnlyViewComponent } from './components/client-read-only-view/client-read-only-view.component';
import { SpecialHandlingComponent } from './components/special-handling/special-handling.component';
import { DuplicateClientFoundComponent } from './components/duplicate-client-found/duplicate-client-found.component';
import { CaseDetailsComponent } from './components/case-details/case-details.component';
import { SpecialHandlingDetailComponent } from './components/special-handling-detail/special-handling-detail.component';
import { SharedUiCommonModule } from '@cms/shared/ui-common';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementFeatureClientRoutingModule,
    CaseManagementDomainModule,
    SharedUiCommonModule,
    SharedUiTpaModule,
    SystemConfigFeatureUserManagementModule,
  ],
  declarations: [
    ClientPageComponent,
    ClientEditViewComponent,
    ClientReadOnlyViewComponent,
    SpecialHandlingComponent,
    DuplicateClientFoundComponent,
    CaseDetailsComponent,
    SpecialHandlingDetailComponent,
  ],
  exports: [
    ClientPageComponent,
    ClientEditViewComponent,
    ClientReadOnlyViewComponent,
    SpecialHandlingComponent,
    DuplicateClientFoundComponent,
    SpecialHandlingDetailComponent,
  ],
})
export class CaseManagementFeatureClientModule {}
