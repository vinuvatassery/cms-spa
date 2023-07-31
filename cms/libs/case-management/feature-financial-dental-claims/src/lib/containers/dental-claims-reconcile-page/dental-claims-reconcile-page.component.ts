import {  ChangeDetectionStrategy,  Component, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialDentalClaimsFacade } from '@cms/case-management/domain'; 

@Component({
  selector: 'cms-dental-claims-reconcile-page',
  templateUrl: './dental-claims-reconcile-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalClaimsReconcilePageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   sortValue = this.financialDentalClaimsFacade.sortValueReconcile;
   sortType = this.financialDentalClaimsFacade.sortType;
   pageSizes = this.financialDentalClaimsFacade.gridPageSizes;
   gridSkipCount = this.financialDentalClaimsFacade.skipCount;
   sort = this.financialDentalClaimsFacade.sortReconcileList;
   state!: State;
   reconcileGridLists$ = this.financialDentalClaimsFacade.reconcileDataList$;
  constructor( 
    private readonly financialDentalClaimsFacade: FinancialDentalClaimsFacade 
  ) {}

  loadReconcileListGrid(event: any) { 
    this.financialDentalClaimsFacade.loadReconcileListGrid();
  }
}
