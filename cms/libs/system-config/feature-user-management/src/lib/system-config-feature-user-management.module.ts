/** Angular **/
 
import { NgModule } from '@angular/core';
 
import { CommonModule } from '@angular/common';
/** Modules **/
import { SystemConfigDomainModule } from '@cms/system-config/domain';
import { SystemConfigFeatureUserManagementRoutingModule } from './system-config-feature-user-management-routing.module';
/** Components **/
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { DeactivateUserConfirmationComponent } from './components/deactivate-user-confirmation/deactivate-user-confirmation.component';
import { UserManagementPageComponent } from './containers/user-management-page/user-management-page.component';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SystemConfigNavigationComponent } from './components/system-config-navigation/system-config-navigation.component';
import { RolesAndPermissionsListComponent } from './components/roles-and-permissions-list/roles-and-permissions-list.component';
import { RolesAndPermissionsDetailComponent } from './components/roles-and-permissions-detail/roles-and-permissions-detail.component';
import { DeactivateRolesAndPermissionsConfirmationComponent } from './components/deactivate-roles-and-permissions-confirmation/deactivate-roles-and-permissions-confirmation.component';
import { SystemConfigFeatureLovModule } from '@cms/system-config/feature-lov';
 
@NgModule({
  imports: [
    CommonModule,
    SystemConfigDomainModule,
    SystemConfigFeatureUserManagementRoutingModule,
    SharedUiCommonModule,
    SharedUiTpaModule,
    SystemConfigFeatureLovModule,
  ],
  declarations: [
    UserListComponent,
    UserDetailComponent,
    DeactivateUserConfirmationComponent,
    UserManagementPageComponent,
    SystemConfigNavigationComponent,
    RolesAndPermissionsListComponent,
    RolesAndPermissionsDetailComponent,
    DeactivateRolesAndPermissionsConfirmationComponent,
  ],
  exports: [
    UserListComponent,
    UserDetailComponent,
    DeactivateUserConfirmationComponent,
    UserManagementPageComponent,
    SystemConfigNavigationComponent,
    RolesAndPermissionsListComponent,
    RolesAndPermissionsDetailComponent,
    DeactivateRolesAndPermissionsConfirmationComponent,
  ],
})
export class SystemConfigFeatureUserManagementModule { }
