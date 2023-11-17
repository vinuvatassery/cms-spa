import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemConfigDomainModule } from '@cms/system-config/domain';
import { UserManagementComponent } from './user-management.component';

@NgModule({
  imports: [CommonModule, SystemConfigDomainModule],
  declarations: [UserManagementComponent],
  exports: [UserManagementComponent],
})
export class SystemConfigFeatureUserManagementModule {}
