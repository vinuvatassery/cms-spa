 
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigCasesFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-case-assignment-page',
  templateUrl: './case-assignment-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseAssignmentPageComponent {  

  state!: State;
  sortType = this.systemConfigCasesFacade.sortType;
  pageSizes = this.systemConfigCasesFacade.gridPageSizes;
  gridSkipCount = this.systemConfigCasesFacade.skipCount;
  sortValueCaseAssignment = this.systemConfigCasesFacade.sortValueCaseAssignment;
  sortCaseAssignmentGrid = this.systemConfigCasesFacade.sortCaseAssignmentGrid;
  caseAssignmentService$ = this.systemConfigCasesFacade.loadCaseAssignmentService$; 
  /** Constructor **/
  constructor(private readonly systemConfigCasesFacade: SystemConfigCasesFacade) { }


 
  loadCaseAssignmentLists(data: any){
    this.systemConfigCasesFacade.loadCaseAssignmentLists();
  }

}

