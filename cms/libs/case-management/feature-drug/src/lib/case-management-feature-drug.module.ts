/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { CaseManagementFeatureDrugRoutingModule } from './case-management-feature-drug-routing.module';
/** Components **/
import { DrugPageComponent } from './containers/drug-page/drug-page.component';
import { PharmacyListComponent } from './components/pharmacy-list/pharmacy-list.component';
import { PharmacyDetailComponent } from './components/pharmacy-detail/pharmacy-detail.component';
import { RemovePharmacyComponent } from './components/remove-pharmacy/remove-pharmacy.component';
import { DeactivatePharmacyComponent } from './components/deactivate-pharmacy/deactivate-pharmacy.component';
import { SetAsPrimaryPharmacyComponent } from './components/set-as-primary-pharmacy/set-as-primary-pharmacy.component';
import { PharmacyClaimListComponent } from './components/pharmacy-claim-list/pharmacy-claim-list.component';
import { NewPharmacyApprovalRequestComponent } from './components/new-pharmacy-approval-request/new-pharmacy-approval-request.component';
import { SetPharmacyPriorityComponent } from './components/set-pharmacy-priority/set-pharmacy-priority.component';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementDomainModule,
    CaseManagementFeatureDrugRoutingModule,
    SharedUiTpaModule,
  ],
  declarations: [
    DrugPageComponent,
    PharmacyListComponent,
    PharmacyDetailComponent,
    RemovePharmacyComponent,
    DeactivatePharmacyComponent,
    SetAsPrimaryPharmacyComponent,
    PharmacyClaimListComponent,
    NewPharmacyApprovalRequestComponent,
    SetPharmacyPriorityComponent,
  ],
  exports: [
    DrugPageComponent,
    PharmacyListComponent,
    PharmacyDetailComponent,
    RemovePharmacyComponent,
    DeactivatePharmacyComponent,
    SetAsPrimaryPharmacyComponent,
    PharmacyClaimListComponent,
    NewPharmacyApprovalRequestComponent,
    SetPharmacyPriorityComponent,
  ],
})
export class CaseManagementFeatureDrugModule {}
