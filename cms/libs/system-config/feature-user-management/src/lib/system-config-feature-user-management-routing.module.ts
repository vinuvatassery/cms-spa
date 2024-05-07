/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementPageComponent } from './containers/user-management-page/user-management-page.component';
import { RolesAndPermissionsPageComponent } from './containers/roles-and-permissions-page/roles-and-permissions-page.component';
import { CaseManagerPageComponent } from './containers/case-manager-page/case-manager-page.component';
import { RolesAndPermissionsDetailsPageComponent } from './containers/roles-and-permissions-details-page/roles-and-permissions-details-page.component';

const routes: Routes = [
  {
    path: 'users',
    component: UserManagementPageComponent,
    data: {
      title: 'Users',
    },
  },
  {
    path: 'roles-and-permissions',
    component: RolesAndPermissionsPageComponent,
    data: {
      title: 'Roles & Permissions',
    },
  },

  {
    path: 'case-managers',
    component: CaseManagerPageComponent,
    data: {
      title: 'Case Manager',
    },
  },

  {
    path: 'roles-and-permissions/detail',
    component: RolesAndPermissionsDetailsPageComponent,
    data: {
      title: 'Roles & Permissions From',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigFeatureUserManagementRoutingModule {}
