/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { ProductivityToolsDomainModule } from '@cms/productivity-tools/domain';
import { ProductivityToolsFeatureDirectMessageRoutingModule } from './productivity-tools-feature-direct-message-routing.module';
/** Components **/
import { DirectMessagePageComponent } from './containers/direct-message-page/direct-message-page.component';
import { DirectMessageComponent } from './components/direct-message/direct-message.component';

@NgModule({
  imports: [
    CommonModule,
    ProductivityToolsDomainModule,
    ProductivityToolsFeatureDirectMessageRoutingModule,
    SharedUiTpaModule,
  ],
  declarations: [DirectMessagePageComponent, DirectMessageComponent],
  exports: [DirectMessagePageComponent, DirectMessageComponent],
})
export class ProductivityToolsFeatureDirectMessageModule {}
