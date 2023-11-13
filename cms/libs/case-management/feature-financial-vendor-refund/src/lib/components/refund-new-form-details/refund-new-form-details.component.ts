import { Component , Output, EventEmitter, Input} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  isGridVisible: boolean = false;
  state!: State;
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
  data:any;
  constructor(  private readonly financialVendorRefundFacade: FinancialVendorRefundFacade,
    private formBuilder: FormBuilder,) {
 
    }
    ngOnInit(){
    
      debugger
  
      this.initRefundForm()
     
    
    }
  selectionChange(event: any){
    debugger
    this.isConfirmationClicked = false
  }
  confirmationClicked (){
    this.isSubmitted=true
    this.isConfirmationClicked = true
  }
  selectDiffPayments(){
    this.isConfirmationClicked = false;
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
    this.checkRequiredFields();
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