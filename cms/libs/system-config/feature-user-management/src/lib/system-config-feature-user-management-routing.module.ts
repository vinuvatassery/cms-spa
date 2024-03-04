/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesAndPermissionsDetailComponent } from './components/roles-and-permissions-detail/roles-and-permissions-detail.component';
import { RolesAndPermissionsListComponent } from './components/roles-and-permissions-list/roles-and-permissions-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserManagementPageComponent } from './containers/user-management-page/user-management-page.component'; 
 
const routes: Routes = [
  {
    path: '',
    component: UserManagementPageComponent,
    children: [
      {
        path: 'users',
        component: UserListComponent,
      },
      {
        path: 'roles-and-permissions',
        component: RolesAndPermissionsListComponent,
      },
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'users',
    component: UserManagementPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigFeatureUserManagementRoutingModule { }
