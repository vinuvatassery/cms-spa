import { Component , Output, EventEmitter, ViewChild, TemplateRef, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State, filterBy } from '@progress/kendo-data-query';
import { ContactFacade, FinancialVendorFacade, FinancialVendorRefundFacade, GridFilterParam, ServiceTypeCode, ServiceSubTypeCode } from '@cms/case-management/domain'; 
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { Subject, debounceTime } from 'rxjs';
import { VendorRefundClaimsListComponent, VendorRefundInsurancePremiumListComponent } from '@cms/case-management/feature-financial-vendor-refund';
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
 vendorId: any;
 @Input() vendorAddressId :any
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
  refundForm!: FormGroup;

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
  existingRxRefundClaim$ = this.financialVendorRefundFacade.existingRxRefundClaim$;
  insurancevendors$ = this.financialVendorRefundFacade.insurancevendors$;
  tpavendors$ = this.financialVendorRefundFacade.tpavendors$;
 
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
  creditMaskFormat: string = '000000-000';

 @Input() serviceType=''
 @Input() inspaymentRequestId:any
  @Output() modalCloseAddEditRefundFormModal = new EventEmitter<Boolean>();
  sortValue: string | undefined;
  financialPremiumsRefundGridLists: any;
  filterData: any;
  paymentRequestId: any;
  insurancePremiumsRequestIds: any;
  disableFeildsOnConfirmSelection = false
  selectedVendor: any;
  claimsCount:number=0;
  diffclaims:any[]=[];
  inputConfirmationClicked!: boolean;
  isRefundRxSubmitted!: boolean;
  refundNoteValueLength: any;
  pharmaciesList: any;
  isSpotsPayment: boolean =true;
  selectedInsRequests: any[]=[];
  constructor(private readonly financialVendorRefundFacade: FinancialVendorRefundFacade,
    private lovFacade: LovFacade,
    public contactFacade: ContactFacade,
    public financialVendorFacade :FinancialVendorFacade,   
    private dialogService: DialogService,
    private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    
    this.subscribeLoadRefundClaimDataForRx();
    this.financialVendorRefundFacade.premiumsListData$.subscribe((res:any)=>{
      
      this.diffclaims=res.item;
    })
    this.lovFacade.getRefundTypeLov();
    this.lovFacade.getServiceTypeLov();
     this.initForm()
    this.lovFacade.refundType$.subscribe((res:any[]) =>{
      
     this.refundType =  res.filter(x=> x.lovCode!=='TAX')
    })
if(this.isEdit){
  this.disableFeildsOnConfirmSelection = true
  this.selectedRefundType = this.serviceType
  this.onEditInitiallydontShowPremiumselection = true
  this.selectedClient={
    clientId: this.clientId,
    clientNames :this.clientName
  }
    const vendors = [{
        vendorAddressId: this.vendorAddressId,
        providerFullName: this.vendorName,
        vendorName: this.vendorName,
        tin: ""
    },]
    this.selectedVendor = vendors
   
  
  this.financialVendorRefundFacade.clientSubject.next([this.selectedClient])
  /*if(this.serviceType == 'PHARMACY'){
    this.isConfirmationClicked = true;
    this.financialVendorRefundFacade.pharmaciesSubject.next(vendors)  
    this.selectedMedicalProvider =vendors[0]
    this.loadPaymentRequestData();
  }
  else{
    this.financialVendorRefundFacade.insurancevendorsSubject.next(vendors)  
    this.selectedVendor =vendors[0];
    this.searchInsuranceVendors(this.vendorName) 
    this.insRefundForm.controls['insVendor'].disable();
  }*/
  this.initForm()
  if(this.selectedRefundType === ServiceTypeCode.insurancePremium){
  this.refundForm.controls['insVendor'].disable();
  this.refundForm.patchValue({
    insVendor : this.selectedVendor
  });
  this.insurancevendors$.subscribe((res:any[])=>{
    const vendors = res.filter((x) =>{
      return x.vendorAddressId ==  this.vendorAddressId
    })
    this.selectedVendor = vendors && vendors[0]
  })
  this.onInputChange(this.vendorName);

  this.financialVendorRefundFacade.insurancevendorsSubject.next([this.selectedVendor])
   }

    if (this.selectedRefundType === ServiceTypeCode.pharmacy || this.serviceType == 'PHARMACY'){
    this.refundForm.patchValue({
      rxVendor : this.selectedVendor
    });
  this.refundForm.controls['rxVendor'].disable();
  this.financialVendorRefundFacade.pharmaciesSubject.next([this.selectedVendor])
  this.searchPharmacy(this.vendorName) 
      this.isConfirmationClicked = true;
      this.financialVendorRefundFacade.pharmaciesSubject.next(vendors)
      this.selectedMedicalProvider = vendors[0]
      this.loadPaymentRequestData();
 
  }

  if(this.selectedRefundType === ServiceTypeCode.tpa){
    this.refundForm.patchValue({
      tpaVendor : this.selectedVendor
    });
    
  this.refundForm.controls['tpaVendor'].disable();
  this.searchTpaVendors(this.vendorName) 
  }
  
  

}
  }
  subscribeLoadRefundClaimDataForRx(){
    this.pharmacySearchResult$.subscribe((res:any)=>{
      this.pharmaciesList = res;
    });

    this.existingRxRefundClaim$.subscribe((res:any)=>{
      this.getSelectedVendorRefundsList(res,"EDIT");
    })
  }
  loadPaymentRequestData(){
    this.financialVendorRefundFacade.loadPharmacyRefundEditList(this.inspaymentRequestId);
  }
  initForm(){
    if(this.selectedRefundType === ServiceTypeCode.insurancePremium){
    this.refundForm = this.formBuilder.group({
      insVendor:this.selectedVendor
    });
  }
  if(this.selectedRefundType === ServiceTypeCode.pharmacy){
    this.refundForm = this.formBuilder.group({
      rxVendor:this.selectedVendor
    });
  }

  if(this.selectedRefundType === ServiceTypeCode.tpa){
    this.refundForm = this.formBuilder.group({
      tpaVendor:this.selectedVendor
    });
  }
  }

  addInsuranceRefundClaim(event:any){
    this.financialVendorRefundFacade.addUpdateInsuranceRefundClaim$.subscribe(res =>{
      this.closeAddEditRefundFormModalClicked(true)
    })
    if(this.isEdit){
    this.financialVendorRefundFacade.updateInsuranceRefundEditInformation(event.data)
    }else{
    this.financialVendorRefundFacade.addInsuranceRefundClaim(event.data) 
  }
}

  selectionChange(event: any){
    this.isConfirmationClicked = false
    this.vendorId=null;
    this.vendorAddressId=null;
    this.selectedProvider=null;
  }
  confirmationClicked (){ 
      this.isConfirmationClicked = true   
      this.inputConfirmationClicked = true;
    this.disableFeildsOnConfirmSelection = true
   
    if(this.selectedRefundType=== ServiceTypeCode.insurancePremium 
    && this.insClaims.selectedInsuranceClaims &&  this.insClaims.selectedInsuranceClaims.length>0
    ){
      this.refundForm.controls['insVendor'].disable();
    this.insurancePremiumPaymentReqIds =  [...this.insClaims.selectedInsuranceClaims]
  } 

  if(this.selectedRefundType === ServiceTypeCode.tpa ){
    this.refundForm.controls['tpaVendor'].disable();
    this.tpaClaimsPaymentReqIds =  this.tpaClaims.selectedTpaClaims
  }
   if (this.selectedRefundType === ServiceTypeCode.pharmacy || this.selectedRefundType === 'RX' || this.selectedRefundType === 'PHARMACY'){
    this.refundForm.controls['rxVendor'].disable();    
    this.getSelectedVendorRefundsList(this.rxClaims.selectedPharmacyClaims)
  }
}

onSelectedClaimsChangeEvent(event:any[]){
  this.selectedInsRequests = event
  this.insurancePremiumPaymentReqIds = event
}

onSelectedRxClaimsChangeEvent(event:any){
  this.rxPaymentReqIds = event
}
  /*** refund INS */
  getInsuranceRefundInformation(data:any){

    const param ={
      ...data,
      paymentRequestsId: this.selectedInsRequests,
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
    this.disableFeildsOnConfirmSelection = true;
    if(this.selectedRefundType == ServiceTypeCode.insurancePremium){
    this.refundForm.controls['insVendor'].disable();
    }
    this.onEditInitiallydontShowPremiumselection = false
    this.inputConfirmationClicked= false
    this.isRefundGridClaimShow = true;
    
 
  }
  closeAddEditRefundFormModalClicked(event:Boolean){
    this.modalCloseAddEditRefundFormModal.emit(event);  
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
      this.financialVendorRefundFacade.loadInsurancevendorBySearchText("",this.clientId);
      this.clientName = client.clientFullName;
      if (this.clientId != null && this.vendorAddressId != null) {
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
    this.vendorAddressId=null;
    if($event==undefined){ 
      this.vendorAddressId=null;
    }
    this.vendorId=$event.vendorId;
    this.vendorAddressId = $event.vendorAddressId;
    this.vendorName = $event.vendorName;
    this.vendorId = $event.vendorId
    this.providerTin = $event;
    if (this.clientId != null && this.vendorAddressId != null){
      this.isRefundGridClaimShow = true;
    } 
  }
  initRefundForm() {
    this.refundClaimForm = this.formBuilder.group({
      medicalProvider: [this.selectedMedicalProvider, Validators.required],
      client: [this.selectedClient, Validators.required],
    });
    this.refundRXForm = this.formBuilder.group({
      voucherPayable: [''], 
      creditNumber: [''],
      warantNumber: ['', Validators.required],
      depositDate: [null, [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
      refundNote:[''],
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
   debounce<T>(func: (arg: T) => void, debounceTimeMs: number): (arg: T) => void {
    const subject = new Subject<T>();
  
    subject.pipe(debounceTime(debounceTimeMs)).subscribe(arg => func(arg));
  
    return (arg: T) => subject.next(arg);
  }
  debouncedSearchInsuranceVendors = this.debounce((searchText: any) => {
    this.searchInsuranceVendors(searchText);
  }, 300); // Adjust the debounce time (in milliseconds) according to your needs


  debouncedtpaVendors = this.debounce((searchText: any) => {
    this.searchTpaVendors(searchText);
  }, 300); // Adjust the debounce time (in milliseconds) according to your needs

  onInputChange(searchText: any) {
    this.debouncedSearchInsuranceVendors(searchText);
  }
  searchInsuranceVendors(searchText: any) {
    if (!searchText || searchText.length == 0) {
      return;
    }

    this.financialVendorRefundFacade.loadInsurancevendorBySearchText(searchText,this.clientId);
  }
  searchTpaVendors(searchText: any) {
    if (!searchText || searchText.length == 0) {
      return;
    }
    this.financialVendorRefundFacade.loadTpavendorBySearchText(searchText,this.clientId);
  }
  claimsCountEvent(data:any){
    
    this.claimsCount=data;
  }
  getSelectedVendorRefundsList(listData : any, operation :string = "ADD"){
    if(operation === "ADD"){
      this.selectedVendorRefundsList = Array.from(new Set(listData.map((item:any)=>
      JSON.stringify(
        {
          indexCode : item.indexCode,
          pcaCode : item.pcaCode,
          grantNo : item.grantNo,
          warrantNbr : item.warrantNbr,
          paymentStatusCode : item.paymentStatusCode,
          prescriptionFillItems : []  
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
          element.prescriptionFillItems = listData.filter(
            (x : any)=>
            x.indexCode == element.indexCode
            && x.pcaCode == element.pcaCode
            && x.warrantNbr == element.warrantNbr
            && x.paymentStatusCode == element.paymentStatusCode
            )
        });
    }
    else{
          this.isConfirmationClicked = true   
          this.inputConfirmationClicked = true;
        this.disableFeildsOnConfirmSelection = true
        const formValues: {
          voucherPayable: string | null,
          creditNumber: string | null,
          warantNumber: string | null,
          depositDate: Date | null,
          refundNote: string | null
        } = {
          voucherPayable: listData.voucherPayable ?? '',
          creditNumber: listData.creditNo ?? '',
          warantNumber: listData.warrantNumber ?? '',
          depositDate: listData.depositDate ? new Date(listData.depositDate) : null,
          refundNote: listData.refundNote ?? '',
        };
        this.refundRXForm.setValue(formValues as any);
        listData = [listData].map((obj : any) =>
          ({
            ...obj,
            warrantNbr:obj.warrantNumber,
            paymentStatusCode : obj.paymentStatus
          }));
     this.clientId = this.selectedClient.clientId
      this.selectedVendorRefundsList = listData;
    }
    
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
  depositDate:[null, [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
  refundNote:[''],
})
markGridFormTouched(){
  for(var index = 0; index<document.getElementsByClassName(`grid-input`).length;index++){
    document.getElementsByClassName(`grid-input`)[index].classList.add('ng-touched')
  }
}
addNewRefundRx() {
    this.isRefundRxSubmitted = true;
    this.refundRXForm.markAsTouched();
    this.refundRXForm.markAsDirty();
    this.markGridFormTouched();
    var selectedpharmacyClaims = this.selectedVendorRefundsList.reduce((result:any, obj:any) => result.concat(obj.prescriptionFillItems), []);
    var InValidSelectedRefundPharmacyClaimInput = selectedpharmacyClaims.filter((x:any)=> x.qtyRefundedValid == false || x.daySupplyRefundedValid == false || x.refundedAmountValid == false)
    if ((this.refundRXForm.invalid && !this.isEdit) || InValidSelectedRefundPharmacyClaimInput.length >0) {
      return;
    } else {
      var selectedpharmacyClaimsDto = selectedpharmacyClaims.map((obj : any)=>
        ({
          paymentRequestId : obj.paymentRequestId ?? this.selectedVendorRefundsList[0].paymentRequestId,
          refundedPaymentRequestId : this.selectedVendorRefundsList[0].refundedPaymentRequestId,
          prescriptionFillId : obj.perscriptionFillId ?? obj.prescriptionFillId,
          refundedPrescriptionFillId : obj.refundedPrescriptionFillId,
          refundedQty : obj.qtyRefunded ,
          daySupplyRefunded : obj.daySupplyRefunded,
          refundedAmount : obj.refundedAmount,
          grantNo : obj.grantNo,
          pcaCode : obj.pcaCode,
          creditNumber : obj.creditNumber,
          rxqtype : obj.rxqtype,
          pharmacyNpi : obj.PharmacyNpi,
          ndc : obj.ndc
        }));
      var refundRxData = { 
        ...this.refundRXForm.value, 
        vendorId : this.vendorId,
        clientId  : this.clientId,
        clientCaseEligibilityId   : this.clientCaseEligibilityId ?? selectedpharmacyClaims[0].clientCaseEligibilityId,
        refundType : this.selectedRefundType,
        isSpotsPaymentCheck: this.isSpotsPayment,
        pharmacyRefundedItems:selectedpharmacyClaimsDto
      };
      if(this.isEdit == false){
        this.financialVendorRefundFacade.showLoader();
      this.financialVendorRefundFacade.addNewRefundRx(refundRxData).subscribe({
        next: (data: any) => {
          this.financialVendorRefundFacade.hideLoader();
          this.closeAddEditRefundFormModalClicked(true)
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
      else{
        this.financialVendorRefundFacade.showLoader();
        this.financialVendorRefundFacade.editNewRefundRx(refundRxData).subscribe({
          next: (data: any) => {
            this.financialVendorRefundFacade.hideLoader();
            this.closeAddEditRefundFormModalClicked(true)
            this.financialVendorRefundFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS,
              'Pharmacy Refund Updated Successfuly')
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
  
}
onRefundNoteValueChange(event: any) {
  this.refundNoteValueLength = event.length
}
onSpotsPaymentChange(check: any) {
  this.isSpotsPayment = check.currentTarget.checked;
}

selectedRxClaimsChangeEvent(event:any){
  this.selectedInsRequests = event
  this.pharmacyClaimsPaymentReqIds = event
}
}
