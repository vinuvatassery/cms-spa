import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoLoginAllRoutesGuard } from '@cms/shared/util-oidc';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('@cms/dashboard/feature-dashboard').then(
        (m) => m.DashboardFeatureDashboardModule
      ),
    canLoad: [AutoLoginAllRoutesGuard],
  },
  {
    path: 'case-management',
    loadChildren: () =>
      import('@cms/case-management/feature-home').then(
        (m) => m.CaseManagementFeatureHomeModule
      ),
      data: {
        title: 'Clients',
      },
    canLoad: [AutoLoginAllRoutesGuard],
  },
  {
    path: 'financial-management',
    loadChildren: () =>
      import('@cms/case-management/feature-financial-management').then(
        (m) => m.CaseManagementFeatureFinancialManagementModule
      ),
      data: {
        title: 'Financial Management',
      },
    canLoad: [AutoLoginAllRoutesGuard],
  },
  {
    path: 'productivity-tools',
    loadChildren: () =>
      import('@cms/feature-productivity-tools').then(
        (m) => m.CaseManagementFeatureProductivityToolsModule
      ),
 
    canLoad: [AutoLoginAllRoutesGuard],
  },
  {
    path: 'productivity-tools',
    loadChildren: () =>
      import('@cms/productivity-tools/feature-home').then(
        (m) => m.ProductivityToolsFeatureHomeModule
      ),
    canLoad: [AutoLoginAllRoutesGuard],
  },
  {
    path: 'system-config',
    loadChildren: () =>
      import('@cms/system-config/feature-home').then(
        (m) => m.SystemConfigFeatureHomeModule
      ),
      data: {
        title: 'System Configuration',
      },
    canLoad: [AutoLoginAllRoutesGuard],
  },
  {
    path: 'system-interface',
    loadChildren: () =>
      import('@cms/system-interface/feature-system-interface-home').then(
        (m) => m.FeatureSystemInterfaceHomeModule
      ),
    canLoad: [AutoLoginAllRoutesGuard],
  },
  {
    outlet: 'search',
    path: '',
    loadChildren: () =>
      import('@cms/case-management/feature-search').then(
        (m) => m.CaseManagementFeatureSearchModule
      ),
    canLoad: [AutoLoginAllRoutesGuard],
  },
  {
    outlet: 'notifications',
    path: '',
    loadChildren: () =>
      import('@cms/productivity-tools/feature-notification-snackbar').then(
        (m) => m.ProductivityToolsFeatureNotificationSnackbarModule
      ),
    canLoad: [AutoLoginAllRoutesGuard],
  },
  {   
   
    path: 'forbidden' , component : ForbiddenComponent 
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      //initialNavigation: 'enabledBlocking',
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
