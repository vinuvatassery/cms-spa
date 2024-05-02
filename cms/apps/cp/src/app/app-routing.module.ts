import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'client-portal',
    loadChildren: () =>
      import('@cms/feature-client-portal-home').then(
        (m) => m.FeatureClientPortalHomeModule
      ),
  },
  { path: '', redirectTo: 'client-portal', pathMatch: 'full' },
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
