import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router'; 
import { InterfaceSupportPageComponent } from './container/interface-support-page/interface-support-page.component';
import { SupportGroupComponent } from './components/support-group/support-group.component';
import { DistributionListsComponent } from './components/distribution-lists/distribution-lists.component';
import { ErrorCategoryComponent } from './components/error-category/error-category.component';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';

@NgModule({
  imports: [
    CommonModule, 
    SharedUiTpaModule,
    SharedUiCommonModule,
  ],
  declarations: [
    InterfaceSupportPageComponent,
    SupportGroupComponent,
    DistributionListsComponent,
    ErrorCategoryComponent,
  ],
  exports: [
    InterfaceSupportPageComponent,
    SupportGroupComponent,
    DistributionListsComponent,
    ErrorCategoryComponent,
  ],
})
export class FeatureInterfaceSupportModule {}
