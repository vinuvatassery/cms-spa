import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { EmailTemplateListComponent } from './components/email-template-list/email-template-list.component';
import { LetterTemplateListComponent } from './components/letter-template-list/letter-template-list.component';
import { SmsTextTemplateListComponent } from './components/sms-text-template-list/sms-text-template-list.component';
import { ClientNotificationDefaultsListComponent } from './components/client-notification-defaults-list/client-notification-defaults-list.component';
import { FormDocumentsListComponent } from './components/form-documents-list/form-documents-list.component';
import { EmailTemplateHeaderFooterComponent } from './components/email-template-header-footer/email-template-header-footer.component';
import { EmailTemplateNewFormComponent } from './components/email-template-new-form/email-template-new-form.component';
import { EmailTemplateSendTestComponent } from './components/email-template-send-test/email-template-send-test.component';
import { EmailTemplateLeavePageComponent } from './components/email-template-leave-page/email-template-leave-page.component';

import { TemplateAddLanguageComponent } from './components/template-add-language/template-add-language.component';
import { TemplateDeleteLanguageComponent } from './components/template-delete-language/template-delete-language.component';
import { LetterTemplateHeaderFooterComponent } from './components/letter-template-header-footer/letter-template-header-footer.component';
import { LetterTemplateLeavePageComponent } from './components/letter-template-leave-page/letter-template-leave-page.component';
import { LetterTemplateNewFormComponent } from './components/letter-template-new-form/letter-template-new-form.component';
import { SmsTextTemplateNewFormComponent } from './components/sms-text-template-new-form/sms-text-template-new-form.component';
import { SmsTextTemplateSendTestComponent } from './components/sms-text-template-send-test/sms-text-template-send-test.component';
import { ClientNotificationDefaultsPageComponent } from './containers/client-notification-defaults-page/client-notification-defaults-page.component';
import { EmailTemplatePageComponent } from './containers/email-template-page/email-template-page.component';
import { SmsTextTemplatePageComponent } from './containers/sms-text-template-page/sms-text-template-page.component';
import { FormDocumentsPageComponent } from './containers/form-documents-page/form-documents-page.component';
import { LetterTemplatePageComponent } from './containers/letter-template-page/letter-template-page.component';
import { TemplatePageComponent } from './containers/template-page/template-page.component';
import { SystemConfigFeatureCommunicationRoutingModule } from './system-config-feature-communication.routing.module';
import { LetterTemplateHeaderFooterPageComponent } from './containers/letter-template-header-footer-page/letter-template-header-footer-page.component';
import { EmailTemplateNewFormPageComponent } from './containers/email-template-new-form-page/email-template-new-form-page.component';
import { LetterTemplateNewFormPageComponent } from './containers/letter-template-new-form-page/letter-template-new-form-page.component';
import { SmsTextTemplateNewFormPageComponent } from './containers/sms-text-template-new-form-page/sms-text-template-new-form-page.component';
import { EmailTemplateHeaderFooterPageComponent } from './containers/email-template-header-footer-page/email-template-header-footer-page.component';
import { TemplateLayoutListsComponent } from './components/template-layout-lists/template-layout-lists.component';
import { TemplateLayoutNewFormComponent } from './components/template-layout-new-form/template-layout-new-form.component';
import { TemplateLayoutNewFormPageComponent } from './containers/template-layout-new-form-page/template-layout-new-form-page.component';
import { TemplateLayoutPageComponent } from './containers/template-layout-page/template-layout-page.component';
import { AddFolderComponent } from './components/add-folder/add-folder.component';
import { UploadFilesComponent } from './components/upload-files/upload-files.component';

@NgModule({
  imports: [
    CommonModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    SystemConfigFeatureCommunicationRoutingModule,
  ],
  declarations: [
    EmailTemplateListComponent,
    LetterTemplateListComponent,
    SmsTextTemplateListComponent,
    ClientNotificationDefaultsListComponent,
    FormDocumentsListComponent,
    EmailTemplateHeaderFooterComponent,
    EmailTemplateNewFormComponent,
    EmailTemplateSendTestComponent,
    EmailTemplateLeavePageComponent,
    TemplateAddLanguageComponent,
    TemplateDeleteLanguageComponent,
    LetterTemplateHeaderFooterComponent,
    LetterTemplateLeavePageComponent,
    LetterTemplateListComponent,
    LetterTemplateNewFormComponent,
    SmsTextTemplateNewFormComponent,
    SmsTextTemplateSendTestComponent,
    ClientNotificationDefaultsPageComponent,
    EmailTemplatePageComponent,
    SmsTextTemplatePageComponent,
    FormDocumentsPageComponent,
    LetterTemplatePageComponent,
    TemplatePageComponent,
    LetterTemplateHeaderFooterPageComponent,
    EmailTemplateNewFormPageComponent,
    LetterTemplateHeaderFooterPageComponent,
    LetterTemplateNewFormPageComponent,
    SmsTextTemplateNewFormPageComponent,
    EmailTemplateHeaderFooterPageComponent,
    TemplateLayoutNewFormComponent,
    TemplateLayoutNewFormPageComponent,
    TemplateLayoutPageComponent,
    TemplateLayoutListsComponent,
    AddFolderComponent,
    UploadFilesComponent,
  ],
  exports: [
    ClientNotificationDefaultsListComponent,
    FormDocumentsListComponent,
    EmailTemplateHeaderFooterComponent,
    EmailTemplateNewFormComponent,
    EmailTemplateSendTestComponent,
    EmailTemplateLeavePageComponent,
    LetterTemplatePageComponent,
    TemplateAddLanguageComponent,
    TemplateDeleteLanguageComponent,
    LetterTemplateHeaderFooterComponent,
    LetterTemplateLeavePageComponent,
    LetterTemplateListComponent,
    LetterTemplateNewFormComponent,
    SmsTextTemplateNewFormComponent,
    SmsTextTemplateSendTestComponent,
    ClientNotificationDefaultsPageComponent,
    EmailTemplatePageComponent,
    SmsTextTemplatePageComponent,
    FormDocumentsPageComponent,
    TemplatePageComponent,
    LetterTemplateHeaderFooterPageComponent,
    EmailTemplateNewFormPageComponent,
    LetterTemplateHeaderFooterPageComponent,
    LetterTemplateNewFormPageComponent,
    SmsTextTemplateNewFormPageComponent,
    EmailTemplateHeaderFooterPageComponent,
    TemplateLayoutNewFormComponent,
    TemplateLayoutNewFormPageComponent,
    TemplateLayoutPageComponent,
    TemplateLayoutListsComponent,
    AddFolderComponent,
    UploadFilesComponent,
  ],
})
export class SystemConfigFeatureCommunicationModule {}
