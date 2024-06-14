import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { FinancialPremiumsFacade, GridFilterParam, InsurancePremiumDetails, LoadTypes, PaymentStatusCode } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { LovFacade, UserManagementFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import {
  ColumnVisibilityChangeEvent,
  FilterService,
  GridDataResult,
} from '@progress/kendo-angular-grid';
import { IntlService } from '@progress/kendo-angular-intl';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { BehaviorSubject, Observable, Subject, debounceTime, first } from 'rxjs';

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
  gridLoaderSubject = new BehaviorSubject(false);
  @Input() premiumsType: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() financialPremiumsAllPaymentsGridLists$: any;
  @Output() loadFinancialPremiumsAllPaymentsListEvent = new EventEmitter<any>();
  @Input() financialPremiumPaymentLoader$: any;
  @Input() letterContentList$ :any;
  @Input() letterContentLoader$ :any;
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  @Output() unBatchPremiumEvent = new EventEmitter<any>();
  @Output() loadTemplateEvent = new EventEmitter<any>();
  paymentStatusCode="PAYMENT_STATUS_CODE"
  gridColumns: any = {
    itemNumber: 'Item #',
    batchNumber: 'Batch #',
    providerName: 'Insurance Vendor',
    itemsCountInBatch: 'Item Count',
    totalDue: 'Total Amount',
    acceptsReportsFlag: 'Accepts reports',
    paymentRequestedDate: 'Date Payment Requested',
    paymentSentDate: 'Date Payment Sent',
    paymentMethodDesc: 'Payment Method',
    paymentStatusDesc: 'Payment Status',
    pcaCode: 'PCA',
    mailCode: 'Mail Code',
    by: 'By',
  };

  vendorId: any;
  clientId: any;
  clientName: any = "";
  paymentRequestId:any
  premiumId!: string;
  private editPremiumsFormDialog: any;
  @Output() loadPremiumEvent = new EventEmitter<string>();
  @Output() updatePremiumEvent = new EventEmitter<any>();
  @Input() insurancePremium$!: Observable<InsurancePremiumDetails>;
  @Input() insuranceCoverageDates$: any;

  searchColumnList: { columnName: string; columnDesc: string }[] = [
    {
      columnName: 'ALL',
      columnDesc: 'All Columns',
    },
    {
      columnName: 'batchNumber',
      columnDesc: 'Batch #',
    },
    {
      columnName: 'providerName',
      columnDesc: 'Insurance Vendor',
    }
  ];

  @ViewChild('editPremiumsDialogTemplate', { read: TemplateRef })
  editPremiumsDialogTemplate!: TemplateRef<any>;

  //searching
  private searchSubject = new Subject<string>();
  selectedSearchColumn: null | string = 'ALL';
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
    'itemsCountInBatch',
    'totalDue',
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
  sendReportDialog: any;
  isRequestPaymentClicked = false;
  isSendReportOpened = false;
  isUnBatchPaymentOpen = false;
  isDeletePaymentOpen = false;
  isEditBatchClosed = false;
  isUnBatchPaymentPremiumsClosed = false;
  showDeleteConfirmation = false;
  @ViewChild('removePremiumsConfirmationDialogTemplate', { read: TemplateRef })
  removePremiumsConfirmationDialogTemplate!: TemplateRef<any>;
  @ViewChild('unBatchPaymentPremiumsDialogTemplate', { read: TemplateRef })
  unBatchPaymentPremiumsDialogTemplate!: TemplateRef<any>;
  selected:any;
  paymentId!: any;
  showExportLoader = false;
  @Input() unbatchPremiums$ :any
  @Input() exportButtonShow$: any;
  @Input() premiumAllPaymentsPremium$!: any;
  @Output() deletePaymentEvent = new EventEmitter();
  @Output() exportGridDataEvent = new EventEmitter<any>();

  UnBatchPaymentDialog: any;
  removePremiumsDialog: any;
  isPrintAdviceLetterClicked = false;
  selectAll:boolean=false;
  unCheckedPaymentRequest:any=[];
  selectedDataIfSelectAllUnchecked:any=[];
  financialPremiumsAllPaymentsGridLists: any = [];
  currentPageRecords: any = [];
  selectedAllPaymentsList!: any;
  isPageCountChanged: boolean = false;
  isPageChanged: boolean = false;
  unCheckedProcessRequest:any=[];
  checkedAndUncheckedRecordsFromSelectAll:any=[];
  recordCountWhenSelectallClicked: number = 0;
  totalGridRecordsCount: number = 0;
  selectedCount: number = 0;
  printAuthorizationDialog: any;
  previewText = false;
  allPaymentsPremiumSubject = new Subject();
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
  public batchLogGridActions(dataItem:any){
    return [
     {
       buttonType: 'btn-h-primary',
       text: 'Unbatch Premium',
       icon: 'undo',
       disabled: [PaymentStatusCode.Paid, PaymentStatusCode.PaymentRequested, PaymentStatusCode.ManagerApproved].includes(dataItem.paymentStatusCode),
       click: (data: any): void => {
         if(![PaymentStatusCode.Paid, PaymentStatusCode.PaymentRequested, PaymentStatusCode.ManagerApproved].includes(data.paymentStatusCode))
         {
         if (!this.isUnBatchPaymentPremiumsClosed) {
           this.isUnBatchPaymentPremiumsClosed = true;
           this.selected = data;
           this.onUnBatchPaymentOpenClicked(this.unBatchPaymentPremiumsDialogTemplate);
         }
       }
       },
     },
     {
       buttonType: 'btn-h-danger',
       text: 'Delete Payment',
       icon: 'delete',
       disabled: [PaymentStatusCode.Paid, PaymentStatusCode.PaymentRequested, PaymentStatusCode.ManagerApproved].includes(dataItem.paymentStatusCode),
       click: (data: any): void => {
         if (data && !this.showDeleteConfirmation) {
           this.showDeleteConfirmation = true;
           this.onRemovePremiumsOpenClicked(data.paymentRequestId, this.removePremiumsConfirmationDialogTemplate);
         }
       },
     },
     {
      buttonType: 'btn-h-primary',
      text: 'Edit Premium',
      icon: 'edit',
      disabled: [PaymentStatusCode.Paid, PaymentStatusCode.PaymentRequested, PaymentStatusCode.ManagerApproved].includes(dataItem.paymentStatusCode),
      click: (data: any): void => {
        if (!this.isEditBatchClosed) {
          this.isEditBatchClosed = true;
          this.onEditPremiumsClick(data?.insurancePremiumId, data?.vendorId, data?.clientId, data.clientFullName, data?.paymentRequestId);
        }
      },
    },
   ];
 }
 onUnBatchPaymentCloseClicked(result: any) {
  if (result) {
      this.handleUnbatchClaims();
      this.unBatchPremiumEvent.emit({
        paymentId : [this.selected.paymentRequestId],
        premiumsType: this.premiumsType
      })
  }
  this.isUnBatchPaymentPremiumsClosed = false;
  this.UnBatchPaymentDialog.close();
}
handleUnbatchClaims() {
  this.unbatchPremiums$
    .pipe(first((unbatchResponse: any) => unbatchResponse != null))
    .subscribe((unbatchResponse: any) => {
      if (unbatchResponse ?? false) {
        this.loadFinancialPremiumsPaymentsListGrid();
      }
    });
}
public onRemovePremiumsOpenClicked(paymentRequestId: string, template: TemplateRef<unknown>): void {
  this.paymentId = paymentRequestId;
  this.removePremiumsDialog = this.dialogService.open({
    content: template,
    cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
  });
}

onModalRemovePremiumsModalClose(result: any) {
  if (result) {
    this.showDeleteConfirmation = false;
    this.removePremiumsDialog.close();
  }
}
deletePremiumPayment(paymentId: string) {
  this.deletePaymentEvent.emit(this.paymentId);
  this.onModalRemovePremiumsModalClose(true);
  this.loadFinancialPremiumsPaymentsListGrid();
}
  public bulkMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'RECONCILE PAYMENTS',
      icon: 'edit',
      click: (data: any): void => {
        this.navToReconcilePayments(data);
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'PRINT ADVICE LETTERS',
      icon: 'print',
      click: (data: any): void => {
        this.isRequestPaymentClicked = false;
        this.isPrintAdviceLetterClicked = true;
        this.previewText = true;
      },
    }
  ];

  constructor(
    private route: Router,
    private dialogService: DialogService,
    private readonly configProvider: ConfigurationProvider,
    private readonly intl: IntlService,
    private readonly lovFacade: LovFacade,
    private readonly cdr: ChangeDetectorRef,
    private readonly financialPremiumsFacade: FinancialPremiumsFacade,
    private readonly userManagementFacade: UserManagementFacade,
  ) {}

  ngOnInit(): void {
    this.addSearchSubjectSubscription();
    this.getVedndorTypeCodeLov();
    this.getPaymentMethodLov();
    this.financialPremiumsAllPaymentsGridLists$.subscribe((response:any) =>{
      this.totalGridRecordsCount = response?.acceptsReportsCount;
      this.paymentStauses = response?.lovs[this.paymentStatusCode]
      if(this.selectAll){
      this.markAsChecked(response.data);
      }
      this.financialPremiumsAllPaymentsGridLists = response;
    })
  }

  ngOnChanges(): void {
    this.initializePremiumsPaymentsGrid();
    this.loadFinancialPremiumsPaymentsListGrid();
    this.handleAllPaymentsGridData();
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
    this.initializePremiumsPaymentsGrid()
    this.sortColumn = 'itemNumber';
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : '';
    this.sortDir = this.sort[0]?.dir === 'desc' ? 'Descending' : '';
    this.filter = [];
    this.searchText = '';
    this.selectedSearchColumn = 'ALL';
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
    this.updateGridFilterDateFormat(stateData, false);
    this.clearIndividualSelectionOnClear(stateData);
    this.filter = stateData?.filter?.filters;
    this.setFilterBy(true, '', this.filter);
    this.loadFinancialPremiumsPaymentsListGrid();
    this.updateGridFilterDateFormat(stateData, true);
  }

  getDate(element:any, isDisplayFormat:boolean){
    if ((element.field == "paymentRequestedDate" || element.field == "paymentSentDate")) {
      if(isDisplayFormat){
        element.value = new Date(element.value)
      }else{
        element.value = this.intl.formatDate(
          new Date(element.value),
          this.configProvider?.appSettings?.dateFormat
        );
      }
    }
  }
  updateGridFilterDateFormat(stateData: any,isDisplayFormat:boolean){
    const filterList = [];
    if((stateData.filter?.filters.length > 0) && (stateData.filter?.filters.slice(-1)[0].filters.length>1)){
      this.isFiltered = true;
      stateData.filter?.filters.slice(-1)[0].filters?.forEach((element: any) => {
       element.value = this.getDate(element, isDisplayFormat);
      });
      for (const filter of stateData.filter.filters) {
        filterList.push(this.gridColumns[filter.filters[0].field]);
      }
      this.filteredBy = filterList.toString();
    }else {
      this.filter = stateData.filter?.filters.length > 0 ? this.filter : '';
      this.isFiltered = stateData.filter?.filters.length > 0 ? true : false;
    }
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

  private loadFinancialPremiumsPaymentsListGrid(): void {
    const filter = this.filter == "" ? "[]" : JSON.stringify(this.filter);
    const param = new GridFilterParam(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      filter
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
    ],{ queryParams :{loadType: LoadTypes.allPayments}});
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
    this.isPrintAdviceLetterClicked = false;
    this.selectAll = false;
    this.previewText = false;
    this.isRequestPaymentClicked = false;
    this.isSendReportOpened = false;
    this.selectedCount = 0;
    this.markAsUnChecked(this.financialPremiumsAllPaymentsGridLists?.data);
    this.markAsUnChecked(this.selectedDataIfSelectAllUnchecked);
    this.markAsUnChecked(this.unCheckedProcessRequest);
    this.unCheckedPaymentRequest=[];
    this.selectedDataIfSelectAllUnchecked=[];
    this.unCheckedProcessRequest = [];
    this.checkedAndUncheckedRecordsFromSelectAll = [];
    this.selectedAllPaymentsList.PrintAdviceLetterSelected = [];
    this.selectedAllPaymentsList.PrintAdviceLetterUnSelected = [];
    this.loadFinancialPremiumsPaymentsListGrid();
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
    this.UnBatchPaymentDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
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
  onProviderNameClick(event:any){
    this.onProviderNameClickEvent.emit(event)
  }

   /* Public methods */
   navToBatchDetails(event : any){
    this.route.navigate([`/financial-management/premiums/${this.premiumsType}/batch`],
    { queryParams :{bid: event.batchId}});
  }

  onClickedExport() {
    this.showExportLoader = true;
    this.exportGridDataEvent.emit();

    this.exportButtonShow$.subscribe((response: any) => {
      if (response) {
        this.showExportLoader = false;
        this.cdr.detectChanges();
      }
    });
  }

  selectionChange(dataItem:any, selected:boolean){
    if(!selected){
      this.onRecordSelectionChecked(dataItem);
    }
    else{
      this.onRecordSelectionUnChecked(dataItem);
    }
      this.selectedAllPaymentsList = {'selectAll':this.selectAll,'PrintAdviceLetterUnSelected':this.unCheckedProcessRequest,
      'PrintAdviceLetterSelected':this.checkedAndUncheckedRecordsFromSelectAll,'print':true,
      'batchId':null,'currentPrintAdviceLetterGridFilter':null,'requestFlow':'print'};
    if(this.selectAll){
      if(this.unCheckedProcessRequest?.length > 0){
        this.selectedCount = this.totalGridRecordsCount - this.unCheckedProcessRequest?.length;
        this.recordCountWhenSelectallClicked = this.selectedCount;
      }else{
      this.recordCountWhenSelectallClicked = selected ? this.recordCountWhenSelectallClicked + 1 : this.recordCountWhenSelectallClicked - 1;
      this.selectedCount = this.recordCountWhenSelectallClicked;
      }
    }else{
      this.selectedCount = this.selectedAllPaymentsList?.PrintAdviceLetterSelected?.filter((item: any) => item.selected).length;
   }
    this.cdr.detectChanges();
}

selectionAllChange(){
  this.unCheckedProcessRequest=[];
  this.checkedAndUncheckedRecordsFromSelectAll=[];
  if(this.selectAll){
    this.markAsChecked(this.financialPremiumsAllPaymentsGridLists?.data);
  }
  else{
    this.markAsUnChecked(this.financialPremiumsAllPaymentsGridLists?.data);
  }
  this.selectedAllPaymentsList = {'selectAll':this.selectAll,'PrintAdviceLetterUnSelected':this.unCheckedProcessRequest,
  'PrintAdviceLetterSelected':this.checkedAndUncheckedRecordsFromSelectAll,'print':true,
  'batchId':null,'currentPrintAdviceLetterGridFilter':null,'requestFlow':'print'};
  this.cdr.detectChanges();
  if(this.selectAll){
    if(this.unCheckedProcessRequest?.length > 0){
      this.selectedCount = this.totalGridRecordsCount - this.unCheckedProcessRequest?.length;
      this.recordCountWhenSelectallClicked = this.selectedCount;
    }else{
      this.selectedCount = this.totalGridRecordsCount;
    }
  }else{
  this.getSelectedReportCount(this.selectedAllPaymentsList?.PrintAdviceLetterSelected);
}
}

markAsChecked(data:any){
  data.forEach((element:any) => {
    if(this.selectAll){
      element.selected = true;
    }
    else{
      element.selected = false;
    }
    if(this.unCheckedPaymentRequest.length>0 || this.selectedDataIfSelectAllUnchecked.length >0)   {
      const itemMarkedAsUnChecked=   this.unCheckedPaymentRequest.find((x:any)=>x.paymentRequestId ===element.paymentRequestId);
      if(itemMarkedAsUnChecked !== null && itemMarkedAsUnChecked !== undefined){
        element.selected = false;
      }
      const itemMarkedAsChecked = this.selectedDataIfSelectAllUnchecked.find((x:any)=>x.paymentRequestId ===element.paymentRequestId);
      if(itemMarkedAsChecked !== null && itemMarkedAsChecked !== undefined){
        element.selected = true;
      }
    }

  });

}

markAsUnChecked(data:any){
  data.forEach((element:any) => {
    element.selected = false;
});
}

onRecordSelectionUnChecked(dataItem: any) {
  this.unCheckedProcessRequest = this.unCheckedProcessRequest.filter((item:any) => item.paymentRequestId !== dataItem.paymentRequestId);
    this.currentPageRecords?.forEach((element: any) => {
      if (element.paymentRequestId === dataItem.paymentRequestId) {
        element.selected = true;
      }
    });
    const exist = this.checkedAndUncheckedRecordsFromSelectAll?.filter((x: any) => x.paymentRequestId === dataItem.paymentRequestId).length;
    if (exist === 0) {
      this.checkedAndUncheckedRecordsFromSelectAll.push({ 'paymentRequestId': dataItem.paymentRequestId, 'vendorAddressId': dataItem.vendorAddressId, 'selected': true, 'batchId':dataItem.batchId, 'checkNbr':dataItem.checkNbr });
    }else{
      const recordIndex = this.checkedAndUncheckedRecordsFromSelectAll.findIndex((element: any) => element.paymentRequestId === dataItem.paymentRequestId);
      if (recordIndex !== -1) {
        this.checkedAndUncheckedRecordsFromSelectAll.splice(recordIndex, 1); // Remove the record at the found index
      }
    }
}

onRecordSelectionChecked(dataItem: any) {
  this.unCheckedProcessRequest.push({'paymentRequestId':dataItem.paymentRequestId,'vendorAddressId':dataItem.vendorAddressId,'selected':true, 'batchId':dataItem.batchId, 'checkNbr':dataItem.checkNbr });
      this.currentPageRecords?.forEach((element: any) => {
        if (element.paymentRequestId === dataItem.paymentRequestId) {
          element.selected = false;
        }
      });
      const exist = this.checkedAndUncheckedRecordsFromSelectAll?.filter((x: any) => x.paymentRequestId === dataItem.paymentRequestId).length;
      if (exist === 0) {
        this.checkedAndUncheckedRecordsFromSelectAll.push({ 'paymentRequestId': dataItem.paymentRequestId, 'vendorAddressId': dataItem.vendorAddressId, 'selected': false, 'batchId':dataItem.batchId, 'checkNbr':dataItem.checkNbr });
      }else{
        const recordIndex = this.checkedAndUncheckedRecordsFromSelectAll.findIndex((element: any) => element.paymentRequestId === dataItem.paymentRequestId);
        if (recordIndex !== -1) {
          this.checkedAndUncheckedRecordsFromSelectAll.splice(recordIndex, 1); // Remove the record at the found index
        }
      }
}

getSelectedReportCount(selectedSendReportList : []){
  this.selectedCount = selectedSendReportList.length;
}

  loadEachLetterTemplate(event:any){
    this.loadTemplateEvent.emit(event);
}

public onPrintAuthorizationOpenClicked(template: TemplateRef<unknown>): void {
  this.printAuthorizationDialog = this.dialogService.open({
    content: template,
    cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
  });
}

onPrintAuthorizationCloseClicked(result: any) {
  if (result) {
    this.printAuthorizationDialog.close();
  }
}

handleAllPaymentsGridData() {
  this.financialPremiumsAllPaymentsGridLists$.subscribe((data: GridDataResult) => {
    this.gridDataResult = data;
    this.gridFinancialPremiumsAllPaymentsDataSubject.next(this.gridDataResult);
    if (data?.total >= 0 || data?.total === -1) {
      this.gridLoaderSubject.next(false);
    }
    this.financialPremiumsAllPaymentsGridLists = this.gridDataResult?.data;
    if(this.recordCountWhenSelectallClicked == 0){
      this.recordCountWhenSelectallClicked = this.gridDataResult?.total;
      this.totalGridRecordsCount = this.gridDataResult?.total;
    }
    if(!this.selectAll)
    {
    this.financialPremiumsAllPaymentsGridLists.forEach((item1: any) => {
      const matchingGridItem = this.selectedAllPaymentsList?.PrintAdviceLetterSelected.find((item2: any) => item2.paymentRequestId === item1.paymentRequestId);
      if (matchingGridItem) {
        item1.selected = true;
      } else {
        item1.selected = false;
      }
    });
  }
  this.currentPageRecords = this.financialPremiumsAllPaymentsGridLists;
  //If the user is selecting the individual check boxes and changing the page count
  this.handlePageCountSelectionChange();
  //If the user click on select all header and either changing the page number or page count
  this.pageNumberAndCountChangedInSelectAll();
  this.gridLoaderSubject.next(false);
  });
}

handlePageCountSelectionChange() {
  if(!this.selectAll && (this.isPageChanged || this.isPageCountChanged)){
    // Extract the payment request ids from grid data
    const idsToKeep: number[] = this.checkedAndUncheckedRecordsFromSelectAll.map((item: any) => item.paymentRequestId);
    // Remove items from selected records based on the IDs from grid data
    for (let i = this.selectedAllPaymentsList?.PrintAdviceLetterSelected?.length - 1; i >= 0; i--) {
      if (!idsToKeep.includes(this.selectedAllPaymentsList?.PrintAdviceLetterSelected[i].paymentRequestId)) {
        this.selectedAllPaymentsList?.PrintAdviceLetterSelected.splice(i, 1); // Remove the item at index i
      }
    }
    this.getSelectedReportCount(this.selectedAllPaymentsList?.PrintAdviceLetterSelected?.filter((item:any) => item.selected));
  }
}

pageNumberAndCountChangedInSelectAll() {
//If selecte all header checked and either the page count or the page number changed
if(this.selectAll && (this.isPageChanged || this.isPageCountChanged)){
  this.selectedAllPaymentsList = [];
  this.selectedAllPaymentsList.PrintAdviceLetterSelected = [];
  for (const item of this.financialPremiumsAllPaymentsGridLists) {
    // Check if the item is in the second list.
    const isItemInSecondList = this.unCheckedProcessRequest.find((item2 :any) => item2.paymentRequestId === item.paymentRequestId);
    // If the item is in the second list, mark it as selected true.
    if (isItemInSecondList) {
      item.selected = false;
    }else{
      item.selected = true;
    }
  }
}
}
onitemNumberClick(dataItem: any) {
  this.route.navigate(
    [`/financial-management/premiums/${this.premiumsType}/batch/items`],
    { queryParams:
      {
        bid: dataItem?.batchId,
        pid: dataItem.paymentRequestId,
        eid: dataItem.vendorId,
      }
    }
  );
}

onEditPremiumsClick(premiumId: string, vendorId: any, clientId: any, clientName: any, paymentRequestId: any) {
  this.vendorId = vendorId;
  this.clientId = clientId;
  this.clientName = clientName;
  this.premiumId = premiumId;
  this.paymentRequestId = paymentRequestId;
  this.onClickOpenEditPremiumsFromModal(this.editPremiumsDialogTemplate);
}

onClickOpenEditPremiumsFromModal(template: TemplateRef<unknown>): void {
  this.editPremiumsFormDialog = this.dialogService.open({
    content: template,
    cssClass: 'app-c-modal app-c-modal-96full add_premiums_modal',
  });
}

modalCloseEditPremiumsFormModal(result: any) {
  if (result && this.editPremiumsFormDialog) {
    this.isEditBatchClosed = false;
    this.editPremiumsFormDialog.close();
  }
}

  loadPremium(premiumId: string) {
    this.loadPremiumEvent.emit(premiumId);
  }

  updatePremium(data: any) {
    this.updatePremiumEvent.emit(data);
  }


paymentClickHandler(dataItem: any) {
  this.route.navigate(['financial-management/premiums/medical/batch/items'], {
    queryParams: { bid:  dataItem.batchId, pid: dataItem.paymentRequestId,eid:dataItem.vendorAddressId,vid:dataItem.vendorId },
  });
}

columnName: any = "";
clearIndividualSelectionOnClear(stateData: any)
  {
    if(stateData.filter?.filters.length > 0)
      {
        let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
        this.columnName = stateFilter.field;

          this.filter = stateFilter.value;

        this.isFiltered = true;
        const filterList = []
        for(const filter of stateData.filter.filters)
        {
          filterList.push(this.gridColumns[filter.filters[0].field]);
        }
        this.isFiltered =true;
        this.filteredBy =  filterList.toString();
      }
      else
      {
        this.filter = "";
        this.columnName = "";
        this.isFiltered = false
        this.selectedPaymentMethod = '';
        this.selectedPaymentStatus = '';
      }
      this.state=stateData;
      if (!this.filteredBy.includes(this.gridColumns.paymentStatusDesc)) this.selectedPaymentStatus = '';
      if (!this.filteredBy.includes(this.gridColumns.paymentMethodDesc)) this.selectedPaymentMethod = '';
  }
}
