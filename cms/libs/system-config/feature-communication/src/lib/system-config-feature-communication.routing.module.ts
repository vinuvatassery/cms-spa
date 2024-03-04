import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { ClientNotificationDefaultsPageComponent } from './containers/client-notification-defaults-page/client-notification-defaults-page.component';
import { EmailTemplatePageComponent } from './containers/email-template-page/email-template-page.component';
import { FormDocumentsPageComponent } from './containers/form-documents-page/form-documents-page.component';
import { LetterTemplatePageComponent } from './containers/letter-template-page/letter-template-page.component';
import { SmsTextTemplatePageComponent } from './containers/sms-text-template-page/sms-text-template-page.component';
import { TemplatePageComponent } from './containers/template-page/template-page.component';

const routes: Routes = [
  {
    path: '',
    component: EmailTemplatePageComponent,
 
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
    path: 'form-template',
    component: FormDocumentsPageComponent,
  },
  {
    path: 'email-template',
    component: LetterTemplatePageComponent,
  },
  {
    path: 'sms-text-template',
    component: SmsTextTemplatePageComponent,
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
