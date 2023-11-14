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
import { Observable, Subject, first } from 'rxjs';
import { Router } from '@angular/router';
import { FilterService } from '@progress/kendo-angular-treelist/filtering/filter.service';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import {
  PaymentStatusCode,PaymentType, PaymentMethodCode
} from '@cms/case-management/domain';

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
  isPrintAuthorizationClicked = false;
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
  isLogGridExpand = true;
  isBulkUnBatchOpened =false;
  @Output() unBatchEntireBatchEvent = new EventEmitter<any>(); 
  @Output() unBatchClaimsEvent = new EventEmitter<any>();
  @Input() batchId:any
  @Input() unbatchClaim$ :any
  @Input() unbatchEntireBatch$ :any
  @Input() exportButtonShow$ :any
  public bulkMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'Request Payments',
      icon: 'local_atm',
      click: (data: any): void => {
      this.isRequestPaymentClicked = true;
      this.isPrintAuthorizationClicked = false;
        
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
      text: 'Print Authorizations',
      icon: 'print',
      click: (data: any): void => {
        this.isRequestPaymentClicked = false;
        this.isPrintAuthorizationClicked = true;
          
        },

    },
    {
      buttonType: 'btn-h-primary',
      text: 'Unbatch Entire Batch',
      icon: 'undo',
      click: (data: any): void => {
        if (!this.isBulkUnBatchOpened) {
          this.isBulkUnBatchOpened = true;
          this.onUnBatchOpenClicked(this.unBatchClaimsDialogTemplate);
        }
      },
    }
  ];
  selected: any;

  public batchLogGridActions(dataItem:any){ 
   return  [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Claim',
      icon: 'edit',
      click: (data: any): void => {
        if (!this.isAddEditClaimMoreClose) {
          this.isAddEditClaimMoreClose = true;
          this.onClickOpenAddEditClaimsFromModal(this.addEditClaimsDialog);
        }
       
      } 
      
    },
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
      buttonType: 'btn-h-primary',
      text: 'Reverse claim',
      icon: 'fast_rewind',
      click: (data: any): void => {
        if (!this.reverseClaimsDialogClosed) {
          this.reverseClaimsDialogClosed = true;
          this.onReverseClaimsOpenClicked(this.reverseClaimsDialogTemplate);
        }
       
      }      
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Claim',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isDeleteClaimClosed) {
          this.isDeleteClaimClosed = true;
          this.onDeleteClaimsOpenClicked(this.deleteClaimsConfirmationDialogTemplate);
        }
       
      }

      
    },
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
  selectedColumn= 'itemNbr';
  gridDataResult!: GridDataResult;
  gridClaimsBatchLogDataSubject = new Subject<any>();
  gridClaimsBatchLogData$ = this.gridClaimsBatchLogDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  gridColumns: { [key: string]: string } = {
    itemNbr: 'Item #',
    vendorName: 'Pharmacy Name',
    clientFullName: 'Client Name',
    nameOnInsuranceCard: 'Name on Primary Insurance Card',
    clientId: 'Client ID',
    paymentMethodCode: 'Payment Method',
    paymentTypeCode: 'Payment Type',
    creationTime : 'Entry Date',
    paymentStatusCode: 'Payment Status',
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
    private readonly intl: IntlService, ) {}
  
  ngOnInit(): void {
    this.sortColumnName = 'Item #';
    this.loadBatchLogListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadBatchLogListGrid();
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
      sortColumn: this.sortColumn ?? 'itemNbr',
      sortType: sortTypeValue ?? 'asc',
      filter: this.filter,
    };
    this.loadBatchLogListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
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
      this.selectedColumn === 'clientId' ||
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
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumn = stateData.sort[0]?.field;
    this.sortColumnName = this.gridColumns[this.sortColumn];
    this.filter = stateData?.filter?.filters;
    this.loadBatchLogListGrid();
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
  public rowClass = (args:any) => ({
    "table-row-orange": (args.dataItem.item === 1),
  });
   backToBatch(event : any){  
    this.route.navigate(['/financial-management/pharmacy-claims'] );
  }

  goToBatchItems(event : any){  
    this.route.navigate(['/financial-management/pharmacy-claims/batch/items'] );
  }

  navToReconcilePayments(event : any){  
    this.route.navigate(['/financial-management/pharmacy-claims/batch/reconcile-payments'] );
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
    this.isRequestPaymentClicked = false;
    this.isPrintAuthorizationClicked = false;
  }

  onPrintAuthorizationOpenClicked(template: TemplateRef<unknown>): void {
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
          this.loadBatchLogListGrid();
        }
      });
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

  onClickOpenAddEditClaimsFromModal(template: TemplateRef<unknown>): void {
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
  
}
