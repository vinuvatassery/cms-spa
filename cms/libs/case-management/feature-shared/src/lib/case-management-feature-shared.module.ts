import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseDetailComponent } from './components/case-details/case-details.component';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';

@NgModule({
  imports: [
    CommonModule,
    SharedUiTpaModule
  ],
  declarations:[CaseDetailComponent],
  exports: [
    CaseDetailComponent
  ],
})
export class CaseManagementFeatureSharedModule {}
