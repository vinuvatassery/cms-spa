/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenderListComponent, LanguageListComponent, PronounsListComponent, RacialOrEthnicIdentityListComponent, SexualOrientationListComponent } from '@cms/system-config/feature-client-profile-management';
import { CaseAvailabilityListComponent, EidLifetimePeriodListComponent, SlotListComponent } from 'libs/system-config/feature-housing-coordination-management/src';
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
      {
        path: 'pronouns',
        component: PronounsListComponent,
      },
      {
        path: 'gender',
        component: GenderListComponent,
      },
      {
        path: 'sexual-orientation',
        component: SexualOrientationListComponent,
      },
      {
        path: 'racial-or-ethnic-identity',
        component: RacialOrEthnicIdentityListComponent,
      },
      {
        path: 'languages',
        component: LanguageListComponent,
      },
      {
        path: 'slots',
        component: SlotListComponent,
      },
      {
        path: 'case-availability',
        component: CaseAvailabilityListComponent,
      },
      {
        path: 'eid-period',
        component: EidLifetimePeriodListComponent,
      },
    ],
  },
  {
    path: 'roles-and-permissions-detail',
    component: RolesAndPermissionsDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigFeatureUserManagementRoutingModule { }
