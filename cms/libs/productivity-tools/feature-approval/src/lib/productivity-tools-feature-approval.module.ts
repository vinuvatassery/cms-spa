/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { ProductivityToolsDomainModule } from '@cms/productivity-tools/domain';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { ProductivityToolsFeatureApprovalRoutingModule } from './productivity-tools-feature-approval-routing.module';
/** Components **/
import { ApprovalListComponent } from './components/approval-list/approval-list.component';
import { ApprovalDetailComponent } from './components/approval-detail/approval-detail.component';
import { ApprovalPageComponent } from './containers/approval-page/approval-page.component';

@NgModule({
  imports: [
    CommonModule,
    ProductivityToolsDomainModule,
    SharedUiCommonModule,
    ProductivityToolsFeatureApprovalRoutingModule,
  ],
  declarations: [
    ApprovalListComponent,
    ApprovalDetailComponent,
    ApprovalPageComponent,
  ],
  exports: [
    ApprovalListComponent,
    ApprovalDetailComponent,
    ApprovalPageComponent,
  ],
})
export class ProductivityToolsFeatureApprovalModule {}
