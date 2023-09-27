import { Component, EventEmitter, OnInit, OnChanges,Input, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import {  GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { FilterService } from '@progress/kendo-angular-treelist/filtering/filter.service';
@Component({
  selector: 'productivity-tools-approval-batch-lists',
  templateUrl: './approval-batch-lists.component.html',
})
export class ApprovalBatchListsComponent implements OnInit, OnChanges{
  @Input() batchId?: string | null;
  @Input() currentBatch?: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() batchDetailPaymentsList$: any;
  @Input() pendingApprovalPaymentFullList:any;
  @Output() closeViewPaymentsBatchClickedEvent = new EventEmitter();
  @Output() loadBatchDetailPaymentsListEvent = new EventEmitter<any>();
  public state!: State;
  isBatchDetailPaymentsGridLoaderShow = false;
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

  gridBatchDetailPaymentsDataSubject = new Subject<any>();
  gridBatchDetailPaymentsData$ = this.gridBatchDetailPaymentsDataSubject.asObservable();
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

  //constructor() {}

  ngOnInit(): void {
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
    this.isBatchDetailPaymentsGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: this.sortColumn ?? 'paymentNbr',
      sortType: sortTypeValue ?? 'asc',
      filter: this.filter,
    };
    let batchId = this.batchId;
    this.loadBatchDetailPaymentsListEvent.emit({gridDataRefinerValue, batchId});
    this.gridDataHandle();
  }

  gridDataHandle() {
    this.batchDetailPaymentsList$.subscribe((data: any) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridBatchDetailPaymentsDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) { 
        this.isBatchDetailPaymentsGridLoaderShow = false;
      }
    });
    this.isBatchDetailPaymentsGridLoaderShow = false;
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
