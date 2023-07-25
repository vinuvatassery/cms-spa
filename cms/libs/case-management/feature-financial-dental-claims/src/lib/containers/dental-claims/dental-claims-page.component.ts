import { Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialDentalClaimsFacade } from '@cms/case-management/domain'; 

@Component({
  selector: 'cms-dental-claims-page',
  templateUrl: './dental-claims-page.component.html',
})
export class DentalClaimsPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
 


   sortType = this.financialDentalClaimsFacade.sortType;
   pageSizes = this.financialDentalClaimsFacade.gridPageSizes;
   gridSkipCount = this.financialDentalClaimsFacade.skipCount;

   sortValueDentalClaimsProcess = this.financialDentalClaimsFacade.sortValueDentalClaimsProcess;
   sortProcessList = this.financialDentalClaimsFacade.sortProcessList;
   sortValueDentalClaimsBatch = this.financialDentalClaimsFacade.sortValueDentalClaimsBatch;
   sortBatchList = this.financialDentalClaimsFacade.sortBatchList;
   sortValueDentalClaimsPayments = this.financialDentalClaimsFacade.sortValueDentalClaimsPayments;
   sortPaymentsList = this.financialDentalClaimsFacade.sortPaymentsList;
   

   state!: State;
  dentalClaimsProcessGridLists$ =
  this.financialDentalClaimsFacade.dentalClaimsProcessData$;
  dentalClaimsBatchGridLists$ = this.financialDentalClaimsFacade.dentalClaimsBatchData$;

  dentalClaimsAllPaymentsGridLists$ = this.financialDentalClaimsFacade.dentalClaimsAllPaymentsData$;
  constructor( 
    private readonly financialDentalClaimsFacade: FinancialDentalClaimsFacade 
  ) {}


  loadDentalClaimsProcessListGrid(event: any) {
  
    this.financialDentalClaimsFacade.loadDentalClaimsProcessListGrid();
  }
  

  loadDentalClaimsBatchListGrid(event: any) {
 
    this.financialDentalClaimsFacade.loadDentalClaimsBatchListGrid();
  }

  loadDentalClaimsAllPaymentsListGrid(event: any) {
  
    this.financialDentalClaimsFacade.loadDentalClaimsAllPaymentsListGrid();
  }
}