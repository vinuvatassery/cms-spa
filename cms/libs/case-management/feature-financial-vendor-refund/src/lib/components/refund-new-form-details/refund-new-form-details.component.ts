import { Component , Output, EventEmitter, ViewChild, TemplateRef} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State, filterBy } from '@progress/kendo-data-query';
import { ContactFacade, FinancialVendorFacade, FinancialVendorRefundFacade, GridFilterParam } from '@cms/case-management/domain'; 
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorRefundInsurancePremiumListComponent } from '../vendor-refund-insurance-premium-list/vendor-refund-insurance-premium-list.component';
import { Subject } from 'rxjs';
@Component({
  selector: 'cms-refund-new-form-details',
  templateUrl: './refund-new-form-details.component.html',
})
export class RefundNewFormDetailsComponent{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isShownSearchLoader = false;
  selectedRefundType : any;
  public refundType  = [
    "TPA",
    "INS",
    "RX",
  ];
  clientCaseEligibilityId: any = null;
  clientId: any;
  clientName: any;
  vendorId: any;
  isRecentClaimShow = false;
  isShowReasonForException = false;
  showServicesListForm: boolean =false;
  selectedMedicalProvider: any;
  mailcode:any;
  currentFormControl!: FormGroup<any>;
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

  @ViewChild('providerDetailsTemplate', { read: TemplateRef })
  providerDetailsTemplate!: TemplateRef<any>;
  
  /**  INS  ****/
  isGridVisible: boolean = false;
  providerTin: any;
  selectedClient: any;
  pharmacyClaimForm!: FormGroup;
  vendorName: any;
  sortValueClaims = this.financialVendorRefundFacade.sortValueClaims;
  sortClaims = this.financialVendorRefundFacade.sortClaimsList;
  claimsListData$ =   this.financialVendorRefundFacade.claimsListData$;
 
  sortValuePremiums = this.financialVendorRefundFacade.sortValuePremiums;
  sortPremiums = this.financialVendorRefundFacade.sortPremiumsList;
  premiumsListData$ =   this.financialVendorRefundFacade.premiumsListData$;
 
  sortValueClientClaims = this.financialVendorRefundFacade.sortValueClientClaims;
  sortClientClaims = this.financialVendorRefundFacade.sortClientClaimsList;
  clientClaimsListData$ =   this.financialVendorRefundFacade.clientClaimsListData$;
 /****INS */
  sortValuePharmacyPayment = this.financialVendorRefundFacade.sortValuePharmacyPayment;
  sortPharmacyPayment = this.financialVendorRefundFacade.sortValuePharmacyPayment;
  pharmacyPaymentsListData$ =   this.financialVendorRefundFacade.pharmacyPaymentsListData$;
  clientSearchLoaderVisibility$ =
  this.financialVendorRefundFacade.clientSearchLoaderVisibility$;
  clientSearchResult$ = this.financialVendorRefundFacade.clients$;
  pharmacySearchResult$ = this.financialVendorRefundFacade.pharmacies$;
  vendors$ = this.financialVendorRefundFacade.vendors$;
  isConfirmationClicked = false;
  isSubmitted: boolean = false;
  
  insuraceAddRefundClickSubject = new Subject<any>();
  insuraceAddRefundClick$ = this.insuraceAddRefundClickSubject.asObservable()

  clientSearchResult =[
 
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
  ];
 
  @Output() modalCloseAddEditRefundFormModal = new EventEmitter();
  sortValue: string | undefined;
  financialPremiumsRefundGridLists: any;
  filterData: any;
  paymentRequestIds:any[] = [] ;
  insurancePremiumsRequestIds: any;
  disableFeildsOnConfirmSelection = false
  @ViewChild('InsurancePremiumSelection', { static: false })
  InsurancePremiumSelection!: VendorRefundInsurancePremiumListComponent;
  paymentRequestId: any;

  constructor(private readonly financialVendorRefundFacade: FinancialVendorRefundFacade,
    private lovFacade: LovFacade,
    public contactFacade: ContactFacade,
    public financialVendorFacade :FinancialVendorFacade,   
    private dialogService: DialogService,
    private formBuilder: FormBuilder) {}
  data:any;

    ngOnInit(){
      this.initRefundForm()
    }
  selectionChange(event: any){
    this.isConfirmationClicked = false
  }
  confirmationClicked (){
    this.isSubmitted=true

    this.disableFeildsOnConfirmSelection = true
    if(this.selectedRefundType ==='INS' && this.InsurancePremiumSelection.selectedInsurancePremiums
    && this.pharmacyClaimForm.valid){
    this.paymentRequestIds = this.InsurancePremiumSelection.selectedInsurancePremiums
    this.isConfirmationClicked = true
    }else{
      return;
    }
  } 

  onAddRefundClicked(){
  }

  /*** refund INS */
  getInsuranceRefundInformation(data:any){
    const param ={
      ...data,
      paymentRequestsId : this.paymentRequestIds
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
this.insuraceAddRefundClickSubject.next(true);
}

  /******  */
  selectDiffPayments(){
    this.isConfirmationClicked = false;
    this.disableFeildsOnConfirmSelection = false;
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
    debugger;
    if (!clientSearchText || clientSearchText.length == 0) {
      return
    }
    clientSearchText = clientSearchText.replace("/", "-");
    clientSearchText = clientSearchText.replace("/", "-");
    this.financialVendorRefundFacade.loadClientBySearchText(clientSearchText)
   
  }
  onClientValueChange(client: any) {
    debugger;
    if (client != undefined) {
      this.clientCaseEligibilityId = client.clientCaseEligibilityId;
      this.clientId = client.clientId;
      this.clientName = client.clientFullName;
      if (this.clientId != null && this.vendorId != null) {
        this.isRecentClaimShow = true;
      }
      this.showServicesListForm= true ;
     
    }
  }
  showHideServicesListForm(){
    if(this.pharmacyClaimForm.controls['medicalProvider'].value &&  this.pharmacyClaimForm.controls['client'].value)
    {
      this.showServicesListForm = true;
    }
    else
    {
      this.showServicesListForm= false;
      this.isRecentClaimShow =false;
 
    }
  }
  searchPharmacy(searchText: any) {
    if (!searchText || searchText.length == 0) {
      return;
    }
    this.financialVendorRefundFacade.loadPharmacyBySearchText(searchText);
  }
  searchVendors(searchText: any) {
    if (!searchText || searchText.length == 0) {
      return;
    }
    this.financialVendorRefundFacade.loadvendorBySearchText(searchText);
  }
  onProviderValueChange($event: any) {
    debugger
    this.vendorId = $event.vendorId;
    this.vendorName = $event.vendorName;
    this.providerTin = $event;
    if (this.clientId != null && this.vendorId != null) {
      this.isRecentClaimShow = true;
    }
   // this.checkRequiredFields();
  }
  initRefundForm() {
    this.pharmacyClaimForm = this.formBuilder.group({
      medicalProvider: [this.selectedMedicalProvider, Validators.required],
      client: [this.selectedClient, Validators.required],
    });
 
  }
  checkRequiredFields() {
   
    const isClientSelected = this.selectedClient !== null && this.selectedClient !== undefined;
    const isRefundTypeSelected = this.selectedRefundType !== null && this.selectedRefundType !== undefined;
    const isMedicalProviderSelected = this.selectedMedicalProvider !== null && this.selectedMedicalProvider !== undefined;
 
    this.isGridVisible = isClientSelected && isRefundTypeSelected && isMedicalProviderSelected;
  }
 
}