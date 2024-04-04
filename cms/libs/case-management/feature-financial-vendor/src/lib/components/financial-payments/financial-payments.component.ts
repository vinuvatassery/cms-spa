import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { GridFilterParam, PaymentsFacade, PremiumType } from '@cms/case-management/domain';
import { CompositeFilterDescriptor, SortDescriptor, State } from '@progress/kendo-data-query';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ColumnVisibilityChangeEvent, FilterService } from '@progress/kendo-angular-grid';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { IntlService } from '@progress/kendo-angular-intl';
import { ConfigurationProvider, DocumentFacade } from '@cms/shared/util-core';
import { Router } from '@angular/router';
import { LovFacade } from '@cms/system-config/domain';
@Component({
  selector: 'cms-financial-payments',
  templateUrl: './financial-payments.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FinancialPaymentComponent implements OnDestroy {
  /** Input Properties **/
  @Input() vendorId!: string;
  formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  sortValue = 'batchName';
  sortType = this.paymentsFacade.sortType;
  pageSizes = this.paymentsFacade.gridPageSizes;
  gridSkipCount = this.paymentsFacade.skipCount;
  sort: SortDescriptor[] = [{ field: 'batchName', dir: 'asc' }];
  state!: State;
  filter!: any;
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  paymentStatusFilter = '';
  paymentBatchesGridView$ = this.paymentsFacade.paymentBatches$;
  paymentBatchLoader$ = this.paymentsFacade.paymentBatchLoader$;
  batchStatusLov$ = this.lovFacade.batchStatus$;  
  batchStatusLov:any;
  batchStatusLovSubscription!: Subscription;
  sortDir = 'Ascending';
  sortColumnDesc = 'Batch #';
  filteredByColumnDesc = '';
  columnChangeDesc = 'Default Columns';
  selectedSearchColumn = 'batchName';
  searchText = '';

  gridColumns: { [key: string]: string } = {
    ALL: 'All Columns',
    batchName: 'Batch #',
    itemNumber: 'Item #',
    itemCount: 'Item Count',
    totalAmount: 'Total Amount',
    paymentRequestDate: 'Date Pmt. Requested',
    paymentSentDate: 'Date Pmt. Sent',
    paymentStatus: 'Pmt. Status',
    paymentReconciledDate: 'Date Pmt. Reconciled',
    warrantNumber: 'Warrant #',
    pcaCode: 'PCA',
  };

  searchColumnList = [
    { columnName: 'ALL', columnDesc: 'All Columns' },
    { columnName: 'batchName', columnDesc: 'Batch #' },
    { columnName: 'itemNumber', columnDesc: 'Item #' },
    { columnName: 'itemCount', columnDesc: 'Item Count' },
    { columnName: 'totalAmount', columnDesc: 'Total Amount' },
    { columnName: 'paymentRequestDate', columnDesc: 'Date Pmt. Requested' },
    { columnName: 'paymentSentDate', columnDesc: 'Date Pmt. Sent' },
    { columnName: 'paymentStatusCode', columnDesc: 'Pmt. Status' },
    { columnName: 'paymentReconciledDate', columnDesc: 'Date Pmt. Reconciled' },
    { columnName: 'warrantNumber', columnDesc: 'Warrant #' },
    { columnName: 'pcaCode', columnDesc: 'PCA' },
  ];

  columnsReordered = false;
  showExportLoader = false;
  showDateSearchWarning = false;
  showNumberSearchWarning = false;
  private searchSubject = new Subject<string>();
  paymentBatchesProfilePhotoSubscription = new Subscription();
  paymentBatchesProfilePhotoSubject = new Subject();
  paymentBatchesProfilePhoto$ = this.paymentsFacade.paymentBatchesProfilePhotoSubject;

  /** Constructor **/
  constructor(private readonly paymentsFacade: PaymentsFacade,
    private documentFacade :  DocumentFacade,
    private lovFacade :  LovFacade,
    private readonly intl: IntlService,
    private readonly configProvider: ConfigurationProvider,
    private route: Router
) { }
    
  ngOnInit(): void {
    this.loadPaymentsListGrid();
    this.addSearchSubjectSubscription();
    this.loadBatchStatusLov();
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
    this.loadPaymentsListGrid();
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.filter = stateData?.filter?.filters;
    this.state = stateData;
    this.sortDir = this.sortType === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.setFilterBy(true, '', this.filter);
    this.loadPaymentsListGrid();
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    if (field === 'paymentStatus') {
      this.paymentStatusFilter = value;
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

  loadPaymentsListGrid() {
    const params = new GridFilterParam(this.state.skip, this.state.take, this.sortValue, this.sortType, JSON.stringify(this.filter))
    this.paymentsFacade.loadPaymentsListGrid(this.vendorId, params);
  }

  searchColumnChangeHandler(value: any) {
    this.filter = [];
    this.showNumberSearchWarning = (['itemNumber', 'totalAmount', 'itemCount', 'warrantNumber', 'pcaCode']).includes(value);
    this.showDateSearchWarning = (['paymentRequestDate','paymentSentDate','paymentReconciledDate']).includes(value);
    if (this.searchText) {
      this.onSearch(this.searchText);
    }
  }

  onSearch(searchValue: any) {
    const isDateSearch = searchValue.includes('/');
     this.showDateSearchWarning = isDateSearch || (['paymentRequestDate','paymentSentDate','paymentReconciledDate']).includes(this.selectedSearchColumn);
    searchValue = this.formatSearchValue(searchValue, isDateSearch);
    if (isDateSearch && !searchValue) return;
    this.setFilterBy(false, searchValue, []);
    this.searchSubject.next(searchValue);
  }

  resetGrid() {
    this.defaultGridState();
    this.sortValue = 'batchName';
    this.sortType = 'asc';
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
    this.loadPaymentsListGrid();
  }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  private addSearchSubjectSubscription() {
    this.searchSubject.pipe(debounceTime(300))
      .subscribe((searchValue) => {
        this.performSearch(searchValue);
      });
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

  performSearch(data: any) {
    this.defaultGridState();
    const numberAndDateFields = ['itemNumber', 'totalAmount', 'itemCount', 'warrantNumber', 'pcaCode','paymentRequestDate','paymentSentDate','paymentReconciledDate'];
    const operator = numberAndDateFields.includes(this.selectedSearchColumn) ? 'eq' : 'startswith';
    if ((['paymentRequestDate','paymentSentDate','paymentReconciledDate']).includes(this.selectedSearchColumn) && (!this.isValidDate(data) && data !== '')) {
      return;
    }

    if ((['itemNumber', 'totalAmount', 'itemCount', 'warrantNumber', 'pcaCode']).includes(this.selectedSearchColumn) && isNaN(Number(data))) {
      return;
    }

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'ALL',
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

  private defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter: { logic: 'and', filters: [] },
    };
  }
  
  private setFilterBy(isFromGrid: boolean, searchValue: any = '', filter: any = []) {
    this.filteredByColumnDesc = '';
    if (isFromGrid) {
      if (filter.length > 0) {
        const filteredColumns = this.filter?.map((f: any) => {
          const filteredColumns = f.filters?.filter((fld: any) => fld.value)?.map((fld: any) =>
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

  columnChange(event: ColumnVisibilityChangeEvent) {
    const columnsRemoved = event?.columns.filter(x => x.hidden).length
    this.columnChangeDesc = columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }

  onExportPayments(){
    const params = {
      SortType: this.sortType,
      Sorting: this.sortValue,
      Filter: JSON.stringify(this.filter)
    };

    this.documentFacade.getExportFile(params,`vendors/${this.vendorId}/payment-batches` , 'insurance-payments')
  }

  onBatchClicked(dataItem: any) {
    const premiumsType = dataItem?.serviceSubTypeCode.toLowerCase().includes(PremiumType.Medical) ? PremiumType.Medical : PremiumType.Dental;
    this.route.navigate([`/financial-management/premiums/${premiumsType}/batch`],
    { queryParams :{bid: dataItem.batchId }});
}

  loadBatchStatusLov()
  {
    this.lovFacade.getBatchStatusLov();
    this.batchStatusLovSubscription = this.batchStatusLov$.subscribe({
      next:(response) => {
        this.batchStatusLov = response;
      }
    });
  }

  ngOnDestroy(): void {
    this.batchStatusLovSubscription.unsubscribe();
    this.paymentBatchesProfilePhotoSubscription?.unsubscribe();
    this.paymentBatchesProfilePhotoSubscription?.unsubscribe();
  }
}
