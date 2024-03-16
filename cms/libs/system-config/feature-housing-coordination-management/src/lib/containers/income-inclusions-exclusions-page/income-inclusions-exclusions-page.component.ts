import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigHousingCoordinationFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-income-inclusions-exclusions-page',
  templateUrl: './income-inclusions-exclusions-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeInclusionsExclusionsPageComponent {
  state!: State;
  sortType = this.systemConfigHousingCoordinationFacade.sortType;
  pageSizes = this.systemConfigHousingCoordinationFacade.gridPageSizes;
  gridSkipCount = this.systemConfigHousingCoordinationFacade.skipCount;
  sortValueIncomeInclusionsListGrid = this.systemConfigHousingCoordinationFacade.sortValueIncomeInclusionsListGrid;
  sortIncomeInclusionsListGrid = this.systemConfigHousingCoordinationFacade.sortIncomeInclusionsListGrid;
  incomeInclusionsExclusions$ = this.systemConfigHousingCoordinationFacade.incomeInclusionsExclusions$; 
  /** Constructor **/
  constructor(private readonly systemConfigHousingCoordinationFacade: SystemConfigHousingCoordinationFacade) { }


 
  loadIncomeInclusionsExlusionsList(data: any){
    this.systemConfigHousingCoordinationFacade.loadIncomeInclusionsExlusionsList();
  }

}
