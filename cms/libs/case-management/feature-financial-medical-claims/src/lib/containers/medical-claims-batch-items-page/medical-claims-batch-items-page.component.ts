import {  ChangeDetectionStrategy,  Component, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialMedicalClaimsFacade } from '@cms/case-management/domain'; 

@Component({
  selector: 'cms-medical-claims-batch-items-page',
  templateUrl: './medical-claims-batch-items-page.component.html',
  styleUrls: ['./medical-claims-batch-items-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsBatchItemsPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   sortValue = this.financialMedicalClaimsFacade.sortValueBatchLog;
   sortType = this.financialMedicalClaimsFacade.sortType;
   pageSizes = this.financialMedicalClaimsFacade.gridPageSizes;
   gridSkipCount = this.financialMedicalClaimsFacade.skipCount;
   sort = this.financialMedicalClaimsFacade.sortBatchLogList;
   state!: State;
   batchLogGridLists$ = this.financialMedicalClaimsFacade.batchLogData$;
  constructor( 
    private readonly financialMedicalClaimsFacade: FinancialMedicalClaimsFacade 
  ) {}

  loadBatchLogListGrid(event: any) { 
    this.financialMedicalClaimsFacade.loadBatchLogListGrid();
  }
}
