import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductivityToolsDomainModule } from '@cms/productivity-tools/domain';

import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { CommonActionsComponent } from './containers/common-actions/common-actions.component';
import { ProductivityToolsFeatureFabsMenuRoutingModule } from './productivity-tools-feature-fabs-menu-routing.module';



@NgModule({
  imports: [
    CommonModule,
    ProductivityToolsDomainModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    ProductivityToolsFeatureFabsMenuRoutingModule    
  ],
  declarations: [
    CommonActionsComponent
    
  ],
  exports: [
    CommonActionsComponent
    
  ],
})
export class ProductivityToolsFeatureFabsMenuModule {}
