import {  ChangeDetectionStrategy,  Component, TemplateRef, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialPharmacyClaimsFacade } from '@cms/case-management/domain'; 
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'cms-pharmacy-claims-batch-items-page',
  templateUrl: './pharmacy-claims-batch-items-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsBatchItemsPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
   sortValue = this.financialPharmacyClaimsFacade.sortValueBatchItem;
   sortType = this.financialPharmacyClaimsFacade.sortType;
   pageSizes = this.financialPharmacyClaimsFacade.gridPageSizes;
   gridSkipCount = this.financialPharmacyClaimsFacade.skipCount;
   sort = this.financialPharmacyClaimsFacade.sortBatchItemList;
   state!: State;
   batchItemsGridLists$ = this.financialPharmacyClaimsFacade.batchItemsData$;
  paymentRequestId: any;
  providerDetailsDialog: any;
  providerDetailsTemplate!: TemplateRef<any>;
  constructor( 
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade,
    private dialogService: DialogService,
  ) {}

  loadBatchItemListGrid(event: any) { 
    this.financialPharmacyClaimsFacade.loadBatchItemsListGrid();
  }
  onProviderNameClick(event:any){
    this.paymentRequestId = event
    this.providerDetailsDialog = this.dialogService.open({
    content: this.providerDetailsTemplate,
      animation:{
        direction: 'left',
        type: 'slide',  
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });
  }
}
