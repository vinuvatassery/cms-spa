import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';  
import { DirectMessagePageComponent } from './containers/direct-message-page/direct-message-page.component';
import { GenderPageComponent } from './containers/gender-page/gender-page.component';
import { LanguagePageComponent } from './containers/language-page/language-page.component';
import { PronounsPageComponent } from './containers/pronouns-page/pronouns-page.component';
import { RacialOrEthnicIdentityPageComponent } from './containers/racial-or-ethnic-identity-page/racial-or-ethnic-identity-page.component';
import { SexualOrientationPageComponent } from './containers/sexual-orientation-page/sexual-orientation-page.component';
  
const routes: Routes = [
  {
    path: '',
    redirectTo: 'pronouns',
    pathMatch: 'full',
  },
  {
    path: 'direct-messages',
    component: DirectMessagePageComponent,
    data: {
      title: 'Direct Messages',
    },
  },
  {
    path: 'languages',
    component: LanguagePageComponent,
    data: {
      title: 'Languages',
    },
  },
  {
    path: 'racial-or-ethnic-identity',
    component: RacialOrEthnicIdentityPageComponent,
    data: {
      title: 'Racial or Ethnic Identity',
    },
  },
  {
    path: 'gender',
    component: GenderPageComponent,
    data: {
      title: 'Gender',
    },
  },
  {
    path: 'pronouns',
    component: PronounsPageComponent,
    data: {
      title: 'Pronouns',
    },
  }, 
  {
    path: 'sexual-orientation',
    component: SexualOrientationPageComponent,
    data: {
      title: 'Sexual Orientation',
    },
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigFeatureClientProfileManagementRoutingModule {}
