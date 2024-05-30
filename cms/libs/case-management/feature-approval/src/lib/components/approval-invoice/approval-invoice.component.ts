/** Angular libraries **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';

/** External libraries **/
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Subscription, Subject } from 'rxjs';
/** Facade **/
import {
  ColumnComponent,
  ColumnVisibilityChangeEvent,
  FilterService,
  GridDataResult,
} from '@progress/kendo-angular-grid';
import { LovFacade } from '@cms/system-config/domain';
import { PendingApprovalGeneralFacade } from '@cms/case-management/domain';
@Component({
  selector: 'productivity-tools-approval-invoice',
  templateUrl: './approval-invoice.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalInvoiceComponent implements OnInit, OnDestroy {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isInvoiceGridLoaderShow = false;
  @Input() exceptionId: any;
  public sortValue = this.pendingApprovalGeneralFacade.sortValue;
  public sortType = this.pendingApprovalGeneralFacade.sortType;
  public pageSizes = this.pendingApprovalGeneralFacade.gridPageSizes;
  public gridSkipCount = this.pendingApprovalGeneralFacade.skipCount;
  public sort = this.pendingApprovalGeneralFacade.sort;
  @Output() loadApprovalsExceptionInvoiceEvent = new EventEmitter<any>();
  public state!: any;
  sortColumn = 'Service Start';
  sortDir = 'Ascending';
  sortColumnDesc: string = 'Service Start';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;

  invoiceData$ = this.pendingApprovalGeneralFacade.invoiceData$;
  invoiceDataSubscription! : Subscription;
  invoiceGridViewDataSubject = new Subject<any>();
  invoiceGridView$ =  this.invoiceGridViewDataSubject.asObservable();
  isInvoiceLoading$ = this.pendingApprovalGeneralFacade.isInvoiceLoading$;
  isInvoiceLoadingSubject = new Subject<boolean>();
  isInvoiceLoadingData$ = this.isInvoiceLoadingSubject.asObservable();
  providerId: any;
  isInvoiceLoadingSubscription!: Subscription;

  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  addRemoveColumns = 'Default Columns';
  columns: any;
  dropDowncolumns: any;

  selectedPaymentType: string | null = null;
  paymentRequestTypes$ = this.lovFacade.paymentRequestType$;
  paymentRequestTypes: any = [];
  paymentRequestTypesSubscription! : Subscription;
  paymentTypeFilter = '';
  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly lovFacade: LovFacade,
    private readonly pendingApprovalGeneralFacade: PendingApprovalGeneralFacade
  ) {}

  ngOnInit(): void {
    this.loadColumnsData();
    this.getCoPaymentRequestTypeLov();
    this.initializeGridState();
    this.loadGeneralExceptionInvoiceGrid();
  }

  private clearSelectedColumn() {
    this.selectedColumn = '';
    this.filter = '';
    this.state.searchValue = '';
    this.state.selectedColumn = '';
    this.state.columnName = '';
  }

  onChange(data: any) {
    this.defaultGridState();
    let operator = 'startswith';

    if (
      this.selectedColumn === 'serviceCost' ||
      this.selectedColumn === 'amountDue'
    ) {
      operator = 'eq';
    }

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'serviceStartDate',
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
      let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
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
    if (!this.filteredBy.includes('Payment Type'))
      this.selectedPaymentType = '';
    this.loadGeneralExceptionInvoiceGrid();
  }

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadGeneralExceptionInvoiceGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.isInvoiceGridLoaderShow = true;
    this.invoiceDataSubscription = this.invoiceData$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.invoiceGridViewDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isInvoiceGridLoaderShow = false;
      } 
      this.isInvoiceGridLoaderShow = false;
    });
  }

  public columnChange(e: any) {
    let event = e as ColumnVisibilityChangeEvent;
    const columnsRemoved = event?.columns.filter((x) => x.hidden).length;
    const columnsAdded = event?.columns.filter(
      (x) => x.hidden === false
    ).length;

    if (columnsAdded > 0) {
      this.addRemoveColumns = 'Columns Added';
    } else {
      this.addRemoveColumns =
        columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
    }

    event.columns.forEach((column) => {
      if (column.hidden) {
        const field = (column as ColumnComponent)?.field;
        const mainFilters = this.state.filter.filters;

        mainFilters.forEach((filter: any) => {
          const filterList = filter.filters;

          const foundFilter = filterList.find((x: any) => x.field === field);

          if (foundFilter) {
            filter.filters = filterList.filter((x: any) => x.field !== field);
            this.clearSelectedColumn();
          }
        });
      }
      if (!column.hidden) {
        let columnData = column as ColumnComponent;
        this.columns[columnData.field] = columnData.title;
      }
    });
  }
  private loadColumnsData() {
    this.columns = {
      invoiceId: 'Invoice ID',
      serviceStartDate: 'Service Start',
      serviceEndDate: 'Service End',
      cptCode: 'CPT Code',
      medicalService: 'Medical Service',
      serviceCost: 'Service Cost',
      amountDue: 'Amount Due',
      paymentTypeDesc: 'Payment Type',
      entryDate: 'Entry Date',
    };
    this.dropDowncolumns = [
      { columnCode: 'invoiceId', columnDesc: 'Invoice ID' },
      { columnCode: 'serviceStartDate', columnDesc: 'Service Start' },
      { columnCode: 'serviceEndDate', columnDesc: 'Service End' },
      { columnCode: 'cptCode', columnDesc: 'CPT Code' },
      { columnCode: 'medicalService', columnDesc: 'Medical Service' },
      { columnCode: 'serviceCost', columnDesc: 'Service Cost' },
      { columnCode: 'amountDue', columnDesc: 'Amount Due' },
      { columnCode: 'paymentTypeDesc', columnDesc: 'Payment Type' },
      { columnCode: 'entryDate', columnDesc: 'Entry Date' },
    ];
  }

  loadGeneralExceptionInvoiceGrid() {
    this.loadInvoice(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }

  loadInvoice(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isInvoiceGridLoaderShow = true;
    const gridDataRefinerValue = {
      exceptionId: this.exceptionId,
      skipCount: skipCountValue,
      pageSize: maxResultCountValue,
      sort: sortValue,
      sortType: sortTypeValue,
      filter: this.state?.['filter']?.['filters'] ?? [],
    };
    this.loadInvoiceListGrid(gridDataRefinerValue);
    this.gridDataHandle();
  }

  loadInvoiceListGrid(data: any) {
    this.pendingApprovalGeneralFacade.loadInvoiceListGrid(data);
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    if (field === 'paymentTypeDesc') this.selectedPaymentType = value;
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

  private getCoPaymentRequestTypeLov() {
    this.lovFacade.getCoPaymentRequestTypeLov();
    this.paymentRequestTypesSubscription = this.paymentRequestTypes$.subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          item.lovDesc = item.lovDesc.toUpperCase();
        });
        this.paymentRequestTypes = data.sort(
          (value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr
        );
      },
    });
  }

  private initializeGridState() {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: [{ field: 'serviceStartDate', dir: 'desc' }],
    };
    this.sortColumnDesc = 'Service Start';
  }

  ngOnDestroy(): void {
    this.paymentRequestTypesSubscription?.unsubscribe();
    this.invoiceDataSubscription?.unsubscribe();
  }
}