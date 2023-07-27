/** Angular libraries **/
import {  Component, Input, ViewChild, OnInit,OnChanges, OnDestroy } from '@angular/core'; 
import { Router } from '@angular/router';

/** External libraries **/
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs';

/** Facade **/
import { ProductivityInvoiceFacade } from '@cms/productivity-tools/domain';
import { GridComponent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'productivity-tools-approval-invoice',
  templateUrl: './approval-invoice.component.html',
})
export class ApprovalInvoiceComponent implements OnInit, OnChanges, OnDestroy{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isInvoiceGridLoaderShow = false;
  public sortValue = this.productivityInvoiceFacade.sortValue;
  public sortType = this.productivityInvoiceFacade.sortType;
  public pageSizes = this.productivityInvoiceFacade.gridPageSizes;
  public gridSkipCount = this.productivityInvoiceFacade.skipCount;
  public sort = this.productivityInvoiceFacade.sort;
  public state!: State;
  invoiceGridView$ = this.productivityInvoiceFacade.invoiceData$;
  providerId:any;
  isInvoiceLoading$=  this.productivityInvoiceFacade.isInvoiceLoading$
  isInvoiceLoadingSubscription!:Subscription;
  @Input() tabCode: any;
  @Input() vendorId: any;
  @ViewChild(GridComponent)
  invoiceGrid!: GridComponent;

   /** Constructor **/
   constructor(private readonly productivityInvoiceFacade: ProductivityInvoiceFacade,private readonly router: Router) {}

  ngOnInit(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
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
    };
  }

  ngOnDestroy(): void {
    this.isInvoiceLoadingSubscription.unsubscribe();
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

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadInvoiceListGrid();
  }

  loadInvoiceListGrid() {
    this.productivityInvoiceFacade.loadInvoiceListGrid(this.state,this.tabCode,this.sortValue,this.sortType);
  }

  

 

 
}
