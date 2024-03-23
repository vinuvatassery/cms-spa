import {  ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { ContactFacade, FinancialPharmacyClaimsFacade, FinancialVendorFacade, GridFilterParam } from '@cms/case-management/domain'; 
import { ActivatedRoute } from '@angular/router';
import { DocumentFacade } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'cms-pharmacy-claims-reconcile-page',
  templateUrl: './pharmacy-claims-reconcile-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsReconcilePageComponent implements OnInit{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   sortValueBreakOut = this.financialPharmacyClaimsFacade.sortValueReconcileBreakout;
   sortType = this.financialPharmacyClaimsFacade.sortType;
   pageSizes = this.financialPharmacyClaimsFacade.gridPageSizes;
   gridSkipCount = this.financialPharmacyClaimsFacade.skipCount;
   sort = this.financialPharmacyClaimsFacade.sortReconcileBreakoutList;
   state!: State;
   reconcileGridLists$ = this.financialPharmacyClaimsFacade.reconcileDataList$;
   deliveryMethodLov$ = this.lovFacade.deliveryMethodLov$;
   batchId:any = null;
   @ViewChild('providerDetailsTemplate', { read: TemplateRef })
  providerDetailsTemplate!: TemplateRef<any>;
  paymentRequestId: any;
  tab = 1;
  updateProviderPanelSubject$ =
  this.financialVendorFacade.updateProviderPanelSubject$;
  providerDetailsDialog: any;
  vendorProfile$ = this.financialVendorFacade.providePanelSubject$;
  ddlStates$ = this.contactFacade.ddlStates$;
  paymentMethodCode$ = this.lovFacade.paymentMethodType$;
   sortValueBatch = this.financialPharmacyClaimsFacade.sortValueReconcile;
   sortBatch = this.financialPharmacyClaimsFacade.sortReconcileList;
   exportButtonShow$ = this.documentFacade.exportButtonShow$;
   dataExportParameters! : any
   letterContentList$ = this.financialPharmacyClaimsFacade.letterContentList$;
   letterContentLoader$ = this.financialPharmacyClaimsFacade.letterContentLoader$;
   reconcileBreakoutSummary$ = this.financialPharmacyClaimsFacade.reconcileBreakoutSummary$;
   reconcilePaymentBreakoutList$ = this.financialPharmacyClaimsFacade.reconcilePaymentBreakoutList$;
   reconcilePaymentBreakoutLoaderList$ = this.financialPharmacyClaimsFacade.reconcilePaymentBreakoutLoaderList$ 
   pharmacyBreakoutProfilePhoto$ = this.financialPharmacyClaimsFacade.pharmacyBreakoutProfilePhotoSubject;

  constructor( 
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade,
    private readonly route: ActivatedRoute,
    public lovFacade: LovFacade,
    private dialogService: DialogService,
    private documentFacade :  DocumentFacade,
    private readonly financialVendorFacade: FinancialVendorFacade,
    public contactFacade: ContactFacade
  ) {}

  ngOnInit(): void {   
    this.getQueryParams();
    this.lovFacade.getDeliveryMethodLovs();
  }
 
  private getQueryParams() {
    this.batchId = this.route.snapshot.queryParams['bid'];  
  }

  loadReconcileListGrid(event: any) { 
    this.dataExportParameters = event;
    const params = new GridFilterParam(event.skipCount, event.pageSize, event.sortColumn, event.sortType, JSON.stringify(event.filter)); 
    this.financialPharmacyClaimsFacade.loadReconcileListGrid(this.batchId,params);
  }
  exportClaimBatchesGridData(){
    const data = this.dataExportParameters
    if(data){
    const  filter = JSON.stringify(data?.filter);
      const vendorPageAndSortedRequest =
      {
        SortType : data?.sortType,
        Sorting : data?.sortColumn,
        SkipCount : data?.skipcount,
        MaxResultCount : data?.maxResultCount,
        Filter : filter
      }      
      const fileName ='Pharmacy Claims Reconciling Payment'
      this.documentFacade.getExportFile(vendorPageAndSortedRequest,`pharmacy/payment-batches/${this.batchId}/reconcile-payments` , fileName)
    }
  }
  loadEachLetterTemplate(event:any){
    this.financialPharmacyClaimsFacade.loadEachLetterTemplate(event);  
  }

  loadReconcileBreakoutSummary(event: any){
    this.financialPharmacyClaimsFacade.loadReconcilePaymentBreakoutSummary(event);
  }

  loadReconcilePaymentBreakoutList(event: any){
    this.financialPharmacyClaimsFacade.loadReconcilePaymentBreakoutListGrid(event);
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
  onEditProviderProfileClick() {
    this.contactFacade.loadDdlStates();
    this.lovFacade.getPaymentMethodLov();
  }
  updateProviderProfile(event: any) {
    console.log(event);
    this.financialVendorFacade.updateProviderPanel(event);
  }
  getProviderPanel(event: any) {
    this.financialVendorFacade.getProviderPanel(event);
  }
  onCloseViewProviderDetailClicked(result: any) {
    if (result) {
      this.providerDetailsDialog.close();
    }
  }
}
