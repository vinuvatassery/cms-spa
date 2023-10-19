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
import { FinancialClaimsFacade, PaymentStatusCode } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FilterService, GridDataResult, SelectableMode, SelectableSettings } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State
} from '@progress/kendo-data-query';
import { Subject, first } from 'rxjs';

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

  @Input() claimsType: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() financialClaimsAllPaymentsGridLoader$: any;
  @Input() financialClaimsAllPaymentsGridLists$: any;
  @Input() exportButtonShow$: any;

  @Output() loadFinancialClaimsAllPaymentsListEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();

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
  deletemodelbody = "This action cannot be undone, but you may add a claim at any time. This claim will not appear in a batch";
  selected: any;
  isGridExpand = true;
  selectedClaims: any[] = [];;
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
  selectedColumn!: any;
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

  getPaymentsGridActions(dataItem: any){
    return [
      {
        buttonType: 'btn-h-primary',
        text: 'Edit Claim',
        icon: 'edit',
        click: (claim: any): void => {
          this.onClaimClick(claim);
        },
      },
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
      text: 'Print Advice Letter(s)',
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

  dropDowncolumns: any = [
    {
      columnCode: 'itemNumber',
      columnDesc: 'Item #',
    },
    {
      columnCode: 'batchNumber',
      columnDesc: 'Batch #',
    },
    {
      columnCode: 'invoiceNbr',
      columnDesc: 'Invoice ID',
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
      columnCode: 'paymentMethodDesc',
      columnDesc: 'Payment Method',
    },
    {
      columnCode: 'clientFullName',
      columnDesc: 'Client Name',
    },
    {
      columnCode: 'insuranceName',
      columnDesc: 'Name on Primary Insurance Card',
    },
    {
      columnCode: 'clientId',
      columnDesc: 'Client ID',
    },
    {
      columnCode: 'serviceCount',
      columnDesc: 'Service Count',
    },
    {
      columnCode: 'totalCost',
      columnDesc: 'Total Cost',
    },
    {
      columnCode: 'totalDue',
      columnDesc: 'Total Due',
    },
    {
      columnCode: 'amountDue',
      columnDesc: 'Total Due',
    },
    {
      columnCode: 'paymentStatusDesc',
      columnDesc: 'Payment Status',
    },
  ];

  selectedPaymentStatus: string | null = null;
  selectedpaymentMethod: string | null = null;
  paymentMethodType$ = this.lovFacade.paymentMethodType$;
  paymentStatus$ = this.lovFacade.paymentStatus$;
  paymentMethodTypes: any = [];
  paymentStauses: any = [];

  constructor(
    private route: Router,
    private dialogService: DialogService,
    public activeRoute: ActivatedRoute,
    private readonly lovFacade: LovFacade,
    private readonly cdr: ChangeDetectorRef,
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly notificationSnackbarService: NotificationSnackbarService,
  ) {
    this.selectableSettings = {
      checkboxOnly: this.checkboxOnly,
      mode: this.mode,
      drag: this.drag,
    };
  }

  ngOnInit(): void {
    this.getPaymentMethodLov();
    this.getPaymentStatusLov();

  }
  ngOnChanges(): void {
    this.defaultGridState()
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
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadFinancialClaimsAllPaymentsListGrid();
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
    this.selectedColumn = null;

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
    ]);
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
          this.loadFinancialClaimsAllPaymentsListGrid();        }
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
    if (result) {
      this.loadFinancialClaimsAllPaymentsListGrid();
      this.addEditClaimsFormDialog.close();
    }
  }
}
