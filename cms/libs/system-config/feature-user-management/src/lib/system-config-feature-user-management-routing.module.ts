/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesAndPermissionsDetailComponent } from './components/roles-and-permissions-detail/roles-and-permissions-detail.component';
import { RolesAndPermissionsListComponent } from './components/roles-and-permissions-list/roles-and-permissions-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserManagementPageComponent } from './containers/user-management-page/user-management-page.component'; 
import { RolesAndPermissionsPageComponent } from './containers/roles-and-permissions-page/roles-and-permissions-page.component';
import { CaseManagerPageComponent } from './containers/case-manager-page/case-manager-page.component';
 
const routes: Routes = [
  {
    path: 'users',
    component: UserManagementPageComponent,
  },
  {
    path: 'roles-and-permissions',
    component: RolesAndPermissionsPageComponent,
  },

  {
    path: 'case-managers',
    component: CaseManagerPageComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigFeatureUserManagementRoutingModule { }
