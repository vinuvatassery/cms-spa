/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { SystemConfigDomainModule } from '@cms/system-config/domain';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SystemConfigFeatureTemplateManagementRoutingModule } from './system-config-feature-template-management-routing.module';
/** Components **/
import { FormsAndDocumentsComponent } from './components/forms-and-documents/forms-and-documents.component';
import { FormsAndDocumentsPageComponent } from './containers/forms-and-documents-page/forms-and-documents-page.component';

@NgModule({
  imports: [
    CommonModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    SystemConfigDomainModule,
    SystemConfigFeatureTemplateManagementRoutingModule,
  ],
  declarations: [FormsAndDocumentsComponent, FormsAndDocumentsPageComponent],
  exports: [FormsAndDocumentsComponent, FormsAndDocumentsPageComponent],
})
export class SystemConfigFeatureTemplateManagementModule {}
