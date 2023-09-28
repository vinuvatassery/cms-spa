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
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { DialogService } from '@progress/kendo-angular-dialog';

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

  dropDowncolumns: any[] = [
    {
      columnCode: 'itemNumber',
      columnDesc: 'Item Number',
    },
    {
      columnCode: 'batchNumber',
      columnDesc: 'Batch Number',
    },
    {
      columnCode: 'vendorTypeCode',
      columnDesc: 'Vendor Type Code',
    },
    {
      columnCode: 'itemCountInBatch',
      columnDesc: 'Item Count In Batch',
    },
    {
      columnCode: 'totalCost',
      columnDesc: 'Total Cost',
    },
    {
      columnCode: 'paymentRequestedDate',
      columnDesc: 'Payment Requested Date',
    },
    {
      columnCode: 'paymentSentDate',
      columnDesc: 'Payment Sent Date',
    },
    {
      columnCode: 'paymentMethodDesc',
      columnDesc: 'Payment Method Desc',
    },
    {
      columnCode: 'paymentStatusCode',
      columnDesc: 'Payment Status Code',
    },
    {
      columnCode: 'pcaCode',
      columnDesc: 'PCA Code',
    },
    {
      columnCode: 'mailCode',
      columnDesc: 'Mail Code',
    },
    {
      columnCode: 'clientFullName',
      columnDesc: 'Client Full Name',
    },
    {
      columnCode: 'totalDue',
      columnDesc: 'Total Due',
    },
    {
      columnCode: 'by',
      columnDesc: 'By',
    },
  ];

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
  gridFinancialPremiumsAllPaymentsDataSubject = new Subject<any>();
  gridFinancialPremiumsAllPaymentsData$ =
    this.gridFinancialPremiumsAllPaymentsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
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

  constructor(private route: Router, private dialogService: DialogService) {}

  ngOnInit(): void {
    this.loadFinancialPremiumsAllPaymentsListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadFinancialPremiumsAllPaymentsListGrid();
  }

  private loadFinancialPremiumsAllPaymentsListGrid(): void {
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
    this.loadFinancialPremiumsAllPaymentsListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadFinancialPremiumsAllPaymentsListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
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
      '/financial-management/premiums/'+ this.premiumsType +'/payments/reconcile-payments',
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
