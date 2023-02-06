import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoLoginAllRoutesGuard } from '@cms/shared/util-oidc';

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
    canLoad: [AutoLoginAllRoutesGuard],
  },
  {
    path: 'financial-management',
    loadChildren: () =>
      import('@cms/financial-management/feature-home').then(
        (m) => m.FinancialManagementFeatureHomeModule
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
  { path: '', redirectTo: 'case-management', pathMatch: 'full' },
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
