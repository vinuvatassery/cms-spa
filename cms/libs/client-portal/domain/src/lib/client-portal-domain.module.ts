import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterModule, Route } from '@angular/router';
import { clientPortalDomainRoutes } from './lib.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(clientPortalDomainRoutes),
    RouterModule,
  ],
})
export class ClientPortalDomainModule {}
