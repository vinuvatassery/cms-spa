import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FinancialClaimsFacade, FinancialPharmacyClaimsFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade, UserManagementFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { ColumnComponent, ColumnVisibilityChangeEvent, FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'cms-pharmacy-claims-batches-reconcile-payments-breakout',
  templateUrl:
    './pharmacy-claims-batches-reconcile-payments-breakout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsBatchesReconcilePaymentsBreakoutComponent implements OnInit,OnChanges{
  public gridSkipCount  : any;
  isGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValueBreakOut: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() reconcilePaymentBreakoutList$ :any;
  @Input() batchId:any;
  @Input() entityId:any;
  @Input() paymentRequestType$: any;
  @Input() paymentStatus$:any
  @Input() reconcilePaymentBreakoutLoaderList$:any;
  @Input() deliveryMethodLov$:any;
  @Input() pharmacyBreakoutProfilePhoto$!: any;
  @Input() claimsType: any;
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
  recentClaimsGridLists$ = this.financialPharmacyClaimsFacade.recentClaimsGridLists$;
  paymentRequestType:any
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  addRemoveColumns="Default Columns";
  reconcilePaymentBreakoutLoader:any=true;
  deliveryMethods!:any;
  columns : any = {
    clientName:"Client Name",
    nameOnPrimaryInsuranceCard:"Name on Primary Insurance Card",
    clientId:"Client ID",
    rxNumber:"RX Number",
    prescriptionFillDate:"Fill Date",
    brandName:"Brand Name",
    drugName:"Drug Name",
    paymentTypeDesc:"Payment Type",
    amountPaid:"Amount Paid",
    productType:"Product Type",
    ndcCode:"NDC Code",
    indexCode:"Index Code",
    pcaCode:"PCA Code",
    objectCode:"Object Code",
    rxQty:"RX Qty",
    unit:"Unit",
    rxDaysSupply:"RX Days Supply",
    creationTime:"Entry Date"
  }  

  gridReconcilePaymentBreakoutListSubject = new Subject<any>();
  gridReconcilePaymentBreakout$ = this.gridReconcilePaymentBreakoutListSubject.asObservable();
  selectedPaymentType: string | null = null;
  selectedPaymentStatus: string | null = null;
  selectedDeliveryMethod: string | null = null;
  paymentMethodTypes: any = [];
  paymentStatus: any = [];
  
  pharmacyBreakoutSubscription = new Subscription();
  pharmacyBreakoutProfilePhotoSubject = new Subject();
  sortValueRecentClaimList = this.financialPharmacyClaimsFacade.sortValueRecentClaimList;
  sortRecentClaimList = this.financialPharmacyClaimsFacade.sortRecentClaimList;
  pharmacyRecentClaimsProfilePhoto$ = this.financialPharmacyClaimsFacade.pharmacyRecentClaimsProfilePhoto$;
  constructor(private readonly cdr: ChangeDetectorRef, private route: Router, private dialogService: DialogService,private readonly lovFacade: LovFacade, private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly userManagementFacade: UserManagementFacade,private readonly financialPharmacyClaimsFacade : FinancialPharmacyClaimsFacade) { }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
   }
  ngOnInit(): void {
     this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.paymentRequestType$.subscribe((paymentRequestType:any) => {
      this.paymentRequestType= paymentRequestType;
    });
    this.paymentStatus$.subscribe((paymentStatus:any) => {
      this.paymentStatus= paymentStatus;
    });
    this.reconcilePaymentBreakoutLoaderList$.subscribe((reconcilePaymentBreakoutLoader:any)=>{
      this.reconcilePaymentBreakoutLoader = reconcilePaymentBreakoutLoader;
    });
    this.deliveryMethodLov$.subscribe((deliveryMethods:any)=>{
      this.deliveryMethods = deliveryMethods;
    });
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
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValueBreakOut,
      this.sortType,
    );
  }
  loadBreakList(
    batchId:any,
    entityId:any,
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isGridLoaderShow = true;
    const gridDataRefinerValue = {
      batchId:batchId,
      entityId:entityId,
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      filter : this.filter === undefined?null:this.filter
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
    this.sortValueBreakOut = stateData.sort[0]?.field ?? this.sortValueBreakOut;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sortValueBreakOut[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.filter = stateData?.filter?.filters;

    this.sortColumn = this.columns[stateData.sort[0]?.field];

    if (stateData.filter?.filters.length > 0) {
      this.isFiltered = true;
      const filterList = [];
      for (const filter of stateData.filter.filters) {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.filteredBy = filterList.toString();
    } else {
      this.filter = null;
      this.isFiltered = false;
    }
    this.loadPaymentBreakoutGrid();
  }

  pageSelectionchange(data: any) {
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

  clientRecentClaimsModalClicked(
    template: TemplateRef<unknown> ,
    data:any): void {
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
    this.clientName = data.clientName;
  }

  closeRecentClaimsModal(result: any){
    if (result) {
      this.addClientRecentClaimsDialog.close();
    }
  }

   onClientClicked(clientId: any) {
    this.route.navigate([`/case-management/cases/case360/${clientId}`]);
    this.addClientRecentClaimsDialog.close();
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    if (field === 'paymentTypeDesc') this.selectedPaymentType = value;
    if (field === 'paymentStatusDesc') this.selectedPaymentStatus = value;
    if (field === 'unit') this.selectedDeliveryMethod = value;
    filterService.filter({
      filters: [
        {
          field: field,
          operator: 'eq',
          value: value.lovDesc,
        },
      ],
      logic: 'and',
    });
  }

  loadRecentClaimListEventHandler(data : any){
    this.financialPharmacyClaimsFacade.loadRecentClaimListGrid(data);
  }
  
}
