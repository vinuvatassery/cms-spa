import { ChangeDetectionStrategy,ChangeDetectorRef, Component,Input,Output,EventEmitter, OnInit,OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { GridDataResult,ColumnVisibilityChangeEvent, ColumnComponent } from '@progress/kendo-angular-grid';
import { DialogService } from '@progress/kendo-angular-dialog';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
@Component({
  selector: 'cms-financial-premiums-batches-reconcile-payments-breakout',
  templateUrl:
    './financial-premiums-batches-reconcile-payments-breakout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsBatchesReconcilePaymentsBreakoutComponent  implements OnInit,OnChanges{
  public gridSkipCount  : any;
  isGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() reconcileBreakoutList$ :any;
  @Input() premiumsType: any;
  @Input() batchId:any;
  @Input() entityId:any;
  @Output() loadReconcilePaymentBreakOutGridEvent = new EventEmitter<any>();
  vendorId:any;
  clientId:any;
  clientName:any;
  public state!: any;
  public formUiStyle : UIFormStyle = new UIFormStyle();   
  sortColumn = 'creationDate';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  addRemoveColumns="Default Columns"
  columns : any = {
    vendorName:"Insurance Vendor",
    itemCount:"Item Count",
    totalAmount:"Total Amount",
    creationTime:"Date Payment Requested",
    paymentSentDate:"Date Payment Sent",
    paymentMethodDesc:"Payment Method",
    paymentStatusCode:"Payment Status",
    warrantNumber:"Warrant Number",    
    pca:"PCA" 
  }
  
  dropDowncolumns : any = [
    {   "columnCode": "vendorName",         "columnDesc": "Insurance Vendor"            },
    {   "columnCode": "itemCount",          "columnDesc": "Item Count"                  },
    {   "columnCode": "totalAmount",        "columnDesc": "Total Amount"                },
    {   "columnCode": "creationTime",       "columnDesc": "Date Payment Requested"      },
    {   "columnCode": "paymentSentDate",    "columnDesc": "Date Payment Sent"           },
    {   "columnCode": "paymentMethodDesc",  "columnDesc": "Payment Method"              },
    {   "columnCode": "paymentStatusCode",  "columnDesc": "Payment Status"              },
    {   "columnCode": "warrantNumber",      "columnDesc": "Warrant Number"              },
    {   "columnCode": "pca",                "columnDesc": "PCA"                         }  
  ]

  gridReconcileIPBreakoutListSubject = new Subject<any>();
  gridReconcileIPBreakoutList$ = this.gridReconcileIPBreakoutListSubject.asObservable();


  constructor(private readonly cdr: ChangeDetectorRef, private route: Router, private dialogService: DialogService) { }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
   }
  ngOnInit(): void {
     this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }

  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadPaymentBreakoutGrid();
  }

  private loadPaymentBreakoutGrid(): void {
    this.loadBreakList(
      this.batchId,
      this.entityId,
      this.premiumsType,
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
    );
  }
  loadBreakList(
    batchId:any,
    entityId:any,
    claimsType:any,
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isGridLoaderShow = true;
    const gridDataRefinerValue = {
      batchId:batchId,
      entityId:entityId,
      claimsType:claimsType,
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      filter : this.state?.["filter"]?.["filters"] ?? []
    };
   this.loadPaymentBreakout(gridDataRefinerValue);
  }

  onChange(data: any) {
    this.defaultGridState();
    let operator= "startswith"

    if(this.selectedColumn ==="amountDue")
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
  loadPaymentBreakout(gridDataRefinerValue:any) {
    this.loadReconcilePaymentBreakOutGridEvent.emit(gridDataRefinerValue);
    this.isGridLoaderShow=false;
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
    this.loadPaymentBreakoutGrid();    
  }

  pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadPaymentBreakoutGrid();
  }
  gridDataHandle() {
    this.gridReconcileIPBreakoutListSubject.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridReconcileIPBreakoutListSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isGridLoaderShow = false;
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

  private clearSelectedColumn() {
    this.selectedColumn = '';
    this.filter = '';
    this.state.searchValue = '';
    this.state.selectedColumn = '';
    this.state.columnName = '';
  }
}
