import {  ChangeDetectionStrategy,  Component, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialMedicalClaimsFacade } from '@cms/case-management/domain'; 

@Component({
  selector: 'cms-medical-claims-reconcile-page',
  templateUrl: './medical-claims-reconcile-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsReconcilePageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   sortValue = this.financialMedicalClaimsFacade.sortValueReconcile;
   sortType = this.financialMedicalClaimsFacade.sortType;
   pageSizes = this.financialMedicalClaimsFacade.gridPageSizes;
   gridSkipCount = this.financialMedicalClaimsFacade.skipCount;
   sort = this.financialMedicalClaimsFacade.sortReconcileList;
   state!: State;
   reconcileGridLists$ = this.financialMedicalClaimsFacade.reconcileDataList$;
  constructor( 
    private readonly financialMedicalClaimsFacade: FinancialMedicalClaimsFacade 
  ) {}

  loadReconcileListGrid(event: any) { 
    this.financialMedicalClaimsFacade.loadReconcileListGrid();
  }
}
