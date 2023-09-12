import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ClaimsFacade } from '@cms/case-management/domain';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Router } from '@angular/router';
@Component({
  selector: 'cms-financial-pharmacy-claims',
  templateUrl: './financial-pharmacy-claims.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPharmacyClaimsComponent {
  /* Input Properties */
  @Input() vendorId!: string;
  
  /* public properties */
  formUiStyle: UIFormStyle = new UIFormStyle();
  isFinancialDrugsDetailShow = false;
  isFinancialDrugsDeactivateShow = false; 
  isFinancialDrugsReassignShow  = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  sortValue = this.claimsFacade.sortValue;
  sortType = this.claimsFacade.sortType;
  pageSizes = this.claimsFacade.gridPageSizes;
  gridSkipCount = this.claimsFacade.skipCount;
  sort = this.claimsFacade.sort;
  state!: State;
  claimsGridView$ = this.claimsFacade.claimsData$;
  claimsGridViewLoader$ = this.claimsFacade.claimsDataLoader$;
   
   /** Constructor **/
   constructor(private readonly claimsFacade: ClaimsFacade,
    private readonly router: Router,
    ) {}
   
  ngOnInit(): void {
    this.initializePaging();
    this.loadClaimsListGrid();
  }
  ngOnChanges(): void {
    this.initializePaging();
  }

  private initializePaging() {
    const sort: SortDescriptor[] = [{
        field: 'creationTime',
        dir: 'desc'
    }];
    this.state = {
        skip: this.gridSkipCount,
        take: this.pageSizes[0]?.value,
        sort: sort
    };
}

  // updating the pagination info based on dropdown selection
  pageSelectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadClaimsListGrid();
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.state = stateData;
    this.loadClaimsListGrid();
  }
  
  loadClaimsListGrid() {
    this.claimsFacade.loadClaimsListGrid(this.vendorId, this.state);
  }

  onClientNameClicked(clientDetails: any) {
    this.router.navigate([`/case-management/cases/case360/${clientDetails?.clientId}`]);
  }

}
