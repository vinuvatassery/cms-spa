import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DrugCategoryCode } from '@cms/case-management/domain';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FilterService } from '@progress/kendo-angular-grid';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'cms-financial-drugs',
  templateUrl: './financial-drugs.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialDrugsComponent {
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
  dialogTitle = "Add";
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  filters:any=[];
  filteredBy = "";
  isFiltered = false;
  sortColumn: any;
  sortDir = "";
  columnsReordered = false;
  searchValue = "";
  yesOrNoLovs:any=[];
  yesOrNoLov$ = this.lovFacade.yesOrNoLov$;
  hivValue = null;
  hepaValue = null;
  oppoValue = null;

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

  gridColumns: { [key: string]: string } = {
    ndcNbr: 'NDC',
    brandName: 'Brand Name',
    drugName: 'Drug Name',
    deliveryMethodCode: 'Delivery Method',
    hiv: 'HIV Drugs?',
    hepatitis: 'Hep Drugs?',
    opportunisticInfection: 'OI Drugs?'
  };

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
    this.state = {
      skip: this.gridSkipCount,
      take: this.state?.take ?? this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadDrugsListGrid();
  }

  pageSelectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadDrugsListGrid();
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.setGridState(stateData);
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
        filters:this.filters
      };
     this.loadDrugListEvent.emit(gridDataRefinerValue);
  }


  public columnChange(e: any) {
    this.ref.detectChanges();
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    debugger;
    this.filterData = filter;
  }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  dropdownFilterChange(field:string, value: any, filterService: FilterService): void {
    debugger;
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

  private loadYesOrNoLovs() {
    this.yesOrNoLov$
    .subscribe({
      next: (data: any) => {
        this.yesOrNoLovs=data;
      }
    });
  }

  public setGridState(stateData: any): void {
    debugger;
    this.state = stateData;

    const filters = stateData.filter?.filters ?? [];

    // for (let val of filters) {
    //   if (val.field === 'effectiveDate') {
    //     this.intl.formatDate(val.value, this.dateFormat);
    //   }
    // }
    const filterList = this.state?.filter?.filters ?? [];
    this.filters = JSON.stringify(filterList);
    this.filteredBy = filterList.toString();

    if (filters.length > 0) {
      const filterListData = filters.map((filter:any) => this.gridColumns[filter?.filters[0]?.field]);
      this.isFiltered = true;
      this.filteredBy = filterListData.toString();
      this.ref.detectChanges();
    }
    else {
      this.isFiltered = false;
    }

    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? "";
    this.sortType = stateData.sort[0]?.dir ?? "";
    this.state = stateData;
    this.sortColumn = this.gridColumns[stateData.sort[0]?.field];
    this.sortDir = "";
    if(this.sort[0]?.dir === 'asc'){
      this.sortDir = 'Ascending';
    }
    if(this.sort[0]?.dir === 'desc'){
      this.sortDir = 'Descending';
    }
  }
}
