import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { ClientNotificationDefaultsPageComponent } from './containers/client-notification-defaults-page/client-notification-defaults-page.component';
import { EmailTemplatePageComponent } from './containers/email-template-page/email-template-page.component';
import { FormDocumentsPageComponent } from './containers/form-documents-page/form-documents-page.component';
import { LetterTemplatePageComponent } from './containers/letter-template-page/letter-template-page.component';
import { SmsTextTemplatePageComponent } from './containers/sms-text-template-page/sms-text-template-page.component';
import { TemplatePageComponent } from './containers/template-page/template-page.component';
import { EmailTemplateHeaderFooterPageComponent } from './containers/email-template-header-footer-page/email-template-header-footer-page.component';
import { EmailTemplateNewFormPageComponent } from './containers/email-template-new-form-page/email-template-new-form-page.component';
import { LetterTemplateHeaderFooterPageComponent } from './containers/letter-template-header-footer-page/letter-template-header-footer-page.component';
import { SmsTextTemplateNewFormPageComponent } from './containers/sms-text-template-new-form-page/sms-text-template-new-form-page.component';
import { LetterTemplateNewFormPageComponent } from './containers/letter-template-new-form-page/letter-template-new-form-page.component';

const routes: Routes = [
  {
    path: '',
    component: ClientNotificationDefaultsPageComponent,
 
  }, 
  {
    path: 'client-notification-defaults',
    component: ClientNotificationDefaultsPageComponent,
  },
  {
    path: 'email-template',
    component: EmailTemplatePageComponent,
  },
  {
    path: 'email-template/header-footer',
    component: EmailTemplateHeaderFooterPageComponent,
  },
  {
    path: 'email-template/form',
    component: EmailTemplateNewFormPageComponent,
  },
  {
    path: 'forms-documents',
    component: FormDocumentsPageComponent,
  },
  {
    path: 'letter-template',
    component: LetterTemplatePageComponent,
  },
  {
    path: 'letter-template/header-footer',
    component: LetterTemplateHeaderFooterPageComponent,
  },
  {
    path: 'letter-template/form',
    component: LetterTemplateNewFormPageComponent,
  },
  {
    path: 'sms-text-template',
    component: SmsTextTemplatePageComponent,
  },
  {
    path: 'sms-text-template/form',
    component: SmsTextTemplateNewFormPageComponent,
  },
  {
    path: 'templates',
    component: TemplatePageComponent,
  },
 
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigFeatureCommunicationRoutingModule {}
