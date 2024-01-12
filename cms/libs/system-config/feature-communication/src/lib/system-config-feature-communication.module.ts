import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { EmailTemplateListComponent } from './components/email-template-list/email-template-list.component';
import { LetterTemplateListComponent } from './components/letter-template-list/letter-template-list.component';
import { SmsTextTemplateListComponent } from './components/sms-text-template-list/sms-text-template-list.component'; 
import { ClientNotificationDefaultsListComponent } from './components/client_notification_defaults_list/client-notification-defaults-list.component';
import { FormDocumentsListComponent } from './components/form_documents_list/form-documents-list.component';

@NgModule({
  imports: [CommonModule, SharedUiTpaModule, SharedUiCommonModule],
  declarations: [
    EmailTemplateListComponent,
    LetterTemplateListComponent,
    SmsTextTemplateListComponent, 
    ClientNotificationDefaultsListComponent,
    FormDocumentsListComponent,
  ],
  exports: [  
    ClientNotificationDefaultsListComponent,
    FormDocumentsListComponent,
  ],
})
export class SystemConfigFeatureCommunicationModule {}
