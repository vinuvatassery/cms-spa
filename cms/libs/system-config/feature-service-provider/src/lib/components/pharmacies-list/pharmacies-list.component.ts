 
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core'; 
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import { Subject, Subscription } from 'rxjs';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'system-config-pharmacies-list',
  templateUrl: './pharmacies-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmaciesListComponent implements OnInit, OnChanges{
 
  /** Public properties **/
  isPharmaciesDetailPopup = false; 
  isPharmaciesDeletePopupShow = false;
  isPharmaciesDeactivatePopupShow = false; 
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();

  public moreactions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
     
    }, 
  
    {
      buttonType:"btn-h-primary",
      text: "Deactivate",
      icon: "block",
      click: (data: any): void => {
        this.onPharmaciesDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete", 
      click: (data: any): void => {
        this.onPharmaciesDeleteClicked();
      },
    }, 
 
  ];
    
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() pharmaciesDataLists$: any;
  @Input() pharmaciesProfilePhoto$: any;
  @Input() pharmaciesListDataLoader$: any;
  @Input() pharmaciesFilterColumn$: any;
  @Input() exportButtonShow$: any;
  @Output() loadPharmaciesListsEvent = new EventEmitter<any>();
  @Output() pharmaciesFilterColumnEvent = new EventEmitter<any>();
  @Output() exportGridEvent$ = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'Pharmacy Name';
  sortDir = 'Ascending';
  selectedSearchColumn = 'ALL';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  statusFilter: any;
  gridDataResult!: GridDataResult;
  isPharmaciesListGridLoaderShow = false;
  paymentMethodLov$ = this.lovFacade.paymentMethodType$;
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  paymentMethodLovSubscription!: Subscription;
  paymentMethodLovList: any;
  paymentMethodFilter = '';
  showExportLoader = false;
  /** Internal event methods **/
  columns: any = {
    ALL: 'All Columns',
    vendorName: "Pharmacy Name",
    tin: "Tin",
    npiNbr: "Npi Number",
    accountingNbr: "Account Number",
    paymentMethodCode: "Payment Method",
    lastModificationTime: "Last Modified",
    activeFlag: "Status",
  };
 dropDowncolumns: any = [
    { columnCode: 'ALL', columnDesc: 'All Columns' },
    { columnCode: 'vendorName', columnDesc: 'Pharmacy Name' }
  ];
  /** Constructor **/
  constructor(private lovFacade: LovFacade, private readonly cdr: ChangeDetectorRef) {}
  
  ngOnInit(): void {
    this.loadPharmaciesList(); 
    this.loadPaymentMethodLov();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadPharmaciesList();
  }
  
  private loadPaymentMethodLov(){
    this.lovFacade.getPaymentMethodLov();
    this.paymentMethodLovSubscription = this.paymentMethodLov$.subscribe({
      next:(response) => {
        response.sort((value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr);
        this.paymentMethodLovList = response;
      }
    });
  }


  private loadPharmaciesList(): void {
    this.loadPharmaciesLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadPharmaciesLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isPharmaciesListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      maxResultCount: maxResultCountValue,
      sorting: sortValue,
      sortType: sortTypeValue,
      filter: this.filter !== null && this.filter !== '' ? JSON.stringify(this.filter) : null
    };
    this.loadPharmaciesListsEvent.emit(gridDataRefinerValue);
  }
  loadPharmaciesFilterColumn(){
    this.pharmaciesFilterColumnEvent.emit();
  
  }
  onChange(data: any) {
    this.defaultGridState();
    let operator = 'contains';
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'vendorName',
              operator: operator,
              value: data,
            },
          ],
          logic: 'and',
        },
      ],
    };
    const stateData = this.state;
    stateData.filter = this.filterData;
    this.dataStateChange(stateData);
  }
  
  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter: { logic: 'and', filters: [] },
    };
  }
  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {

    if (field === 'paymentMethodCode') {
      this.paymentMethodFilter = value;
    } else if (field === 'activeFlag') {
      this.statusFilter = value;
    }

    filterService.filter({
      filters: [
        {
          field: field,
          operator: 'eq',
          value: value,
        },
      ],
      logic: 'or',
    });
  }
  searchColumnChangeHandler(value: string) {
    this.selectedSearchColumn = value;
    this.filter = [];
    if (this.searchValue) {
      this.onSearch(this.searchValue);
    }
  }

    onSearch(searchValue: any) {
    this.onChange(searchValue);
  }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }
  
  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumn = this.columns[this.sortValue];
    this.filter = stateData?.filter?.filters;

    if (stateData.filter?.filters.length > 0) {
      const filterList = [];
      this.isFiltered = true;
      for (const filter of stateData.filter.filters) {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.filteredBy = filterList.toString();
    } else {
      this.isFiltered = false;
    }

    this.loadPharmaciesList();
  }
  
  setToDefault() {
    this.defaultGridState();
    this.sortColumn = 'Pharmacy Name';
    this.sortType = 'asc';
    this.sortDir = this.sortType === 'asc' ? 'Ascending' : "";
    this.filter = '';
    this.selectedSearchColumn = 'ALL';
    this.isFiltered = false;
    this.sortValue = 'vendorName';
    this.sort = this.sortValue;
    this.searchValue = '';
    this.loadPharmaciesList();
  }
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadPharmaciesList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  onClickedExport() {
    this.showExportLoader = true;
    const params = {
      SortType: this.sortType,
      Sorting: this.sortValue,
      Filter: JSON.stringify(this.state?.filter?.filters ?? []),
    };
    this.exportGridEvent$.emit(params);
    this.exportButtonShow$.subscribe((response: any) => {
      if (response) {
        this.showExportLoader = false
        this.cdr.detectChanges()
      }
    });
  }


  /** Internal event methods **/
  onClosePharmaciesDetailClicked() {
    this.isPharmaciesDetailPopup = false;
  }
  onPharmaciesDetailClicked() {
    this.isPharmaciesDetailPopup = true;
  }

  onClosePharmaciesDeleteClicked() {
    this.isPharmaciesDeletePopupShow = false;
  }
  onPharmaciesDeleteClicked() {
    this.isPharmaciesDeletePopupShow = true;
  }
  onClosePharmaciesDeactivateClicked() {
    this.isPharmaciesDeactivatePopupShow = false;
  }
  onPharmaciesDeactivateClicked() {
    this.isPharmaciesDeactivatePopupShow = true;
  }
}
