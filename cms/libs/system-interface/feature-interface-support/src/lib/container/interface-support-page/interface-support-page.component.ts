import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemInterfaceSupportFacade } from '@cms/system-interface/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-interface-support-page',
  templateUrl: './interface-support-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterfaceSupportPageComponent {
  selectedGroupChangeEvent(data: any) {
    this.selectedGroup = data;
  }
  selectedGroup: any;
  state!: State;
  sortType = this.systemInterfaceSupportFacade.sortType;
  pageSizes = this.systemInterfaceSupportFacade.gridPageSizes;
  gridSkipCount = this.systemInterfaceSupportFacade.skipCount;

  sortValueSupportGroup = this.systemInterfaceSupportFacade.sortValueSupportGroup;
  sortSupportGroupList = this.systemInterfaceSupportFacade.sortSupportGroupList;

  sortValueDistribution = this.systemInterfaceSupportFacade.sortValueDistribution;
  sortDistributionList = this.systemInterfaceSupportFacade.sortDistributionList;

  sortValueNotificationCategory = this.systemInterfaceSupportFacade.sortValueNotificationCategory;
  sortNotificationCategoryList = this.systemInterfaceSupportFacade.sortNotificationCategoryList;

  supportGroup$ = this.systemInterfaceSupportFacade.supportGroup$;
  distributionLists$ = this.systemInterfaceSupportFacade.distributionLists$;
  notificationCategoryLists$ = this.systemInterfaceSupportFacade.notificationCategoryLists$;
  supportGroupReactivate$ = this.systemInterfaceSupportFacade.supportGroupReactivate$;
  supportGroupRemove$ = this.systemInterfaceSupportFacade.supportGroupRemove$;

  constructor(
    private readonly systemInterfaceSupportFacade: SystemInterfaceSupportFacade,
  ) { }

  loadSupportGroup(event: any) {
    this.systemInterfaceSupportFacade.loadSupportGroup(event);
  }

  loadDistributionLists(event: any) {
    this.systemInterfaceSupportFacade.loadDistributionGroup(event);
  }

  loadNotificationCategory(event: any) {
    this.systemInterfaceSupportFacade.loadNotificationCategory();
  }

  handleDeactivate(event: any) {
    this.systemInterfaceSupportFacade.changeSupportGroupStatus(event, false);
  }

  handleReactivate(event: any) {
    this.systemInterfaceSupportFacade.changeSupportGroupStatus(event, true);
  }

  handleDeleteSupportGroup(event: any) {
    this.systemInterfaceSupportFacade.deleteSupportGroup(event, false);
  }
}
