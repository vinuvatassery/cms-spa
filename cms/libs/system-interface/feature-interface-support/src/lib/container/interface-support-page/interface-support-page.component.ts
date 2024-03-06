import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoggingService } from '@cms/shared/util-core';
import { SystemInterfaceSupportFacade } from '@cms/system-interface/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-interface-support-page',
  templateUrl: './interface-support-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterfaceSupportPageComponent {
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
  addSupportGroup$ = this.systemInterfaceSupportFacade.addSupportGroup$;
  editSupportGroup$ = this.systemInterfaceSupportFacade.editSupportGroup$;
  distributionLists$ = this.systemInterfaceSupportFacade.distributionLists$;
  notificationCategoryLists$ = this.systemInterfaceSupportFacade.notificationCategoryLists$;
  supportGroupReactivate$ = this.systemInterfaceSupportFacade.supportGroupReactivate$;
  supportGroupRemove$ =this.systemInterfaceSupportFacade.supportGroupRemove$;

  constructor(
    private readonly systemInterfaceSupportFacade: SystemInterfaceSupportFacade,
  ) {}


  
  loadSupportGroup(event: any) {
    this.systemInterfaceSupportFacade.loadSupportGroup(event);
  }

  loadDistributionLists(event: any) {
    this.systemInterfaceSupportFacade.loadDistributionLists();
  }

  loadNotificationCategory(event: any) {
    this.systemInterfaceSupportFacade.loadNotificationCategory();
  }

  handleAddSuppportGroup(event: any){
    this.systemInterfaceSupportFacade.addSupportGroup(event);
  }
  handleEditSupportGroup(event: any){
      this.systemInterfaceSupportFacade.editSupportGroup(event);
  }

  handleDeactivate(event: any){
    this.systemInterfaceSupportFacade.changeSupportGroupStatus(event, false);
  }
  handleReactivate(event: any){
    this.systemInterfaceSupportFacade.changeSupportGroupStatus(event, true);
  }
  handleDeleteSupportGroup(event: any){
    this.systemInterfaceSupportFacade.deleteSupportGroup(event, false);
  }
}
