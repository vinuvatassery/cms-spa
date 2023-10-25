import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ClaimsFacade, GridFilterParam } from '@cms/case-management/domain';
import { CompositeFilterDescriptor, SortDescriptor, State } from '@progress/kendo-data-query';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Router } from '@angular/router';
import { FilterService } from '@progress/kendo-angular-grid';
import { LovFacade } from '@cms/system-config/domain';
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
  columnsReordered = false;
  filteredBy = '';
  isFiltered = false;
  filter!: any;
  columns : any;  
  selectedPaymentStatus: string | null = null;
  selectedPaymentType: string | null = null;
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  paymentStatus$ = this.lovFacade.paymentStatus$;
  paymentRequestTypes$= this.lovFacade.paymentRequestType$;
  paymentStatus: any = [];
  paymentRequestTypes: any = [];
  sortColumn = 'Entry Date';
  sortDir = 'Ascending';
   
   /** Constructor **/
   constructor(private readonly claimsFacade: ClaimsFacade,
    private readonly router: Router,  private readonly lovFacade: LovFacade,
    ) {}
   
  ngOnInit(): void {
    this.initializePaging();
    this.getPaymentStatusLov();
    this.getCoPaymentRequestTypeLov();  
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
        sort: sort,
        filter : this.filterData,
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
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.filter = stateData?.filter?.filters;
    this.loadClaimsListGrid();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    if (field === 'paymentStatusDesc') this.selectedPaymentStatus = value;
    if (field === 'paymentTypeDesc') this.selectedPaymentType = value;
    filterService.filter({
      filters: [
        {
          field: field,
          operator: 'eq',
          value: value,
        },
      ],
      logic: 'and',
    });
  }
  private getPaymentStatusLov() {
    this.lovFacade.getPaymentStatusLov();
    this.paymentStatus$.subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          item.lovDesc = item.lovDesc.toUpperCase();
        });
        this.paymentStatus = data.sort(
          (value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr
        );
      },
    });
  }

  private getCoPaymentRequestTypeLov() {
    this.lovFacade.getCoPaymentRequestTypeLov();
    this.paymentRequestTypes$.subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          item.lovDesc = item.lovDesc.toUpperCase();
        });
        this.paymentRequestTypes = data.sort(
          (value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr
        );
      },
    });
  }
  loadClaimsListGrid() {
    const param = new GridFilterParam(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      JSON.stringify(this.filter));
    this.claimsFacade.loadClaimsListGrid(this.vendorId, param);
  }
  
  onClientNameClicked(clientDetails: any) {
    this.router.navigate([`/case-management/cases/case360/${clientDetails?.clientId}`]);
  }

}
