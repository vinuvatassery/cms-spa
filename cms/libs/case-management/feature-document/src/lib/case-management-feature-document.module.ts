/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { CaseManagementFeatureDocumentRoutingModule } from './case-management-feature-document-routing.module';
/** Components **/
import { UploadProofDocumentComponent } from './components/upload-proof-document/upload-proof-document.component';
import { DocumentPageComponent } from './containers/document-page/document-page.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';


@NgModule({
  imports: [
    CommonModule,
    CaseManagementDomainModule,
    CaseManagementFeatureDocumentRoutingModule,
    SharedUiCommonModule,
    SharedUiTpaModule
  ],
  declarations: [
    UploadProofDocumentComponent,
    DocumentPageComponent,
    DocumentListComponent,
  ],
  exports: [
    UploadProofDocumentComponent,
    DocumentPageComponent,
    DocumentListComponent,
  ],
})
export class CaseManagementFeatureDocumentModule {}
