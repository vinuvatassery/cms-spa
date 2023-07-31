import {  ChangeDetectionStrategy,  Component, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialDentalPremiumsFacade } from '@cms/case-management/domain'; 

@Component({
  selector: 'cms-dental-premiums-reconcile-page',
  templateUrl: './dental-premiums-reconcile-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalPremiumsReconcilePageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   sortValue = this.financialDentalPremiumsFacade.sortValueReconcile;
   sortType = this.financialDentalPremiumsFacade.sortType;
   pageSizes = this.financialDentalPremiumsFacade.gridPageSizes;
   gridSkipCount = this.financialDentalPremiumsFacade.skipCount;
   sort = this.financialDentalPremiumsFacade.sortReconcileList;
   state!: State;
   reconcileGridLists$ = this.financialDentalPremiumsFacade.reconcileDataList$;
  constructor( 
    private readonly financialDentalPremiumsFacade: FinancialDentalPremiumsFacade 
  ) {}

  loadReconcileListGrid(event: any) { 
    this.financialDentalPremiumsFacade.loadReconcileListGrid();
  }
}
