import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DrugCategoryCode } from '@cms/case-management/domain';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FilterService, GridComponent } from '@progress/kendo-angular-grid';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'cms-financial-drugs',
  templateUrl: './financial-drugs.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialDrugsComponent {
  @ViewChild(GridComponent) grid!: GridComponent;
  @Input() drugsData$!: Observable<any>;
  @Input() vendorDetails$!: Observable<any>;
  @Input() pageSizes : any;
  @Input() sortValue : any;
  @Input() sortType : any;
  @Input() sort : any;
  @Input() gridSkipCount : any;
  @Output() loadDrugListEvent = new EventEmitter<any>();

  public formUiStyle: UIFormStyle = new UIFormStyle();
  isFinancialDrugsDetailShow = false;
  isFinancialDrugsDeactivateShow = false;
  isFinancialDrugsReassignShow  = false;
  vendorId: any;
  DrugCategoryCode = DrugCategoryCode;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isDrugsGridLoaderShow = false;
  public state!: State;
  dialogTitle = "Add New";
  filters:any=[];
  isFiltered = false;
  yesOrNoLovs:any=[];
  yesOrNoLov$ = this.lovFacade.yesOrNoLov$;
  hivValue = null;
  hepaValue = null;
  oppoValue = null;
  columnName: any = "";

  column: any = {
    ndcNbr: 'NDC',
    brandName: 'Brand Name',
    drugName: 'Drug Name',
    deliveryMethodCode: 'Delivery Method',
    hiv: 'HIV Drugs?',
    hepatitis: 'Hep Drugs?',
    opportunisticInfection: 'OI Drugs?'
  };

  //Column Standards
  columnsReordered = false;

  //sorting
  sortColumn = 'ndcNbr';
  sortColumnDesc = 'NDC';
  sortDir = 'Ascending';

  //filtering
  filteredBy = '';
  filter: any = [
    {
      filters: [],
      logic: 'and',
    },
  ];
  filteredByColumnDesc = '';
  selectedStatus = 'Active';
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  columnChangeDesc = 'Default Columns';

  public emailBillingAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Drug',
      icon: 'edit',
      click: (data: any): void => {
        this.clickOpenAddEditFinancialDrugsDetails("Edit");
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Re-assign Drug',
      icon: 'compare_arrows',
      click: (data: any): void => {
        this.clickOpenReassignFinancialDrugsDetails();
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate Drug',
      icon: 'block',
      click: (data: any): void => {
        this.clickOpenDeactivateFinancialDrugsDetails();
      },
    },
  ];

  ngAfterViewInit() {
    this.grid.filter = {
      logic: 'and',
      filters: [
        {
          filters: [],
          logic: 'and',
        },
      ],
    };
    this.loadDrugsListGrid();
  }

   /** Constructor **/
   constructor(private route: ActivatedRoute,
    private readonly ref: ChangeDetectorRef,
     private readonly lovFacade: LovFacade
   ) {}



  ngOnInit(): void {
    this.lovFacade.getYesOrNoLovs();
    this.loadYesOrNoLovs();
    this.vendorId = this.route.snapshot.queryParams['v_id'];
  }

  ngOnChanges(): void {
    this.initializeGrid(false);
    this.loadDrugsListGrid();
  }

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadDrugsListGrid();
  }

  loadDrugsListGrid() {
    this.loadDrugList (
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }

  clickOpenAddEditFinancialDrugsDetails(title:string) {
    this.dialogTitle = title;
    this.isFinancialDrugsDetailShow = true;
  }

  clickCloseAddEditFinancialDrugsDetails() {
    this.isFinancialDrugsDetailShow = false;
  }

  clickOpenDeactivateFinancialDrugsDetails() {
    this.isFinancialDrugsDeactivateShow = true;
  }
  clickCloseDeactivateFinancialDrugs() {
    this.isFinancialDrugsDeactivateShow = false;
  }
  clickOpenReassignFinancialDrugsDetails() {
    this.isFinancialDrugsReassignShow = true;
  }
  clickCloseReassignFinancialDrugs(){
    this.isFinancialDrugsReassignShow = false;
  }

  loadDrugList (
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string)
    {
      const gridDataRefinerValue = {
        skipCount: skipCountValue,
        pageSize: maxResultCountValue,
        sortColumn: sortValue,
        sortType: sortTypeValue,
        filters: JSON.stringify(this.filter)
      };
     this.loadDrugListEvent.emit(gridDataRefinerValue);
  }

  //Column Options Standard Implementation

  dropdownFilterChange(field:string, value: any, filterService: FilterService): void {
    filterService.filter({
        filters: [{
          field: field,
          operator: "eq",
          value:value.lovCode
      }],
        logic: "or"
    });

    if(field == "hiv"){
      this.hivValue = value;
    }
    if(field == "hepatitis"){
      this.hepaValue = value;
    }
    if(field == "opportunisticInfection"){
      this.oppoValue = value;
    }
  }

  public columnChange(e: any) {
    this.ref.detectChanges();
  }

  private loadYesOrNoLovs() {
    this.yesOrNoLov$
    .subscribe({
      next: (data: any) => {
        this.yesOrNoLovs=data;
      }
    });
  }

  restGrid() {
    this.sortValue = 'ndcNbr';
    this.sortType = 'asc';
    this.sortColumn = 'ndcNbr';
    this.sortDir = 'Ascending';
    this.filter = [];
    this.filteredByColumnDesc = '';
    this.sortColumnDesc = this.column[this.sortValue];
    this.columnChangeDesc = 'Default Columns';
    this.initializeGrid(true);
    this.loadDrugsListGrid();
    this.hivValue = this.hepaValue = this.oppoValue = null;
  }

  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter: { logic: 'and', filters: [] },
    };
  }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sortType === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumnDesc = this.column[this.sortValue];
    this.filter = stateData?.filter?.filters;
    this.setFilterBy(true, '', this.filter);
    if (!this.filteredByColumnDesc.includes('Status')) this.selectedStatus = '';
    this.loadDrugsListGrid();
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

   private initializeGrid(resetState:boolean) {
    if (this.state == undefined || resetState) {
       this.state = {
        skip: 0,
        take: this.pageSizes[0]?.value,
        sort: [{ field: this.sortValue, dir: this.sortType }],
      };
    }
  }

  private setFilterBy(
    isFromGrid: boolean,
    searchValue: any = '',
    filter: any = []
  ) {
    this.filteredByColumnDesc = '';
    if (isFromGrid) {
      if (filter.length > 0) {
        const filteredColumns = this.filter?.map((f: any) => {
          const filteredColumns = f.filters
            ?.filter((fld: any) => fld.value)
            ?.map((fld: any) => this.column[fld.field]);
          return [...new Set(filteredColumns)];
        });

        this.filteredByColumnDesc =
          [...new Set(filteredColumns)]?.sort()?.join(', ') ?? '';
      }
    }
  }
}
