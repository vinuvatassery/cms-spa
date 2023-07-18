import { Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialMedicalClaimsFacade } from '@cms/case-management/domain'; 
@Component({
  selector: 'cms-medical-claims-page',
  templateUrl: './medical-claims-page.component.html',
})
export class FinancialMedicalClaimsPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
 


   sortType = this.financialMedicalClaimsFacade.sortType;
   pageSizes = this.financialMedicalClaimsFacade.gridPageSizes;
   gridSkipCount = this.financialMedicalClaimsFacade.skipCount;

   sortValueMedicalClaimsProcess = this.financialMedicalClaimsFacade.sortValueMedicalClaimsProcess;
   sortProcessList = this.financialMedicalClaimsFacade.sortProcessList;
   sortValueMedicalClaimsBatch = this.financialMedicalClaimsFacade.sortValueMedicalClaimsBatch;
   sortBatchList = this.financialMedicalClaimsFacade.sortBatchList;
   sortValueMedicalClaimsPayments = this.financialMedicalClaimsFacade.sortValueMedicalClaimsPayments;
   sortPaymentsList = this.financialMedicalClaimsFacade.sortPaymentsList;
   

   state!: State;
  medicalClaimsProcessGridLists$ =
  this.financialMedicalClaimsFacade.medicalClaimsProcessData$;
  medicalClaimsBatchGridLists$ = this.financialMedicalClaimsFacade.medicalClaimsBatchData$;

  medicalClaimsAllPaymentsGridLists$ = this.financialMedicalClaimsFacade.medicalClaimsAllPaymentsData$;
  constructor( 
    private readonly financialMedicalClaimsFacade: FinancialMedicalClaimsFacade 
  ) {}


  loadMedicalClaimsProcessListGrid(event: any) {
  
    this.financialMedicalClaimsFacade.loadMedicalClaimsProcessListGrid();
  }
  

  loadMedicalClaimsBatchListGrid(event: any) {
 
    this.financialMedicalClaimsFacade.loadMedicalClaimsBatchListGrid();
  }

  loadMedicalClaimsAllPaymentsListGrid(event: any) {
  
    this.financialMedicalClaimsFacade.loadMedicalClaimsAllPaymentsListGrid();
  }
}