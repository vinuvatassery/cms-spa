import { ChangeDetectionStrategy, Component } from '@angular/core';
import { State } from '@progress/kendo-data-query';
import { PharmaciesFacade } from '@cms/system-config/domain';
import { DocumentFacade } from '@cms/shared/util-core';

@Component({
  selector: 'system-config-pharmacies-page',
  templateUrl: './pharmacies-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmaciesPageComponent {

  state!: State;
  sortType = this.pharmaciesFacade.sortType;
  pageSizes = this.pharmaciesFacade.gridPageSizes;
  gridSkipCount = this.pharmaciesFacade.skipCount;
  sortValuePharmacies = this.pharmaciesFacade.sortValuePharmacies;
  sortPharmaciesGrid = this.pharmaciesFacade.sortPharmaciesGrid;

  pharmaciesDataLists$ = this.pharmaciesFacade.loadPharmaciesListsService$; 
  pharmaciesProfilePhoto$ = this.pharmaciesFacade.pharmaciesProfilePhoto$;
  pharmaciesListDataLoader$ = this.pharmaciesFacade.pharmaciesListDataLoader$;
  exportButtonShow$ = this.documentFacade.exportButtonShow$;
  /** Constructor **/
  constructor(private readonly pharmaciesFacade: PharmaciesFacade, private readonly documentFacade: DocumentFacade) { }

  loadPharmaciesLists(data: any){
    this.pharmaciesFacade.loadPharmaciesLists(data);
  }
  onExportAllCPTCode(event: any){
    this.pharmaciesFacade.onExportAllUser(event);
  }


}
