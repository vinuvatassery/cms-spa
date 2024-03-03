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
import { DirectMessageListComponent } from './components/direct-message-list/direct-message-list.component';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { DirectMessageFabComponent } from './containers/direct-message-fab/direct-message-fab.component';

@NgModule({
  imports: [
    CommonModule,
    ProductivityToolsDomainModule,
    ProductivityToolsFeatureDirectMessageRoutingModule,
    SharedUiTpaModule,
    SharedUiCommonModule
  ],
  declarations: [
    DirectMessagePageComponent,
    DirectMessageComponent,
    DirectMessageListComponent,
    DirectMessageFabComponent
  ],
  exports: [
    DirectMessagePageComponent,
    DirectMessageComponent,
    DirectMessageListComponent,
    DirectMessageFabComponent
  ],
})
export class ProductivityToolsFeatureDirectMessageModule {}
