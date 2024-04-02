/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { CaseManagementFeatureCommunicationRoutingModule } from './case-management-feature-communication-routing.module';
/** Components **/
import { SendTextMessageComponent } from './components/text-message/send-text-message/send-text-message.component';
import { TextMessageEditorComponent } from './components/text-message/text-message-editor/text-message-editor.component';
import { SendTextMessageConfirmationComponent } from './components/text-message/send-text-message-confirmation/send-text-message-confirmation.component';
import { TemplatePickerComponent } from './components/template-picker/template-picker.component';
import { SendEmailComponent } from './components/email/send-email/send-email.component';
import { EmailEditorComponent } from './components/email/email-editor/email-editor.component';
import { EmailAttachmentComponent } from './components/email/email-attachment/email-attachment.component';
import { PreviewEmailComponent } from './components/email/preview-email/preview-email.component';
import { SendEmailConfirmationComponent } from './components/email/send-email-confirmation/send-email-confirmation.component';
import { SendLetterComponent } from './components/letter/send-letter/send-letter.component';
import { LetterEditorComponent } from './components/letter/letter-editor/letter-editor.component';
import { LetterAttachmentComponent } from './components/letter/letter-attachment/letter-attachment.component';
import { PreviewLetterComponent } from './components/letter/preview-letter/preview-letter.component';
import { PrintLetterComponent } from './components/letter/print-letter/print-letter.component';
import { SendLetterConfirmationComponent } from './components/letter/send-letter-confirmation/send-letter-confirmation.component';
import { SendIdCardComponent } from './components/id-card/send-id-card/send-id-card.component';
import { CommunicationPageComponent } from './containers/communication-page/communication-page.component';
import { SendLetterPageComponent } from './containers/send-letter-page/send-letter-page.component';
import { DisEnrollmentLaterComponent } from './components/disenrollment-letter-later/disenrollment-letter-later.component';
import { ApprovalLaterComponent } from './components/approval-letter-later/approval-letter-later.component';
import { NotificationDraftConfirmationComponent } from './components/notification-draft-confirmation/notification-draft-confirmation.component';
import { PreviewNotificationTemplatesComponent } from './components/preview-notification-templates/preview-notification-templates.component';

@NgModule({
  imports: [
    CommonModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CaseManagementDomainModule,
    CaseManagementFeatureCommunicationRoutingModule,
  ],
  declarations: [
    SendTextMessageComponent,
    TextMessageEditorComponent,
    SendTextMessageConfirmationComponent,
    TemplatePickerComponent,
    SendEmailComponent,
    EmailEditorComponent,
    EmailAttachmentComponent,
    PreviewEmailComponent,
    SendEmailConfirmationComponent,
    SendLetterComponent,
    LetterEditorComponent,
    LetterAttachmentComponent,
    PreviewLetterComponent,
    PrintLetterComponent,
    SendLetterConfirmationComponent,
    SendIdCardComponent,
    CommunicationPageComponent,
    SendLetterPageComponent,
    DisEnrollmentLaterComponent,
    ApprovalLaterComponent,
    NotificationDraftConfirmationComponent,
    PreviewNotificationTemplatesComponent,
  ],
  exports: [
    SendTextMessageComponent,
    TextMessageEditorComponent,
    SendTextMessageConfirmationComponent,
    TemplatePickerComponent,
    SendEmailComponent,
    EmailEditorComponent,
    EmailAttachmentComponent,
    PreviewEmailComponent,
    SendEmailConfirmationComponent,
    SendLetterComponent,
    LetterEditorComponent,
    LetterAttachmentComponent,
    PreviewLetterComponent,
    PrintLetterComponent,
    SendLetterConfirmationComponent,
    SendIdCardComponent,
    CommunicationPageComponent,
    SendLetterPageComponent,
    DisEnrollmentLaterComponent,
    ApprovalLaterComponent,
    NotificationDraftConfirmationComponent,
    PreviewNotificationTemplatesComponent,
  ],
})
export class CaseManagementFeatureCommunicationModule {}
