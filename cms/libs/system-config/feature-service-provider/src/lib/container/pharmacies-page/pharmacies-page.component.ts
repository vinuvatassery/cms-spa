import { ChangeDetectionStrategy, Component } from '@angular/core';
import { State } from '@progress/kendo-data-query';
import { PharmaciesFacade } from '@cms/system-config/domain';

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

  /** Constructor **/
  constructor(private readonly pharmaciesFacade: PharmaciesFacade) { }

  loadPharmaciesLists(data: any){
    this.pharmaciesFacade.loadPharmaciesLists(data);
  }
}
