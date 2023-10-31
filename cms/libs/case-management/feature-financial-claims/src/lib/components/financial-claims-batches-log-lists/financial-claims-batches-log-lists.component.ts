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
} from '@progress/kendo-data-query';
import { Observable, Subject, first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterService } from '@progress/kendo-angular-treelist/filtering/filter.service';
import { FinancialClaimsFacade, PaymentBatchName, PaymentStatusCode } from '@cms/case-management/domain';
import { NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { Location } from '@angular/common';
@Component({
  selector: 'cms-financial-claims-batches-log-lists',
  templateUrl: './financial-claims-batches-log-lists.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsBatchesLogListsComponent
  implements OnInit, OnChanges
{
  @ViewChild('previewSubmitPaymentDialogTemplate', { read: TemplateRef })
  previewSubmitPaymentDialogTemplate!: TemplateRef<any>;
  @ViewChild('unBatchClaimsDialogTemplate', { read: TemplateRef })
  unBatchClaimsDialogTemplate!: TemplateRef<any>;
  @ViewChild('deleteClaimsConfirmationDialogTemplate', { read: TemplateRef })
  deleteClaimsConfirmationDialogTemplate!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isBatchLogGridLoaderShow = false;
  isRequestPaymentClicked = false;
  isPrintAdviceLetterClicked = false;
  isUnBatchClaimsClosed = false;
  isDeleteClaimClosed = false;
  isBulkUnBatchOpened = false;
  PreviewSubmitPaymentDialog: any;
  printAuthorizationDialog: any;
  UnBatchDialog: any;
  deleteClaimsDialog: any;
  onlyPrintAdviceLetter = true;
  currentPrintAdviceLetterGridFilter:any;
  private addClientRecentClaimsDialog: any;
  vendorId:any;
  clientId:any;
  clientName:any;
  PaymentStatusList = [PaymentStatusCode.Paid, PaymentStatusCode.PaymentRequested, PaymentStatusCode.ManagerApproved];
  public bulkMore = [
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
      text: 'Print Advice Letters',
      icon: 'print',
      click: (data: any): void => {
        this.isRequestPaymentClicked = false;
        this.isPrintAdviceLetterClicked = true;
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
    },
  ];
  @Output() onProviderNameClickEvent = new EventEmitter<any>();

  @Input() claimsType: any;
  @Input() batchId: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() batchLogGridLists$: any;
  @Input() loader$!: Observable<boolean>;
  @Input() paymentBatchName$!: Observable<PaymentBatchName>;
  @Output() loadBatchLogListEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'paymentNbr';
  sortDir = 'Ascending';
  sortColumnName = '';
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
  isEdit!: boolean;
  paymentRequestId!: string;
@ViewChild('addEditClaimsDialog')
  private addEditClaimsDialog!: TemplateRef<any>;
  private addEditClaimsFormDialog: any;


  gridColumns: { [key: string]: string } = {
    paymentNbr: 'Item #',
    invoiceNbr: 'Invoice ID',
    vendorName: 'Provider Name',
    tin: 'Tax ID',
    clientId: 'Member ID',
    clientFullName: 'Client Name',
    nameOnInsuranceCard: 'Name on Primary Insurance Card',
    serviceCount: 'Service Count',
    serviceCost: 'Total Cost',
    amountDue: 'Total Due',
    paymentMethodCode: 'Payment Method',
    paymentTypeCode: 'Payment Type',
    paymentStatusCode: 'Payment Status',
    clientMaximum: 'Client Annual Total',
    balanceAmount: 'Client Balance',
  };

  paymentMethods = ['CHECK', 'ACH', 'SPOTS'];
  paymentTypes = ['PAYMENT', 'REFUND', 'COPAYMENT', 'DEDUCTIBLE', 'FULL PAY'];
  paymentStatusList = [
    'SUBMITTED',
    'PENDING_APPROVAL',
    'DENIED',
    'MANAGER_APPROVED',
    'PAYMENT_REQUESTED',
    'ONHOLD',
    'FAILED',
    'PAID',
  ];
  paymentMethodFilter = '';
  paymentTypeFilter = '';
  paymentStatusFilter = '';
  selected: any;
  selectedDataRows: any;
  selectedCount = 0;
  disablePrwButton = true;
  deletemodelbody = "This action cannot be undone, but you may add a claim at any time. This claim will not appear in a batch";

  getBatchLogGridActions(dataItem: any){
    if (dataItem.paymentStatusCode.toLowerCase() == PaymentStatusCode.Denied.toLowerCase()) {
      return [{
        buttonType: 'btn-h-primary',
        text: 'Edit Claim',
        icon: 'edit',
        click: (claim: any): void => {
          this.onClaimClick(claim);
        }
      },
      {
        buttonType: 'btn-h-danger',
        text: 'Delete Claim',
        icon: 'delete',
        click: (data: any): void => {
          if([PaymentStatusCode.Paid, PaymentStatusCode.PaymentRequested, PaymentStatusCode.ManagerApproved].includes(data.paymentStatusCode))
          {
            this.notificationSnackbarService.manageSnackBar(
              SnackBarNotificationType.ERROR,
              "This claim cannot be deleted",
              NotificationSource.UI
            );
          }else{
              this.isUnBatchClaimsClosed = false;
              this.isDeleteClaimClosed = true;
              this.onSingleClaimDelete(data.paymentRequestId.split(','));
              this.onDeleteClaimsOpenClicked(
                this.deleteClaimsConfirmationDialogTemplate
              );

          }

        },
      },
    ];
    }
    return [
      {
        buttonType: 'btn-h-primary',
        text: 'Unbatch Claim',
        icon: 'undo',
        disabled: [PaymentStatusCode.Paid, PaymentStatusCode.PaymentRequested, PaymentStatusCode.ManagerApproved].includes(dataItem.paymentStatusCode),
        click: (data: any): void => {

          if(![PaymentStatusCode.Paid, PaymentStatusCode.PaymentRequested, PaymentStatusCode.ManagerApproved].includes(data.paymentStatusCode))
            if (!this.isUnBatchClaimsClosed) {
              this.isUnBatchClaimsClosed = true;
              this.selected = data;
              this.onUnBatchOpenClicked(this.unBatchClaimsDialogTemplate);
            }
        },
      },
      {
        buttonType: 'btn-h-danger',
        text: 'Delete Claim',
        icon: 'delete',
        click: (data: any): void => {
          if([PaymentStatusCode.Paid, PaymentStatusCode.PaymentRequested, PaymentStatusCode.ManagerApproved].includes(data.paymentStatusCode))
          {
            this.notificationSnackbarService.manageSnackBar(
              SnackBarNotificationType.ERROR,
              "This claim cannot be deleted",
              NotificationSource.UI
            );
          }else{
              this.isUnBatchClaimsClosed = false;
              this.isDeleteClaimClosed = true;
              this.onSingleClaimDelete(data.paymentRequestId.split(','));
              this.onDeleteClaimsOpenClicked(
                this.deleteClaimsConfirmationDialogTemplate
              );

          }

        },
      },
    ];
  }
  /** Constructor **/
  constructor(
    private route: Router,
    private dialogService: DialogService,
    public activeRoute: ActivatedRoute,
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private location: Location
  ) {}

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

  setNoOfRecordToBePrint(NoOfRecordToBePrint:any){
    this.selectedCount = NoOfRecordToBePrint;
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
      sortColumn: this.sortColumn ?? 'paymentNbr',
      sortType: sortTypeValue ?? 'asc',
      filter: this.filter,
    };
    this.loadBatchLogListEvent.emit(gridDataRefinerValue);
    this.currentPrintAdviceLetterGridFilter = this.filter;
  }

  onChange(data: any) {
    this.defaultGridState();
    const stateData = this.state;
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

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadBatchLogListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  backToBatch(event: any) {
    this.route.navigate(['/financial-management/claims/' + this.claimsType]);
  }

  goToBatchItems(event: any) {
    this.route.navigate([this.route.url, 'items']);
  }

  paymentClickHandler(dataItem: any) {
    const batchId = this.activeRoute.snapshot.queryParams['bid'];
    this.route.navigate([this.route.url.split('?')[0], 'items'], {
      queryParams: { bid: batchId, pid: dataItem.paymentRequestId,eid:dataItem.vendorAddressId },
    });
  }

  navToReconcilePayments(event : any){
    this.route.navigate([`/financial-management/claims/${this.claimsType}/batch/reconcile-payments`],
    { queryParams :{bid: this.batchId}});
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

  loadPrintAdviceLetterEvent(event:any){
    this.currentPrintAdviceLetterGridFilter = event.filter;
    this.loadBatchLogListEvent.emit(event);
  }

  onBulkOptionCancelClicked(){
    this.isRequestPaymentClicked = false;
    this.isPrintAdviceLetterClicked = false;
    this.selectedDataRows = [];
    this.selectedCount = 0;
    this.loadBatchLogListGrid();
  }

  onPrintAuthorizationOpenClicked(template: TemplateRef<unknown>): void {
    this.selectedDataRows.currentPrintAdviceLetterGridFilter = JSON.stringify(this.currentPrintAdviceLetterGridFilter);
    this.printAuthorizationDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-xlg app-c-modal-np_0',
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

  onUnBatchCloseClicked(result: any) {
    if (result) {
      if (this.isBulkUnBatchOpened) {
        this.handleUnbatchEntireBatch();
        this.financialClaimsFacade.unbatchEntireBatch(
          [this.batchId],
          this.claimsType
        );
      } else {
        this.handleUnbatchClaims();
        this.financialClaimsFacade.unbatchClaims(
          [this.selected.paymentRequestId],
          this.claimsType
        );
      }
    }
    this.isUnBatchClaimsClosed = false;
    this.isBulkUnBatchOpened = false;
    this.UnBatchDialog.close();
  }

  handleUnbatchClaims() {
    this.financialClaimsFacade.unbatchClaims$
      .pipe(first((unbatchResponse: any) => unbatchResponse != null))
      .subscribe((unbatchResponse: any) => {
        if (unbatchResponse ?? false) {
          this.loadBatchLogListGrid();
        }
      });
  }

  handleUnbatchEntireBatch() {
    this.financialClaimsFacade.unbatchEntireBatch$
      .pipe(
        first(
          (unbatchEntireBatchResponse: any) =>
            unbatchEntireBatchResponse != null
        )
      )
      .subscribe((unbatchEntireBatchResponse: any) => {
        if (unbatchEntireBatchResponse ?? false) {
          this.route.navigateByUrl(`financial-management/claims/${this.claimsType}?tab=2`)
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
      this.isDeleteClaimClosed=false;
      this.deleteClaimsDialog.close();
    }
  }
  onSingleClaimDelete(selection: any) {
    this.selected=selection;
  }

  onModalBatchDeletingClaimsButtonClicked(action: any) {
    if (action) {
      this.handleDeleteClaims();
      this.financialClaimsFacade.deleteClaims(
        this.selected,
        this.claimsType
      );
    }
  }

  handleDeleteClaims() {
    this.financialClaimsFacade.deleteClaims$
      .pipe(first((deleteResponse: any) => deleteResponse != null))
      .subscribe((deleteResponse: any) => {
        if (deleteResponse!=null) {
          this.isDeleteClaimClosed=false;
          this.deleteClaimsDialog.close()
          this.loadBatchLogListGrid();
        }
      });
  }

  disablePreviewButton(result: any) {
    this.selectedDataRows = result;
    this.selectedDataRows.batchId = this.batchId
    if(result.selectAll){
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
  selectUnSelectPayment(dataItem: any) {
    if (!dataItem.selected) {
      let exist = this.selectedDataRows.PrintAdviceLetterUnSelected.filter((x: any) => x.vendorAddressId === dataItem.vendorAddressId).length;
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
        let exist = this.selectedDataRows.PrintAdviceLetterSelected.filter((x: any) => x.vendorAddressId === dataItem.vendorAddressId).length;
        if (exist === 0) {
          this.selectedDataRows.PrintAdviceLetterSelected.push({ 'paymentRequestId': dataItem.paymentRequestId, 'vendorAddressId': dataItem.vendorAddressId, 'selected': true });
        }

    }
  }

  clientRecentClaimsModalClicked(
    template: TemplateRef<unknown>,
    data: any
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
    this.vendorId=data.vendorId;
    this.clientId=data.clientId;
    this.clientName=data.clientFullName;
  }

  closeRecentClaimsModal(result: any) {
    if (result) {
      this.addClientRecentClaimsDialog.close();
    }
  }

  onClientClicked(clientId: any) {
    this.route.navigate([`/case-management/cases/case360/${clientId}`]);
    this.closeRecentClaimsModal(true);
  }

  onProviderNameClick(event:any){
    this.onProviderNameClickEvent.emit(event);
  }
  onClaimClick(dataitem: any) {
    if (!dataitem.vendorId.length) return;
    this.isEdit = true;
    this.paymentRequestId = dataitem.paymentRequestId;
    this.openAddEditClaimDialoge();
  }

  openAddEditClaimDialoge() {
    this.addEditClaimsFormDialog = this.dialogService.open({
      content: this.addEditClaimsDialog,
      cssClass: 'app-c-modal app-c-modal-full add_claims_modal',
    });
  }
  modalCloseAddEditClaimsFormModal(result: any) {
    if (result === true) {
      this.loadBatchLogListGrid();    
    }
    this.addEditClaimsFormDialog.close();
  }
}
