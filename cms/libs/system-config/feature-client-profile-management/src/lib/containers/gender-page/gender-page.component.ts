import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-gender-page',
  templateUrl: './gender-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenderPageComponent {
  state!: State;
  sortType = this.userManagementFacade.sortType;
  pageSizes = this.userManagementFacade.gridPageSizes;
  gridSkipCount = this.userManagementFacade.skipCount;
  sortValueGenderListGrid = this.userManagementFacade.sortValueGenderListGrid;
  sortGenderListGrid = this.userManagementFacade.sortGenderListGrid;
  gender$ = this.userManagementFacade.clientProfileGender$; 
  /** Constructor **/
  constructor(private readonly userManagementFacade: UserManagementFacade) { }


 
  loadGenderLists(data: any){
    this.userManagementFacade.loadGenderList();
  }
}
