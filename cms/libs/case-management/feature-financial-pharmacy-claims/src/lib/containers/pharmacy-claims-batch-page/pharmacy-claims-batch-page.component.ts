import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { ContactFacade, FinancialPharmacyClaimsFacade, FinancialVendorFacade, GridFilterParam } from '@cms/case-management/domain';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentFacade } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'cms-pharmacy-claims-batch-page',
  templateUrl: './pharmacy-claims-batch-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsBatchPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  sortValue = this.financialPharmacyClaimsFacade.sortValueBatchLog;
  sortType = this.financialPharmacyClaimsFacade.sortType;
  pageSizes = this.financialPharmacyClaimsFacade.gridPageSizes;
  gridSkipCount = this.financialPharmacyClaimsFacade.skipCount;
  sort = this.financialPharmacyClaimsFacade.sortBatchLogList;
  state!: State;
  batchLogGridLists$ = this.financialPharmacyClaimsFacade.batchLogData$;
  unbatchEntireBatch$ = this.financialPharmacyClaimsFacade.unbatchEntireBatch$;
  unbatchClaim$ = this.financialPharmacyClaimsFacade.unbatchClaims$;
  deleteClaims$ = this.financialPharmacyClaimsFacade.deleteClaims$;
  paymentByBatchGridLoader$ = this.financialPharmacyClaimsFacade.paymentByBatchGridLoader$;
  exportButtonShow$ = this.documentFacade.exportButtonShow$;
  letterContentList$ = this.financialPharmacyClaimsFacade.letterContentList$;
  letterContentLoader$ = this.financialPharmacyClaimsFacade.letterContentLoader$;

  updateProviderPanelSubject$ =
  this.financialVendorFacade.updateProviderPanelSubject$;
 ddlStates$ = this.contactFacade.ddlStates$;
 paymentMethodCode$ = this.lovFacade.paymentMethodType$;

 vendorProfile$ = this.financialVendorFacade.providePanelSubject$;
  @ViewChild('providerDetailsTemplate', { read: TemplateRef })
  providerDetailsTemplate!: TemplateRef<any>;
  paymentRequestId: any;
  providerDetailsDialog: any
  claimsType= 'pharmacies';
  batchId!:string;
  dataExportParameters! : any
  constructor(
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade,
    private readonly route : ActivatedRoute,
      private readonly documentFacade: DocumentFacade,
      private readonly router: Router,
      private dialogService: DialogService,
      private readonly financialVendorFacade: FinancialVendorFacade,
      private readonly contactFacade: ContactFacade,
      private lovFacade: LovFacade,
  ) {}

  ngOnInit(): void {
    this.batchId =   this.route.snapshot.queryParams['bid'];
  }

  loadBatchLogListGrid(event: any) {
    this.dataExportParameters = event
    const batchId = this.route.snapshot.queryParams['bid'];
    const params = new GridFilterParam(event.skipCount, event.pagesize, event.sortColumn, event.sortType, JSON.stringify(event.filter));
    this.financialPharmacyClaimsFacade.loadBatchLogListGrid(batchId, params, this.claimsType);
  }
  exportPharmacyBatchesGridData(){
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
      const batchId = this.route.snapshot.queryParams['bid'];
      const fileName = (this.claimsType[0].toUpperCase() + this.claimsType.substr(1).toLowerCase())  +' Pharmacy Batch Payments'

      this.documentFacade.getExportFile(vendorPageAndSortedRequest,`payment-batches/${batchId}/payments` , fileName)
    }
  }
  unBatchEntireBatchClick() { 
     const batchId = this.route.snapshot.queryParams['bid'];
     this.financialPharmacyClaimsFacade.unbatchEntireBatch(batchId)
  }
  unBatchClaimClick(event: any) {
     this.financialPharmacyClaimsFacade.unbatchPremiums(event.paymentId)
  }
  ondeletebatchesClicked(event:any){
    this.financialPharmacyClaimsFacade.deletebatches(event);
  }

  loadEachLetterTemplate(event: any) {
    this.financialPharmacyClaimsFacade.loadEachLetterTemplate(event);
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
