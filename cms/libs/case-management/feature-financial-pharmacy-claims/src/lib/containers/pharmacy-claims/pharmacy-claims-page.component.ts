import { Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialPharmacyClaimsFacade } from '@cms/case-management/domain'; 
@Component({
  selector: 'cms-pharmacy-claims-page',
  templateUrl: './pharmacy-claims-page.component.html',
})
export class PharmacyClaimsPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
 


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

  pharmacyClaimsAllPaymentsGridLists$ = this.financialPharmacyClaimsFacade.pharmacyClaimsAllPaymentsData$;
  constructor( 
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade 
  ) {}


  loadPharmacyClaimsProcessListGrid(event: any) {
    this.financialPharmacyClaimsFacade.loadPharmacyClaimsProcessListGrid(event);
  }
  

  loadPharmacyClaimsBatchListGrid(event: any) {
 
    this.financialPharmacyClaimsFacade.loadPharmacyClaimsBatchListGrid();
  }

  loadPharmacyClaimsAllPaymentsListGrid(event: any) {
  
    this.financialPharmacyClaimsFacade.loadPharmacyClaimsAllPaymentsListGrid();
  }

  // exportClaimsProcessGridData(){
  //   const data = this.dataExportParameters
  //   if(data){
  //   const  filter = JSON.stringify(data?.filter);

  //     const vendorPageAndSortedRequest =
  //     {
  //       SortType : data?.sortType,
  //       Sorting : data?.sortColumn,
  //       SkipCount : data?.skipcount,
  //       MaxResultCount : data?.maxResultCount,
  //       Filter : filter
  //     }
  //    let fileName = (this.claimsType[0].toUpperCase() + this.claimsType.substr(1).toLowerCase()) +' Claims'

  //     this.documentFacade.getExportFile(vendorPageAndSortedRequest,`claims/${this.claimsType}` , fileName)
  //   }
  // }

  exportPharmacyClaimProcess(){
    
  }
}