/** Angular **/
import {  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridFilterParam } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs';
import { ScrollFocusValidationfacade } from '@cms/system-config/domain';

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
   isSpotPayment = false
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
  @Input() vendorAddressId:any;
  @Input() clientName:any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  refundNoteValueLength = 0
  @Input() isEdit = false
  isSubmitted = false;
  @Input() insuraceAddRefundClick$:any
  @Output() Reqpayload = new EventEmitter<any>()
  refundForm! :FormGroup

  @Input() insurancePremiumPaymentReqIds:any[] =[]
  public constructor(private formBuilder : FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly scrollFocusValidationfacade: ScrollFocusValidationfacade,
    private readonly elementRef: ElementRef,
  ){

  }


 ngOnInit(): void {
  this.initForm()
  this.initializeRefunInformationGrid()
  this.insuraceAddRefundClick$.subscribe((res:any) =>{
    this.changeDetectorRef.markForCheck()
    this.isSubmitted = true;
    this.financialPremiumsRefundGridLists.forEach(x=>{
      if(!x.refundAmount)
      {
        x.refundAmountError = "Refund amount is required"
      }else if(x.refundAmountError)
      {
        return
      }
      else
      {
        x.refundAmountError = ""
      }
    })
    let refundError =   this.financialPremiumsRefundGridLists.filter((x) =>{
      return   !!x.refundAmountError
    })
    if (this.refundForm.invalid || (refundError && refundError.length >0)) {
      this.scrollToValidationError()
    }else{
       const refundRequests :any[] =[]
      this.financialPremiumsRefundGridLists.forEach(x=>{
        refundRequests.push({
          ...x,
          voucherPayabeNbr: this.refundForm.controls['vp']?.value,
          refundWarantNumber: this.refundForm.controls['warantNumber']?.value,
          depositDate:this.refundForm.controls['depositDate']?.value,
          refundNote:this.refundForm.controls['refundNote']?.value,
          creditNumber:this.refundForm.controls['creditNumber']?.value,
          isSpotPayment: this.isSpotPayment
        })
      })

      const payload ={
        vendorId : this.vendorAddressId,
        clientId : this.clientId,
        creditNumber:this.refundForm.controls['creditNumber']?.value,
        voucherPayable: this.refundForm.controls['vp']?.value,
        warrantNumber: this.refundForm.controls['warantNumber']?.value,
        depositDate:this.refundForm.controls['depositDate']?.value,
        notes:this.refundForm.controls['refundNote']?.value,
        isSpotPayment: this.isSpotPayment,
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

initForm(){
  this.refundForm =  this.formBuilder.group({
    vp: ['', Validators.required],
    creditNumber: ['', Validators.required],
    warantNumber: ['', Validators.required],
    refundNote:[''],
    depositDate: [''],

  })
}


  refundAmountChange(dataItem:any){
   if(dataItem.amountPaid < dataItem.refundAmount ){
     dataItem.refundAmountError="Refund amount is greater than the claim."
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
       this.totalAmountPaid = this.financialPremiumsRefundGridLists.map(x=> x.amountDue).reduce((a, b) => a + b, 0)
       const formData =  this.financialPremiumsRefundGridLists &&  this.financialPremiumsRefundGridLists[0]
       this.isSpotPayment = formData.isSpotPayment
       this.refundForm.patchValue({
        vp: formData.voucherPayabeNbr,
        creditNumber:formData.creditNumber,
        warantNumber:formData.refundWarantNumber ,
        refundNote:formData.refundNote
       })
       if(formData.depositDate != null && formData.depositDate !="" && formData.depositDate !=undefined)
       {
        this.refundForm.controls['depositDate'].setValue(new Date(formData.depositDate));
       }
    })
    this.insuranceRefundInformationConfirmClicked.emit(
      {...param,
        paymentRequestsId : this.insurancePremiumPaymentReqIds
      }
      );
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

  scrollToValidationError(){
    const invalidControl = this.scrollFocusValidationfacade.findInvalidControl(this.refundForm, this.elementRef.nativeElement,null);
    if (invalidControl) {
      invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      invalidControl.focus();
    }
  }
}
