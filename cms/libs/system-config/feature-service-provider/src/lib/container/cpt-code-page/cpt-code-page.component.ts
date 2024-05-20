import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentFacade } from '@cms/shared/util-core';
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
  editCptCode$ = this.cptCodeFacade.editCptCode$;
  cptCodeChangeStatus$ = this.cptCodeFacade.cptCodeChangeStatus$;
  exportButtonShow$ = this.documentFacade.exportButtonShow$;

  /** Constructor **/
  constructor(private readonly cptCodeFacade: CptCodeFacade,
    private readonly documentFacade: DocumentFacade
  ) { }


 
  loadCptCodeLists(data: any){
    this.cptCodeFacade.loadCptCodeLists(data);
  }

  handleAddCptCode(event: any) {
    this.cptCodeFacade.addCptCode(event);
  }

  handleEditCptCode(event: any) {
    this.cptCodeFacade.editCptCode(event);
  }

  handleDeactivateCptCode(event: any) {
    this.cptCodeFacade.changeCptCodeStatus(event, false);
  }
  handleReactivateCptCode(event: any) {
    this.cptCodeFacade.changeCptCodeStatus(event, true);
  }
  onExportAllCPTCode(event: any){
    this.cptCodeFacade.onExportAllUser(event);
  }

}
