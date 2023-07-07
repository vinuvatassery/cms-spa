/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { ProductivityToolsDomainModule } from '@cms/productivity-tools/domain';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { ProductivityToolsFeatureApprovalRoutingModule } from './productivity-tools-feature-approval-routing.module';
/** Components **/
import { ApprovalListComponent } from './components/approval-list/approval-list.component';
import { ApprovalDetailComponent } from './components/approval-detail/approval-detail.component';
import { ApprovalPageComponent } from './containers/approval-page/approval-page.component';
import { ApprovalsGeneralListComponent } from './components/approvals-general-list/approvals-general-list.component';
import { ApprovalsPaymentsListComponent } from './components/approvals-payments-list/approvals-payments-list.component';
import { DepositDetailsComponent } from './components/deposit-details/deposit-details.component';

@NgModule({
  imports: [
    CommonModule,
    ProductivityToolsDomainModule,
    SharedUiCommonModule,
    SharedUiTpaModule,
    ProductivityToolsFeatureApprovalRoutingModule,
  ],
  declarations: [
    ApprovalListComponent,
    ApprovalDetailComponent,
    ApprovalPageComponent,
    ApprovalsGeneralListComponent,
    ApprovalsPaymentsListComponent,
    DepositDetailsComponent,
  ],
  exports: [
    ApprovalListComponent,
    ApprovalDetailComponent,
    ApprovalPageComponent,
  ],
})
export class ProductivityToolsFeatureApprovalModule {}
