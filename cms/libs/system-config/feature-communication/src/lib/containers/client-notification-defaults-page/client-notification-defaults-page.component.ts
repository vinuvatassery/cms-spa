import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TemplateManagementFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-client-notification-defaults-page',
  templateUrl: './client-notification-defaults-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientNotificationDefaultsPageComponent {

  state!: State;
  sortType = this.templateManagementFacade.sortType;
  pageSizes = this.templateManagementFacade.gridPageSizes;
  gridSkipCount = this.templateManagementFacade.skipCount;
  sortValueClientNotification = this.templateManagementFacade.sortValueClientNotification;
  sortClientNotificationGrid = this.templateManagementFacade.sortClientNotificationGrid;
  clientNotificationService$ = this.templateManagementFacade.clientNotificationDefaultsLists$; 
  /** Constructor **/
  constructor(private readonly templateManagementFacade: TemplateManagementFacade) { }
  loadClientNotificationLists(gridDataRefinerValue: any): void {
    const gridDataRefiner = {
      skipcount: gridDataRefinerValue.skipCount,
      sort: gridDataRefinerValue.sortColumn,
      sortType: gridDataRefinerValue.sortType,
      filter: gridDataRefinerValue.filter
    };
    this.templateManagementFacade.loadClientNotificationDefaultsLists(
      gridDataRefiner.skipcount,
      gridDataRefiner.sort,
      gridDataRefiner.sortType,
      gridDataRefiner.filter
    );
  }
}
