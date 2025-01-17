/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules**/
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SystemConfigFeatureUserManagementModule } from '@cms/system-config/feature-user-management';
import { CaseManagementFeatureContactRoutingModule } from './case-management-feature-contact-routing.module';
/** Components **/
import { AddressListComponent } from './components/address-list/address-list.component';
import { AddressDetailComponent } from './components/address-detail/address-detail.component';
import { PhoneListComponent } from './components/phone-list/phone-list.component';
import { PhoneDetailComponent } from './components/phone-detail/phone-detail.component';
import { EmailListComponent } from './components/email-list/email-list.component';
import { EmailDetailComponent } from './components/email-detail/email-detail.component';
import { FriendOrFamilyListComponent } from './components/friend-or-family-list/friend-or-family-list.component';
import { FriendOrFamilyDetailComponent } from './components/friend-or-family-detail/friend-or-family-detail.component';
import { DeactivateAddressConfirmationComponent } from './components/deactivate-address-confirmation/deactivate-address-confirmation.component';
import { ContactPageComponent } from './containers/contact-page/contact-page.component';
import { DeactivatePhoneConfirmationComponent } from './components/deactivate-phone-confirmation/deactivate-phone-confirmation.component';
import { DeactivateEmailConfirmationComponent } from './components/deactivate-email-confirmation/deactivate-email-confirmation.component';
import { DeactivateFriendOrFamilyConfirmationComponent } from './components/deactivate-friend-or-family-confirmation/deactivate-friend-or-family-confirmation.component';
import { DeleteAddressConfirmationComponent } from './components/delete-address-confirmation/delete-address-confirmation.component';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { ProfileContactPageComponent } from './containers/profile-contact-page/profile-contact-page-component';
import { DeleteEmailConfirmationComponent } from './components/delete-email-confirmation/delete-email-confirmation.component';
import { RemovePhoneConfirmationComponent } from './components/remove-phone-confirmation/remove-phone-confirmation.component';
import { DeleteFriendOrFamilyConfirmationComponent } from './components/delete-friend-or-family-confirmation/delete-friend-or-family-confirmation.component';


@NgModule({
  imports: [
    CommonModule,
    CaseManagementDomainModule,
    CaseManagementFeatureContactRoutingModule,
    SharedUiTpaModule,
    SystemConfigFeatureUserManagementModule,
    SharedUiCommonModule,
  ],
  declarations: [
    AddressListComponent,
    AddressDetailComponent,
    PhoneListComponent,
    PhoneDetailComponent,
    EmailListComponent,
    EmailDetailComponent,
    FriendOrFamilyListComponent,
    FriendOrFamilyDetailComponent,
    DeactivateAddressConfirmationComponent,
    ContactPageComponent,
    DeactivatePhoneConfirmationComponent,
    DeactivateEmailConfirmationComponent,
    DeactivateFriendOrFamilyConfirmationComponent,
    DeleteAddressConfirmationComponent,
    ProfileContactPageComponent,
    DeleteEmailConfirmationComponent,
    RemovePhoneConfirmationComponent,
    DeleteFriendOrFamilyConfirmationComponent
  ],
  exports: [
    AddressListComponent,
    AddressDetailComponent,
    PhoneListComponent,
    PhoneDetailComponent,
    EmailListComponent,
    EmailDetailComponent,
    FriendOrFamilyListComponent,
    FriendOrFamilyDetailComponent,
    DeactivateAddressConfirmationComponent,
    DeactivatePhoneConfirmationComponent,
    DeactivateEmailConfirmationComponent,
    DeactivateFriendOrFamilyConfirmationComponent,
    DeleteAddressConfirmationComponent,
    ProfileContactPageComponent,
    DeleteEmailConfirmationComponent,
    RemovePhoneConfirmationComponent,
    DeleteFriendOrFamilyConfirmationComponent
  ],
})
export class CaseManagementFeatureContactModule {}
