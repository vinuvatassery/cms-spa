import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FinancialVendorTypeCode, GridFilterParam } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';  
import { ConfigurationProvider } from '@cms/shared/util-core';
import { ColumnVisibilityChangeEvent } from '@progress/kendo-angular-grid';
import { IntlService } from '@progress/kendo-angular-intl';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { Subject, debounceTime } from 'rxjs';
 

@Component({
  selector: 'cms-financial-clinic-provider-list',
  templateUrl: './financial-clinic-provider-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClinicProviderListComponent implements OnInit, OnChanges {
  isProvidersDetailShow = false;
  isProvidersRemoveShow = false;
  selectProviderId!: string;
  gridColumns: { [key: string]: string } = {
    ALL: 'All Columns',
    vendorName:"Vendor Name",
    tin:"Tin",
    address:"Address",
    effectiveDate:"Effective Date"
  };

  sortColumn = 'vendorName';
  sortDir = 'Ascending';
  sortColumnDesc = 'Vendor Name';
  columnsReordered = false;
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  searchColumnList: { columnName: string, columnDesc: string }[] = [
    { columnName: 'ALL', columnDesc: 'All Columns' },
    { columnName: 'vendorName', columnDesc: 'Vendor Name' },
    { columnName: 'tin', columnDesc: 'Tin' },
    { columnName: 'address', columnDesc: 'Address' },
    { columnName: 'effectiveDate', columnDesc: 'Effective Date' }
  ];

  filter!: any;
  selectedSearchColumn = 'ALL';
  filteredByColumnDesc = '';
  showDateSearchWarning = false;
  showNumberSearchWarning = false;
  columnChangeDesc = 'Default Columns'
  public state!: State;
  searchText = '';

  
  @Input() providerList$:any
  @Output() loadProviderListEvent = new EventEmitter<any>();
  @Output() removeProviderClick = new EventEmitter<any>();
  @Input() ParentVendorId :any
  public processGridActions = [
    {
      buttonType: 'btn-h-danger',
      text: 'Remove',
      icon: 'delete',
      click: (data: any): void => {
    },
  }
  ];



  private searchSubject = new Subject<string>();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;

  constructor(
    private readonly intl: IntlService,
    private readonly configProvider: ConfigurationProvider
  ) { }

  
  ngOnInit(): void {
    this.initializeProviderPage();
  }
  
  ngOnChanges(): void {
    this.initializeProviderGrid();
    this.loadProviderListGrid();
  }

  private initializeProviderGrid() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: [{ field: 'vendorName', dir: 'asc' }]
    };
  }

  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter: { logic: 'and', filters: [] },
    };
  }

  searchColumnChangeHandler(value: string) {
    this.filter = [];value
    this.showNumberSearchWarning = (['tin']).includes(value);
    this.showDateSearchWarning = value === 'closeDate';
    if (this.searchText) {
      this.onProviderListSearch(this.searchText);
    }
  }

  onProviderListSearch(searchValue: any) {
    const isDateSearch = searchValue.includes('/');
    this.showDateSearchWarning = isDateSearch || this.selectedSearchColumn === 'closeDate';
    searchValue = this.formatSearchValue(searchValue, isDateSearch);
    if (isDateSearch && !searchValue) return;
    this.setFilterBy(false, searchValue, []);
    this.searchSubject.next(searchValue);
  }

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadProviderListGrid();
  }


  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }
  
  columnChange(event: ColumnVisibilityChangeEvent) {
    const columnsRemoved = event?.columns.filter(x => x.hidden).length
    this.columnChangeDesc = columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }

  resetProviderGrid() {
    this.sortValue = 'vendorName';
    this.sortType = 'asc';
    this.initializeProviderGrid();
    this.sortColumn = 'vendorName';
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : "";
    this.sortDir = this.sort[0]?.dir === 'desc' ? 'Descending' : "";
    this.filter = [];
    this.searchText = '';
    this.selectedSearchColumn = 'ALL';
    this.filteredByColumnDesc = '';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.columnChangeDesc = 'Default Columns';
    this.showDateSearchWarning = false;
    this.showNumberSearchWarning = false;
    this.loadProviderListGrid();
  }

  private setFilterBy(isFromGrid: boolean, searchValue: any = '', filter: any = []) {
    this.filteredByColumnDesc = '';
    if (isFromGrid) {
      if (filter.length > 0) {
        const filteredColumns = this.filter?.map((f: any) => {
          const filteredColumns = f.filters?.filter((fld:any)=> fld.value)?.map((fld: any) =>
            this.gridColumns[fld.field])
          return ([...new Set(filteredColumns)]);
        });

        this.filteredByColumnDesc = ([...new Set(filteredColumns)])?.sort()?.join(', ') ?? '';
      }
      return;
    }

    if (searchValue !== '') {
      this.filteredByColumnDesc = this.searchColumnList?.find(i => i.columnName === this.selectedSearchColumn)?.columnDesc ?? '';
    }
  }

  private isValidDate = (searchValue: any) => isNaN(searchValue) && !isNaN(Date.parse(searchValue));

  private formatSearchValue(searchValue: any, isDateSearch: boolean) {
    if (isDateSearch) {
      if (this.isValidDate(searchValue)) {
        return this.intl.formatDate(new Date(searchValue), this.configProvider?.appSettings?.dateFormat);
      }
      else {
        return '';
      }
    }

    return searchValue;
  }

  private initializeProviderPage() {
    this.loadProviderListGrid();
    this.addSearchSubjectSubscription();
  }

  private loadProviderListGrid(): void {
  
    const param = new GridFilterParam(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      JSON.stringify(this.filter));
      const providerQuery={
        vendorId:'5CEDE881-6338-4AF9-A5A7-9EEDE95C3696',
        vendorTypeCode :FinancialVendorTypeCode.Clinic,
        ...param
      }
    this.loadProviderListEvent.emit(providerQuery);
 //   this.gridDataHandle();
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  private addSearchSubjectSubscription() {
    this.searchSubject.pipe(debounceTime(300))
      .subscribe((searchValue) => {
        this.performVendorListSearch(searchValue);
      });
  }

  
  performVendorListSearch(data: any) {
    this.defaultGridState();
    const operator = (['effectiveDate']).includes(this.selectedSearchColumn) ? 'eq' : 'startswith';
    if (this.selectedSearchColumn === 'effectiveDate' && (!this.isValidDate(data) && data !== '')) {
      return;
    }
    if ((['tin']).includes(this.selectedSearchColumn) && isNaN(Number(data))) {
      return;
    }
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'pcaCode',
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
    this.loadProviderListGrid();
  }

  
  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.filter = stateData?.filter?.filters;
    this.setFilterBy(true, '', this.filter);
    this.loadProviderListGrid();
  }

  
  clickOpenAddEditProvidersDetails() {
    this.isProvidersDetailShow = true;
  }

  clickCloseAddEditProvidersDetails() {
    this.isProvidersDetailShow = false;
  }


  clickOpenRemoveProviders() {
    this.isProvidersRemoveShow = true;
  }
  clickCloseRemoveProviders() {
    this.isProvidersRemoveShow = false;
  }
  removeProvider(dataItem: any) {
      this.removePoviderEvent(this.selectProviderId);
      this.clickOpenRemoveProviders();
   }

   removedClick(vendorId:any)
   {
     this.selectProviderId = vendorId
     this.clickOpenRemoveProviders();
   }
   removePoviderEvent(providerId: any) {
    debugger;
    this.removeProviderClick.emit(providerId);
    this.clickCloseRemoveProviders();
     this.loadProviderListGrid();
  }
}
