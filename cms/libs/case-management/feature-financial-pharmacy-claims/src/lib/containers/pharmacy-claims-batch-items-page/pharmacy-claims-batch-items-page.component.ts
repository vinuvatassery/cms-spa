import {  ChangeDetectionStrategy,  Component, TemplateRef, ViewChild, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { ContactFacade, FinancialPharmacyClaimsFacade, FinancialVendorFacade } from '@cms/case-management/domain'; 
import { DialogService } from '@progress/kendo-angular-dialog';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'cms-pharmacy-claims-batch-items-page',
  templateUrl: './pharmacy-claims-batch-items-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsBatchItemsPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
  paymentRequestId: any;
  providerDetailsDialog:any;
  @ViewChild('providerDetailsTemplate', { read: TemplateRef })
  providerDetailsTemplate!: TemplateRef<any>;
   sortValue = this.financialPharmacyClaimsFacade.sortValueBatchItem;
   sortType = this.financialPharmacyClaimsFacade.sortType;
   pageSizes = this.financialPharmacyClaimsFacade.gridPageSizes;
   gridSkipCount = this.financialPharmacyClaimsFacade.skipCount;
   sort = this.financialPharmacyClaimsFacade.sortBatchItemList;
   state!: State;
   batchItemsGridLists$ = this.financialPharmacyClaimsFacade.batchItemsData$;
   vendorProfile$ = this.financialVendorFacade.providePanelSubject$
   updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$
   ddlStates$ = this.contactFacade.ddlStates$;
   paymentMethodCode$ = this.lovFacade.paymentMethodType$;
   pharmacyBatchListDetailProfilePhoto$ = this.financialPharmacyClaimsFacade.pharmacyBatchListDetailProfilePhotoSubject;
  constructor( 
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade ,
    private dialogService: DialogService,
    private readonly financialVendorFacade : FinancialVendorFacade, 
    public contactFacade: ContactFacade,
    public lovFacade: LovFacade
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
  onCloseViewProviderDetailClicked(result: any){
    if(result){
      this.providerDetailsDialog.close();
    }
  }
  getProviderPanel(event:any){
    this.financialVendorFacade.getProviderPanel(event)
  }
  updateProviderProfile(event:any){
    this.financialVendorFacade.updateProviderPanel(event)
  }
  OnEditProviderProfileClick(){
    this.contactFacade.loadDdlStates()
    this.lovFacade.getPaymentMethodLov()
  }
}
