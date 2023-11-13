import { Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialPharmacyClaimsFacade, GridFilterParam } from '@cms/case-management/domain';
import { LovFacade } from '@cms/system-config/domain';
@Component({
  selector: 'cms-pharmacy-claims-page',
  templateUrl: './pharmacy-claims-page.component.html',
})
export class PharmacyClaimsPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  paymentRequestType$ = this.lovFacade.paymentRequestType$;
  deliveryMethodLov$ = this.lovFacade.deliveryMethodLov$;
  batchingClaims$ = this.financialPharmacyClaimsFacade.batchClaims$;

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
  pharmacyClaimsProcessGridLists$ = this.financialPharmacyClaimsFacade.pharmacyClaimsProcessData$;
  pharmacyClaimsProcessLoader$ = this.financialPharmacyClaimsFacade.pharmacyClaimsProcessLoader$;
  pharmacyClaimsBatchGridLists$ = this.financialPharmacyClaimsFacade.pharmacyClaimsBatchData$;
  pharmacyClaimsBatchGridLoader$ = this.financialPharmacyClaimsFacade.pharmacyClaimsBatchLoader$;

  pharmacyClaimsAllPaymentsGridLists$ = this.financialPharmacyClaimsFacade.pharmacyClaimsAllPaymentsData$;
  pharmacyClaimsAllPaymentsGridLoader$ = this.financialPharmacyClaimsFacade.pharmacyClaimsAllPaymentsLoader$;

  addPharmacyClaim$ = this.financialPharmacyClaimsFacade.addPharmacyClaim$;
  editPharmacyClaim$ = this.financialPharmacyClaimsFacade.editPharmacyClaim$;
  getPharmacyClaim$ = this.financialPharmacyClaimsFacade.getPharmacyClaim$;
  searchPharmacies$ = this.financialPharmacyClaimsFacade.searchPharmacies$;
  searchClients$ = this.financialPharmacyClaimsFacade.searchClients$;
  searchDrugs$ = this.financialPharmacyClaimsFacade.searchDrugs$;

  searchPharmaciesLoader$ = this.financialPharmacyClaimsFacade.searchPharmaciesLoader$;
  searchClientLoader$ = this.financialPharmacyClaimsFacade.searchClientLoader$;
  searchDrugsLoader$ = this.financialPharmacyClaimsFacade.searchDrugsLoader$;

  constructor(
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade ,
    private lovFacade: LovFacade,
  ) {}

  getCoPaymentRequestTypeLov()
  {
    this.lovFacade.getCoPaymentRequestTypeLov();
  }


  getDrugUnitTypeLov()
  {
    this.lovFacade.getDeliveryMethodLovs();
  }

  loadPharmacyClaimsProcessListGrid(event: any) {
    this.financialPharmacyClaimsFacade.loadPharmacyClaimsProcessListGrid(event);
  }

  loadPharmacyClaimsBatchListGrid(event: any) {
    this.financialPharmacyClaimsFacade.loadPharmacyClaimsBatchListGrid(event);
  }

  loadPharmacyClaimsAllPaymentsListGrid(params: GridFilterParam) {
    this.financialPharmacyClaimsFacade.loadPharmacyClaimsAllPaymentsListGrid(params);
  }

  addPharmacyClaim(data: any) {
    this.financialPharmacyClaimsFacade.addPharmacyClaim(data);
  }

  updatePharmacyClaim(data: any) {
    this.financialPharmacyClaimsFacade.updatePharmacyClaim(data);
  }

  getPharmacyClaim(paymentRequestId: string) {
    this.financialPharmacyClaimsFacade.getPharmacyClaim(paymentRequestId);
  }

  searchPharmacies(searchText: string) {
    this.financialPharmacyClaimsFacade.searchPharmacies(searchText);
  }

  searchClients(searchText: string) {
    this.financialPharmacyClaimsFacade.searchClients(searchText);
  }
  searchDrug(searchText: string) {
    this.financialPharmacyClaimsFacade.searchDrug(searchText);
  }

  onExportClaimsInProcess(event: any){
    this.financialPharmacyClaimsFacade.exportPharmacyClaimsProcessListGrid(event);
  }

  onExportClaimsInBatch(event: any){
    this.financialPharmacyClaimsFacade.exportPharmacyClaimsBatchListGrid(event);
  }

  onExportAllPayments(event: any){
  }

  onbatchClaimsClicked(event:any){
    this.financialPharmacyClaimsFacade.batchClaims(event);
  }
  ondeleteClaimsClicked(event:any){
    this.financialPharmacyClaimsFacade.deleteClaims(event);
  }
}
