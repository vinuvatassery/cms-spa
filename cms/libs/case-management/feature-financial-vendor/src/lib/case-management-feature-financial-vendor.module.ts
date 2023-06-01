import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialVendorPageComponent } from './containers/financial-vendor-page/financial-vendor-page.component';
import { FinancialVendorProfileComponent } from './containers/financial-vendor-profile/financial-vendor-profile.component';
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
import { VendorInfoComponent } from './components/vendor-info/vendor-info.component';
import { VendorHeaderToolsComponent } from './components/vendor-header-tools/vendor-header-tools.component';
import { PaymentAddressesComponent } from './components/payment-addresses/payment-addresses.component';
import { FinancialDrugsComponent } from './components/financial-drugs/financial-drugs.component';
import { FinancialPaymentComponent } from './components/financial-payments/financial-payments.component'; 
import { BillingAddressDeactivateComponent } from './components/billing-address-deactivate/billing-address-deactivate.component';
import { BillingAddressDeleteComponent } from './components/billing-address-delete/billing-address-delete.component';
import { BillingAddressDetailsComponent } from './components/billing-address-details/billing-address-details.component';
import { BillingAddressListComponent } from './components/billing-address-list/billing-address-list.component';
import { BillingEmailAddressDeleteComponent } from './components/billing-email-address-delete/billing-email-address-delete.component';
import { BillingEmailAddressDetailsComponent } from './components/billing-email-address-details/billing-email-address-details.component';
import { BillingEmailAddressListComponent } from './components/billing-email-address-list/billing-email-address-list.component';
import { ContactsDeactivateComponent } from './components/contacts-deactivate/contacts-deactivate.component';
import { ContactsDeleteComponent } from './components/contacts-delete/contacts-delete.component';
import { ContactsDetailsComponent } from './components/contacts-details/contacts-details.component';
import { FinancialInsurancePlansComponent } from './components/financial-insurance-plans/financial-insurance-plans.component';
import { FinancialPharmacyClaimsComponent } from './components/financial-pharmacy-claims/financial-pharmacy-claims.component';
import { FinancialDrugsDetailsComponent } from './components/financial-drugs-details/financial-drugs-details.component';
import { FinancialDrugsDeactivateComponent } from './components/financial-drugs-deactivate/financial-drugs-deactivate.component';
import { FinancialDrugsReassignComponent } from './components/financial-drugs-reassign/financial-drugs-reassign.component';
import { FinancialInsuranceProviderComponent } from './components/financial-insurance-provider/financial-insurance-provider.component';
import { ProductivityToolsFeatureEventLogModule } from '@cms/productivity-tools/feature-event-log';

@NgModule({
  imports: [
    CaseManagementDomainModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CommonModule,
    CaseManagementFeatureFinancialVendorRoutingModule,
    ProductivityToolsFeatureTodoModule,
    ProductivityToolsFeatureEventLogModule
  ],
  declarations: [
    FinancialVendorPageComponent,
    FinancialVendorProfileComponent,
    InvoicesComponent,
    ClientsComponent,
    ContactsComponent,
    VendorProfileHeaderComponent,
    VendorsListComponent,
    FinancialReminderComponent,
    VendorDetailsComponent,
    ProvidersListComponent,
    VendorInfoComponent,
    VendorHeaderToolsComponent,
    PaymentAddressesComponent,
    FinancialDrugsComponent,
    FinancialPaymentComponent,
    FinancialInsurancePlansComponent,
    FinancialPharmacyClaimsComponent,
    BillingAddressDeactivateComponent,
    BillingAddressDeleteComponent,
    BillingAddressDetailsComponent,
    BillingAddressListComponent,
    BillingEmailAddressDeleteComponent,
    BillingEmailAddressDetailsComponent,
    BillingEmailAddressListComponent,
    ContactsDeactivateComponent,
    ContactsDeleteComponent,
    ContactsDetailsComponent,
    FinancialDrugsDetailsComponent,
    FinancialDrugsDeactivateComponent,
    FinancialDrugsReassignComponent,
    FinancialInsuranceProviderComponent
  ],
  exports: [
    FinancialVendorPageComponent,
    FinancialVendorProfileComponent,
    InvoicesComponent,
    ClientsComponent,
    ContactsComponent,
    VendorProfileHeaderComponent,
    VendorsListComponent,
    FinancialReminderComponent,
    VendorDetailsComponent,
    ProvidersListComponent,
    VendorInfoComponent,
    VendorHeaderToolsComponent,
    PaymentAddressesComponent,
    FinancialDrugsComponent,
    FinancialPaymentComponent,
    FinancialInsurancePlansComponent,
    FinancialPharmacyClaimsComponent,
    BillingAddressDeactivateComponent,
    BillingAddressDeleteComponent,
    BillingAddressDetailsComponent,
    BillingAddressListComponent,
    BillingEmailAddressDeleteComponent,
    BillingEmailAddressDetailsComponent,
    BillingEmailAddressListComponent,
    ContactsDeactivateComponent,
    ContactsDeleteComponent,
    ContactsDetailsComponent,
    FinancialDrugsDetailsComponent,
    FinancialDrugsDeactivateComponent,
    FinancialDrugsReassignComponent,
    FinancialInsuranceProviderComponent
  ],
})
export class CaseManagementFeatureFinancialVendorModule {}
