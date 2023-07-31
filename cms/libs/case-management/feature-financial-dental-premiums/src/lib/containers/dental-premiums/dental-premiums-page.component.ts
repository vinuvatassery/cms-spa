import { Component } from '@angular/core';
import { FinancialDentalPremiumsFacade } from '@cms/case-management/domain';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'cms-dental-premiums-page',
  templateUrl: './dental-premiums-page.component.html',
})
export class DentalPremiumsPageComponent { 
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
 


   sortType = this.financialDentalPremiumsFacade.sortType;
   pageSizes = this.financialDentalPremiumsFacade.gridPageSizes;
   gridSkipCount = this.financialDentalPremiumsFacade.skipCount;

   sortValueDentalPremiumsProcess = this.financialDentalPremiumsFacade.sortValueDentalPremiumsProcess;
   sortProcessList = this.financialDentalPremiumsFacade.sortProcessList;
   sortValueDentalPremiumsBatch = this.financialDentalPremiumsFacade.sortValueDentalPremiumsBatch;
   sortBatchList = this.financialDentalPremiumsFacade.sortBatchList;
   sortValueDentalPremiumsPayments = this.financialDentalPremiumsFacade.sortValueDentalPremiumsPayments;
   sortPaymentsList = this.financialDentalPremiumsFacade.sortPaymentsList;
   

   state!: State;
  dentalPremiumsProcessGridLists$ =
  this.financialDentalPremiumsFacade.dentalPremiumsProcessData$;
  dentalPremiumsBatchGridLists$ = this.financialDentalPremiumsFacade.dentalPremiumsBatchData$;

  dentalPremiumsAllPaymentsGridLists$ = this.financialDentalPremiumsFacade.dentalPremiumsAllPaymentsData$;
  constructor( 
    private readonly financialDentalPremiumsFacade: FinancialDentalPremiumsFacade 
  ) {}


  loadDentalPremiumsProcessListGrid(event: any) {
  
    this.financialDentalPremiumsFacade.loadDentalPremiumsProcessListGrid();
  }
  

  loadDentalPremiumsBatchListGrid(event: any) {
 
    this.financialDentalPremiumsFacade.loadDentalPremiumsBatchListGrid();
  }

  loadDentalPremiumsAllPaymentsListGrid(event: any) {
  
    this.financialDentalPremiumsFacade.loadDentalPremiumsAllPaymentsListGrid();
  }
}