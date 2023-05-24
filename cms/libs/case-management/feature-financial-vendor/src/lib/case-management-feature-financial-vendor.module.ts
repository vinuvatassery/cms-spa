import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialVendorPageComponent } from './containers/financial-vendor-page/financial-vendor-page.component';
import { FinancialVendorProfileComponent } from './containers/financial-vendor-profile/financial-vendor-profile.component';
import { ProviderInfoComponent } from './components/provider-info/provider-info.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { VendorProfileHeaderComponent } from './components/vendor-profile-header/vendor-profile-header.component';
import { CaseManagementFeatureFinancialVendorRoutingModule } from './case-management-feature-financial-vendor.routing.module';
import { ProductivityToolsFeatureTodoModule } from '@cms/productivity-tools/feature-todo';
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { VendorsListComponent } from './components/vendors-list/vendors-list.component';
import { VendorDetailsComponent } from './components/vendor-details/vendor-details.component';
import { FinancialReminderComponent } from './components/financial-reminder/financial-reminder.component';
import { ProvidersListComponent } from './components/providers-list/providers-list.component';
import { FinancialProviderProfileComponent } from './containers/financial-provider-profile/financial-provider-profile.component';
import { ProviderProfileHeaderComponent } from './components/provider-profile-header/provider-profile-header.component';

@NgModule({
  imports: [
    CaseManagementDomainModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CommonModule,
    CaseManagementFeatureFinancialVendorRoutingModule,
    ProductivityToolsFeatureTodoModule
  ],
  declarations: [
    FinancialVendorPageComponent,
    FinancialVendorProfileComponent,
    ProviderInfoComponent,
    InvoicesComponent,
    ClientsComponent,
    ContactsComponent,
    VendorProfileHeaderComponent,
    VendorsListComponent,
    FinancialReminderComponent,
    VendorDetailsComponent,
    ProvidersListComponent,
    FinancialProviderProfileComponent,
    ProviderProfileHeaderComponent
  ],
  exports: [
    FinancialVendorPageComponent,
    FinancialVendorProfileComponent,
    ProviderInfoComponent,
    InvoicesComponent,
    ClientsComponent,
    ContactsComponent,
    VendorProfileHeaderComponent,
    VendorsListComponent,
    FinancialReminderComponent,
    VendorDetailsComponent,
    ProvidersListComponent,
    FinancialProviderProfileComponent,
    ProviderProfileHeaderComponent
  ],
})
export class CaseManagementFeatureFinancialVendorModule {}
