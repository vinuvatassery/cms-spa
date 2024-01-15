import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { EmailTemplateListComponent } from './components/email-template-list/email-template-list.component';
import { LetterTemplateListComponent } from './components/letter-template-list/letter-template-list.component';
import { SmsTextTemplateListComponent } from './components/sms-text-template-list/sms-text-template-list.component';
import { ClientNotificationDefaultsListComponent } from './components/client_notification_defaults_list/client-notification-defaults-list.component';
import { FormDocumentsListComponent } from './components/form_documents_list/form-documents-list.component';
import { EmailTemplateHeaderFooterComponent } from './components/email-template-header-footer/email-template-header-footer.component';
import { EmailTemplateNewFormComponent } from './components/email-template-new-form/email-template-new-form.component';
import { EmailTemplateSendTestComponent } from './components/email-template-send-test/email-template-send-test.component';
import { EmailTemplateLeavePageComponent } from './components/email-template-leave-page/email-template-leave-page.component';
import { EmailTemplateDeactivateComponent } from './components/email-template-deactivate/email-template-deactivate.component';
import { EmailTemplateDeleteComponent } from './components/email-template-delete/email-template-delete.component';
import { TemplateAddLanguageComponent } from './components/template-add-language/template-add-language.component';
import { TemplateDeleteLanguageComponent } from './components/template-delete-language/template-delete-language.component';

@NgModule({
  imports: [CommonModule, SharedUiTpaModule, SharedUiCommonModule],
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
    EmailTemplateDeactivateComponent,
    EmailTemplateDeleteComponent,
    TemplateAddLanguageComponent,
    TemplateDeleteLanguageComponent,
  ],
  exports: [
    ClientNotificationDefaultsListComponent,
    FormDocumentsListComponent,
    EmailTemplateHeaderFooterComponent,
    EmailTemplateNewFormComponent,
    EmailTemplateSendTestComponent,
    EmailTemplateLeavePageComponent,
    EmailTemplateDeactivateComponent,
    EmailTemplateDeleteComponent,
    TemplateAddLanguageComponent,
    TemplateDeleteLanguageComponent,
  ],
})
export class SystemConfigFeatureCommunicationModule {}
