import { Component } from '@angular/core';
import { FinancialMedicalPremiumsFacade } from '@cms/case-management/domain';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'cms-medical-premiums-page',
  templateUrl: './medical-premiums-page.component.html',
})
export class MedicalPremiumsPageComponent { 
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
 


   sortType = this.financialMedicalPremiumsFacade.sortType;
   pageSizes = this.financialMedicalPremiumsFacade.gridPageSizes;
   gridSkipCount = this.financialMedicalPremiumsFacade.skipCount;

   sortValueMedicalPremiumsProcess = this.financialMedicalPremiumsFacade.sortValueMedicalPremiumsProcess;
   sortProcessList = this.financialMedicalPremiumsFacade.sortProcessList;
   sortValueMedicalPremiumsBatch = this.financialMedicalPremiumsFacade.sortValueMedicalPremiumsBatch;
   sortBatchList = this.financialMedicalPremiumsFacade.sortBatchList;
   sortValueMedicalPremiumsPayments = this.financialMedicalPremiumsFacade.sortValueMedicalPremiumsPayments;
   sortPaymentsList = this.financialMedicalPremiumsFacade.sortPaymentsList;
   

   state!: State;
  medicalPremiumsProcessGridLists$ =
  this.financialMedicalPremiumsFacade.medicalPremiumsProcessData$;
  medicalPremiumsBatchGridLists$ = this.financialMedicalPremiumsFacade.medicalPremiumsBatchData$;

  medicalPremiumsAllPaymentsGridLists$ = this.financialMedicalPremiumsFacade.medicalPremiumsAllPaymentsData$;
  constructor( 
    private readonly financialMedicalPremiumsFacade: FinancialMedicalPremiumsFacade 
  ) {}


  loadMedicalPremiumsProcessListGrid(event: any) {
  
    this.financialMedicalPremiumsFacade.loadMedicalPremiumsProcessListGrid();
  }
  

  loadMedicalPremiumsBatchListGrid(event: any) {
 
    this.financialMedicalPremiumsFacade.loadMedicalPremiumsBatchListGrid();
  }

  loadMedicalPremiumsAllPaymentsListGrid(event: any) {
  
    this.financialMedicalPremiumsFacade.loadMedicalPremiumsAllPaymentsListGrid();
  }
}