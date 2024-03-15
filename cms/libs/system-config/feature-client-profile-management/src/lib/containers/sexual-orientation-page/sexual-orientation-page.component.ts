import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-sexual-orientation-page',
  templateUrl: './sexual-orientation-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SexualOrientationPageComponent {
  state!: State;
  sortType = this.userManagementFacade.sortType;
  pageSizes = this.userManagementFacade.gridPageSizes;
  gridSkipCount = this.userManagementFacade.skipCount;
  sortValueSexualOrientationListGrid = this.userManagementFacade.sortValueSexualOrientationListGrid;
  sortSexualOrientationListGrid = this.userManagementFacade.sortSexualOrientationListGrid;
  sexualOrientation$ = this.userManagementFacade.clientProfileSexualOrientation$; 
  /** Constructor **/
  constructor(private readonly userManagementFacade: UserManagementFacade) { }


 
  loadSexualOrientationList(data: any){
    this.userManagementFacade.loadSexualOrientationList();
  }

}
