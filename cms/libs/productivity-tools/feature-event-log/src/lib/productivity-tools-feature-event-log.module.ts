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

@NgModule({
  imports: [
    CommonModule,
    ProductivityToolsDomainModule,
    SharedUiTpaModule,
    ProductivityToolsFeatureEventLogRoutingModule,
    SharedUiCommonModule
  ],
  declarations: [
    EventLogComponent,
    EventDetailComponent,
    EventAttachmentComponent,
  ],
  exports: [EventLogComponent, EventDetailComponent, EventAttachmentComponent],
})
export class ProductivityToolsFeatureEventLogModule {}
