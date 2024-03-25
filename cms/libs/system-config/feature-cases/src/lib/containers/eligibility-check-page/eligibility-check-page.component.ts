import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigCasesFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-eligibility-check-page',
  templateUrl: './eligibility-check-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EligibilityCheckPageComponent {  

  state!: State;
  sortType = this.systemConfigCasesFacade.sortType;
  pageSizes = this.systemConfigCasesFacade.gridPageSizes;
  gridSkipCount = this.systemConfigCasesFacade.skipCount;
  sortValueEligibilityChecklist = this.systemConfigCasesFacade.sortValueEligibilityChecklist;
  sortEligibilityChecklistGrid = this.systemConfigCasesFacade.sortEligibilityChecklistGrid;
  eligibilityChecklistService$ = this.systemConfigCasesFacade.loadEligibilityChecklistsListsService$; 
  /** Constructor **/
  constructor(private readonly systemConfigCasesFacade: SystemConfigCasesFacade) { }


 
  loadEligibilityChecklistLists(data: any){
    this.systemConfigCasesFacade.loadEligibilityChecklistsLists();
  }

}

