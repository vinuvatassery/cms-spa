import {  ChangeDetectionStrategy,  Component, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialPremiumsFacade } from '@cms/case-management/domain'; 

@Component({
  selector: 'cms-financial-premiums-reconcile-page',
  templateUrl: './financial-premiums-reconcile-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsReconcilePageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   sortValue = this.financialPremiumsFacade.sortValueReconcile;
   sortType = this.financialPremiumsFacade.sortType;
   pageSizes = this.financialPremiumsFacade.gridPageSizes;
   gridSkipCount = this.financialPremiumsFacade.skipCount;
   sort = this.financialPremiumsFacade.sortReconcileList;
   state!: State;
   reconcileGridLists$ = this.financialPremiumsFacade.reconcileDataList$;
  constructor( 
    private readonly financialPremiumsFacade: FinancialPremiumsFacade 
  ) {}

  loadReconcileListGrid(event: any) { 
    this.financialPremiumsFacade.loadReconcileListGrid();
  }
}
