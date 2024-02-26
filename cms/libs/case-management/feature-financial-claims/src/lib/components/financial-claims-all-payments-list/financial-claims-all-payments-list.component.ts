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
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialClaimsFacade, LoadTypes, PaymentStatusCode } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { LovFacade, UserManagementFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FilterService, GridDataResult, SelectableMode, SelectableSettings } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State
} from '@progress/kendo-data-query';
import { BehaviorSubject, Subject, first } from 'rxjs';

@Component({
  selector: 'cms-financial-claims-all-payments-list',
  templateUrl: './financial-claims-all-payments-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsAllPaymentsListComponent
  implements OnInit, OnChanges
{
  @ViewChild('previewSubmitPaymentDialogTemplate', { read: TemplateRef })
  previewSubmitPaymentDialogTemplate!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  private addClientRecentClaimsDialog: any;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isFinancialClaimsAllPaymentsGridLoaderShow = false;
  gridLoaderSubject = new BehaviorSubject(false);
  @Input() claimsType: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() financialClaimsAllPaymentsGridLoader$: any;
  @Input() financialClaimsAllPaymentsGridLists$: any;
  @Input() exportButtonShow$: any;
  @Input() letterContentList$ :any;
  @Input() letterContentLoader$ :any;
  @Input() dentalClaimAllPaymentClaimsProfilePhoto$!: any;
  @Output() loadFinancialClaimsAllPaymentsListEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();
  @Output() loadTemplateEvent = new EventEmitter<any>();
  @ViewChild('unBatchClaimsDialogTemplate', { read: TemplateRef })
  unBatchClaimsDialogTemplate!: TemplateRef<any>;
  @ViewChild('deleteClaimsConfirmationDialogTemplate', { read: TemplateRef })
  deleteClaimsConfirmationDialogTemplate!: TemplateRef<any>;
  @ViewChild('addEditClaimsDialog')
  private addEditClaimsDialog!: TemplateRef<any>;

  isEdit!: boolean;
  paymentRequestId!: string;
  private addEditClaimsFormDialog: any;
  isUnBatchClaimsClosed = false;
  isDeleteClaimClosed = false;
  UnBatchDialog: any;
  deleteClaimsDialog: any;
  deletemodelbody =
    'This action cannot be undone, but you may add a claim at any time. This claim will not appear in a batch';
  selected: any;
  isGridExpand = true;
  selectedClaims: any[] = [];
  previewText = false;

  public selectableSettings: SelectableSettings;
  public checkboxOnly = true;
  public mode: SelectableMode = 'multiple';
  public drag = false;

  public state!: State;
  sortColumn = 'batchNumber';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;

  gridDataResult!: GridDataResult;
  showExportLoader = false;
  gridFinancialClaimsAllPaymentsDataSubject = new Subject<any>();
  gridFinancialClaimsAllPaymentsData$ =
    this.gridFinancialClaimsAllPaymentsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  PreviewSubmitPaymentDialog: any;
  printAuthorizationDialog: any;
  isPrintAuthorizationClicked = false;
  vendorId: any;
  clientId: any;
  clientName: any;
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  selectAll:boolean=false;
  unCheckedPaymentRequest:any=[];
  selectedDataIfSelectAllUnchecked:any=[];
  financialClaimsAllPaymentsGridLists: any = [];
  currentPageRecords: any = [];
  selectedAllPaymentsList!: any;
  isPageCountChanged: boolean = false;
  isPageChanged: boolean = false;
  unCheckedProcessRequest:any=[];
  checkedAndUncheckedRecordsFromSelectAll:any=[];
  recordCountWhenSelectallClicked: number = 0;
  totalGridRecordsCount: number = 0;
  sendReportCount: number = 0;
  recentClaimsGridLists$ = this.financialClaimsFacade.recentClaimsGridLists$;

  getPaymentsGridActions(dataItem: any) {
    let list = [
      {
        buttonType: 'btn-h-primary',
        text: 'Unbatch Claim',
        icon: 'undo',
        disabled: [
          PaymentStatusCode.Paid,
          PaymentStatusCode.PaymentRequested,
          PaymentStatusCode.ManagerApproved,
        ].includes(dataItem.paymentStatusCode),
        click: (data: any): void => {
          if (
            ![
              PaymentStatusCode.Paid,
              PaymentStatusCode.PaymentRequested,
              PaymentStatusCode.ManagerApproved,
            ].includes(data.paymentStatusCode)
          )
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
        },
      },
    ];

    if (PaymentStatusCode.Denied == dataItem.paymentStatusCode)
      list = [
        {
          buttonType: 'btn-h-primary',
          text: 'Edit Claim',
          icon: 'edit',
          click: (claim: any): void => {
            this.onClaimClick(claim);
          },
        },
        ...list,
      ];
    return list;
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
      text: 'PRINT ADVICE LETTER(S)',
      icon: 'print',
      click: (data: any): void => {
        this.isGridExpand = false;
        this.previewText = true;
        this.isPrintAuthorizationClicked = true;
      },
    },
  ];

  columns: any = {
    itemNumber: 'Item #',
    batchNumber: 'Batch #',
    invoiceNbr: 'Invoice ID',
    providerName: 'Provider Name',
    tin: 'Tax ID',
    paymentMethodDesc: 'Payment Method',
    clientFullName: 'Client Name',
    insuranceName: 'Name on Primary Insurance Card',
    clientId: 'Client ID',
    serviceCount: 'Service Count',
    totalCost: 'Total Cost',
    totalDue: 'Total Due',
    paymentStatusDesc: 'Payment Status',
  };

  dropDowncolumns!: any[];
  selectedPaymentStatus: string | null = null;
  selectedpaymentMethod: string | null = null;
  paymentMethodType$ = this.lovFacade.paymentMethodType$;
  paymentStatus$ = this.lovFacade.paymentStatus$;
  paymentMethodTypes: any = [];
  paymentStauses: any = [];
  selectedColumn = 'ALL';
  allPaymentClaimsProfileSubject = new Subject();
  constructor(
    private route: Router,
    private dialogService: DialogService,
    public activeRoute: ActivatedRoute,
    private readonly lovFacade: LovFacade,
    private readonly cdr: ChangeDetectorRef,
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly userManagementFacade: UserManagementFacade,
  ) {
    this.selectableSettings = {
      checkboxOnly: this.checkboxOnly,
      mode: this.mode,
      drag: this.drag,
    };
  }

  ngOnInit(): void {
    this.setDropDownColumns();
    this.getPaymentMethodLov();
    this.getPaymentStatusLov();
    this.handleAllPaymentsGridData();
  }
  setDropDownColumns() {
    if(this.claimsType == 'medical') {
      this.dropDowncolumns = [
        {
          columnCode: 'ALL',
          columnDesc: 'All Columns',
        },
        {
          columnCode: 'batchNumber',
          columnDesc: 'Batch #',
        },
        {
          columnCode: 'providerName',
          columnDesc: 'Provider Name',
        },
        {
          columnCode: 'tin',
          columnDesc: 'Tax ID',
        },
        {
          columnCode: 'clientFullName',
          columnDesc: 'Client Name',
        },
        {
          columnCode: 'clientId',
          columnDesc: 'Client ID',
        },
      ];
    } else if (this.claimsType == 'dental') {
      this.dropDowncolumns = [
        {
          columnCode: 'ALL',
          columnDesc: 'All Columns',
        },
        {
          columnCode: 'batchNumber',
          columnDesc: 'Batch #',
        },
        {
          columnCode:  'invoiceNbr',
          columnDesc:  'Invoice ID',
        },
        {
          columnCode: 'clientFullName',
          columnDesc: 'Client Name',
        },
        {
          columnCode: 'clientId',
          columnDesc: 'Client ID',
        },
      ];
    }
  
  }

  handleAllPaymentsGridData() {
    this.financialClaimsAllPaymentsGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridFinancialClaimsAllPaymentsDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.gridLoaderSubject.next(false);
      }
      this.financialClaimsAllPaymentsGridLists = this.gridDataResult?.data;
      if(this.recordCountWhenSelectallClicked == 0){
        this.recordCountWhenSelectallClicked = this.gridDataResult?.total;
        this.totalGridRecordsCount = this.gridDataResult?.total;
      }
      if(!this.selectAll)
      {
      this.financialClaimsAllPaymentsGridLists.forEach((item1: any) => {
        const matchingGridItem = this.selectedAllPaymentsList?.PrintAdviceLetterSelected.find((item2: any) => item2.paymentRequestId === item1.paymentRequestId);
        if (matchingGridItem) {
          item1.selected = true;
        } else {
          item1.selected = false;
        }
      });
    }
    this.currentPageRecords = this.financialClaimsAllPaymentsGridLists;
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
    for (const item of this.financialClaimsAllPaymentsGridLists) {
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

  ngOnChanges(): void {
    this.defaultGridState();
    this.loadFinancialClaimsAllPaymentsListGrid();
  }

  selectedKeysChange(selection: any) {
    this.selectedClaims = selection;
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

  private loadFinancialClaimsAllPaymentsListGrid(): void {
    this.loadRefundAllPayments(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }

  loadRefundAllPayments(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isFinancialClaimsAllPaymentsGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      filter: this.state?.['filter']?.['filters'] ?? [],
    };
    this.loadFinancialClaimsAllPaymentsListEvent.emit(gridDataRefinerValue);
  }

  onChange(data: any) {
    this.defaultGridState();

    let operator = 'startswith';

    if (
      this.selectedColumn === 'clientId' ||
      this.selectedColumn === 'serviceCount' ||
      this.selectedColumn === 'totalCost' ||
      this.selectedColumn === 'totalDue'
    ) {
      operator = 'eq';
    }

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'batchNumber',
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
      this.filteredBy = '';
    }
    if (!this.filteredBy.includes('Payment Method'))
      this.selectedpaymentMethod = null;
    if (!this.filteredBy.includes('Payment Status'))
      this.selectedPaymentStatus = '';
    this.loadFinancialClaimsAllPaymentsListGrid();
    if(this.isPrintAuthorizationClicked){
      this.handleAllPaymentsGridData();
    }
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.isPageCountChanged = true;
    this.isPageChanged = false;
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadFinancialClaimsAllPaymentsListGrid();
    if(this.isPrintAuthorizationClicked){
      this.handleAllPaymentsGridData();
    }
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  setToDefault() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.filter = '';
    this.searchValue = '';
    this.isFiltered = false;
    this.columnsReordered = false;
    this.selectedColumn = "ALL";

    this.sortColumn = 'Batch #';
    this.sortDir = 'Ascending';
    this.sortValue = 'batchNumber';
    this.sortType = 'asc';
    this.sort = this.sortColumn;

    this.loadFinancialClaimsAllPaymentsListGrid();
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    if (field === 'paymentStatusDesc') this.selectedPaymentStatus = value;
    if (field === 'paymentMethodDesc') this.selectedpaymentMethod = value;
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

  navToReconcilePayments(event: any) {
    this.route.navigate([
      '/financial-management/claims/' +
        this.claimsType +
        '/payments/reconcile-payments',
    ],{ queryParams :{loadType: LoadTypes.allPayments}});
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
    this.vendorId = data.vendorId;
    this.clientId = data.clientId;
    this.clientName = data.clientFullName;
  }

  closeRecentClaimsModal(result: any) {
    if (result) {
      this.addClientRecentClaimsDialog.close();
    }
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
    this.isPrintAuthorizationClicked = false;
    this.isGridExpand = true;
    this.previewText = false;
    this.markAsUnChecked(this.selectedAllPaymentsList?.PrintAdviceLetterSelected);
    this.markAsUnChecked(this.financialClaimsAllPaymentsGridLists);
    this.unCheckedProcessRequest = [];
    this.checkedAndUncheckedRecordsFromSelectAll = [];
    this.selectedAllPaymentsList.PrintAdviceLetterSelected = [];
    this.selectedAllPaymentsList.PrintAdviceLetterUnSelected = [];
    this.getSelectedReportCount(this.selectedAllPaymentsList?.PrintAdviceLetterSelected);
    this.selectAll = false;
    this.recordCountWhenSelectallClicked = 0;
    this.sendReportCount = 0;
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

  onClientClicked(clientId: any) {
    this.route.navigate([`/case-management/cases/case360/${clientId}`]);
    this.closeRecentClaimsModal(true);
  }

  onProviderNameClick(event: any) {
    this.onProviderNameClickEvent.emit(event);
  }

  onitemNumberClick(dataItem: any) {
    this.route.navigate(
      [`/financial-management/claims/${this.claimsType}/batch/items`],
      { queryParams:
        {
          bid: dataItem?.batchId,
          pid: dataItem.paymentRequestId,
          eid: dataItem.vendorId,
        }
      }
    );
  }

  onbatchNumberClick(dataItem: any) {
    this.route.navigate(
      [`/financial-management/claims/${this.claimsType}/batch`],
      { queryParams: { bid: dataItem?.batchId } }
    );
  }

  onUnBatchOpenClicked(template: TemplateRef<unknown>): void {
    this.UnBatchDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onUnBatchCloseClicked(result: any) {
    if (result) {
      this.handleUnbatchClaims();
      this.financialClaimsFacade.unbatchClaims(
        [this.selected.paymentRequestId],
        this.claimsType
      );
    }
    this.isUnBatchClaimsClosed = false;
    this.UnBatchDialog.close();
  }

  handleUnbatchClaims() {
    this.financialClaimsFacade.unbatchClaims$
      .pipe(first((unbatchResponse: any) => unbatchResponse != null))
      .subscribe((unbatchResponse: any) => {
        if (unbatchResponse ?? false) {
          this.loadFinancialClaimsAllPaymentsListGrid();
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
      this.isDeleteClaimClosed = false;
      this.deleteClaimsDialog.close();
    }
  }

  onSingleClaimDelete(selection: any) {
    this.selected = selection;
  }

  onModalBatchDeletingClaimsButtonClicked(action: any) {
    if (action) {
      this.handleDeleteClaims();
      this.financialClaimsFacade.deleteClaims(this.selected, this.claimsType);
    }
  }

  handleDeleteClaims() {
    this.financialClaimsFacade.deleteClaims$
      .pipe(first((deleteResponse: any) => deleteResponse != null))
      .subscribe((deleteResponse: any) => {
        if (deleteResponse != null) {
          this.isDeleteClaimClosed = false;
          this.deleteClaimsDialog.close();
          this.loadFinancialClaimsAllPaymentsListGrid();
        }
      });
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
      this.loadFinancialClaimsAllPaymentsListGrid();
    }
    this.addEditClaimsFormDialog.close();
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
        this.sendReportCount = this.totalGridRecordsCount - this.unCheckedProcessRequest?.length;
        this.recordCountWhenSelectallClicked = this.sendReportCount;
      }else{
      this.recordCountWhenSelectallClicked = selected ? this.recordCountWhenSelectallClicked + 1 : this.recordCountWhenSelectallClicked - 1;
      this.sendReportCount = this.recordCountWhenSelectallClicked;
      }
    }else{
      this.sendReportCount = this.selectedAllPaymentsList?.PrintAdviceLetterSelected?.filter((item: any) => item.selected).length;
   }
    this.cdr.detectChanges();
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
        this.checkedAndUncheckedRecordsFromSelectAll.push({ 'paymentRequestId': dataItem.paymentRequestId, 'vendorAddressId': dataItem.vendorAddressId, 'selected': true, 'batchId': dataItem.batchId });
      }else{
        const recordIndex = this.checkedAndUncheckedRecordsFromSelectAll.findIndex((element: any) => element.paymentRequestId === dataItem.paymentRequestId);
        if (recordIndex !== -1) {
          this.checkedAndUncheckedRecordsFromSelectAll.splice(recordIndex, 1); // Remove the record at the found index
        }
      }
  }

  onRecordSelectionChecked(dataItem: any) {
    this.unCheckedProcessRequest.push({'paymentRequestId':dataItem.paymentRequestId,'vendorAddressId':dataItem.vendorAddressId,'selected':true});
        this.currentPageRecords?.forEach((element: any) => {
          if (element.paymentRequestId === dataItem.paymentRequestId) {
            element.selected = false;
          }
        });
        const exist = this.checkedAndUncheckedRecordsFromSelectAll?.filter((x: any) => x.paymentRequestId === dataItem.paymentRequestId).length;
        if (exist === 0) {
          this.checkedAndUncheckedRecordsFromSelectAll.push({ 'paymentRequestId': dataItem.paymentRequestId, 'vendorAddressId': dataItem.vendorAddressId, 'selected': false, 'batchId': dataItem.batchId });
        }else{
          const recordIndex = this.checkedAndUncheckedRecordsFromSelectAll.findIndex((element: any) => element.paymentRequestId === dataItem.paymentRequestId);
          if (recordIndex !== -1) {
            this.checkedAndUncheckedRecordsFromSelectAll.splice(recordIndex, 1); // Remove the record at the found index
          }
        }
  }

  selectionAllChange(){
    this.unCheckedProcessRequest=[];
    this.checkedAndUncheckedRecordsFromSelectAll=[];
    if(this.selectAll){
      this.markAsChecked(this.financialClaimsAllPaymentsGridLists);
    }
    else{
      this.markAsUnChecked(this.financialClaimsAllPaymentsGridLists);
    }
    this.selectedAllPaymentsList = {'selectAll':this.selectAll,'PrintAdviceLetterUnSelected':this.unCheckedProcessRequest,
    'PrintAdviceLetterSelected':this.checkedAndUncheckedRecordsFromSelectAll,'print':true,
    'batchId':null,'currentPrintAdviceLetterGridFilter':null,'requestFlow':'print'};
    this.cdr.detectChanges();
    if(this.selectAll){
      if(this.unCheckedProcessRequest?.length > 0){
        this.sendReportCount = this.totalGridRecordsCount - this.unCheckedProcessRequest?.length;
        this.recordCountWhenSelectallClicked = this.sendReportCount;
      }else{
        this.sendReportCount = this.totalGridRecordsCount;
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

  getSelectedReportCount(selectedSendReportList : []){
    this.sendReportCount = selectedSendReportList.length;
  }

    loadEachLetterTemplate(event:any){
      this.loadTemplateEvent.emit(event);
  }
}
