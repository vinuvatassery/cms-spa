import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemInterfaceSupportFacade } from '@cms/system-interface/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-interface-support-page',
  templateUrl: './interface-support-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterfaceSupportPageComponent {
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


  distributionLists$ = this.systemInterfaceSupportFacade.distributionLists$;
  notificationCategoryLists$ = this.systemInterfaceSupportFacade.notificationCategoryLists$;

  supportGroup$ = this.systemInterfaceSupportFacade.supportGroup$;
  addSupportGroup$ = this.systemInterfaceSupportFacade.addSupportGroup$;
  editSupportGroup$ = this.systemInterfaceSupportFacade.editSupportGroup$;
  supportGroupReactivate$ = this.systemInterfaceSupportFacade.supportGroupReactivate$;
  supportGroupRemove$ = this.systemInterfaceSupportFacade.supportGroupRemove$;
  supportGroupProfilePhoto$ = this.systemInterfaceSupportFacade.supportGroupProfilePhoto$;
  supportGroupListsLoader$ = this.systemInterfaceSupportFacade.supportGroupListDataLoader$;

  notificationCategories$ = this.systemInterfaceSupportFacade.notificationCategories$;
  addnotificationCategory$ = this.systemInterfaceSupportFacade.addnotificationCategory$;
  editnotificationCategory$ = this.systemInterfaceSupportFacade.editnotificationCategory$;
  notificationCategoryReactivate$ = this.systemInterfaceSupportFacade.notificationCategoryReactivate$;
  notificationCategoryRemove$ = this.systemInterfaceSupportFacade.notificationCategoryRemove$;
  notificationCategoryListDataLoader$ = this.systemInterfaceSupportFacade.notificationCategoryListDataLoader$
  eventLov$ = this.systemInterfaceSupportFacade.eventLov$;

  constructor(
    private readonly systemInterfaceSupportFacade: SystemInterfaceSupportFacade,
  ) { }

  selectedGroupChangeEvent(data: any) {
    this.selectedGroup = data;
    this.systemInterfaceSupportFacade.loadEventLov();
  }

  loadDistributionLists(event: any) {
    this.systemInterfaceSupportFacade.loadDistributionGroup(event);
  }
  loadSupportGroup(event: any) {
    this.systemInterfaceSupportFacade.loadSupportGroup(event);
  }
  handleAddSuppportGroup(event: any) {
    this.systemInterfaceSupportFacade.addSupportGroup(event);
  }
  handleEditSupportGroup(event: any) {
    this.systemInterfaceSupportFacade.editSupportGroup(event);
  }

  handleDeactivateSupportGroup(event: any) {
    this.systemInterfaceSupportFacade.changeSupportGroupStatus(event, false);
  }

  handleReactivateSupportGroup(event: any) {
    this.systemInterfaceSupportFacade.changeSupportGroupStatus(event, true);
  }

  handleDeleteSupportGroup(event: any) {
    this.systemInterfaceSupportFacade.deleteSupportGroup(event, false);
  }

  // Notification Category 

  loadNotificationCategory(event: any) {
    this.systemInterfaceSupportFacade.loadNotificationCategory(event);
  }
  handleAddNotificationCategory(event: any) {
    this.systemInterfaceSupportFacade.addNotificationCategory(event);
  }
  handleEditNotificationCategory(event: any) {
    this.systemInterfaceSupportFacade.editNotificationCategory(event);
  }

  handleDeactivateNotificationCategory(event: any) {
    this.systemInterfaceSupportFacade.changeNotificationCategoryStatus(event, false);
  }

  handleReactivateNotificationCategory(event: any) {
    this.systemInterfaceSupportFacade.changeNotificationCategoryStatus(event, true);
  }

  handleDeleteNotificationCategory(event: any) {
    this.systemInterfaceSupportFacade.deleteNotificationCategory(event, false);
  }

  
  }
