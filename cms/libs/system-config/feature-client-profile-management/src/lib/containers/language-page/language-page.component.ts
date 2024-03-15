import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-language-page',
  templateUrl: './language-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguagePageComponent {
  state!: State;
  sortType = this.userManagementFacade.sortType;
  pageSizes = this.userManagementFacade.gridPageSizes;
  gridSkipCount = this.userManagementFacade.skipCount;
  sortValueLanguageListGrid = this.userManagementFacade.sortValueLanguageListGrid;
  sortLanguageListGrid = this.userManagementFacade.sortLanguageListGrid;
  languages$ = this.userManagementFacade.clientProfileLanguages$; 
  /** Constructor **/
  constructor(private readonly userManagementFacade: UserManagementFacade) { }


 
  loadClientProfileLanguages(data: any){
    this.userManagementFacade.loadClientProfileLanguages();
  }
}
