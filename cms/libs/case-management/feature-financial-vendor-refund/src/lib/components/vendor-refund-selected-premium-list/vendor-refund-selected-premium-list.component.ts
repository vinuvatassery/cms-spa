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
   @Input() editPaymentRequestId:any
     public state!: State;
     filter!: any;  
  @Output() insuranceRefundInformationConfirmClicked = new EventEmitter<any>();
  @Output() onProviderNameClickEvent = new EventEmitter<any>()
  public totalAmountPaid =0;
  public totalRefundAmount=0
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  financialPremiumsRefundGridLists!: any[];
 @Input() gridDataResult! : GridDataResult
 @Input() clientId :any 
@Input() vendorAddressId :any 
 public formUiStyle: UIFormStyle = new UIFormStyle();
  refundNoteValueLength = 0
  @Input() isEdit = false
  isSubmitted = false;
  @Input() insuraceAddRefundClick$:any
  @Output() Reqpayload = new EventEmitter<any>()
  refundForm = this.formBuilder.group({
    vp: ['', Validators.required],
    creditNumber: ['', Validators.required],
    warantNumber: ['', Validators.required],
    depositDate: [''],
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
    }else{
       const refundRequests :any[] =[]
      this.financialPremiumsRefundGridLists.forEach(x=>{
        refundRequests.push({
          ...x,
          voucherPayable: this.refundForm.controls['vp']?.value,
          refundWarrantNumber: this.refundForm.controls['warantNumber']?.value,
          depositDate:this.refundForm.controls['depositDate']?.value,
          refundNote:this.refundForm.controls['refundNote']?.value,
        })
      })

      const payload ={
        vendorId : this.vendorAddressId,
        clientId : this.clientId,
        creditNumber:"0",
        voucherPayable: this.refundForm.controls['vp']?.value,
        warrantNumber: this.refundForm.controls['warantNumber']?.value,
        depositDate:this.refundForm.controls['depositDate']?.value,
        Notes:this.refundForm.controls['refundNote']?.value,
        addRefundDto: refundRequests,
        refundType:"insurance"
      }

      if(this.isEdit){
        this.Reqpayload.emit({
          data: refundRequests,
          vendorId  : this.vendorAddressId,
          clientId : this.clientId,

        })
      }else{
      this.Reqpayload.emit({
        data: payload,
        vendorId  : this.vendorAddressId
      })
    }
    }
  })
}



  refundAmountChange(dataItem:any){
   if(dataItem.amountPaid < dataItem.refundAmount ){
     dataItem.refundAmountError="Refund amount cannot be greater than claim amount"
   }else{
    dataItem.refundAmountError=""
   }
   this.totalRefundAmount = this.financialPremiumsRefundGridLists.map(x=> x.refundAmount).reduce((a, b) => a + b, 0)       
  
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
    sort: [{ field: 'creationTime', dir: 'asc' }]
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
       const formData =  this.financialPremiumsRefundGridLists &&  this.financialPremiumsRefundGridLists[0]
       this.refundForm.patchValue({
        vp: formData.voucherPayabeNbr,
        creditNumber:formData.creditNumber,
        warantNumber:formData.warantNumber ,
        depositDate:formData.depositDate,
        refundNote:formData.refundNote
       })
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
