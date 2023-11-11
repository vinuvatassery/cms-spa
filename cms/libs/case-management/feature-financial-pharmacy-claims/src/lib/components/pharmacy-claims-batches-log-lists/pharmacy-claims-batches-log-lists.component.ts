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
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import {  GridDataResult } from '@progress/kendo-angular-grid';
import { DialogService } from '@progress/kendo-angular-dialog';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject, first } from 'rxjs';
import { Router } from '@angular/router';
import { FilterService } from '@progress/kendo-angular-treelist/filtering/filter.service';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { PaymentStatusCode } from '@cms/case-management/domain';

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
  @Output() loadVendorRefundBatchListEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'batch';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  gridClaimsBatchLogDataSubject = new Subject<any>();
  gridClaimsBatchLogData$ = this.gridClaimsBatchLogDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
    
  /** Constructor **/
  constructor(private route: Router,private dialogService: DialogService ) {}
  
  ngOnInit(): void {
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
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadVendorRefundBatchListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
 
  
  onChange(data: any) {
    this.defaultGridState();

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'vendorName',
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
    template: TemplateRef<unknown> 
  ): void {
    this.addClientRecentClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal  app-c-modal-bottom-up-modal',
      animation: {
        direction: 'up',
        type: 'slide',
        duration: 200,
      },
    });
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
}
