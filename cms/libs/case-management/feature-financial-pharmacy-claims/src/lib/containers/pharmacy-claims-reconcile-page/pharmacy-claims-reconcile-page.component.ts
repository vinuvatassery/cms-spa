import {  ChangeDetectionStrategy,  Component, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialPharmacyClaimsFacade } from '@cms/case-management/domain'; 

@Component({
  selector: 'cms-pharmacy-claims-reconcile-page',
  templateUrl: './pharmacy-claims-reconcile-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsReconcilePageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   sortValue = this.financialPharmacyClaimsFacade.sortValueReconcile;
   sortType = this.financialPharmacyClaimsFacade.sortType;
   pageSizes = this.financialPharmacyClaimsFacade.gridPageSizes;
   gridSkipCount = this.financialPharmacyClaimsFacade.skipCount;
   sort = this.financialPharmacyClaimsFacade.sortReconcileList;
   state!: State;
   reconcileGridLists$ = this.financialPharmacyClaimsFacade.reconcileDataList$;
  constructor( 
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade 
  ) {}

  loadReconcileListGrid(event: any) { 
    this.financialPharmacyClaimsFacade.loadReconcileListGrid();
  }
}
