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
import { FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import { DialogService } from '@progress/kendo-angular-dialog';
import { CompositeFilterDescriptor, State, } from '@progress/kendo-data-query';
import { Subject, first, Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LovFacade } from '@cms/system-config/domain';
import { PaymentStatusCode } from 'libs/case-management/domain/src/lib/enums/payment-status-code.enum';
import { PaymentBatchName } from '@cms/case-management/domain';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
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
  PaymentStatusList = [PaymentStatusCode.Paid, PaymentStatusCode.PaymentRequested, PaymentStatusCode.ManagerApproved];
 
  yesOrNoLovs: any = [];
  onlyPrintAdviceLetter: boolean = true;
  printAuthorizationDialog: any;
  selectedDataRows: any;
  isLogGridExpand = true;
  paymentId!: any;
  showDeleteConfirmation = false;
  private actionResponseSubscription: Subscription | undefined;
  isBulkUnBatchOpened = false;
  @Input() unbatchPremiums$ :any
  @Input() unbatchEntireBatch$ :any
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  selected:any
  noDeleteStatus=['PENDING_APPROVAL','MANAGER_APPROVED']
  public bulkMore = [
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
    {
      buttonType: 'btn-h-primary',
      text: 'Unbatch Entire Batch',
      icon: 'undo',
      click: (data: any): void => {
        if (!this.isBulkUnBatchOpened) {
          this.isBulkUnBatchOpened = true;
          this.onUnBatchPaymentOpenClicked(this.unBatchPaymentPremiumsDialogTemplate);
        }
      },
    }
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
      click: (data: any): void => {
        if (data && !this.showDeleteConfirmation) {
          this.showDeleteConfirmation = true;
          this.onRemovePremiumsOpenClicked(data.paymentRequestId, this.removePremiumsConfirmationDialogTemplate);
        }
      },
    },
  ];
}


  dropDowncolumns: any = [
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
      columnDesc: 'Accepts reports?',
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
      columnCode: 'paymentStatusCode',
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
    itemNbr: "Item #",
    vendorName: "Insurance Vendor",
    serviceCount: "Item Count",
    serviceCost: "Total Amount",
    acceptsReports: "Accepts reports?",
    paymentRequestedDate: "Date Pmt. Requested",
    paymentSentDate: "Date Pmt. Sent",
    paymentMethodCode: "Pmt. Method",
    paymentStatusCode: "Pmt. Status",
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
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  gridPremiumsBatchLogDataSubject = new Subject<any>();
  gridPremiumsBatchLogData$ = this.gridPremiumsBatchLogDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  sendReportDialog: any;
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
    };
    this.loadBatchLogListEvent.emit(gridDataRefinerValue);
 
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
              field: this.selectedColumn ?? 'itemNbr',
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
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadBatchLogListGrid();
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
  }

  clientRecentPremiumsModalClicked(template: TemplateRef<unknown>, data: any): void {
    this.addClientRecentPremiumsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal  app-c-modal-bottom-up-modal',
      animation: {
        direction: 'up',
        type: 'slide',
        duration: 200
      }
    });
    this.vendorId = "3F111CFD-906B-4F56-B7E2-7FCE5A563C36";
    this.clientId = 5;
    this.clientName = "Jason Biggs";
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
        this.loadBatchLogListGrid();
      }
    });
  }

  private unsubscribeFromActionResponse() {
    if (this.actionResponseSubscription) {
      this.actionResponseSubscription.unsubscribe();
    }
  }

  paymentClickHandler(dataItem: any) {
    const batchId = this.activeRoute.snapshot.queryParams['bid'];
    this.route.navigate([this.route.url.split('?')[0], 'items'], {
      queryParams: { bid: batchId, pid: dataItem.paymentRequestId,eid:dataItem.vendorAddressId },
    });
  }

  onProviderNameClick(event:any){
    this.onProviderNameClickEvent.emit(event);
  }
}
