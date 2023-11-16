/** Angular **/
import {  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GridFilterParam } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs';
 

@Component({
  selector: 'cms-vendor-refund-selected-premium-list',
  templateUrl: './vendor-refund-selected-premium-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorRefundSelectedPremiumListComponent implements  OnInit  {

  
   paymentStatusCode =null
   paymentStatusLovSubscription!:Subscription;
   paymentStatusType:any;
   @Input() refundInformationLoader$:any
   @Input() insuranceRefundInformation$:any
   @Input() sortValue:any
   @Input() sort :any
   @Input() pageSizes :any
   @Input() sortType :any
     public state!: State;
     filter!: any;  
  @Output() insuranceRefundInformationConfirmClicked = new EventEmitter<any>();
  @Output() onProviderNameClickEvent = new EventEmitter<any>()
  public totalAmountPaid =0;
  public totalRefundAmount=0
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  financialPremiumsRefundGridLists!: any[];
 @Input() gridDataResult! : GridDataResult
 @Input() clientId :any =30104

 public formUiStyle: UIFormStyle = new UIFormStyle();
  refundNoteValueLength = 0
  isSubmitted = false;
  @Input() insuraceAddRefundClick$:any
  refundForm = this.formBuilder.group({
    vp: ['', Validators.required],
    creditNumber: ['', Validators.required],
    warantNumber: ['', Validators.required],
    depositDate: ['', Validators.required],
    refundNote:['']
  })
  public constructor(private formBuilder : FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef){
    
  }

 
 ngOnInit(): void {
  this.initializeRefunInformationGrid()
  this.insuraceAddRefundClick$.subscribe((res:any) =>{
    this.changeDetectorRef.markForCheck()
    this.isSubmitted = true;
    if (this.refundForm.invalid) {
      return;
    }
  })
}



  refundAmountChange(dataItem:any){
   if(dataItem.amountDue < dataItem.refundAmount ){
     dataItem.refundAmountError="Refund Amount cannot be greater than claim amount"
   }
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
    if(field == "paymentStatusCode"){
      this.paymentStatusCode = value;
    }
  }

  initializeRefunInformationGrid(){
  this.state = {
    skip: 0,
    take: this.pageSizes[0]?.value,
    sort: [{ field: 'createdDate', dir: 'asc' }]
  };
  this.loadRefundInformationListGrid()
  }  

  private loadRefundInformationListGrid(): void {
    const param = new GridFilterParam(
      undefined,undefined,
      this.sortValue,
      this.sortType,
      JSON.stringify(this.filter))
      this.insuranceRefundInformation$.subscribe((res:any) =>{
        this.financialPremiumsRefundGridLists = res.data
       this.totalRefundAmount = this.financialPremiumsRefundGridLists.map(x=> x.refundAmount).reduce((a, b) => a + b, 0)       
       this.totalAmountPaid = this.financialPremiumsRefundGridLists.map(x=> x.amountPaid).reduce((a, b) => a + b, 0)
     
      })
    this.insuranceRefundInformationConfirmClicked.emit(param);
  }


  filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }


  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;

    this.filter = stateData?.filter?.filters;
    this.loadRefundInformationListGrid();
  }

  
  onProviderNameClick(event:any){
    this.onProviderNameClickEvent.emit(event)
  }

  
  onRefundNoteValueChange(event: any) {
    this.refundNoteValueLength = event.length
  }
}
