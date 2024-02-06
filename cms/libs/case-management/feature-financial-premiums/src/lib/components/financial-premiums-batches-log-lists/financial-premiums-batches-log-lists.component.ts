/** Angular **/
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
import { ActivatedRoute, Router } from '@angular/router';
import { BatchStatusCode, InsurancePremiumDetails, PaymentBatchName, PaymentStatusCode } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import { IntlService } from '@progress/kendo-angular-intl';
import { CompositeFilterDescriptor, State, filterBy, } from '@progress/kendo-data-query';
import { BehaviorSubject, Observable, Subject, Subscription, first } from 'rxjs';
@Component({
  selector: 'cms-financial-premiums-batches-log-lists',
  templateUrl: './financial-premiums-batches-log-lists.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsBatchesLogListsComponent
  implements OnInit, OnChanges  {
  @ViewChild('previewSubmitPaymentDialogTemplate', { read: TemplateRef })
  previewSubmitPaymentDialogTemplate!: TemplateRef<any>;
  @ViewChild('unBatchPaymentPremiumsDialogTemplate', { read: TemplateRef })
  unBatchPaymentPremiumsDialogTemplate!: TemplateRef<any>;
  @ViewChild('removePremiumsConfirmationDialogTemplate', { read: TemplateRef })
  removePremiumsConfirmationDialogTemplate!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  showDateSearchWarning = false
  yesOrNoLov$ = this.lovFacade.yesOrNoLov$;
  isBatchLogGridLoaderShow = false;
  isRequestPaymentClicked = false;
  isSendReportOpened = false;
  isUnBatchPaymentPremiumsClosed = false;
  PreviewSubmitPaymentDialog: any;
  UnBatchPaymentDialog: any;
  removePremiumsDialog: any;
  addClientRecentPremiumsDialog: any;
  acceptReportValue = null
  vendorId: any;
  clientId: any;
  clientName: any = "";
  totalPaymentsCount = 0;
  totalReconciled = 0;
  isPageCountChanged: boolean = false;
  isPageChanged: boolean = false;
  yesOrNoLovs: any = [];
  onlyPrintAdviceLetter = true;
  printAuthorizationDialog: any;
  selectedDataRows: any;
  isLogGridExpand = true;
  paymentId!: any;
  showDeleteConfirmation = false;
  private actionResponseSubscription: Subscription | undefined;
  isBulkUnBatchOpened = false;
  @Input() unbatchPremiums$ :any
  @Input() unbatchEntireBatch$ :any
  @Input() letterContentList$ :any;
  @Input() letterContentLoader$ :any;
  @Input() paymentByBatchGridLoader$!: Observable<boolean>;
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  @Output() loadTemplateEvent = new EventEmitter<any>();
  selected:any
  private editPremiumsFormDialog: any;
  currentPrintAdviceLetterGridFilter: any;
  isPrintAdviceLetterClicked = false;
  selectAll = false;
  unCheckedPaymentRequest:any=[];
  selectedDataIfSelectAllUnchecked:any=[];
  currentGridFilter:any;
  totalRecord:any;
  noOfRecordToPrint:any = 0;
  batchLogPrintAdviceLetterPagedList:any;
  @ViewChild('editPremiumsDialogTemplate', { read: TemplateRef })
  editPremiumsDialogTemplate!: TemplateRef<any>;
  isEditBatchClosed =false;
  premiumId!:string;
  paymentRequestId!:any
  gridLoaderSubject = new BehaviorSubject(false);
  unCheckedProcessRequest: any = [];
  batchLogGridLists!: any;
  recordCountWhenSelectallClicked: number = 0;
  totalGridRecordsCount: number = 0;
  currentPageRecords: any = [];
  selectedAllPaymentsList!: any;
    @Output() updatePremiumEvent = new EventEmitter<any>();
    @Output() loadPremiumEvent = new EventEmitter<string>();


  public batchLogGridActions(dataItem:any){
   return [
    {
      buttonType: 'btn-h-primary',
      text: 'Unbatch Premium',
      icon: 'undo',
      disabled: [PaymentStatusCode.Paid, PaymentStatusCode.PaymentRequested, PaymentStatusCode.ManagerApproved].includes(dataItem.paymentStatusCode),
      click: (data: any): void => {
        if(![PaymentStatusCode.Paid, PaymentStatusCode.PaymentRequested, PaymentStatusCode.ManagerApproved].includes(data.paymentStatusCode) && !this.isUnBatchPaymentPremiumsClosed)
      {
          this.isUnBatchPaymentPremiumsClosed = true;
          this.selected = data;
          this.onUnBatchPaymentOpenClicked(this.unBatchPaymentPremiumsDialogTemplate);
      }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Remove Premium',
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
      disabled: PaymentStatusCode.Denied !== dataItem.paymentStatusCode,
      click: (data: any): void => {
        if (!this.isEditBatchClosed) {
          this.isEditBatchClosed = true;
          this.onEditPremiumsClick(data?.insurancePremiumId,data?.vendorId,data?.clientId,data.clientFullName, data?.paymentRequestId);
        }
      },
    }
  ];
}


  dropDowncolumns: any = [
    { columnCode: 'ALL', columnDesc: 'All Columns' },
    {
      columnCode: 'itemNbr',
      columnDesc: 'Item #',
    },
    {
      columnCode: 'vendorName',
      columnDesc: 'Insurance Vendor',
    },
    {
      columnCode: 'serviceCount',
      columnDesc: 'Item Count',
    },
    {
      columnCode: 'serviceCost',
      columnDesc: 'Total Amount',
    },
    {
      columnCode: 'acceptsReports',
      columnDesc: 'Accepts Reports?',
    },
    {
      columnCode: 'paymentRequestedDate',
      columnDesc: 'Date Pmt. Requested',
    },
    {
      columnCode: 'paymentSentDate',
      columnDesc: 'Date Pmt. Sent',
    },
    {
      columnCode: 'paymentMethodCode',
      columnDesc: 'Pmt. Method',
    },
    {
      columnCode: 'paymentStatusCodeDesc',
      columnDesc: 'Pmt. Status',
    },
    {
      columnCode: 'pca',
      columnDesc: 'PCA',
    },
    {
      columnCode: 'mailCode',
      columnDesc: 'Mail Code',
    },
  ]
  columns: any = {
    ALL: 'All Columns',
    itemNbr: "Item #",
    vendorName: "Insurance Vendor",
    serviceCount: "Item Count",
    serviceCost: "Total Amount",
    acceptsReports: "Accepts Reports?",
    paymentRequestedDate: "Date Pmt. Requested",
    paymentSentDate: "Date Pmt. Sent",
    paymentMethodCode: "Pmt. Method",
    paymentStatusCodeDesc: "Pmt. Status",
    pca: "PCA",
    mailCode: "Mail Code"
  }
  @Input() premiumsType: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() batchLogGridLists$: any;
  @Input() batchLogServicesData$: any;
  @Output() loadBatchLogListEvent = new EventEmitter<any>();
  @Input() batchId: any;
  @Input() exportButtonShow$: any
  @Input() actionResponse$: any;
  @Input() paymentBatchName$!: Observable<PaymentBatchName>;
  batchStatus = PaymentStatusCode.PendingApproval
  @Output() loadVendorRefundBatchListEvent = new EventEmitter<any>();
  @Output() loadFinancialPremiumBatchInvoiceListEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();
  @Output() unBatchEntireBatchEvent = new EventEmitter<any>();
  @Output() unBatchPremiumEvent = new EventEmitter<any>();
  @Output() deletePaymentEvent = new EventEmitter();

  public state!: State;
  showExportLoader = false;
  sortColumn = 'Item #';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn: null | string = 'ALL';
  gridDataResult!: GridDataResult;
  gridPremiumsBatchLogDataSubject = new Subject<any>();
  gridPremiumsBatchLogData$ = this.gridPremiumsBatchLogDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  sendReportDialog: any;
  selectedCount = 0;
  disablePrwButton = true;
  public bulkMore !:any
  isReconciled: boolean = false;
  batchLogListSubscription!: Subscription;
  @Input() insuranceCoverageDates$: any;
  @Input() insurancePremium$!: Observable<InsurancePremiumDetails>;
  /** Constructor **/
  constructor(private route: Router, private dialogService: DialogService,
    public activeRoute: ActivatedRoute, private readonly lovFacade: LovFacade,
    private readonly cdr: ChangeDetectorRef,
    private readonly configProvider: ConfigurationProvider,
    private readonly intl: IntlService,) { }

  ngOnInit(): void {
    this.loadBatchLogListGrid();
    this.lovFacade.getYesOrNoLovs();
    this.loadYesOrNoLovs();
    this.addActionRespSubscription();
    this.batchLogListItemsSubscription();
    this.batchLogGridLists$.subscribe((data:GridDataResult) =>{
      this.totalPaymentsCount=data.total;
      this.totalReconciled = 0;
        data.data.forEach(item =>{
          if([PaymentStatusCode.Paid, PaymentStatusCode.PaymentRequested, PaymentStatusCode.ManagerApproved].includes(item.paymentStatusCode)){
            this.batchStatus = item.paymentStatusCode
           }
          if(item.paymentStatusCode == BatchStatusCode.Paid){
            this.totalReconciled += 1;
          }

        })   
        this.initiateBulkMore()  
    })
  }

  initiateBulkMore() {
     this.bulkMore = [
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
          this.isReconciled = true;
          this.loadBatchLogListGrid();
          this.isRequestPaymentClicked = false;
          this.isPrintAdviceLetterClicked = true;
        },
      },
      {
        buttonType: 'btn-h-primary',
        text: 'UNBATCH ENTIRE BATCH',
        icon: 'undo',
        disabled: [
          PaymentStatusCode.Paid,
          PaymentStatusCode.PaymentRequested,
          PaymentStatusCode.ManagerApproved,
        ].includes(this.batchStatus),
        click: (data: any): void => {
          if (!this.isBulkUnBatchOpened) {
            this.isBulkUnBatchOpened = true;
            this.onUnBatchPaymentOpenClicked(this.unBatchPaymentPremiumsDialogTemplate);
          }
        },
      }
    ];
   }
  onEditPremiumsClick(premiumId: string,vendorId:any,clientId:any,clientName:any,paymentRequestId:any){
    this.vendorId=vendorId;
    this.clientId=clientId;
    this.clientName=clientName;
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

  batchLogListItemsSubscription() {
    this.batchLogListSubscription = this.batchLogGridLists$.subscribe((response:any) =>{
      this.totalRecord = response?.acceptsReportsCount;
      if(this.selectAll){
      this.markAsChecked(response.data);
      }
      this.batchLogPrintAdviceLetterPagedList = response;
    })
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadBatchLogListGrid();
    this.unsubscribeFromActionResponse();
  }

  ngOnDestroy(): void {
    this.batchLogListSubscription.unsubscribe();
  }

  setDisablePropertyOfBulkMore(dataItem : any){
  return dataItem.text=='Unbatch Entire Batch' 
  }

  loadFinancialPremiumBatchInvoiceList(data: any) {
    this.loadFinancialPremiumBatchInvoiceListEvent.emit(data)
  }

  private loadBatchLogListGrid(): void {
    this.isBatchLogGridLoaderShow = true;
    this.loadBatchLog(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadBatchLog(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isBatchLogGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue ?? 'itemNbr',
      sortType: sortTypeValue ?? 'asc',
      filter: this.state?.['filter']?.['filters'] ?? [],
      isReconciled: this.isReconciled
    };
    this.loadBatchLogListEvent.emit(gridDataRefinerValue);
    this.currentPrintAdviceLetterGridFilter = this.state?.['filter']?.['filters'] ?? [];
    this.gridDataHandle();
  }

  searchColumnChangeHandler(value: string) {

    if(value === 'paymentRequestedDate' || value === 'paymentSentDate')
    {
      this.showDateSearchWarning = true
    }
    else
    {
      this.showDateSearchWarning = false
    }
    this.filter = [];

    if (this.searchValue) {
      this.onChange(this.searchValue);
    }
  }

  onChange(data: any) {
    this.defaultGridState();

    const isDateSearch = data.includes('/');

    data = this.formatSearchValue(data, isDateSearch);
    if (isDateSearch && !data) return;

    let operator = 'startswith';
    if (
      this.selectedColumn === 'itemNbr' ||
      this.selectedColumn === 'serviceCount' ||
      this.selectedColumn === 'serviceCost' ||
      this.selectedColumn === 'amountDue' ||
      this.selectedColumn === 'balanceAmount'
    ) {
      operator = 'eq';
    }

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'ALL',
              operator: operator,
              value: data,
            },
          ],
          logic: 'and',
        },
      ],
    };

    if( this.selectedColumn === 'paymentRequestedDate'||
    this.selectedColumn === 'paymentSentDate')
    {

      this.filterData = {
        logic: 'and',
        filters: [
          {
            filters: [
              {
                field: this.selectedColumn ?? 'ALL',
                operator: 'gte',
                value: data+'T01:01:00.000Z',
              },
            ],
            logic: 'and',
          },
          {
            filters: [
              {
                field: this.selectedColumn ?? 'ALL',
                operator: 'lte',
                value: data+'T23:59:00.000Z',
              },
            ],
            logic: 'and',
          }
        ],
      };
    }


    const stateData = this.state;
    stateData.filter = this.filterData;
    this.dataStateChange(stateData);
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
    this.isPageCountChanged = false;
    this.isPageChanged = true;
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';

    this.sortColumn = this.columns[stateData.sort[0]?.field];

    if (stateData.filter?.filters.length > 0) {
      const stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.filter = stateFilter.value;
      this.isFiltered = true;
      const filterList = [];
      for (const filter of stateData.filter.filters) {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.filteredBy = filterList.toString();
    } else {
      this.filter = '';
      this.isFiltered = false;
    }
    this.loadBatchLogListGrid();
    if (this.isPrintAdviceLetterClicked) {
      this.handleBatchPaymentsGridData();
    }
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.isPageCountChanged = true;
    this.isPageChanged = false;
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadBatchLogListGrid();
    if (this.isPrintAdviceLetterClicked) {
      this.handleBatchPaymentsGridData();
    }
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.batchLogGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridPremiumsBatchLogDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isBatchLogGridLoaderShow = false;
      }
      this.isBatchLogGridLoaderShow = false;
    });
  }

  backToBatch(event: any) {
    this.route.navigate(['/financial-management/premiums/' + this.premiumsType]);
  }

  goToBatchItems(event: any) {
    this.route.navigate(['/financial-management/premiums/' + this.premiumsType + '/batch/items']);
  }

  navToReconcilePayments(event : any){
    this.route.navigate([`/financial-management/premiums/${this.premiumsType}/batch/reconcile-payments`],
    { queryParams :{bid: this.batchId}});
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
    this.isReconciled = false;
    this.selectAll = false;
    this.isRequestPaymentClicked = false;
    this.isPrintAdviceLetterClicked = false;
    this.isSendReportOpened = false;
    this.selectedCount = 0;
    this.noOfRecordToPrint = 0;
    this.markAsUnChecked(this.batchLogPrintAdviceLetterPagedList.data);
    this.markAsUnChecked(this.selectedDataIfSelectAllUnchecked);
    this.unCheckedPaymentRequest=[];
    this.selectedDataIfSelectAllUnchecked=[];
    this.loadBatchLogListGrid();
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

  onUnBatchPaymentCloseClicked(result: any) {
    if (result) {
      if (this.isBulkUnBatchOpened) {
        this.handleUnbatchEntireBatch();
        this.unBatchEntireBatchEvent.emit({
         batchId: {paymentRequestBatchId: this.batchId},
         premiumsType: this.premiumsType
      });
      } else {
        this.handleUnbatchClaims();
        this.unBatchPremiumEvent.emit({
          paymentId : [this.selected.paymentRequestId],
          premiumsType: this.premiumsType
        })
      }
    }
    this.isBulkUnBatchOpened = false;
    this.isUnBatchPaymentPremiumsClosed = false;
    this.UnBatchPaymentDialog.close();
  }

  handleUnbatchClaims() {
    this.unbatchPremiums$
      .pipe(first((unbatchResponse: any) => unbatchResponse != null))
      .subscribe((unbatchResponse: any) => {
        if (unbatchResponse ?? false) {
          this.loadBatchLogListGrid();
        }
      });
  }

  handleUnbatchEntireBatch() {
    this.unbatchEntireBatch$
      .pipe(
        first(
          (unbatchEntireBatchResponse: any) =>
            unbatchEntireBatchResponse != null
        )
      )
      .subscribe((unbatchEntireBatchResponse: any) => {
        if (unbatchEntireBatchResponse ?? false) {
          this.loadBatchLogListGrid();
          this.backToBatch(null)
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
      this.removePremiumsDialog?.close();
    }
  }

  deletePremiumPayment(paymentId: string) {
    this.deletePaymentEvent.emit(this.paymentId);
  }

  closeRecentPremiumsModal(result: any) {
    if (result) {
      this.addClientRecentPremiumsDialog.close();
    }
  }

  private loadYesOrNoLovs() {
    this.yesOrNoLov$
      .subscribe({
        next: (data: any) => {
          this.yesOrNoLovs = data;
        }
      });
  }

  dropdownFilterChange(field: string, value: any, filterService: FilterService): void {

    this.acceptReportValue = value
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: field,
              operator: 'eq',
              value: value?.lovCode,
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

  setToDefault() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.sortColumn = 'Item #';
    this.sortDir = 'Ascending';
    this.filter = '';
    this.searchValue = '';
    this.selectedColumn = 'ALL'
    this.isFiltered = false;
    this.columnsReordered = false;
    this.sortValue = 'itemNbr';
    this.sortType = 'asc';
    this.sort = this.sortColumn;

    this.loadBatchLogListGrid();
  }

  onPrintAuthorizationCloseClicked(result: any) {
    if (result) {
      this.printAuthorizationDialog.close();
    }
  }

  onClientClicked(clientId: any) {
    this.route.navigate([`/case-management/cases/case360/${clientId}`]);
    this.closeRecentPremiumsModal(true);
  }

  onClickedExport() {
    this.showExportLoader = true
    this.exportGridDataEvent.emit()

    this.exportButtonShow$
      .subscribe((response: any) => {
        if (response) {
          this.showExportLoader = false
          this.cdr.detectChanges()
        }

      })
  }

  /* Private Methods */
  private addActionRespSubscription() {
    this.actionResponseSubscription = this.actionResponse$.subscribe((resp: boolean) => {
      if (resp) {
        this.onModalRemovePremiumsModalClose(true);
        this.modalCloseEditPremiumsFormModal(true);
        this.loadBatchLogListGrid();
      }
    });
  }

  paymentClickHandler(dataItem: any) {
    const batchId = this.activeRoute.snapshot.queryParams['bid'];
    this.route.navigate([this.route.url.split('?')[0], 'items'], {
      queryParams: { bid: batchId, pid: dataItem.paymentRequestId,eid:dataItem.vendorAddressId,vid:dataItem.vendorId },
    });
  }

  onProviderNameClick(event:any){
    this.onProviderNameClickEvent.emit(event);
  }

  loadPrintAdviceLetterEvent(event:any){
    this.currentPrintAdviceLetterGridFilter = event.filter;
    this.loadBatchLogListEvent.emit(event);
  }

  onPrintAuthorizationOpenClicked(template: TemplateRef<unknown>): void {
    this.selectedDataRows.currentPrintAdviceLetterGridFilter = JSON.stringify(this.currentPrintAdviceLetterGridFilter);
    this.printAuthorizationDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-xlg',
    });
  }

  selectUnSelectPayment(dataItem: any) {
    if (!dataItem.selected) {
      const exist = this.selectedDataRows.PrintAdviceLetterUnSelected.filter((x: any) => x.vendorAddressId === dataItem.vendorAddressId).length;
      if (exist === 0) {
        this.selectedDataRows.PrintAdviceLetterUnSelected.push({ 'paymentRequestId': dataItem.paymentRequestId, 'vendorAddressId': dataItem.vendorAddressId, 'selected': true });
      }
        this.selectedDataRows?.PrintAdviceLetterSelected?.forEach((element: any) => {
          if (element.paymentRequestId === dataItem.paymentRequestId) {
            element.selected = false;
          }
        });
    }
    else {
      this.selectedDataRows.PrintAdviceLetterUnSelected.forEach((element: any) => {
        if (element.paymentRequestId === dataItem.paymentRequestId) {
          element.selected = false;
        }
      });
        const exist = this.selectedDataRows.PrintAdviceLetterSelected.filter((x: any) => x.vendorAddressId === dataItem.vendorAddressId).length;
        if (exist === 0) {
          this.selectedDataRows.PrintAdviceLetterSelected.push({ 'paymentRequestId': dataItem.paymentRequestId, 'vendorAddressId': dataItem.vendorAddressId, 'selected': true });
        }
    }
  }

  disablePreviewButton(result: any) {
    this.selectedDataRows = result;
    this.selectedDataRows.batchId = this.batchId
    if(result.selectAll && this.batchLogPrintAdviceLetterPagedList.data?.length > 0){
      this.disablePrwButton = false;
    }
    else if(result.PrintAdviceLetterSelected.length>0)
    {
      this.disablePrwButton = false;
    }
    else
    {
      this.disablePrwButton = true;
    }
  }

  setNoOfRecordToBePrint(NoOfRecordToBePrint:any){
    this.selectedCount = NoOfRecordToBePrint;
  }

  selectionAllChange(){
    this.unCheckedPaymentRequest=[];
    this.selectedDataIfSelectAllUnchecked=[];
    if(this.selectAll){
      this.markAsChecked(this.batchLogPrintAdviceLetterPagedList?.data);
      this.noOfRecordToPrint = this.totalRecord;
      this.selectedCount = this.noOfRecordToPrint;
    }
    else{
      this.markAsUnChecked(this.batchLogPrintAdviceLetterPagedList.data);
      this.noOfRecordToPrint = 0; 
      this.selectedCount = this.noOfRecordToPrint
    }
    this.selectedAllPaymentsList = {'selectAll':this.selectAll,'PrintAdviceLetterUnSelected':this.unCheckedPaymentRequest,
    'PrintAdviceLetterSelected':this.selectedDataIfSelectAllUnchecked,'print':true,
    'batchId':null,'currentPrintAdviceLetterGridFilter':null,'requestFlow':'print', 'isReconciled': this.isReconciled}
    this.disablePreviewButton(this.selectedAllPaymentsList);
  }

  selectionChange(dataItem:any,selected:boolean){
    if(!selected){
      this.noOfRecordToPrint = this.noOfRecordToPrint - 1;
      this.selectedCount = this.noOfRecordToPrint
      this.unCheckedPaymentRequest.push({'paymentRequestId':dataItem.paymentRequestId,'vendorAddressId':dataItem.vendorAddressId,'selected':true,'batchId':dataItem.batchId, 'checkNbr':dataItem.checkNbr});
      if(!this.selectAll){
      this.selectedDataIfSelectAllUnchecked = this.selectedDataIfSelectAllUnchecked.filter((item:any) => item.paymentRequestId !== dataItem.paymentRequestId);

      }
    }
    else{
      this.noOfRecordToPrint = this.noOfRecordToPrint + 1;
      this.selectedCount = this.noOfRecordToPrint
      this.unCheckedPaymentRequest = this.unCheckedPaymentRequest.filter((item:any) => item.paymentRequestId !== dataItem.paymentRequestId);
      if(!this.selectAll){
      this.selectedDataIfSelectAllUnchecked.push({'paymentRequestId':dataItem.paymentRequestId,'vendorAddressId':dataItem.vendorAddressId,'selected':true,'batchId':dataItem.batchId, 'checkNbr':dataItem.checkNbr});
      }
    }
    this.selectedAllPaymentsList = {'selectAll':this.selectAll,'PrintAdviceLetterUnSelected':this.unCheckedPaymentRequest,
    'PrintAdviceLetterSelected':this.selectedDataIfSelectAllUnchecked,'print':true,
    'batchId':null,'currentPrintAdviceLetterGridFilter':null,'requestFlow':'print', 'isReconciled': this.isReconciled}
    this.disablePreviewButton(this.selectedAllPaymentsList);
  }

  markAsUnChecked(data:any){
    data.forEach((element:any) => {
      element.selected = false;
   });
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

  loadEachLetterTemplate(event:any){
    this.loadTemplateEvent.emit(event);
  }

  clientRecentClaimsModalClicked(
    template: TemplateRef<unknown>,
    dataItem: any,
    event:any
  ): void {
    this.addClientRecentPremiumsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal  app-c-modal-bottom-up-modal',
      animation: {
        direction: 'up',
        type: 'slide',
        duration: 200,
      },
    });
    this.vendorId=dataItem.vendorId;
    this.clientId=event.clientId;
    this.clientName=event.clientFullName;
  }

  updatePremium(data: any){
    this.updatePremiumEvent.emit(data);
  }

  loadPremium(data:any){
    this.loadPremiumEvent.emit(data)
  }

  private unsubscribeFromActionResponse() {
    if (this.actionResponseSubscription) {
      this.actionResponseSubscription.unsubscribe();
    }
  }

  handleBatchPaymentsGridData() {
    this.batchLogGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      if (data?.total >= 0 || data?.total === -1) {
        this.gridLoaderSubject.next(false);
      }
      this.batchLogGridLists = this.gridDataResult?.data;
      if (this.recordCountWhenSelectallClicked == 0) {
        this.recordCountWhenSelectallClicked = this.gridDataResult?.total;
        this.totalGridRecordsCount = this.gridDataResult?.total;
      }
      if (!this.selectAll) {
        this.batchLogGridLists.forEach((item1: any) => {
          const matchingGridItem = this.selectedAllPaymentsList?.PrintAdviceLetterSelected.find((item2: any) => item2.paymentRequestId === item1.paymentRequestId);
          if (matchingGridItem) {
            item1.selected = true;
          } else {
            item1.selected = false;
          }
        });
      }
      this.currentPageRecords = this.batchLogGridLists;
      //If the user is selecting the individual check boxes and changing the page count
      this.handlePageCountSelectionChange();
      //If the user click on select all header and either changing the page number or page count
      this.pageNumberAndCountChangedInSelectAll();
      this.gridLoaderSubject.next(false);
    });
  }

  handlePageCountSelectionChange() {
    if (!this.selectAll && (this.isPageChanged || this.isPageCountChanged)) {
      // Extract the payment request ids from grid data
      const idsToKeep: number[] = this.selectedDataIfSelectAllUnchecked.map((item: any) => item.paymentRequestId);
      // Remove items from selected records based on the IDs from grid data
      for (let i = this.selectedAllPaymentsList?.PrintAdviceLetterSelected?.length - 1; i >= 0; i--) {
        if (!idsToKeep.includes(this.selectedAllPaymentsList?.PrintAdviceLetterSelected[i].paymentRequestId)) {
          this.selectedAllPaymentsList?.PrintAdviceLetterSelected.splice(i, 1); // Remove the item at index i
        }
      }
    }
  }

  pageNumberAndCountChangedInSelectAll() {
    //If selecte all header checked and either the page count or the page number changed
    if (this.selectAll && (this.isPageChanged || this.isPageCountChanged)) {
      this.selectedAllPaymentsList = [];
      this.selectedAllPaymentsList.PrintAdviceLetterSelected = [];
      for (const item of this.batchLogGridLists) {
        // Check if the item is in the second list.
        const isItemInSecondList = this.unCheckedPaymentRequest.find((item2: any) => item2.paymentRequestId === item.paymentRequestId);
        // If the item is in the second list, mark it as selected true.
        if (isItemInSecondList) {
          item.selected = false;
        } else {
          item.selected = true;
        }
      }
    }
  }
}
