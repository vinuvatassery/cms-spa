import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Router } from '@angular/router';
import {
  ColumnVisibilityChangeEvent,
  FilterService,
  GridDataResult,
} from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject, debounceTime } from 'rxjs';
import { DialogService } from '@progress/kendo-angular-dialog';
import { GridFilterParam } from '@cms/case-management/domain';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'cms-financial-premiums-all-payments-list',
  templateUrl: './financial-premiums-all-payments-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsAllPaymentsListComponent
  implements OnInit, OnChanges
{
  @ViewChild('previewSubmitPaymentDialogTemplate', { read: TemplateRef })
  previewSubmitPaymentDialogTemplate!: TemplateRef<any>;
  @ViewChild('unBatchPaymentDialogTemplate', { read: TemplateRef })
  unBatchPaymentDialogTemplate!: TemplateRef<any>;
  @ViewChild('deletePaymentDialogTemplate', { read: TemplateRef })
  deletePaymentDialogTemplate!: TemplateRef<any>;

  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isFinancialPremiumsAllPaymentsGridLoaderShow = false;
  @Input() premiumsType: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() financialPremiumsAllPaymentsGridLists$: any;
  @Output() loadFinancialPremiumsAllPaymentsListEvent = new EventEmitter<any>();
  @Input() financialPremiumPaymentLoader$: any;

  gridColumns: any = {
    itemNumber: 'Item #',
    batchNumber: 'Batch #',
    vendorTypeCodeDesc: 'Insurance Vendor',
    itemCountInBatch: 'Item Count',
    totalCost: 'Total Amount',
    acceptsReportsFlag: 'Accepts reports',
    paymentRequestedDate: 'Date Payment Requested',
    paymentSentDate: 'Date Payment Sent',
    paymentMethodDesc: 'Payment Method',
    paymentStatusDesc: 'Payment Status',
    pcaCode: 'PCA',
    mailCode: 'Mail Code',
    by: 'By',
  };

  searchColumnList: { columnName: string; columnDesc: string }[] = [
    {
      columnName: 'itemNumber',
      columnDesc: 'Item #',
    },
    {
      columnName: 'batchNumber',
      columnDesc: 'Batch #',
    },
    {
      columnName: 'vendorTypeCodeDesc',
      columnDesc: 'Insurance Vendor',
    },
    {
      columnName: 'itemCountInBatch',
      columnDesc: 'Item Count',
    },
    {
      columnName: 'totalCost',
      columnDesc: 'Total Amount',
    },
    {
      columnName: '8acceptsReportsFlag',
      columnDesc: 'Accepts reports',
    },
    {
      columnName: 'paymentRequestedDate',
      columnDesc: 'Date Payment Requested',
    },
    {
      columnName: 'paymentSentDate',
      columnDesc: 'Date Payment Sent',
    },
    {
      columnName: 'paymentMethodDesc',
      columnDesc: 'Payment Method',
    },
    {
      columnName: 'paymentStatusDesc',
      columnDesc: 'Payment Status',
    },
    {
      columnName: 'pcaCode',
      columnDesc: 'PCA',
    },
    {
      columnName: 'mailCode',
      columnDesc: 'Mail Code',
    },
    {
      columnName: 'by',
      columnDesc: 'By',
    },
  ];

  //searching
  private searchSubject = new Subject<string>();
  selectedSearchColumn: null | string = null;
  searchText: null | string = null;

  //sorting
  sortColumn = 'itemNumber';
  sortColumnDesc = 'Item #';
  sortDir = 'Ascending';

  //filtering
  filteredBy = '';
  filter: any = [];

  filteredByColumnDesc = '';
  selectedStatus = '';
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  showDateSearchWarning = false;
  showNumberSearchWarning = false;
  columnChangeDesc = 'Default Columns';

  numericColumns: any[] = [
    'itemNumber',
    'itemCountInBatch',
    'totalCost',
    'pcaCode',
  ];
  dateColumns: any[] = ['paymentRequestedDate', 'paymentSentDate'];

  //lov Filters

  selectedVendorTypeCode: string | null = null;
  selectedPaymentStatus: string | null = null;
  selectedPaymentMethod: string | null = null;
  selectedAcceptsReports: string | null = null;
  vendorTypeCode$ = this.lovFacade.VendorTypeCodeLov$;
  paymentMethodType$ = this.lovFacade.paymentMethodType$;
  paymentStatus$ = this.lovFacade.paymentStatus$;
  vendorTypeCodes: any = [];
  paymentMethodTypes: any = [];
  paymentStauses: any = [];
  acceptsReportsList: {name: string, value: string}[] = [{name: 'Yes', value: 'Y'}, {name: 'No', value: 'N'}];

  public state!: State;
  columnsReordered = false;
  isFiltered = false;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  gridFinancialPremiumsAllPaymentsDataSubject = new Subject<any>();
  gridFinancialPremiumsAllPaymentsData$ =
    this.gridFinancialPremiumsAllPaymentsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  PreviewSubmitPaymentDialog: any;
  deletePaymentDialog: any;
  unBatchPaymentDialog: any;
  sendReportDialog: any;
  isRequestPaymentClicked = false;
  isSendReportOpened = false;
  isUnBatchPaymentOpen = false;
  isDeletePaymentOpen = false;

  public allPaymentsGridActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Unbatch Payment',
      icon: 'undo',
      click: (data: any): void => {
        if (!this.isUnBatchPaymentOpen) {
          this.isUnBatchPaymentOpen = true;
          this.onUnBatchPaymentOpenClicked(this.unBatchPaymentDialogTemplate);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Payment',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isDeletePaymentOpen) {
          this.isDeletePaymentOpen = true;
          this.onDeletePaymentOpenClicked(this.deletePaymentDialogTemplate);
        }
      },
    },
  ];

  public bulkMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'Send Report',
      icon: 'mail',
      click: (data: any): void => {
        this.isRequestPaymentClicked = false;
        this.isSendReportOpened = true;
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Request Payments',
      icon: 'local_atm',
      click: (data: any): void => {
        this.isRequestPaymentClicked = true;
        this.isSendReportOpened = false;
      },
    },

    {
      buttonType: 'btn-h-primary',
      text: 'Reconcile Payments',
      icon: 'edit',
      click: (data: any): void => {
        this.navToReconcilePayments(data);
      },
    },
  ];

  constructor(
    private route: Router,
    private dialogService: DialogService,
    private readonly configProvider: ConfigurationProvider,
    private readonly intl: IntlService,
    private readonly lovFacade: LovFacade,
  ) {}

  ngOnInit(): void {
    this.getVedndorTypeCodeLov();
    this.getPaymentMethodLov();
    this.getPaymentStatusLov();
    this.initializePremiumsPaymentsPage();
  }

  ngOnChanges(): void {
    this.initializePremiumsPaymentsGrid();
    this.loadFinancialPremiumsPaymentsListGrid();
  }

  private getVedndorTypeCodeLov() {
    this.lovFacade.getVendorTypeCodeLovs();
    this.vendorTypeCode$.subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          item.lovDesc = item.lovDesc.toUpperCase();
        });
        this.vendorTypeCodes = data.sort(
          (value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr
        );
      },
    });
  }

  private getPaymentMethodLov() {
    this.lovFacade.getPaymentMethodLov();
    this.paymentMethodType$.subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          item.lovDesc = item.lovDesc.toUpperCase();
        });
        this.paymentMethodTypes = data.sort(
          (value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr
        );
      },
    });
  }

  private getPaymentStatusLov() {
    this.lovFacade.getPaymentStatusLov();
    this.paymentStatus$.subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          item.lovDesc = item.lovDesc.toUpperCase();
        });
        this.paymentStauses = data.sort(
          (value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr
        );
      },
    });
  }

  searchColumnChangeHandler(value: string) {
    this.filter = [];
    this.showNumberSearchWarning = this.numericColumns.includes(value);
    this.showDateSearchWarning = this.dateColumns.includes(value);
    if (this.searchText) {
      this.onSearch(this.searchText);
    }
  }

  onSearch(searchValue: any) {
    const isDateSearch = searchValue.includes('/');
    this.showDateSearchWarning =
      isDateSearch || this.dateColumns.includes(this.selectedSearchColumn);
    searchValue = this.formatSearchValue(searchValue, isDateSearch);
    if (isDateSearch && !searchValue) return;
    this.setFilterBy(false, searchValue, []);
    this.searchSubject.next(searchValue);
  }

  performSearch(data: any) {
    this.defaultGridState();
    const operator = [...this.numericColumns, ...this.dateColumns].includes(
      this.selectedSearchColumn?? 'itemNumber'
    )
      ? 'eq'
      : 'startswith';
    if (
      this.dateColumns.includes(this.selectedSearchColumn) &&
      !this.isValidDate(data) &&
      data !== ''
    ) {
      return;
    }
    if (
      this.numericColumns.includes(this.selectedSearchColumn) &&
      isNaN(Number(data))
    ) {
      return;
    }
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'itemNumber',
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

  restGrid() {
    this.sortValue = 'itemNumber';
    this.sortType = 'asc';
    this.initializePremiumsPaymentsPage();
    this.sortColumn = 'itemNumber';
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : '';
    this.sortDir = this.sort[0]?.dir === 'desc' ? 'Descending' : '';
    this.filter = [];
    this.searchText = '';
    this.selectedSearchColumn = null;
    this.filteredByColumnDesc = '';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.columnChangeDesc = 'Default Columns';
    this.showDateSearchWarning = false;
    this.showNumberSearchWarning = false;
    this.loadFinancialPremiumsPaymentsListGrid();
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
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.filter = stateData?.filter?.filters;
    this.setFilterBy(true, '', this.filter);
    this.loadFinancialPremiumsPaymentsListGrid();
  }

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadFinancialPremiumsPaymentsListGrid();
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  rowClass = (args: any) => ({
    'table-row-disabled': !args.dataItem.assigned,
  });

  columnChange(event: ColumnVisibilityChangeEvent) {
    const columnsRemoved = event?.columns.filter((x) => x.hidden).length;
    this.columnChangeDesc =
      columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
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

  onChange(data: any) {
    this.defaultGridState();

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'itemNumber',
              operator: 'startswith',
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

  /* Private methods */
  private initializePremiumsPaymentsGrid() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: [{ field: 'itemNumber', dir: 'asc' }],
    };
  }

  private initializePremiumsPaymentsPage() {
    this.loadFinancialPremiumsPaymentsListGrid();
    this.addSearchSubjectSubscription();
  }

  private loadFinancialPremiumsPaymentsListGrid(): void {
    const param = new GridFilterParam(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,

      JSON.stringify(this.filter)
    );
    this.loadFinancialPremiumsAllPaymentsListEvent.emit(param);
  }

  private addSearchSubjectSubscription() {
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchValue) => {
      this.performSearch(searchValue);
    });
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
            ?.map((fld: any) => this.gridColumns[fld.field]);
          return [...new Set(filteredColumns)];
        });

        this.filteredByColumnDesc =
          [...new Set(filteredColumns)]?.sort()?.join(', ') ?? '';
      }
      return;
    }

    if (searchValue !== '') {
      this.filteredByColumnDesc =
        this.searchColumnList?.find(
          (i) => i.columnName === this.selectedSearchColumn
        )?.columnDesc ?? '';
    }
  }

  private isValidDate = (searchValue: any) =>
    isNaN(searchValue) && !isNaN(Date.parse(searchValue));

  private formatSearchValue(searchValue: any, isDateSearch: boolean) {
    if (isDateSearch) {
      if (this.isValidDate(searchValue)) {
        return this.intl.formatDate(
          new Date(searchValue),
          this.configProvider?.appSettings?.dateFormat
        );
      } else {
        return '';
      }
    }

    return searchValue;
  }

  loadRefundAllPayments(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isFinancialPremiumsAllPaymentsGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadFinancialPremiumsAllPaymentsListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }

  gridDataHandle() {
    this.financialPremiumsAllPaymentsGridLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridFinancialPremiumsAllPaymentsDataSubject.next(
          this.gridDataResult
        );
        if (data?.total >= 0 || data?.total === -1) {
          this.isFinancialPremiumsAllPaymentsGridLoaderShow = false;
        }
      }
    );
    this.isFinancialPremiumsAllPaymentsGridLoaderShow = false;
  }

  navToReconcilePayments(event: any) {
    this.route.navigate([
      '/financial-management/premiums/' +
        this.premiumsType +
        '/payments/reconcile-payments',
    ]);
  }

  public onPreviewSubmitPaymentOpenClicked(
    template: TemplateRef<unknown>
  ): void {
    this.PreviewSubmitPaymentDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    });
  }

  onPreviewSubmitPaymentCloseClicked(result: any) {
    if (result) {
      this.PreviewSubmitPaymentDialog.close();
    }
  }

  onBulkOptionCancelClicked() {
    this.isRequestPaymentClicked = false;
    this.isSendReportOpened = false;
  }

  public onSendReportOpenClicked(template: TemplateRef<unknown>): void {
    this.sendReportDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onSendReportCloseClicked(result: any) {
    if (result) {
      this.sendReportDialog.close();
    }
  }

  onUnBatchPaymentOpenClicked(template: TemplateRef<unknown>): void {
    this.unBatchPaymentDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onUnBatchPaymentCloseClicked(result: any) {
    if (result) {
      this.isUnBatchPaymentOpen = false;
      this.unBatchPaymentDialog.close();
    }
  }

  onDeletePaymentOpenClicked(template: TemplateRef<unknown>): void {
    this.deletePaymentDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onDeletePaymentCloseClicked(result: any) {
    if (result) {
      this.isDeletePaymentOpen = false;
      this.deletePaymentDialog.close();
    }
  }
}
