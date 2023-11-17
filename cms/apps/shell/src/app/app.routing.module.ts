import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@cms/shared/auth/feature-authentication';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('dashboard/Module').then((m) => m.RemoteEntryModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'case-management',
    loadChildren: () =>
      import('case-management/Module').then((m) => m.RemoteEntryModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'financial-management',
    loadChildren: () =>
      import('financial-management/Module').then((m) => m.RemoteEntryModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'productivity-tools',
    loadChildren: () =>
      import('productivity-tools/Module').then((m) => m.RemoteEntryModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'system-config',
    loadChildren: () =>
      import('system-config/Module').then((m) => m.RemoteEntryModule),
    canLoad: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
