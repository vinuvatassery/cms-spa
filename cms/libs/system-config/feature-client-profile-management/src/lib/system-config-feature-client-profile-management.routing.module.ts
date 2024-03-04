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
    path: 'direct-messages',
    component: DirectMessagePageComponent,
  },
  {
    path: 'language',
    component: LanguagePageComponent,
  },
  {
    path: 'racial-or-ethnic-identity',
    component: RacialOrEthnicIdentityPageComponent,
  },
  {
    path: 'gender',
    component: GenderPageComponent,
  },
  {
    path: 'pronouns',
    component: PronounsPageComponent,
  },
  {
    path: '',
    component: PronounsPageComponent,
  },
  {
    path: 'sexual-orientation',
    component: SexualOrientationPageComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigFeatureClientProfileManagementRoutingModule {}
