import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedUtilOidcModule } from '@cms/shared/util-oidc';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilOidcModule,
    RouterModule.forChild([
      /* {path: '', pathMatch: 'full', component: InsertYourComponentHere} */
    ]),
  ],
})
export class SharedAuthFeatureAuthenticationModule {}
