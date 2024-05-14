import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CptCodeFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-cpt-code-page',
  templateUrl: './cpt-code-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CptCodePageComponent {
  state!: State;
  sortType = this.cptCodeFacade.sortType;
  pageSizes = this.cptCodeFacade.gridPageSizes;
  gridSkipCount = this.cptCodeFacade.skipCount;
  sortValueCptCode = this.cptCodeFacade.sortValueCptCode;
  sortCptCodeGrid = this.cptCodeFacade.sortCptCodeGrid;


  cptCodeDataLists$ = this.cptCodeFacade.loadCptCodeListsService$; 
  addCptCode$ = this.cptCodeFacade.addCptCode$;
  cptCodeProfilePhoto$ = this.cptCodeFacade.cptCodeProfilePhoto$;
  cptCodeListDataLoader$ = this.cptCodeFacade.cptCodeListDataLoader$;

  /** Constructor **/
  constructor(private readonly cptCodeFacade: CptCodeFacade) { }


 
  loadCptCodeLists(data: any){
    this.cptCodeFacade.loadCptCodeLists(data);
  }

  handleAddCptCode(event: any) {
    this.cptCodeFacade.addCptCode(event);
  }

}
