import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductivityToolsPageComponent } from './container/productivity-tools-page/productivity-tools-page.component';
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { CaseManagementFeatureProductivityToolsRoutingModule } from './feature-productivity-tools.routing.module';

@NgModule({
  imports: [ CommonModule,
    CaseManagementDomainModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CaseManagementFeatureProductivityToolsRoutingModule,],
  declarations: [ProductivityToolsPageComponent],
  exports: [ProductivityToolsPageComponent],
})
export class CaseManagementFeatureProductivityToolsModule {}
