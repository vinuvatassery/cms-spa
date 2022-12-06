/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
/** Components  **/
import { LoginStatusComponent } from './auth/login-status/login-status.component';
import { BreadCrumbComponent } from './bread-crumb/bread-crumb.component';
import { SignalrStatusComponent } from './signalr-status/signalr-status.component';
import { AddressValidationComponent } from './address-validation/address-validation.component';
import { SignaturePadComponent } from './signature-pad/signature-pad/signature-pad.component';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { NotificationSnackBarComponent } from './notification-snack-bar/notification-snack-bar.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { UserProfileCardComponent } from './user-profile-card/user-profile-card.component';
import { LoaderComponent } from './loader-component';
import { CheckboxListComponent } from './checkbox-list/checkbox-list.component';

// import { SystemConfigFeatureUserManagementModule } from '@cms/system-config/feature-user-management';

@NgModule({
  imports: [CommonModule, SharedUiTpaModule],
  declarations: [
    LoginStatusComponent,
    BreadCrumbComponent,
    SignalrStatusComponent,
    AddressValidationComponent,
    SignaturePadComponent,
    NotificationSnackBarComponent,
    DeleteConfirmationComponent,
    AccountSettingsComponent,
    UserProfileCardComponent,
    LoaderComponent,
    CheckboxListComponent,
  ],
  exports: [
    LoginStatusComponent,
    BreadCrumbComponent,
    SignalrStatusComponent,
    AddressValidationComponent,
    SignaturePadComponent,
    NotificationSnackBarComponent,
    DeleteConfirmationComponent,
    AccountSettingsComponent,
    UserProfileCardComponent,
    LoaderComponent,
  ],
})
export class SharedUiCommonModule {}
