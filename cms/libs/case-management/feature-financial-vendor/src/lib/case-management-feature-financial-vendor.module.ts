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
import { FinancialReminderComponent } from './components/financial-reminder/financial-reminder.component';
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
import { FinancialInsuranceProviderListComponent } from './components/financial-insurance-provider-list/financial-insurance-provider-list.component';
import { FinancialPharmacyClaimsComponent } from './components/financial-pharmacy-claims/financial-pharmacy-claims.component';
import { FinancialDrugsDeactivateComponent } from './components/financial-drugs-deactivate/financial-drugs-deactivate.component';
import { FinancialDrugsReassignComponent } from './components/financial-drugs-reassign/financial-drugs-reassign.component';
import { FinancialInsuranceProviderComponent } from './components/financial-insurance-provider/financial-insurance-provider.component';
import { FinancialInsurancePlanDetailsComponent } from './components/financial-insurance-plan-details/financial-insurance-plan-details.component';
import { FinancialInsurancePlanDeleteComponent } from './components/financial-insurance-plan-delete/financial-insurance-plan-delete.component';
import { FinancialInsurancePlanDeactivateComponent } from './components/financial-insurance-plan-deactivate/financial-insurance-plan-deactivate.component';
import { PaymentAddressDetailsComponent } from './components/payment-address-details/payment-address-details.component';
import { PaymentAddressDeactivateComponent } from './components/payment-address-deactivate/payment-address-deactivate.component';
import { PaymentAddressDeleteComponent } from './components/payment-address-delete/payment-address-delete.component';
import { VendorContactComponent } from './components/vendor-contact/vendor-contact.component';
import { ProductivityToolsFeatureEventLogModule } from '@cms/productivity-tools/feature-event-log';
import { VendorSpecialHandlingComponent } from './components/vendor-special-handling/vendor-special-handling.component';
import { FinancialPaymentBatchSubListComponent } from './components/financial-payment-sub-list/financial-payment-sub-list.component';
import { FinancialInsurancePlanListComponent } from './components/financial-insurance-plan-list/financial-insurance-plan-list.component';
import { ContactAddressDetailsComponent } from './components/contact-address-details/contact-address-details.component';
import { ContactAddressListComponent } from './components/contact-address-list/contact-address-list.component';
import { CaseManagementFeatureCommunicationModule } from '@cms/case-management/feature-communication';
import { FinancialSendLetterComponent } from './components/financial-send-letter/financial-send-letter.component';
import { FinancialSendEmailComponent } from './components/financial-send-email/financial-send-email.component';
import { ProductivityToolsFeatureNotificationModule } from '@cms/productivity-tools/feature-notification';
import { FinancialClinicProviderListComponent } from './components/financial-clinic-provider-list/financial-clinic-provider-list.component';
import { FinancialClinicProviderRemoveComponent } from './components/financial-clinic-provider-remove/financial-clinic-provider-remove.component';
import { FinancialClinicProviderDetailsComponent } from './components/financial-clinic-provider-details/financial-clinic-provider-details.component';
import { InvoiceServiceComponent } from './components/invoice-service/invoice-service.component';
import { CaseManagementFeatureFinancialClaimsModule } from '@cms/case-management/feature-financial-claims';
import { ProductivityToolsFeatureFabsMenuModule } from '@cms/productivity-tools/feature-fabs-menu';
@NgModule({
  imports: [
    CaseManagementDomainModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CommonModule,
    CaseManagementFeatureFinancialVendorRoutingModule,
    ProductivityToolsFeatureTodoModule,
    ProductivityToolsFeatureEventLogModule,
    CaseManagementFeatureCommunicationModule,
    ProductivityToolsFeatureNotificationModule,
    CaseManagementFeatureFinancialClaimsModule,
    ProductivityToolsFeatureFabsMenuModule
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
    VendorInfoComponent,
    VendorHeaderToolsComponent,
    PaymentAddressesComponent,
    FinancialDrugsComponent,
    FinancialPaymentComponent,
    FinancialInsuranceProviderListComponent,
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
    FinancialDrugsDeactivateComponent,
    FinancialDrugsReassignComponent,
    FinancialInsuranceProviderComponent,
    FinancialInsurancePlanDetailsComponent,
    FinancialInsurancePlanDeleteComponent,
    FinancialInsurancePlanDeactivateComponent,
    PaymentAddressDetailsComponent,
    PaymentAddressDeactivateComponent,
    PaymentAddressDeleteComponent,
    ContactAddressDetailsComponent,
    ContactAddressListComponent,
    VendorSpecialHandlingComponent,
    FinancialPaymentBatchSubListComponent,
    FinancialInsurancePlanListComponent,
    VendorContactComponent,
    FinancialSendLetterComponent,
    FinancialSendEmailComponent,
    FinancialClinicProviderListComponent,
    FinancialClinicProviderRemoveComponent,
    FinancialClinicProviderDetailsComponent,
    InvoiceServiceComponent,
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
    VendorInfoComponent,
    VendorHeaderToolsComponent,
    PaymentAddressesComponent,
    FinancialDrugsComponent,
    FinancialPaymentComponent,
    FinancialInsuranceProviderListComponent,
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
    FinancialDrugsDeactivateComponent,
    FinancialDrugsReassignComponent,
    FinancialInsuranceProviderComponent,
    FinancialInsurancePlanDetailsComponent,
    FinancialInsurancePlanDeleteComponent,
    FinancialInsurancePlanDeactivateComponent,
    PaymentAddressDetailsComponent,
    PaymentAddressDeactivateComponent,
    PaymentAddressDeleteComponent,
    ContactAddressDetailsComponent,
    ContactAddressListComponent,
    VendorSpecialHandlingComponent,
    FinancialPaymentBatchSubListComponent,
    FinancialInsurancePlanListComponent,
    FinancialSendLetterComponent,
    FinancialSendEmailComponent,
  ],
})
export class CaseManagementFeatureFinancialVendorModule {}
