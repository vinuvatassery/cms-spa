import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailTemplateListComponent } from './components/email-template-list/email-template-list.component';
import { LetterTemplateListComponent } from './components/letter-template-list/letter-template-list.component';
import { SmsTextTemplateListComponent } from './components/sms-text-template-list/sms-text-template-list.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    EmailTemplateListComponent,
    LetterTemplateListComponent,
    SmsTextTemplateListComponent
  ],
  exports: [
    EmailTemplateListComponent,
    LetterTemplateListComponent,
    SmsTextTemplateListComponent
  ],
})
export class SystemConfigFeatureCommunicationModule {}
