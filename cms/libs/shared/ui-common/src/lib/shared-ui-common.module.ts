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
import { ReminderNotificationSnackBarComponent } from './reminder-notification-snack-bar/reminder-notification-snack-bar.component';
import { ReAssignCaseComponent } from './re-assign-case/re-assign-case.component';
import { SsnPipe } from './pipes/ssn.pipe';
import { PhonePipe } from './pipes/phone.pipe';

import { FileSizePipe } from './pipes/fileSize.pipe';
// directive
import {
  KendoFileSelectDirective,
  FormFieldAutoFocus,
  TextFieldFormFieldAutoFocus,
  DropDownFieldFormFieldAutoFocus,
} from './directives/kendo-componentsforaccessibility.directive';

import { KendoFileUploadDirective } from './directives/kendo-file-upload-accessibility.directive';
import { AfterValueChangedDirective } from './directives/after-value-changed.directive';
import { PermissionManagerDirective } from './directives/permission-manager.directive';
import { UserPhotoIconComponent } from './user-photo-icon/user-photo-icon.component';
import { CaseEligibilityPeriodsComponent } from './case-eligibility-periods/case-eligibility-periods.component';
import { GridCellDateRangeFilterComponent } from './grid-cell-date-range-filter/grid-cell-date-range-filter.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { ClientsAttachmentComponent } from './clients-attachment/clients-attachment.component';
import { YesOrNoPipe } from './pipes/yes-or-no.pipe';
import { VendorDetailsComponent } from './vendor-details/vendor-details.component';
import { TinPipe } from './pipes/tin.pipe';
import { PlaceholderDirective } from './directives/placeholder.directive';
import { FinancialDrugsDetailsComponent } from './financial-drugs-details/financial-drugs-details.component';
import { FinancialPcaChosenAlertComponent } from './financial-pca-chosen-alert/financial-pca-chosen-alert.component';
import { NdcCodePipe } from './pipes/ndc-code.pipe';
import { CmsPharmacyClaimsDetailComponent } from './cms-pharmacy-claims-detail/cms-pharmacy-claims-detail.component';
import { CmsPharmacyClaimsRecentClaimsComponent } from './cms-pharmacy-claims-recent-claims/cms-pharmacy-claims-recent-claims.component';
import { DashboardLoaderPanelComponent } from './dashboard-loader-panel/dashboard-loader-panel.component';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';
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
    AfterValueChangedDirective,
    FormFieldAutoFocus,
    TextFieldFormFieldAutoFocus,
    DropDownFieldFormFieldAutoFocus,
    PermissionManagerDirective,
    UserPhotoIconComponent,
    CaseEligibilityPeriodsComponent,
    GridCellDateRangeFilterComponent,
    DocumentUploadComponent,
    ClientsAttachmentComponent,
    YesOrNoPipe,
    ReminderNotificationSnackBarComponent,
    VendorDetailsComponent,
    TinPipe,
    ReAssignCaseComponent,
    PlaceholderDirective,
    FinancialDrugsDetailsComponent,
    FinancialPcaChosenAlertComponent,
    NdcCodePipe,
    DashboardLoaderPanelComponent,
    CmsPharmacyClaimsDetailComponent,
    CmsPharmacyClaimsRecentClaimsComponent,
    TodoDetailComponent
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
    AfterValueChangedDirective,
    FormFieldAutoFocus,
    TextFieldFormFieldAutoFocus,
    DropDownFieldFormFieldAutoFocus,
    PermissionManagerDirective,
    UserPhotoIconComponent,
    CaseEligibilityPeriodsComponent,
    GridCellDateRangeFilterComponent,
    DocumentUploadComponent,
    ClientsAttachmentComponent,
    YesOrNoPipe,
    ReminderNotificationSnackBarComponent,
    VendorDetailsComponent,
    TinPipe,
    ReAssignCaseComponent,
    PlaceholderDirective,
    FinancialDrugsDetailsComponent,
    FinancialPcaChosenAlertComponent,
    NdcCodePipe,
    DashboardLoaderPanelComponent,
    CmsPharmacyClaimsDetailComponent,
    CmsPharmacyClaimsRecentClaimsComponent,
    TodoDetailComponent
  ],
})
export class SharedUiCommonModule {}
