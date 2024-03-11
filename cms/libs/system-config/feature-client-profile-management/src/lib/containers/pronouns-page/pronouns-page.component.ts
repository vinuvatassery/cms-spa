import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-pronouns-page',
  templateUrl: './pronouns-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PronounsPageComponent {

  state!: State;
  sortType = this.userManagementFacade.sortType;
  pageSizes = this.userManagementFacade.gridPageSizes;
  gridSkipCount = this.userManagementFacade.skipCount;
  sortValuePronounsListGrid = this.userManagementFacade.sortValuePronounsListGrid;
  sortPronounsListGrid = this.userManagementFacade.sortPronounsListGrid;
  pronouns$ = this.userManagementFacade.clientProfilePronouns$; 
  /** Constructor **/
  constructor(private readonly userManagementFacade: UserManagementFacade) { }


 
  loadPronounsList(data: any){
    this.userManagementFacade.loadPronounsList();
  }
}
