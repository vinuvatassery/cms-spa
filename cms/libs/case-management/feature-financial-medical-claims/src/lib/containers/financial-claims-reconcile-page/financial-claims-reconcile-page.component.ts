import {  ChangeDetectionStrategy,  Component, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialClaimsFacade } from '@cms/case-management/domain'; 

@Component({
  selector: 'cms-financial-claims-reconcile-page',
  templateUrl: './financial-claims-reconcile-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsReconcilePageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   sortValue = this.financialClaimsFacade.sortValueReconcile;
   sortType = this.financialClaimsFacade.sortType;
   pageSizes = this.financialClaimsFacade.gridPageSizes;
   gridSkipCount = this.financialClaimsFacade.skipCount;
   sort = this.financialClaimsFacade.sortReconcileList;
   state!: State;
   reconcileGridLists$ = this.financialClaimsFacade.reconcileDataList$;
  constructor( 
    private readonly financialClaimsFacade: FinancialClaimsFacade 
  ) {}

  loadReconcileListGrid(event: any) { 
    this.financialClaimsFacade.loadReconcileListGrid();
  }
}
