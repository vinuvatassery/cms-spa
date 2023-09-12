/** Angular libraries **/
import { ChangeDetectionStrategy, Component, Input, ViewChild, OnInit, OnDestroy } from '@angular/core'; 
import { Router } from '@angular/router';

/** External libraries **/
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs';

/** Facade **/
import { FinancialVendorProviderTabCode, InvoiceFacade } from '@cms/case-management/domain';
import { FilterService, GridComponent } from '@progress/kendo-angular-grid';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'cms-invoices',
  templateUrl: './invoices.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class InvoicesComponent implements OnInit, OnDestroy {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isInvoiceGridLoaderShow = false;
  public sortValue = this.invoiceFacade.sortValue;
  public sortType = this.invoiceFacade.sortType;
  public pageSizes = this.invoiceFacade.gridPageSizes;
  public gridSkipCount = this.invoiceFacade.skipCount;
  public sort = this.invoiceFacade.sort;
  public state!: State;
  invoiceGridView$ = this.invoiceFacade.invoiceData$;
  providerId:any;
  isInvoiceLoading$=  this.invoiceFacade.isInvoiceLoading$
  claimStatus$ = this.lovFacade.paymentStatus$
  isInvoiceLoadingSubscription!:Subscription;
  @Input() tabCode: any;
  @Input() vendorId: any;
  @ViewChild(GridComponent)
  invoiceGrid!: GridComponent;
  claimsType: any = 'dental';
  filter!: any;
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  claimStatus:any;
   /** Constructor **/
   constructor(private readonly invoiceFacade: InvoiceFacade,private readonly router: Router,
    private readonly lovFacade: LovFacade,) {}

  ngOnInit(): void {
    this.claimStatusSubscription();
    this.lovFacade.getPaymentStatusLov();
    if(this.tabCode === FinancialVendorProviderTabCode.MedicalProvider){
      this.claimsType = 'medical';
    } 
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      filter : this.filter === undefined?null:this.filter
    };
    
    this.loadInvoiceListGrid();
    this.isInvoiceLoadingSubscription = this.isInvoiceLoading$.subscribe((data:boolean)=>{
      this.isInvoiceGridLoaderShow = data;
    })

  }

  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter : this.filter === undefined?null:this.filter
    };
  }

  ngOnDestroy(): void {
    this.isInvoiceLoadingSubscription.unsubscribe();
  }

  claimStatusSubscription(){
    this.claimStatus$.subscribe(data=>{
      this.claimStatus = data;
    });
  }
  dropdownFilterChange(field:string, value: any, filterService: FilterService): void {
    filterService.filter({
        filters: [{
          field: field,
          operator: "eq",
          value:value.lovCode
      }],
        logic: "or"
    });
  }
  
  public dataStateChange(stateData: any): void {
    this.collapseAll(this.state?.take);
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.loadInvoiceListGrid();
  }

  collapseAll(rowCount:any){
    for(let i=0; i<rowCount;i++){
      this.invoiceGrid.collapseRow(i)
    }
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadInvoiceListGrid();
  }

  loadInvoiceListGrid() {
    this.invoiceFacade.loadInvoiceListGrid(this.vendorId,this.state,this.tabCode,this.sortValue,this.sortType);
  }

  onClientClicked(clientId: any) {
      this.router.navigate([`/case-management/cases/case360/${clientId}`]);
      
  }

  onBatchClicked(batchId : any) {
    this.router.navigate([`/financial-management/claims/${this.claimsType}/batch`],
    { queryParams :{bid: batchId}});
  } 

  onExpand(event:any) {
    this.invoiceFacade.loadPaymentRequestServices(event.dataItem,this.vendorId,this.tabCode)   
  } 
}
