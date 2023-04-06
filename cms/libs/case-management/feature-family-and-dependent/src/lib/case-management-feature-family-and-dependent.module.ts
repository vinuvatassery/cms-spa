/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { CaseManagementFeatureFamilyAndDependentRoutingModule } from './case-management-feature-family-and-dependent-routing.module';
/** Components **/
import { FamilyAndDependentListComponent } from './components/family-and-dependent-list/family-and-dependent-list.component';
import { FamilyAndDependentDetailComponent } from './components/family-and-dependent-detail/family-and-dependent-detail.component';
import { RemoveFamilyAndDependentConfirmationComponent } from './components/remove-family-and-dependent-confirmation/remove-family-and-dependent-confirmation.component';
import { FamilyAndDependentPageComponent } from './container/family-and-dependent-page/family-and-dependent-page.component';
import { ProfileFamilyAndDependentPageComponent } from './container/profile-family-and -dependent-page/profile-family-and-dependent-page.component';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementDomainModule,
    CaseManagementFeatureFamilyAndDependentRoutingModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
  ],
  declarations: [
    FamilyAndDependentListComponent,
    FamilyAndDependentDetailComponent,
    RemoveFamilyAndDependentConfirmationComponent,
    FamilyAndDependentPageComponent,
    ProfileFamilyAndDependentPageComponent
  ],
  exports: [
    FamilyAndDependentListComponent,
    FamilyAndDependentDetailComponent,
    RemoveFamilyAndDependentConfirmationComponent,
    ProfileFamilyAndDependentPageComponent
  ],
})
export class CaseManagementFeatureFamilyAndDependentModule {}
