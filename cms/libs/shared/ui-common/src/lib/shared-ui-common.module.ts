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
import { LoaderComponent } from './loader/loader.component';
import { GridLoaderComponent } from './loader/grid-loader.component';
import { OptionbuttonListComponent } from './optionbutton-list/optionbutton-list.component';
import { SsnPipe } from './pipes/ssn.pipe';
import { PhonePipe } from './pipes/phone.pipe';
import { FileSizePipe } from './pipes/fileSize.pipe';
// directive
import {KendoFileSelectDirective, FormFieldAutoFocus, TextFieldFormFieldAutoFocus, DropDownFieldFormFieldAutoFocus } from './directives/kendo-componentsforaccessanility.directive'
import { CaseManagerCardComponent } from './hiv-case-manager-card/case-manager-card.component';
import { KendoFileUploadDirective } from './directives/kendo-file-upload-accessibility.directive';

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
    GridLoaderComponent,
    OptionbuttonListComponent,
    SsnPipe,
    PhonePipe,
    FileSizePipe,
    KendoFileSelectDirective,
    KendoFileUploadDirective,
    FormFieldAutoFocus, 
    TextFieldFormFieldAutoFocus,
    DropDownFieldFormFieldAutoFocus,
    CaseManagerCardComponent
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
    GridLoaderComponent,
    OptionbuttonListComponent,
    SsnPipe,
    PhonePipe,
    FileSizePipe,
    KendoFileSelectDirective,
    KendoFileUploadDirective,
    FormFieldAutoFocus, 
    TextFieldFormFieldAutoFocus,
    DropDownFieldFormFieldAutoFocus,
    CaseManagerCardComponent
  ],
})
export class SharedUiCommonModule {}
