/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {  GridDataResult } from '@progress/kendo-angular-grid';
import { DialogService } from '@progress/kendo-angular-dialog';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Observable, Subject, first, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { FilterService } from '@progress/kendo-angular-treelist/filtering/filter.service';
import { ConfigurationProvider, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import {
  PaymentStatusCode,PaymentType, PaymentMethodCode, PaymentBatchName, DrugsFacade, FinancialVendorFacade, FinancialPharmacyClaimsFacade, VendorFacade
} from '@cms/case-management/domain';
import { FinancialVendorTypeCode } from '@cms/shared/ui-common';

@Component({
  selector: 'cms-pharmacy-claims-batches-log-lists',
  templateUrl: './pharmacy-claims-batches-log-lists.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsBatchesLogListsComponent implements OnInit, OnChanges {
  @ViewChild('previewSubmitPaymentDialogTemplate', { read: TemplateRef })
  previewSubmitPaymentDialogTemplate!: TemplateRef<any>;
  @ViewChild('unBatchClaimsDialogTemplate', { read: TemplateRef })
  unBatchClaimsDialogTemplate!: TemplateRef<any>;
  @ViewChild('deleteClaimsConfirmationDialogTemplate', { read: TemplateRef })
  deleteClaimsConfirmationDialogTemplate!: TemplateRef<any>;
  @ViewChild('reverseClaimsDialogTemplate', { read: TemplateRef })
  reverseClaimsDialogTemplate!: TemplateRef<any>;
  @ViewChild('addEditClaimsDialog', { read: TemplateRef })
  addEditClaimsDialog!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isBatchLogGridLoaderShow = false;
  isRequestPaymentClicked = false;
  isPrintVisaAuthorizationClicked = false;
  isUnBatchClaimsClosed = false;
  isDeleteClaimClosed = false;
  reverseClaimsDialogClosed = false;
  isAddEditClaimMoreClose = false;
  providerDetailsDialog : any;
  PreviewSubmitPaymentDialog: any;
  printAuthorizationDialog: any;
  UnBatchDialog: any;
  deleteClaimsDialog: any;
  reverseClaimsDialog: any;
  addClientRecentClaimsDialog: any;
  addEditClaimsFormDialog: any;
  vendorId: any;
  clientId: any;
  clientName: any;
  paymentRequestId!: string;
  isLogGridExpand = true;
  isBulkUnBatchOpened =false;
  gridLoaderSubject = new BehaviorSubject(false);
  recordCountWhenSelectallClicked: number = 0;
  totalGridRecordsCount: number = 0;
  currentPageRecords: any = [];
  selectedAllPaymentsList!: any;
  isPageCountChanged: boolean = false;
  isPageChanged: boolean = false;
  unCheckedProcessRequest:any=[];
  isReconciled: boolean = false;
  deletemodelbody='This action cannot be undone, but you may add a claim at any time. This claim will not appear in a batch';

  @Input() addPharmacyClaim$: any;
  @Input() editPharmacyClaim$: any;
  @Input() getPharmacyClaim$: any;
  @Input() searchPharmacies$: any;
  @Input() searchClients$: any;
  @Input() searchDrugs$: any;
  @Input() searchPharmaciesLoader$: any;
  @Input() searchClientLoader$: any;
  @Input() searchDrugsLoader$: any;
  @Input() paymentRequestType$ : any
  @Input() deliveryMethodLov$ :any

  @Output() updatePharmacyClaimEvent = new EventEmitter<any>();
  @Output() searchPharmaciesEvent = new EventEmitter<any>();
  @Output() searchClientsEvent = new EventEmitter<any>();
  @Output() searchDrugEvent = new EventEmitter<any>();
  @Output() getCoPaymentRequestTypeLovEvent = new EventEmitter<any>();
  @Output() getDrugUnitTypeLovEvent = new EventEmitter<any>();

  @Output() unBatchEntireBatchEvent = new EventEmitter<any>();
  @Output() unBatchClaimsEvent = new EventEmitter<any>();
  @Output() ondeletebatchesClickedEvent = new EventEmitter<any>();

  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  @Output() getPharmacyClaimEvent = new EventEmitter<any>();

  @Input() batchId:any
  @Input() unbatchClaim$ :any
  @Input() unbatchEntireBatch$ :any
  @Input() deleteClaims$ :any
  @Input() exportButtonShow$ :any;
  @Input() paymentBatchName$!: Observable<PaymentBatchName>;
  public bulkMore !:any
  selected: any;
  batchStatus!:any;
  addDrug$ = this.drugsFacade.addDrug$
  manufacturersLov$ = this.financialVendorFacade.manufacturerList$;
  sortValueRecentClaimList = this.financialPharmacyClaimsFacade.sortValueRecentClaimList;
  sortRecentClaimList = this.financialPharmacyClaimsFacade.sortRecentClaimList;
  gridSkipCount = this.financialPharmacyClaimsFacade.skipCount;
  recentClaimsGridLists$ = this.financialPharmacyClaimsFacade.recentClaimsGridLists$;

  public batchLogGridActions(dataItem:any){
   return  [
    {
      buttonType: 'btn-h-primary',
      text: 'Unbatch Claim',
      icon: 'undo',
      disabled: [PaymentStatusCode.Paid, PaymentStatusCode.PaymentRequested, PaymentStatusCode.ManagerApproved].includes(dataItem.paymentStatusCode),
      click: (data: any): void => {
        if(![PaymentStatusCode.Paid, PaymentStatusCode.PaymentRequested, PaymentStatusCode.ManagerApproved].includes(data.paymentStatusCode))
        {
        if (!this.isUnBatchClaimsClosed) {
          this.isUnBatchClaimsClosed = true;
          this.selected = data;
          this.onUnBatchOpenClicked(this.unBatchClaimsDialogTemplate);
        }
      }

      }
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Claim',
      icon: 'delete',
      click: (data: any): void => {

        if (
          [
            PaymentStatusCode.Paid,
            PaymentStatusCode.PaymentRequested,
            PaymentStatusCode.ManagerApproved,
          ].includes(data.paymentStatusCode)
        ) {
          this.notificationSnackbarService.manageSnackBar(
            SnackBarNotificationType.ERROR,
            'This claim cannot be deleted',
            NotificationSource.UI
          );
        } else {
          this.isUnBatchClaimsClosed = false;
          this.isDeleteClaimClosed = true;
          this.onSingleClaimDelete(data.paymentRequestId.split(','));
          this.onDeleteClaimsOpenClicked(
            this.deleteClaimsConfirmationDialogTemplate
          );
        }

      }


    },
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Claim',
      icon: 'edit',
      click: (data: any, paymentRequestId :any): void => {
        if (!this.isAddEditClaimMoreClose) {
          this.isAddEditClaimMoreClose = true;
          this.onClickOpenAddEditClaimsFromModal(this.addEditClaimsDialog,paymentRequestId);
        }

      }

    }
  ]
}
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() batchLogGridLists$: any;
  @Input() loader$!: Observable<boolean>;
  @Output() loadBatchLogListEvent = new EventEmitter<any>();
  @Output() loadVendorRefundBatchListEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();
  @Input() claimsType: any;
  @Input() letterContentList$: any;
  @Input() letterContentLoader$: any;
  @Input() pharmacyBatchDetailProfilePhoto$!: any;
  @Output() loadTemplateEvent = new EventEmitter<any>();
  public state!: State;
  showExportLoader = false;
  sortColumn = 'paymentNbr';
  sortDir = 'Ascending';
  columnsReordered = false;
  sortColumnName = '';
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  showDateSearchWarning = false
  filter!: any;
  selectedColumn= 'ALL';
  gridDataResult!: GridDataResult;
  gridClaimsBatchLogDataSubject = new Subject<any>();
  gridClaimsBatchLogData$ = this.gridClaimsBatchLogDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  batchLogGridLists!: any;
  selectAll: boolean = false;
  unCheckedPaymentRequest: any = [];
  selectedDataIfSelectAllUnchecked: any = [];
  noOfRecordToPrint: any = 0;
  totalRecord: any;
  batchLogPrintAdviceLetterPagedList: any;
  isEdit!: boolean;
  selectedCount = 0;
  selectedDataRows: any;
  disablePrwButton = true;
  currentPrintAdviceLetterGridFilter: any;
  gridColumns: { [key: string]: string } = {
    itemNbr: 'Item #',
    vendorName: 'Pharmacy Name',
    clientFullName: 'Client Name',
    nameOnInsuranceCard: 'Name on Primary Insurance Card',
    clientId: 'Client ID',
    paymentMethodCode: 'Payment Method',
    paymentMethodDesc: 'Payment Method',
    paymentTypeCode: 'Payment Type',
    paymentTypeDesc: 'Payment Type',
    creationTime : 'Entry Date',
    paymentStatusCode: 'Payment Status',
    paymentStatusDesc: 'Payment Status',
    serviceCount: 'Service Count',
    serviceCost: 'Total Cost',
    amountPaid: 'Amount Paid',
    clientMaximum: 'Client Annual Total',
    balanceAmount: 'Client Balance',
    indexCode: 'Index Code',
    pcaCode : 'PCA Code',
    objectCode: 'Object Code',
    checkNbr :'Warrant Number'
  };
  pharmacyRecentClaimsProfilePhoto$ = this.financialPharmacyClaimsFacade.pharmacyRecentClaimsProfilePhoto$;

  paymentMethods = [PaymentMethodCode.CHECK, PaymentMethodCode.ACH, PaymentMethodCode.SPOTS];
  paymentTypes = [PaymentType.Coinsurance, PaymentType.Copayment, PaymentType.Deductible, PaymentType.FullPay];
  paymentStatusList = [
    PaymentStatusCode.Submitted,
    PaymentStatusCode.PendingApproval,
    PaymentStatusCode.Denied,
    PaymentStatusCode.ManagerApproved,
    PaymentStatusCode.PaymentRequested,
    PaymentStatusCode.Hold,
    PaymentStatusCode.Failed,
    PaymentStatusCode.Paid,
  ];

  paymentMethodFilter = '';
  paymentTypeFilter = '';
  paymentStatusFilter = '';

  dropDowncolumns: any = [
    { columnCode: 'ALL', columnDesc: 'All Columns' },
    {
      columnCode: 'itemNbr',
      columnDesc: 'Item #',
    },
    {
      columnCode: 'vendorName',
      columnDesc: 'Pharmacy Name',
    },
    {
      columnCode: 'clientFullName',
      columnDesc: 'Client Name',
    },
    {
      columnCode: 'clientId',
      columnDesc: 'Client ID',
    },
    {
      columnCode: 'paymentMethodCode',
      columnDesc: 'Payment Method',
    },
    {
      columnCode: 'paymentTypeCode',
      columnDesc: 'Payment Type',
    },
    {
      columnCode: 'creationTime',
      columnDesc: 'Entry Date',
    },
    {
      columnCode: 'paymentStatusCode',
      columnDesc: 'Payment Status',
    },
    {
      columnCode: 'indexCode',
      columnDesc: 'Index Code',
    },
    {
      columnCode: 'pca',
      columnDesc: 'PCA',
    },
    {
      columnCode: 'objectCode',
      columnDesc: 'Ojbect Code',
    },
    {
      columnCode: 'checkNbr',
      columnDesc: 'Warrant Number',
    },
    {
      columnCode: 'amountPaid',
      columnDesc: 'Amount Paid',
    },
  ]
  /** Constructor **/
  constructor(private route: Router,private dialogService: DialogService,  private readonly cdr: ChangeDetectorRef,
    private readonly configProvider: ConfigurationProvider,
    private readonly intl: IntlService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly drugsFacade: DrugsFacade,
    private readonly financialVendorFacade: FinancialVendorFacade,
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade,
    private readonly vendorFacade: VendorFacade) {}
  
  ngOnInit(): void {
    this.sortColumnName = 'Pharmacy Name';
    this.loadBatchLogListGrid();
    this.pharmacyBatchLogListSubscription();
    this.batchLogGridLists$.subscribe((res:any)=>{
      this.batchStatus = res && res.data[0].batchStatus
      this.initiateBulkMore()
    })
    this.handleBatchPaymentsGridData();
    this.vendorFacade.loadAllVendors(FinancialVendorTypeCode.Manufacturers).subscribe({
      next: (data: any) => {
        this.financialVendorFacade.manufacturerListSubject.next(data);
      }      
    });
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
        text: 'PRINT VISA AUTHORIZATIONS',
        icon: 'print',
        click: (data: any): void => {
          this.isReconciled = true;
          this.loadBatchLogListGrid();
          this.isRequestPaymentClicked = false;
          this.isPrintVisaAuthorizationClicked = true;

          },

      },
    ];
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadBatchLogListGrid();
  }

  pharmacyBatchLogListSubscription(){
    this.batchLogGridLists$.subscribe((response:any) =>{
      this.totalRecord = response.spotsPaymentsQueryCount;
      if(this.selectAll){
      this.markAsChecked(response.data);
      }
      this.batchLogPrintAdviceLetterPagedList = response;
    });
  }

  loadManufacturerEvent(event:any){
    this.vendorFacade.loadAllVendors(FinancialVendorTypeCode.Manufacturers).subscribe({
      next: (data: any) => {
        this.financialVendorFacade.manufacturerListSubject.next(data);
      }      
    });
  }

  private loadBatchLogListGrid(): void {
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
      sortColumn: this.sortColumn ?? 'vendorName',
      sortType: sortTypeValue ?? 'asc',
      filter: this.filter,
      isReconciled: this.isReconciled
    };
    this.loadBatchLogListEvent.emit(gridDataRefinerValue);
    this.filterData = this.filter;
    this.gridDataHandle();
  }

  onChange(data: any) {
    this.defaultGridState();

    const isDateSearch = data.includes('/');

    data = this.formatSearchValue(data, isDateSearch);
    if (isDateSearch && !data) return;

    let operator = 'contains';
    if (
      this.selectedColumn === 'itemNbr' ||
      this.selectedColumn === 'serviceCount' ||
      this.selectedColumn === 'serviceCost' ||
      this.selectedColumn === 'amountPaid' ||
      this.selectedColumn === 'indexCode' ||
      this.selectedColumn === 'pcaCode' ||
      this.selectedColumn === 'objectCode' ||
      this.selectedColumn === 'checkNbr' ||
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
              field: this.selectedColumn ?? 'itemNbr',
              operator: operator,
              value: data,
            },
          ],
          logic: 'and',
        },
      ],
    };

    if( this.selectedColumn === 'creationTime')
    {

      this.filterData = {
        logic: 'and',
        filters: [
          {
            filters: [
              {
                field: this.selectedColumn ?? 'itemNbr',
                operator: 'gte',
                value: data+'T01:01:00.000Z',
              },
            ],
            logic: 'and',
          },
          {
            filters: [
              {
                field: this.selectedColumn ?? 'itemNbr',
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
  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter: { logic: 'and', filters: [] },
    };
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
    this.sortColumn = stateData.sort[0]?.field;
    this.sortColumnName = this.gridColumns[this.sortColumn];
    this.filter = stateData?.filter?.filters;
    this.loadBatchLogListGrid();
    if(this.isPrintVisaAuthorizationClicked){
      this.handleBatchPaymentsGridData();
    }
  }
  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    if (field === 'paymentMethodCode') {
      this.paymentMethodFilter = value;
    } else if (field === 'paymentTypeCode') {
      this.paymentTypeFilter = value;
    } else if (field === 'paymentStatusCode') {
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
  onSingleClaimDelete(selection: any) {
    this.selected = selection;
  }
  searchColumnChangeHandler(value: string) {
    if(value === 'creationTime')
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

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.isPageCountChanged = true;
    this.isPageChanged = false;
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadBatchLogListGrid();
    if(this.isPrintVisaAuthorizationClicked){
      this.handleBatchPaymentsGridData();
    }
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  resetGrid(){
    this.defaultGridState();
    this.sortValue = 'itemNbr';
    this.sortType = 'asc';
    this.sortDir = this.sortType === 'desc' ? 'Descending' : "Ascending";
    this.filter = [];
    this.searchValue='';
    this.selectedColumn = 'ALL';
    this.filteredBy = '';
    this.sortColumnName = this.gridColumns[this.sortValue];
    this.loadBatchLogListGrid();
  }

  gridDataHandle() {
    this.batchLogGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      if( this.selectedColumn != 'ALL')
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridClaimsBatchLogDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isBatchLogGridLoaderShow = false;
      }
    });
    this.isBatchLogGridLoaderShow = false;
  }

   backToBatch(event : any){
    this.route.navigate(['/financial-management/pharmacy-claims'] );
  }

  goToBatchItems(event : any){
    this.route.navigate(['/financial-management/pharmacy-claims/batch/items'] );
  }

  navToReconcilePayments(event : any){
    this.route.navigate(['/financial-management/pharmacy-claims/batch/reconcile-payments'],
    { queryParams: { bid: this.batchId } });
  }
  public onPreviewSubmitPaymentOpenClicked(template: TemplateRef<unknown>): void {
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

  onBulkOptionCancelClicked(){
    this.isReconciled = false;
    this.isRequestPaymentClicked = false;
    this.isPrintVisaAuthorizationClicked = false;
    this.selectAll = false;
    this.selectedDataRows = [];
    this.selectedCount = 0;
    this.noOfRecordToPrint = 0;
    this.markAsUnChecked(this.batchLogPrintAdviceLetterPagedList.data);
    this.markAsUnChecked(this.selectedDataIfSelectAllUnchecked);
    this.unCheckedPaymentRequest=[];
    this.selectedDataIfSelectAllUnchecked=[];
    this.loadBatchLogListGrid();
  }

  onPrintAuthorizationOpenClicked(template: TemplateRef<unknown>): void {
    this.selectedDataRows.currentPrintAdviceLetterGridFilter = JSON.stringify(
      this.currentPrintAdviceLetterGridFilter
    );
    this.printAuthorizationDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-96full pharmacy_print_auth',
    });
  }


  onPrintAuthorizationCloseClicked(result: any) {
    if (result) {
      this.printAuthorizationDialog.close();
    }
  }


  onUnBatchOpenClicked(template: TemplateRef<unknown>): void {
    this.UnBatchDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }


  onUnBatchPaymentCloseClicked(result: any) {
    if (result) {
      if (this.isBulkUnBatchOpened) {
        this.handleUnbatchEntireBatch();
        this.unBatchEntireBatchEvent.emit({
         batchId: this.batchId
      });
      } else {
        this.handleUnbatchClaims();
        this.unBatchClaimsEvent.emit({
          paymentId : this.selected.paymentRequestId,
        })
      }
    }
    this.isBulkUnBatchOpened = false;
    this.isUnBatchClaimsClosed = false;
    this.UnBatchDialog.close();
  }

  handleUnbatchClaims() {
    this.unbatchClaim$
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
         this.backToBatch(null)
          this.loadBatchLogListGrid();
        }
      });
  }
  onModalBatchDeletingClaimsButtonClicked(action: any) {

    this.ondeletebatchesClickedEvent.emit(this.selected)
    this.deleteClaims$.subscribe((_:any) =>{

      this.isDeleteClaimClosed = false;
      this.deleteClaimsDialog.close();
      this.loadBatchLogListGrid();
    })


  }

  onClientClicked(clientId: any) {
    this.route.navigate([`/case-management/cases/case360/${clientId}`]);
    this.addClientRecentClaimsDialog.close();
  }
  public onDeleteClaimsOpenClicked(template: TemplateRef<unknown>): void {
    this.deleteClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onModalDeleteClaimsModalClose(result: any) {
    if (result) {
      this.deleteClaimsDialog.close();
    }
  }


  clientRecentClaimsModalClicked(
    template: TemplateRef<unknown> ,
    data:any): void {
    this.addClientRecentClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal  app-c-modal-bottom-up-modal',
      animation: {
        direction: 'up',
        type: 'slide',
        duration: 200,
      },
    });

    this.vendorId = data.vendorId;
    this.clientId = data.clientId;
    this.clientName = data.clientFullName;
  }

  closeRecentClaimsModal(result: any) {
    if (result) {
      this.addClientRecentClaimsDialog.close();
    }
  }

  onViewProviderDetailClicked(template: TemplateRef<unknown>): void {
    this.providerDetailsDialog = this.dialogService.open({
      content: template,
      animation: {
        direction: 'left',
        type: 'slide',
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });
  }

  onCloseViewProviderDetailClicked(result: any) {
    if (result) {
      this.providerDetailsDialog.close();
    }
  }


  public onReverseClaimsOpenClicked(template: TemplateRef<unknown>): void {
    this.reverseClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onCloseReverseClaimsClickedEventClicked(result: any) {
    if (result) {
      this.reverseClaimsDialogClosed = false;
      this.reverseClaimsDialog.close();
    }
  }

  onClickOpenAddEditClaimsFromModal(template: TemplateRef<unknown>, paymentRequestId:any): void {
    if(paymentRequestId !== '00000000-0000-0000-0000-000000000000')
    {
    this.getPharmacyClaimEvent.emit(paymentRequestId);
    }
    this.addEditClaimsFormDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-full add_claims_modal',
    });
  }
  modalCloseAddEditClaimsFormModal(result: any) {
    if (result) {
      this.isAddEditClaimMoreClose = false;
      this.addEditClaimsFormDialog.close();
    }
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

  selectionAllChange(){
    this.unCheckedPaymentRequest=[];
    this.selectedDataIfSelectAllUnchecked=[];
    if(this.selectAll){
      this.markAsChecked(this.batchLogPrintAdviceLetterPagedList?.data);
      this.noOfRecordToPrint = this.totalRecord;
      this.selectedCount = this.noOfRecordToPrint;
    }
    else{
      this.markAsUnChecked(this.batchLogPrintAdviceLetterPagedList?.data);
      this.noOfRecordToPrint = 0;
      this.selectedCount = this.noOfRecordToPrint
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
        let itemMarkedAsUnChecked=   this.unCheckedPaymentRequest.find((x:any)=>x.paymentRequestId ===element.paymentRequestId);
        if(itemMarkedAsUnChecked !== null && itemMarkedAsUnChecked !== undefined){
          element.selected = false;
        }
        let itemMarkedAsChecked = this.selectedDataIfSelectAllUnchecked.find((x:any)=>x.paymentRequestId ===element.paymentRequestId);
        if(itemMarkedAsChecked !== null && itemMarkedAsChecked !== undefined){
          element.selected = true;
        }
      }

    });
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

  disablePreviewButton(result: any) {
    this.selectedDataRows = result;
    this.selectedDataRows.batchId = this.batchId;
    if (result.selectAll) {
      this.disablePrwButton = false;
    } else if (result.PrintAdviceLetterSelected.length > 0) {
      this.disablePrwButton = false;
    } else {
      this.disablePrwButton = true;
    }
  }

  selectUnSelectPayment(dataItem: any) {
    if (!dataItem.selected) {
      const exist = this.selectedDataRows.PrintAdviceLetterUnSelected.filter(
        (x: any) => x.vendorAddressId === dataItem.vendorAddressId
      ).length;
      if (exist === 0) {
        this.selectedDataRows.PrintAdviceLetterUnSelected.push({
          paymentRequestId: dataItem.paymentRequestId,
          vendorAddressId: dataItem.vendorAddressId,
          selected: true,
        });
      }
      this.selectedDataRows?.PrintAdviceLetterSelected?.forEach(
        (element: any) => {
          if (element.paymentRequestId === dataItem.paymentRequestId) {
            element.selected = false;
          }
        }
      );
    } else {
      this.selectedDataRows.PrintAdviceLetterUnSelected.forEach(
        (element: any) => {
          if (element.paymentRequestId === dataItem.paymentRequestId) {
            element.selected = false;
          }
        }
      );
      const exist = this.selectedDataRows.PrintAdviceLetterSelected.filter(
        (x: any) => x.vendorAddressId === dataItem.vendorAddressId
      ).length;
      if (exist === 0) {
        this.selectedDataRows.PrintAdviceLetterSelected.push({
          paymentRequestId: dataItem.paymentRequestId,
          vendorAddressId: dataItem.vendorAddressId,
          selected: true,
        });
      }
    }
   }

   loadEachLetterTemplate(event:any){
    this.loadTemplateEvent.emit(event);
  }
  onProviderNameClick(event: any) {
    this.onProviderNameClickEvent.emit(event);
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
      if(this.recordCountWhenSelectallClicked == 0){
        this.recordCountWhenSelectallClicked = this.gridDataResult?.total;
        this.totalGridRecordsCount = this.gridDataResult?.total;
      }
      if(!this.selectAll)
      {
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
    if(!this.selectAll && (this.isPageChanged || this.isPageCountChanged)){
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
  if(this.selectAll && (this.isPageChanged || this.isPageCountChanged)){
    this.selectedAllPaymentsList = [];
    this.selectedAllPaymentsList.PrintAdviceLetterSelected = [];
    for (const item of this.batchLogGridLists) {
      // Check if the item is in the second list.
      const isItemInSecondList = this.unCheckedPaymentRequest.find((item2 :any) => item2.paymentRequestId === item.paymentRequestId);
      // If the item is in the second list, mark it as selected true.
      if (isItemInSecondList) {
        item.selected = false;
      }else{
        item.selected = true;
      }
    }
  }
}

updatePharmacyClaim(data: any) {
  this.updatePharmacyClaimEvent.emit(data);
  this.editPharmacyClaim$.pipe(first((editResponse: any ) => editResponse != null))
  .subscribe((editResponse: any) =>
  {
    if(editResponse)
    {
      this.loadBatchLogListGrid();
      this.modalCloseAddEditClaimsFormModal(true)
    }

  })
}

searchPharmacies(searchText: any) {
  this.searchPharmaciesEvent.emit(searchText);
}

searchClients(searchText: any) {
  this.searchClientsEvent.emit(searchText);
}


searchDrug(searchText: string) {
  this.searchDrugEvent.emit(searchText);
}

getCoPaymentRequestTypeLov()
{
  this.getCoPaymentRequestTypeLovEvent.emit();
}

getDrugUnitTypeLov()
{
  this.getDrugUnitTypeLovEvent.emit();
}

addDrugEventHandler(event:any){
  this.drugsFacade.addDrugData(event);
}

searchClientsDataEventHandler(client:any){
  this.financialPharmacyClaimsFacade.searchClientsDataSubject.next(client);
}

searchPharmacyDataEventHandler(vendor:any){
  this.financialPharmacyClaimsFacade.searchPharmaciesDataSubject.next(vendor)
}

loadRecentClaimListEventHandler(data : any){
  this.financialPharmacyClaimsFacade.loadRecentClaimListGrid(data);
}

}
