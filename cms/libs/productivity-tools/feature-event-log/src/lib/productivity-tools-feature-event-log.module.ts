/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { ProductivityToolsDomainModule } from '@cms/productivity-tools/domain';
import { ProductivityToolsFeatureEventLogRoutingModule } from './productivity-tools-feature-event-log-routing.module';
/** Components **/
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { EventAttachmentComponent } from './components/event-attachment/event-attachment.component';
import { EventLogComponent } from './components/event-log/event-log.component';
import { EventLogComponentFabPageComponent } from './containers/event-log-fab-page/event-log-fab-page.component';
import { EventLogDescriptionComponent } from './components/event-log-description/event-log-description.component';

@NgModule({
  imports: [
    CommonModule,
    ProductivityToolsDomainModule,
    SharedUiTpaModule,
    ProductivityToolsFeatureEventLogRoutingModule,
    SharedUiCommonModule,
  ],
  declarations: [
    EventLogComponent,
    EventDetailComponent,
    EventAttachmentComponent,
    EventLogComponentFabPageComponent,
    EventLogDescriptionComponent,
  ],
  exports: [
    EventLogComponent,
    EventDetailComponent,
    EventAttachmentComponent,
    EventLogComponentFabPageComponent,
  ],
})
export class ProductivityToolsFeatureEventLogModule {}
