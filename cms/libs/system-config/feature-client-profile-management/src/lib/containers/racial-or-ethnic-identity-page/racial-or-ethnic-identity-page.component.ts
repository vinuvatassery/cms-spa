import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-racial-or-ethnic-identity-page',
  templateUrl: './racial-or-ethnic-identity-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RacialOrEthnicIdentityPageComponent {
  state!: State;
  sortType = this.userManagementFacade.sortType;
  pageSizes = this.userManagementFacade.gridPageSizes;
  gridSkipCount = this.userManagementFacade.skipCount;
  sortValueRacialEthnicListGrid = this.userManagementFacade.sortValueRacialEthnicListGrid;
  sortRacialEthnicListGrid = this.userManagementFacade.sortRacialEthnicListGrid;
  racialOrEthnicIdentity$ = this.userManagementFacade.clientProfileRacialOrEthnicIdentity$; 
  /** Constructor **/
  constructor(private readonly userManagementFacade: UserManagementFacade) { }


 
  loadRacialOrEthnicIdentityList(data: any){
    this.userManagementFacade.loadRacialOrEthnicIdentityList();
  }

}
