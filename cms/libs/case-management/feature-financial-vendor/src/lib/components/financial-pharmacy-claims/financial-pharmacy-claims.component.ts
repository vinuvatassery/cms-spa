import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ClaimsFacade } from '@cms/case-management/domain';
import { State } from '@progress/kendo-data-query';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-financial-pharmacy-claims',
  templateUrl: './financial-pharmacy-claims.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPharmacyClaimsComponent {
  SpecialHandlingLength = 100;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isFinancialDrugsDetailShow = false;
  isFinancialDrugsDeactivateShow = false; 
  isFinancialDrugsReassignShow  = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isClaimsGridLoaderShow = false;
  public sortValue = this.claimsFacade.sortValue;
  public sortType = this.claimsFacade.sortType;
  public pageSizes = this.claimsFacade.gridPageSizes;
  public gridSkipCount = this.claimsFacade.skipCount;
  public sort = this.claimsFacade.sort;
  public state!: State;
  claimsGridView$ = this.claimsFacade.claimsData$;

   
   /** Constructor **/
   constructor(private readonly claimsFacade: ClaimsFacade) {}
   
  ngOnInit(): void {
    this.loadClaimsListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }

  // updating the pagination info based on dropdown selection
  pageSelectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
  }
  loadClaimsListGrid() {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.claimsFacade.loadClaimsListGrid();
  }
 


}
