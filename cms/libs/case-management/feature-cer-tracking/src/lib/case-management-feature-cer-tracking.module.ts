/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { SystemConfigFeatureUserManagementModule } from '@cms/system-config/feature-user-management';
import { CaseManagementFeatureCerTrackingRoutingModule } from './case-management-feature-cer-tracking-routing.module';
/** Components  **/
import { CerTrackingPageComponent } from './containers/cer-tracking-page/cer-tracking-page.component';
import { CerListComponent } from './components/cer-list/cer-list.component';
import { SendCerComponent } from './components/send-cer/send-cer.component';
import { SendCerReminderComponent } from './components/send-cer-reminder/send-cer-reminder.component';
import { SendCerRestrictedNoticeComponent } from './components/send-cer-restricted-notice/send-cer-restricted-notice.component';
import { CerCountsComponent } from './components/cer-counts/cer-counts.component';
import { StatusPeriodComponent } from './components/status-period/status-period.component';
import { ProfileCerTrackingPageComponent } from './containers/profile-cer-tracking-page/profile-cer-tracking-page.component';
import { AppHistoryListComponent } from './components/application-history/application-history-list.component';
import { StatusGroupHistoryComponent } from './components/status-group-history/status-group-history.component';
import { StatusFplHistoryComponent } from './components/status-fpl-history/status-fpl-history.component';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementFeatureCerTrackingRoutingModule,
    CaseManagementDomainModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    SystemConfigFeatureUserManagementModule,
  ],
  declarations: [
    CerTrackingPageComponent,
    CerListComponent,
    SendCerComponent,
    SendCerReminderComponent,
    SendCerRestrictedNoticeComponent,
    CerCountsComponent,
    StatusPeriodComponent,
    ProfileCerTrackingPageComponent,
    AppHistoryListComponent,
    StatusGroupHistoryComponent,
    StatusFplHistoryComponent,
  ],
  exports: [
    CerTrackingPageComponent,
    CerListComponent,
    SendCerComponent,
    SendCerReminderComponent,
    SendCerRestrictedNoticeComponent,
    CerCountsComponent,
    StatusPeriodComponent,
    ProfileCerTrackingPageComponent,
    AppHistoryListComponent,
  ],
})
export class CaseManagementFeatureCerTrackingModule {}
