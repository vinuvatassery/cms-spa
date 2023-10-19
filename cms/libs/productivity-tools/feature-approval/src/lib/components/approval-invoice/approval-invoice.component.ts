/** Angular libraries **/
import {  ChangeDetectionStrategy,ChangeDetectorRef,Component, Input, ViewChild, OnInit,OnChanges, OnDestroy } from '@angular/core'; 
import { Router } from '@angular/router';

/** External libraries **/
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Subscription,Subject } from 'rxjs';
/** Facade **/
import { ProductivityInvoiceFacade } from '@cms/productivity-tools/domain';
import { ColumnComponent, ColumnVisibilityChangeEvent, GridComponent,GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  selector: 'productivity-tools-approval-invoice',
  templateUrl: './approval-invoice.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalInvoiceComponent implements OnInit, OnChanges, OnDestroy{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isInvoiceGridLoaderShow = false;
  @Input() exceptionId: any;
  @ViewChild(GridComponent)
  
  public sortValue = this.productivityInvoiceFacade.sortValue;
  public sortType = this.productivityInvoiceFacade.sortType;
  public pageSizes = this.productivityInvoiceFacade.gridPageSizes;
  public gridSkipCount = this.productivityInvoiceFacade.skipCount;
  public sort = this.productivityInvoiceFacade.sort;
  public state!: any;
  sortColumn = 'Entry Date';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;

  invoiceGridView$ = this.productivityInvoiceFacade.invoiceData$;
  invoiceGridViewDataSubject = new Subject<any>();
  invoiceListData$ =  this.invoiceGridViewDataSubject.asObservable();

  providerId:any;
  isInvoiceLoading$=  this.productivityInvoiceFacade.isInvoiceLoading$
  isInvoiceLoadingSubscription!:Subscription;
 
  invoiceGrid!: GridComponent;

  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  addRemoveColumns="Default Columns"
  columns : any;  
  dropDowncolumns : any;
   /** Constructor **/
   constructor(private readonly cdr: ChangeDetectorRef,
               private readonly productivityInvoiceFacade: ProductivityInvoiceFacade,
               private readonly router: Router) {}

  ngOnInit(): void {
    this.loadColumnsData();  
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
    this.loadGeneralExceptionInvoiceGrid();
    this.isInvoiceLoadingSubscription = this.isInvoiceLoading$.subscribe((data:boolean)=>{
      this.isInvoiceGridLoaderShow = data;
    })
  }

  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadGeneralExceptionInvoiceGrid();
  }

  ngOnDestroy(): void {
    this.isInvoiceLoadingSubscription.unsubscribe();
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
    let operator= "startswith"

    if(this.selectedColumn ==="serviceCost" || this.selectedColumn ==="amountDue")
    {
      operator = "eq"
    }
    
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'entryDate',
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

    if(stateData.filter?.filters.length > 0)
    {
      let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.filter = stateFilter.value;
      this.isFiltered = true;
      const filterList = []
      for(const filter of stateData.filter.filters)
      {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.filteredBy =  filterList.toString();
    }
    else
    {
      this.filter = "";
      this.isFiltered = false
    }
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
    this.invoiceGridView$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.invoiceGridViewDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isInvoiceGridLoaderShow = false;
      }
    });
  }

  public columnChange(e: any) {
    let event = e as ColumnVisibilityChangeEvent;
    const columnsRemoved = event?.columns.filter(x=> x.hidden).length
    const columnsAdded = event?.columns.filter(x=> x.hidden === false).length

  if (columnsAdded > 0) {
    this.addRemoveColumns = 'Columns Added';
  }
  else {
    this.addRemoveColumns = columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }

  event.columns.forEach(column => {
    if (column.hidden) {
      const field = (column as ColumnComponent)?.field;
      const mainFilters = this.state.filter.filters;

      mainFilters.forEach((filter:any) => {
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
  private loadColumnsData()
  {
    this.columns = {
      invoiceId:"Invoice ID",
      serviceStartDate:"Service Start",
      serviceEndDate:"Service End",
      cptCode:"CPT Code",
      medicalService:"Medical Service",
      serviceCost:"Service Cost",
      amountDue:"Amount Due",
      paymentTypeDesc:"Payment Type",
      entryDate:"Entry Date"   
    }
    this.dropDowncolumns = [
      {"columnCode": "invoiceId","columnDesc": "Invoice ID"},
      {"columnCode": "serviceStartDate","columnDesc": "Service Start"},
      {"columnCode": "serviceEndDate","columnDesc": "Service End" },
      {"columnCode": "cptCode","columnDesc": "CPT Code" },
      {"columnCode": "medicalService","columnDesc": "Medical Service"},
      {"columnCode": "serviceCost","columnDesc": "Service Cost"},
      {"columnCode": "amountDue","columnDesc": "Amount Due"},
      {"columnCode": "paymentTypeDesc","columnDesc": "Payment Type"},
      {"columnCode": "entryDate","columnDesc": "Entry Date"}
    ]
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
      exceptionId:this.exceptionId,
      skipCount: skipCountValue,
      pageSize: maxResultCountValue,
      sort: sortValue,
      sortType: sortTypeValue,
      filter : this.state?.["filter"]?.["filters"] ?? []
    };
    this.loadInvoiceListGrid(gridDataRefinerValue);
    this.gridDataHandle();
  }

  
  loadInvoiceListGrid(data: any) {
    this.productivityInvoiceFacade.loadInvoiceListGrid(data);
  }
}
