import { Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { ContactFacade, FinancialPharmacyClaimsFacade, FinancialVendorFacade } from '@cms/case-management/domain'; 
import { LovFacade } from '@cms/system-config/domain';
@Component({
  selector: 'cms-pharmacy-claims-page',
  templateUrl: './pharmacy-claims-page.component.html',
})
export class PharmacyClaimsPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
  ddlStates$ = this.contactFacade.ddlStates$;
  paymentMethodCode$ = this.lovFacade.paymentMethodType$
  vendorProfile$ = this.financialVendorFacade.providePanelSubject$
  updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$
   sortType = this.financialPharmacyClaimsFacade.sortType;
   pageSizes = this.financialPharmacyClaimsFacade.gridPageSizes;
   gridSkipCount = this.financialPharmacyClaimsFacade.skipCount;

   sortValuePharmacyClaimsProcess = this.financialPharmacyClaimsFacade.sortValuePharmacyClaimsProcess;
   sortProcessList = this.financialPharmacyClaimsFacade.sortProcessList;
   sortValuePharmacyClaimsBatch = this.financialPharmacyClaimsFacade.sortValuePharmacyClaimsBatch;
   sortBatchList = this.financialPharmacyClaimsFacade.sortBatchList;
   sortValuePharmacyClaimsPayments = this.financialPharmacyClaimsFacade.sortValuePharmacyClaimsPayments;
   sortPaymentsList = this.financialPharmacyClaimsFacade.sortPaymentsList;
   

   state!: State;
   paymentRequestId: any;
  pharmacyClaimsProcessGridLists$ =
  this.financialPharmacyClaimsFacade.pharmacyClaimsProcessData$;
  pharmacyClaimsBatchGridLists$ = this.financialPharmacyClaimsFacade.pharmacyClaimsBatchData$;

  pharmacyClaimsAllPaymentsGridLists$ = this.financialPharmacyClaimsFacade.pharmacyClaimsAllPaymentsData$;
  constructor( 
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade ,
    private readonly financialVendorFacade: FinancialVendorFacade,
    private readonly lovFacade: LovFacade,
    private readonly contactFacade: ContactFacade
  ) {}


  loadPharmacyClaimsProcessListGrid(event: any) {
  
    this.financialPharmacyClaimsFacade.loadPharmacyClaimsProcessListGrid();
  }
  

  loadPharmacyClaimsBatchListGrid(event: any) {
 
    this.financialPharmacyClaimsFacade.loadPharmacyClaimsBatchListGrid();
  }

  loadPharmacyClaimsAllPaymentsListGrid(event: any) {
  
    this.financialPharmacyClaimsFacade.loadPharmacyClaimsAllPaymentsListGrid();
  }
  updateProviderProfile(event:any){
    console.log(event)
    this.financialVendorFacade.updateProviderPanel(event)
  }
  getProviderPanel(event:any){
    this.financialVendorFacade.getProviderPanel(event)
  }
}