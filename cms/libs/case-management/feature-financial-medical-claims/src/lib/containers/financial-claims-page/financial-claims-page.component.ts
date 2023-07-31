import { Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialClaimsFacade } from '@cms/case-management/domain'; 
@Component({
  selector: 'cms-financial-claims-page',
  templateUrl: './financial-claims-page.component.html',
})
export class FinancialClaimsPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
 


   sortType = this.financialClaimsFacade.sortType;
   pageSizes = this.financialClaimsFacade.gridPageSizes;
   gridSkipCount = this.financialClaimsFacade.skipCount;

   sortValueFinancialClaimsProcess = this.financialClaimsFacade.sortValueFinancialClaimsProcess;
   sortProcessList = this.financialClaimsFacade.sortProcessList;
   sortValueFinancialClaimsBatch = this.financialClaimsFacade.sortValueFinancialClaimsBatch;
   sortBatchList = this.financialClaimsFacade.sortBatchList;
   sortValueFinancialClaimsPayments = this.financialClaimsFacade.sortValueFinancialClaimsPayments;
   sortPaymentsList = this.financialClaimsFacade.sortPaymentsList;
   

   state!: State;
  financialClaimsProcessGridLists$ =
  this.financialClaimsFacade.financialClaimsProcessData$;
  financialClaimsBatchGridLists$ = this.financialClaimsFacade.financialClaimsBatchData$;

  financialClaimsAllPaymentsGridLists$ = this.financialClaimsFacade.financialClaimsAllPaymentsData$;
  constructor( 
    private readonly financialClaimsFacade: FinancialClaimsFacade 
  ) {}


  loadFinancialClaimsProcessListGrid(event: any) {
  
    this.financialClaimsFacade.loadFinancialClaimsProcessListGrid();
  }
  

  loadFinancialClaimsBatchListGrid(event: any) {
 
    this.financialClaimsFacade.loadFinancialClaimsBatchListGrid();
  }

  loadFinancialClaimsAllPaymentsListGrid(event: any) {
  
    this.financialClaimsFacade.loadFinancialClaimsAllPaymentsListGrid();
  }
}