import {  ChangeDetectionStrategy,  Component, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialMedicalPremiumsFacade } from '@cms/case-management/domain'; 

@Component({
  selector: 'cms-medical-premiums-reconcile-page',
  templateUrl: './medical-premiums-reconcile-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsReconcilePageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   sortValue = this.financialMedicalPremiumsFacade.sortValueReconcile;
   sortType = this.financialMedicalPremiumsFacade.sortType;
   pageSizes = this.financialMedicalPremiumsFacade.gridPageSizes;
   gridSkipCount = this.financialMedicalPremiumsFacade.skipCount;
   sort = this.financialMedicalPremiumsFacade.sortReconcileList;
   state!: State;
   reconcileGridLists$ = this.financialMedicalPremiumsFacade.reconcileDataList$;
  constructor( 
    private readonly financialMedicalPremiumsFacade: FinancialMedicalPremiumsFacade 
  ) {}

  loadReconcileListGrid(event: any) { 
    this.financialMedicalPremiumsFacade.loadReconcileListGrid();
  }
}
