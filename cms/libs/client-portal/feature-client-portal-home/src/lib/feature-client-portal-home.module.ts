import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CpNavigationComponent } from './components/cp-navigation/cp-navigation.component';
import { CpHomeScreenComponent } from './components/cp-home-screen/cp-home-screen.component';

const routes: Routes = [
  {
    path: 'account',
    loadChildren: () =>
      import('@cms/client-portal/feature-user-login-signup').then(
        (m) => m.FeatureUserLoginSignupModule
      ),
  },
  { path: '', redirectTo: 'account', pathMatch: 'full' },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [CpNavigationComponent, CpHomeScreenComponent],
  exports: [CpNavigationComponent, CpHomeScreenComponent],
})
export class FeatureClientPortalHomeModule {}
