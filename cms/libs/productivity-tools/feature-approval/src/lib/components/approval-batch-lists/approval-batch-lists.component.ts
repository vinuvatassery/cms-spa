import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, OnChanges,Input, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import {  GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy
} from '@progress/kendo-data-query';
import { Observable, Subject, first } from 'rxjs';
import { FilterService } from '@progress/kendo-angular-treelist/filtering/filter.service';
import { PendingApprovalPaymentFacade/*, PaymentBatchName, PaymentStatusCode*/ } from '@cms/productivity-tools/domain';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, ReminderNotificationSnackbarService, ReminderSnackBarNotificationType, SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
  selector: 'productivity-tools-approval-batch-lists',
  templateUrl: './approval-batch-lists.component.html', 
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalBatchListsComponent implements OnInit, OnChanges{
  @Input() batchId?: string | null;
  @Input() currentBatch?: any;
  @Input() pageSizes: any;
  //pageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  @Input() sortValue: any;
  @Input() sortType: any;
  //sortType = 'asc';
  @Input() sort: any;
  // @Input() loader$!: Observable<boolean>;
  //loader$!: Observable<boolean>;
  @Input() batchPaymentGridList$: any;
  @Output() closeViewPaymentsBatchClickedEvent = new EventEmitter();
  @Output() loadBatchPaymentListEvent = new EventEmitter<any>();
  public state!: State;
  //batchPaymentGridLists$: any;
  isBatchPaymentGridLoaderShow = false;
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

  gridBatchPaymentDataSubject = new Subject<any>();
  gridBatchPaymentData$ = this.gridBatchPaymentDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  gridColumns: { [key: string]: string } = {
    paymentNbr: 'Item #',
    invoiceNbr: 'Invoice ID',
    vendorName: 'Provider Name',
    amountDue: 'Total Due',
    paymentMethodCode: 'Payment Method',
    serviceCount: 'Service Count',
    clientFullName: 'Client Name',
    nameOnInsuranceCard: 'Name on Primary Insurance Card',
    clientId: 'Client ID',
    paymentStatusCode: 'Payment Status',
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
  public width = "100%";
  public height = "100%";
  public formUiStyle: UIFormStyle = new UIFormStyle();
  items = [
    {},{}
  ];

  // gridBatchPaymentsDataSubject = new Subject<any>();
  // gridBatchPaymentsData$ = this.gridBatchPaymentsDataSubject.asObservable();
  // columnDropListSubject = new Subject<any[]>();
  // columnDropList$ = this.columnDropListSubject.asObservable();
  // filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  constructor(private configurationProvider: ConfigurationProvider) {}

  ngOnInit(): void {
    // this.sortColumnName = 'Item #';
     //this.defaultGridState();
    //this.loadBatchPaymentListGrid();
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadBatchPaymentListGrid();
  }

  closeViewPaymentsBatchClicked() {
    this.closeViewPaymentsBatchClickedEvent.emit(true);
  }

  private loadBatchPaymentListGrid(): void {
    this.loadBatchPayment(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }

  loadBatchPayment(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isBatchPaymentGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: this.sortColumn ?? 'paymentNbr',
      sortType: sortTypeValue ?? 'asc',
      filter: this.filter,
    };
    let batchId = this.batchId;
    console.log('12-loadBatchPayment',gridDataRefinerValue);
    this.loadBatchPaymentListEvent.emit({gridDataRefinerValue, batchId});
    this.gridDataHandle();
    //this.currentPrintAdviceLetterGridFilter = this.filter;
  }

  gridDataHandle() {
    this.batchPaymentGridList$.subscribe((data: any) => {
      console.log('2',data);
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridBatchPaymentDataSubject.next(this.gridDataResult);console.log('3',this.gridDataResult)
      if (data?.total >= 0 || data?.total === -1) { 
        this.isBatchPaymentGridLoaderShow = false;
      }
    });
    this.isBatchPaymentGridLoaderShow = false;
  }

  onChange(data: any) {
    this.defaultGridState();
    const stateData = this.state;
    this.dataStateChange(stateData);
  }
  
  // onChange(data: any) {
  //   this.defaultGridState();

  //   this.filterData = {
  //     logic: 'and',
  //     filters: [
  //       {
  //         filters: [
  //           {
  //             field: this.selectedColumn ?? 'batch',
  //             operator: 'startswith',
  //             value: data,
  //           },
  //         ],
  //         logic: 'and',
  //       },
  //     ],
  //   };
  //   const stateData = this.state;
  //   stateData.filter = this.filterData;
  //   this.dataStateChange(stateData);
  // }

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
    this.loadBatchPaymentListGrid();
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

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadBatchPaymentListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
}
