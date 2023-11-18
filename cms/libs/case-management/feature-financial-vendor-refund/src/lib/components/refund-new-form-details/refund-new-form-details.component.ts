import { Component , Output, EventEmitter, ViewChild, TemplateRef, Input, OnInit, numberAttribute} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {State, filterBy } from '@progress/kendo-data-query';
import { ContactFacade, FinancialVendorFacade, FinancialVendorRefundFacade, GridFilterParam, ServiceSubTypeCode } from '@cms/case-management/domain'; 
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { Subject } from 'rxjs';
import { VendorRefundClaimsListComponent, VendorRefundInsurancePremiumListComponent } from '@cms/case-management/feature-financial-vendor-refund';
import { VendorRefundClientClaimsListComponent } from '../vendor-refund-client-claims-list/vendor-refund-client-claims-list.component';
import { VendorRefundPharmacyPaymentsListComponent } from '../vendor-refund-pharmacy-payments-list/vendor-refund-pharmacy-payments-list.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
  selector: 'cms-refund-new-form-details',
  templateUrl: './refund-new-form-details.component.html',
})
export class RefundNewFormDetailsComponent implements  OnInit{
 public formUiStyle: UIFormStyle = new UIFormStyle();
  isShownSearchLoader = false;
  selectedRefundType : any;
  public refundType  :any[]=[]
  @Input() isEdit = false
  clientCaseEligibilityId: any = null;
  @Input() clientId: any;

  @Input() clientName: any;
 @Input() vendorId: any;
   selectedProvider:any;
  isRefundGridClaimShow = false;
  isShowReasonForException = false;
  showServicesListForm: boolean =false;
  selectedMedicalProvider: any;
  showGrid: boolean = false;
  tab = 1;
  dataExportParameters!: any;
  providerTin: any;
  selectedClient: any;
  refundClaimForm!: FormGroup;
  @Input() vendorName: any;
  sortType = this.financialVendorRefundFacade.sortType;
  pageSizes = this.financialVendorRefundFacade.gridPageSizes;
  gridSkipCount = this.financialVendorRefundFacade.skipCount;
  /*****   refund INS */
  sortValueRefundInformationGrid = this.financialVendorRefundFacade.sortValueRefundInformationGrid
  sortRefundInformationGrid = this.financialVendorRefundFacade.sortRefundInformationGrid
  state!: State;
  insuranceRefundInformationLoader$ = this.financialVendorRefundFacade.insuranceRefundInformationLoader$;
  insuranceRefundInformation$ = this.financialVendorRefundFacade.insuranceRefundInformation$
  providerDetailsDialog: any;
  vendorProfile$ = this.financialVendorFacade.providePanelSubject$
  updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$
  ddlStates$ = this.contactFacade.ddlStates$;
  paymentMethodCode$ = this.lovFacade.paymentMethodType$
  serviceTypes$ = this.lovFacade.serviceType$
  onEditInitiallydontShowPremiumselection = false;
  @ViewChild('providerDetailsTemplate', { read: TemplateRef })
  providerDetailsTemplate!: TemplateRef<any>;
  
  /******/
  sortValueClaims = this.financialVendorRefundFacade.sortValueClaims;
  sortClaims = this.financialVendorRefundFacade.sortClaimsList;
  claimsListData$ =   this.financialVendorRefundFacade.claimsListData$;

  sortValuePremiums = this.financialVendorRefundFacade.sortValuePremiums;
  sortPremiums = this.financialVendorRefundFacade.sortPremiumsList;
  premiumsListData$ =   this.financialVendorRefundFacade.premiumsListData$;

  sortValueClientClaims = this.financialVendorRefundFacade.sortValueClientClaims;
  sortClientClaims = this.financialVendorRefundFacade.sortClientClaimsList;
  clientClaimsListData$ =   this.financialVendorRefundFacade.clientClaimsListData$;
  
  sortValuePharmacyPayment = this.financialVendorRefundFacade.sortValuePharmacyPayment;
  sortPharmacyPayment = this.financialVendorRefundFacade.sortValuePharmacyPayment;
  pharmacyPaymentsListData$ =   this.financialVendorRefundFacade.pharmacyPaymentsListData$;
  isConfirmationClicked = false;
  
  insuraceAddRefundClickSubject = new Subject<any>();
  insuraceAddRefundClick$ = this.insuraceAddRefundClickSubject.asObservable()

  clientSearchLoaderVisibility$ =
  this.financialVendorRefundFacade.clientSearchLoaderVisibility$;
  clientSearchResult$ = this.financialVendorRefundFacade.clients$;
  pharmacySearchResult$ = this.financialVendorRefundFacade.pharmacies$;
  vendors$ = this.financialVendorRefundFacade.vendors$;
 
  @ViewChild('insClaims', { static: false })
  insClaims!: VendorRefundInsurancePremiumListComponent;

  @ViewChild('tpaClaims', { static: false })
  tpaClaims!: VendorRefundClaimsListComponent;

  @ViewChild('rxClaims', { static: false })
  rxClaims!: VendorRefundPharmacyPaymentsListComponent;
  showNoDataMessage: boolean = false;
  insurancePremiumPaymentReqIds :any[] =[]
  pharmacyClaimsPaymentReqIds :any[]=[]
  tpaClaimsPaymentReqIds :any[] =[]
  tpaPaymentReqIds :any[] =[]
  rxPaymentReqIds :any[] =[]
  selectedVendorRefundsList: any = [];

 @Input() serviceType=''
 @Input() inspaymentRequestId:any
  @Output() modalCloseAddEditRefundFormModal = new EventEmitter();
  sortValue: string | undefined;
  financialPremiumsRefundGridLists: any;
  filterData: any;
  paymentRequestId: any;
  insurancePremiumsRequestIds: any;
  disableFeildsOnConfirmSelection = false
  selectedVendor: any;
  claimsCount:number=0;
  inputConfirmationClicked!: boolean;
  isRefundRxSubmitted!: boolean;
  refundNoteValueLength: any;
  isSpotsPayment: any;
  constructor(private readonly financialVendorRefundFacade: FinancialVendorRefundFacade,
    private lovFacade: LovFacade,
    public contactFacade: ContactFacade,
    public financialVendorFacade :FinancialVendorFacade,   
    private dialogService: DialogService,
    private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.lovFacade.getServiceTypeLov();
    this.lovFacade.serviceType$.subscribe((res:any[]) =>{
     this.refundType =  res.filter(x=> x.lovCode!=='TAX')
    })
if(this.isEdit){
  this.selectedRefundType = this.serviceType
  this.onEditInitiallydontShowPremiumselection = true
  this.selectedClient={
    clientId: this.clientId,
    clientNames :this.clientName
  }
    this.selectedVendor ={
     providerFullName: this.vendorName,
     vendorId: this.vendorId
    }
  
  this.financialVendorRefundFacade.clientSubject.next([this.selectedClient])
  this.financialVendorRefundFacade.vendorsSubject.next([this.selectedVendor])
 
}
  }

  addInsuranceRefundClaim(event:any){
    this.financialVendorRefundFacade.addInsuranceRefundClaim(event.data, event.vendorId)
  }

  selectionChange(event: any){
    this.isConfirmationClicked = false
    this.vendorId=null;
    this.selectedProvider=null;
  }
  confirmationClicked (){
    this.disableFeildsOnConfirmSelection = true
    this.inputConfirmationClicked = true;

    if(this.selectedRefundType=== ServiceSubTypeCode.insurnacePremium 
    && this.insClaims.selectedInsuranceClaims &&  this.insClaims.selectedInsuranceClaims.length>0
    ){
    this.insurancePremiumPaymentReqIds =  this.insClaims.selectedInsuranceClaims
  } 

  if(this.selectedRefundType === 'TPA'){
    this.tpaPaymentReqIds = this.tpaClaims.selectedTpaClaims
  }
  if(this.selectedRefundType === 'RX'){
    this.rxPaymentReqIds = this.rxClaims.selectedPharmacyClaims
  }
}


  /*** refund INS */
  getInsuranceRefundInformation(data:any){

    const param ={
      ...data,
      paymentRequestsId : this.insurancePremiumPaymentReqIds,
      type: this.isEdit? "REFUND":"PAID"
    }
    this.financialVendorRefundFacade.getInsuranceRefundInformation(param);
    this.financialVendorRefundFacade.insuranceRefundInformation$.subscribe(res =>{
    this.financialPremiumsRefundGridLists =  res;
      console.log(this.financialPremiumsRefundGridLists)
    })
  
  }




onCloseViewProviderDetailClicked(result: any){
  if(result){
    this.providerDetailsDialog.close();
  }
}


getProviderPanel(event:any){
  this.financialVendorFacade.getProviderPanel(event)
}

onInsurancePremiumProviderCick(event:any){
  this.paymentRequestId = event
  this.providerDetailsDialog = this.dialogService.open({
    content: this.providerDetailsTemplate,
    animation:{
      direction: 'left',
      type: 'slide',  
    }, 
    cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
  });
  
}
updateProviderProfile(event:any){
  this.financialVendorFacade.updateProviderPanel(event)
}

OnEditProviderProfileClick(){
  this.contactFacade.loadDdlStates()
  this.lovFacade.getPaymentMethodLov()
}

onAddRefundClick(){
  if (this.selectedRefundType === 'PHARMACY') {
    this.addNewRefundRx();
  } else
    this.insuraceAddRefundClickSubject.next(true);
}

  /******  */
  selectDiffPayments(){
    this.isConfirmationClicked = false;
    this.disableFeildsOnConfirmSelection = false;
    this.onEditInitiallydontShowPremiumselection = false
 
  }
  closeAddEditRefundFormModalClicked(){
    this.modalCloseAddEditRefundFormModal.emit(true);  
  }
  loadVendorRefundProcessListGrid(event: any) {
  
    this.financialVendorRefundFacade.loadVendorRefundProcessListGrid();
  }
  

  loadClaimsListGrid(event: any) { 
    this.financialVendorRefundFacade.loadClaimsListGrid();
  }

  loadPremiumsListGrid(event: any) { 
    this.financialVendorRefundFacade.loadPremiumsListGrid();
  }
  loadClientClaimsListGrid(event: any) { 
    this.financialVendorRefundFacade.loadClientClaimsListGrid();
  }
  loadPharmacyPaymentsListGrid(event: any) { 
    this.financialVendorRefundFacade.loadPharmacyPaymentsListGrid();
  }
  loadClientBySearchText(clientSearchText: any) {
    if (!clientSearchText || clientSearchText.length == 0) {
      return
    }
    clientSearchText = clientSearchText.replace("/", "-");
    clientSearchText = clientSearchText.replace("/", "-");
    this.financialVendorRefundFacade.loadClientBySearchText(clientSearchText)
  }
  onClientValueChange(client: any) {
    if (client != undefined) {
      this.clientCaseEligibilityId = client.clientCaseEligibilityId;
      this.clientId = client.clientId;
      this.clientName = client.clientFullName;
      if (this.clientId != null && this.vendorId != null) {
        this.isRefundGridClaimShow = true;
      } 
    }
    else{
      this.clientId=null;
    }
  }
  searchPharmacy(searchText: any) {;
    if (!searchText || searchText.length == 0) {
      return;
    }
    this.financialVendorRefundFacade.loadPharmacyBySearchText(searchText);
  }
  onProviderValueChange($event: any) {
    
    if($event==undefined){ 
      this.vendorId=null;
    }
    this.vendorId = $event.vendorId;
    this.vendorName = $event.vendorName;
    this.providerTin = $event;
    if (this.clientId != null && this.vendorId != null){
      this.isRefundGridClaimShow = true;
    } 
  }
  initRefundForm() {
    this.refundClaimForm = this.formBuilder.group({
      medicalProvider: [this.selectedMedicalProvider, Validators.required],
      client: [this.selectedClient, Validators.required],
    });
  }
  showHideServicesListForm(){
    if(this.refundClaimForm.controls['medicalProvider'].value &&  this.refundClaimForm.controls['selectedClient'].value )
    {
      this.showServicesListForm = true;
    }
    else
    {
      this.showServicesListForm = false;
    }
  }
  searchVendors(searchText: any) {
    if (!searchText || searchText.length == 0) {
      return;
    }
    this.financialVendorRefundFacade.loadvendorBySearchText(searchText,this.selectedRefundType);
  }
  claimsCountEvent(data:any){
    
    this.claimsCount=data;
  }
  getSelectedVendorRefundsList(listData : any){
    debugger
    this.selectedVendorRefundsList = Array.from(new Set(listData.map((item:any)=>
   JSON.stringify(
     {
       indexCode : item.indexCode,
       pcaCode : item.pcaCode,
       grantNo:"xx-xxxxx",
       warrantNbr : item.warrantNbr,
       paymentStatusCode : item.paymentStatusCode,
       prescriptionsDetail : []
     })))).map((str:any) => JSON.parse(str));
     listData = listData.map((obj : any) =>
       ({
         ...obj,
         qtyRefunded : null,
         qtyRefundedValid : false,
         daySupplyRefunded : null,
         daySupplyRefundedValid : false,
         refundedAmount : null,
         refundedAmountValid : false
       }));
     this.selectedVendorRefundsList.forEach((element : any) => {
       element.prescriptionsDetail = listData.filter(
         (x : any)=>
         x.indexCode == element.indexCode
         && x.pcaCode == element.pcaCode
         && x.warrantNbr == element.warrantNbr
         && x.paymentStatusCode == element.paymentStatusCode
         )
     });
   this.isConfirmationClicked = true;
 }

 ngDirtyInValid(dataItem: any, control: any, tblIndex: any, rowIndex: any) {
   let isTouched = document.getElementById(`${control}${tblIndex}-${rowIndex}`)?.classList.contains('ng-touched')
   let inValid = false;
   if (control === 'qtyRefunded') {
     inValid = isTouched == true && !(dataItem.qtyRefunded != null && dataItem.qtyRefunded > 0);
     dataItem.qtyRefundedValid = !inValid;
   }
   if (control === 'daySupplyRefunded') {
     inValid = isTouched == true && !(dataItem.daySupplyRefunded != null && dataItem.daySupplyRefunded > 0);
     dataItem.daySupplyRefundedValid = !inValid;
   }
   if (control === 'refundedAmount') {
     inValid = isTouched == true && !(dataItem.refundedAmount != null && dataItem.refundedAmount > 0);
     dataItem.refundedAmountValid = !inValid;
   }
   if (inValid) {
     document.getElementById(`${control}${tblIndex}-${rowIndex}`)?.classList.remove('ng-valid');
     document.getElementById(`${control}${tblIndex}-${rowIndex}`)?.classList.add('ng-invalid');
     document.getElementById(`${control}${tblIndex}-${rowIndex}`)?.classList.add('ng-dirty');
   }
   else {
     document.getElementById(`${control}${tblIndex}-${rowIndex}`)?.classList.remove('ng-invalid');
     document.getElementById(`${control}${tblIndex}-${rowIndex}`)?.classList.remove('ng-dirty');
     document.getElementById(`${control}${tblIndex}-${rowIndex}`)?.classList.add('ng-valid');
   }
   return 'ng-dirty ng-invalid grid-input';
 }
 getSumOfColumn(list:any, property : string):string{
  let sum = 0 ;
  if(property === 'amountPaid')
    sum = list.reduce((accumulator : number, obj : any) => accumulator + obj.amountPaid, 0);
  if(property === 'refundedAmount')
    sum = list.reduce((accumulator : number, obj : any) => accumulator + obj.refundedAmount, 0);
  return sum.toFixed(2);
 }
 refundRXForm = this.formBuilder.group({
  voucherPayable: [''], 
  creditNumber: [''],
  warantNumber: ['', Validators.required],
  depositDate: ['', Validators.required],
  refundNote:[''],
})
markGridFormTouched(){
  for(var index = 0; index<document.getElementsByClassName(`grid-input`).length;index++){
    document.getElementsByClassName(`grid-input`)[index].classList.add('ng-touched')
  }
}
addNewRefundRx() {
  debugger;
    this.isRefundRxSubmitted = true;
    this.refundRXForm.markAsTouched();
    this.refundRXForm.markAsDirty();
    this.markGridFormTouched();
    var selectedpharmacyClaims = this.selectedVendorRefundsList.reduce((result:any, obj:any) => result.concat(obj.prescriptionsDetail), []);
    var anyInValidSelectedRefundPharmacyClaimInput = selectedpharmacyClaims.any((x:any)=> !x.qtyRefundedValid || !x.daySupplyRefundedValid || !x.refundedAmountValid)
    if (this.refundRXForm.invalid || anyInValidSelectedRefundPharmacyClaimInput) {
      return;
    } else {
      var selectedpharmacyClaimsDto = selectedpharmacyClaims.map((obj:any)=>
      {
        obj.paymentRequestId,
        obj.PrescriptionFillId ,
        obj.paymentRequestId,
        obj.RefundedQty ,
        obj.DaySupplyRefunded,
        obj.RefundedAmount,
        obj.grantNo,
        obj.pcaCode,
        obj.creditNumber
      });
      var refundRxData = { 
        ...this.refundRXForm.value, 
        vendorId : '<Assign-Value-as-Selected-Pharmacy-Id-In-Dropdown>',
        clientId  : '<Assign-Value-as-Selected-Client-Id-In-Dropdown>',
        clientCaseEligibilityId   : '<Assign-Value-as-Selected-Client-Case-Eledibility-In-Dropdown>',
        refundType : "RX",
        pharmacyRefundedItems:selectedpharmacyClaimsDto
      };
      this.financialVendorRefundFacade.addNewRefundRx(refundRxData).subscribe({
        next: (data: any) => {
          this.financialVendorRefundFacade.showLoader();
          this.financialVendorRefundFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS,
            'Pharmacy Refund Added Successfuly')
        },
        error: (error: any) => {
          if (error) {
            this.financialVendorRefundFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error);
            this.financialVendorRefundFacade.hideLoader();
          }
        }
      })
    }
  
}
onRefundNoteValueChange(event: any) {
  this.refundNoteValueLength = event.length
}
onSpotsPaymentChange(check: any) {
  this.isSpotsPayment = check.currentTarget.checked;
}
}
