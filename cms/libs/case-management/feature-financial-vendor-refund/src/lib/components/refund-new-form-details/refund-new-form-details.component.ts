import { Component , Output, EventEmitter, ViewChild, TemplateRef} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State, filterBy } from '@progress/kendo-data-query';
import { ContactFacade, FinancialVendorFacade, FinancialVendorRefundFacade, GridFilterParam } from '@cms/case-management/domain'; 
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { Subject } from 'rxjs';
import { VendorRefundInsurancePremiumListComponent } from '@cms/case-management/feature-financial-vendor-refund';
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

  @ViewChild('InsurancePremiumSelection', { static: false })
  insurancePremiumSelection!: VendorRefundInsurancePremiumListComponent;
  insurancePremiumPaymentReqIds :any[] =[]

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
  paymentRequestId: any;
  insurancePremiumsRequestIds: any;
  disableFeildsOnConfirmSelection = false

  constructor(private readonly financialVendorRefundFacade: FinancialVendorRefundFacade,
    private lovFacade: LovFacade,
    public contactFacade: ContactFacade,
    public financialVendorFacade :FinancialVendorFacade,   
    private dialogService: DialogService) {}
  selectionChange(event: any){
    this.isConfirmationClicked = false
  }
  confirmationClicked (){
  
    if(this.selectedRefundType=="INS" 
    //&& this.insurancePremiumsRequestIds && this.insurancePremiumsRequestIds.length>0
    ){
    this.insurancePremiumPaymentReqIds = this.insurancePremiumsRequestIds
    this.isConfirmationClicked = true
    this.disableFeildsOnConfirmSelection = true
  } 
}


  /*** refund INS */
  getInsuranceRefundInformation(data:any){
    const param ={
      ...data,
      paymentRequestsId : this.insurancePremiumPaymentReqIds
    }
    this.financialVendorRefundFacade.getInsuranceRefundInformation(param);
    this.financialVendorRefundFacade.insuranceRefundInformation$.subscribe(res =>{
    this.financialPremiumsRefundGridLists =  res;
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
}
