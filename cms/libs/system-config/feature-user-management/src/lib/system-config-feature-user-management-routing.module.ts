/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesAndPermissionsDetailComponent } from './components/roles-and-permissions-detail/roles-and-permissions-detail.component';
import { RolesAndPermissionsListComponent } from './components/roles-and-permissions-list/roles-and-permissions-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserManagementPageComponent } from './containers/user-management-page/user-management-page.component'; 
import { RolesAndPermissionsPageComponent } from './containers/roles-and-permissions-page/roles-and-permissions-page.component';
import { CaseManagerPageComponent } from './containers/case-manager-page/case-manager-page.component';
import { RolesAndPermissionsDetailsPageComponent } from './containers/roles-and-permissions-details-page/roles-and-permissions-details-page.component';

const routes: Routes = [
  {
    path: 'users',
    component: UserManagementPageComponent,
  },
  {
    path: 'roles-and-permissions',
    component: RolesAndPermissionsPageComponent,
    children: [
      
    ]
  },

  {
    path: 'case-managers',
    component: CaseManagerPageComponent,
  },

  {
    path: 'roles-and-permissions/detail',
    component: RolesAndPermissionsDetailsPageComponent,
  },

  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigFeatureUserManagementRoutingModule { }
