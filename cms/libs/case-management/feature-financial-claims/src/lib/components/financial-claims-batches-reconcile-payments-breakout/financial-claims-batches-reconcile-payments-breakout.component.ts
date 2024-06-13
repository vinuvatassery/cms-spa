import { ChangeDetectionStrategy,ChangeDetectorRef, Component,Input,Output,EventEmitter, OnInit,OnChanges,TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FilterService,GridDataResult,ColumnVisibilityChangeEvent, ColumnComponent } from '@progress/kendo-angular-grid';
import { DialogService } from '@progress/kendo-angular-dialog';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { LovFacade } from '@cms/system-config/domain';
import { FinancialClaimsFacade } from '@cms/case-management/domain';
@Component({
  selector: 'cms-financial-claims-batches-reconcile-payments-breakout',
  templateUrl:
    './financial-claims-batches-reconcile-payments-breakout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsBatchesReconcilePaymentsBreakoutComponent implements OnInit,OnChanges{
  public gridSkipCount  : any;
  isGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() reconcilePaymentBreakoutList$ :any;
  @Input() claimsType: any;
  @Input() batchId:any;
  @Input() entityId:any;
  @Input() warrantInfoArray:any[]=[];
  @Output() loadReconcilePaymentBreakOutGridEvent = new EventEmitter<any>();
  vendorId:any;
  clientId:any;
  clientName:any;
  private addClientRecentClaimsDialog: any;
  public state!: any;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  sortColumn = 'entryDate';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  recentClaimsGridLists$ = this.financialClaimsFacade.recentClaimsGridLists$;
  clientBalance$ = this.financialClaimsFacade.clientBalance$;
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  addRemoveColumns="Default Columns"
  columns : any = {
    invoiceNbr:"Invoice ID",
    clientName:"Client Name",
    serviceStartDate:"Service Start Date",
    serviceEndDate:"Service End Date",
    amountDue:"Amount Due",
    paymentStatusCode:"Payment Status",
    warrant:"Warrant Number",
    cptCode:"CPT Code",
    entryDate:"Entry Date"
  }

  dropDowncolumns : any = [
    {
      "columnCode": "invoiceNbr",
      "columnDesc": "Invoice ID"
    },
    {
      "columnCode": "clientName",
      "columnDesc": "Client Name"
    },
    {
      "columnCode": "serviceStartDate",
      "columnDesc": "Service Start Date"
    },
    {
      "columnCode": "serviceEndDate",
      "columnDesc": "Service End Date"
    },
    {
      "columnCode": "amountDue",
      "columnDesc": "Amount Due"
    },
    {
      "columnCode": "paymentStatusDesc",
      "columnDesc": "Payment Status"
    },
    {
      "columnCode": "warrant",
      "columnDesc": "Warrant Number"
    },
    {
      "columnCode": "cptCode",
      "columnDesc": "CPT Code"
    },

    {
      "columnCode": "entryDate",
      "columnDesc": "Entry Date"
    }
  ]

  gridReconcilePaymentBreakoutListSubject = new Subject<any>();
  gridReconcilePaymentBreakout$ = this.gridReconcilePaymentBreakoutListSubject.asObservable();
  selectedPaymentStatus: string | null = null;
  selectedpaymentMethod: string | null = null;
  paymentMethodType$ = this.lovFacade.paymentMethodType$;
  paymentStatus$ = this.lovFacade.paymentStatus$;
  paymentMethodTypes: any = [];
  paymentStatus: any = [];

  constructor(private readonly cdr: ChangeDetectorRef, private route: Router, private dialogService: DialogService,private readonly lovFacade: LovFacade, private readonly financialClaimsFacade: FinancialClaimsFacade) { }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
   }
  ngOnInit(): void {
    this.getPaymentStatusLov();
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
      this.claimsType,
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
      filter : this.state?.["filter"]?.["filters"] ?? [],
      warrantCalculation : this.warrantInfoArray ?? []
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
    if (!this.filteredBy.includes('Payment Status'))
    this.selectedPaymentStatus = '';
    this.loadPaymentBreakoutGrid();
  }

  pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadPaymentBreakoutGrid();
  }
  gridDataHandle() {
    this.gridReconcilePaymentBreakout$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridReconcilePaymentBreakoutListSubject.next(this.gridDataResult);
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

  clientRecentClaimsModalClicked (template: TemplateRef<unknown>, data:any): void {
    this.addClientRecentClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal  app-c-modal-bottom-up-modal',
      animation:{
        direction: 'up',
        type:'slide',
        duration: 200
      }
    });
    this.vendorId=data.vendorId;
    this.clientId=data.clientId;
    this.clientName=data.clientName;
  }

  closeRecentClaimsModal(result: any){
    if (result) {
      this.addClientRecentClaimsDialog.close();
    }
  }

  onClientClicked(clientId: any) {
    this.route.navigate([`/case-management/cases/case360/${clientId}`]);
    this.closeRecentClaimsModal(true);
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    ;
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

  private getPaymentStatusLov() {
    this.lovFacade.getPaymentStatusLov();
    this.paymentStatus$.subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          item.lovDesc = item.lovDesc.toUpperCase();
        });
        this.paymentStatus = data.sort(
          (value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr
        );
      },
    });
  }
}
