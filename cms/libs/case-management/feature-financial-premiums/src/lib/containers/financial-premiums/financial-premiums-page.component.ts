import { Component } from '@angular/core';
import { FinancialPremiumsFacade } from '@cms/case-management/domain';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'cms-financial-premiums-page',
  templateUrl: './financial-premiums-page.component.html',
})
export class FinancialPremiumsPageComponent { 
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
 


   sortType = this.financialPremiumsFacade.sortType;
   pageSizes = this.financialPremiumsFacade.gridPageSizes;
   gridSkipCount = this.financialPremiumsFacade.skipCount;

   sortValueFinancialPremiumsProcess = this.financialPremiumsFacade.sortValueFinancialPremiumsProcess;
   sortProcessList = this.financialPremiumsFacade.sortProcessList;
   sortValueFinancialPremiumsBatch = this.financialPremiumsFacade.sortValueFinancialPremiumsBatch;
   sortBatchList = this.financialPremiumsFacade.sortBatchList;
   sortValueFinancialPremiumsPayments = this.financialPremiumsFacade.sortValueFinancialPremiumsPayments;
   sortPaymentsList = this.financialPremiumsFacade.sortPaymentsList;
   

   state!: State;
  financialPremiumsProcessGridLists$ =
  this.financialPremiumsFacade.financialPremiumsProcessData$;
  financialPremiumsBatchGridLists$ = this.financialPremiumsFacade.financialPremiumsBatchData$;

  financialPremiumsAllPaymentsGridLists$ = this.financialPremiumsFacade.financialPremiumsAllPaymentsData$;
  constructor( 
    private readonly financialPremiumsFacade: FinancialPremiumsFacade 
  ) {}


  loadFinancialPremiumsProcessListGrid(event: any) {
  
    this.financialPremiumsFacade.loadFinancialPremiumsProcessListGrid();
  }
  

  loadFinancialPremiumsBatchListGrid(event: any) {
 
    this.financialPremiumsFacade.loadFinancialPremiumsBatchListGrid();
  }

  loadFinancialPremiumsAllPaymentsListGrid(event: any) {
  
    this.financialPremiumsFacade.loadFinancialPremiumsAllPaymentsListGrid();
  }
}