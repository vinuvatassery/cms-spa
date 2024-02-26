import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { ContactFacade, FinancialClaimsFacade, FinancialPharmacyClaimsFacade, FinancialVendorFacade, GridFilterParam } from '@cms/case-management/domain';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationProvider, DocumentFacade, SnackBarNotificationType } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { LovFacade } from '@cms/system-config/domain';
import { IntlService } from '@progress/kendo-angular-intl';

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
  getPharmacyClaim$ = this.financialPharmacyClaimsFacade.getPharmacyClaim$;
  updateProviderPanelSubject$ =
  this.financialVendorFacade.updateProviderPanelSubject$;
 ddlStates$ = this.contactFacade.ddlStates$;
 paymentMethodCode$ = this.lovFacade.paymentMethodType$;
 isEditForm = false
 editPharmacyClaim$ = this.financialPharmacyClaimsFacade.editPharmacyClaim$;
 searchPharmacies$ = this.financialPharmacyClaimsFacade.searchPharmacies$;
 searchClients$ = this.financialPharmacyClaimsFacade.searchClients$;
 searchDrugs$ = this.financialPharmacyClaimsFacade.searchDrugs$;
 claimData : any
 searchPharmaciesLoader$ = this.financialPharmacyClaimsFacade.searchPharmaciesLoader$;
 searchClientLoader$ = this.financialPharmacyClaimsFacade.searchClientLoader$;
 searchDrugsLoader$ = this.financialPharmacyClaimsFacade.searchDrugsLoader$;
 pcaExceptionDialogService: any;
 chosenPcaForReAssignment: any;
 paymentRequestType$ = this.lovFacade.paymentRequestType$;
 deliveryMethodLov$ = this.lovFacade.deliveryMethodLov$;
 pharmacyBatchDetailProfilePhoto$ = this.financialPharmacyClaimsFacade.pharmacyBatchDetailProfilePhotoSubject;
 @ViewChild('pcaExceptionDialogTemplate', { read: TemplateRef })
 pcaExceptionDialogTemplate!: TemplateRef<any>;

 vendorProfile$ = this.financialVendorFacade.providePanelSubject$;
  @ViewChild('providerDetailsTemplate', { read: TemplateRef })
  providerDetailsTemplate!: TemplateRef<any>;
  paymentRequestId: any;
  providerDetailsDialog: any
  claimsType= 'pharmacies';
  batchId!:string;
  dataExportParameters! : any;
  paymentBatchName$ =  this.financialPharmacyClaimsFacade.paymentBatchName$;
  constructor(
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade,
    private readonly route : ActivatedRoute,
      private readonly documentFacade: DocumentFacade,
      private readonly router: Router,
      private dialogService: DialogService,
      private readonly financialVendorFacade: FinancialVendorFacade,
      private readonly contactFacade: ContactFacade,
      private lovFacade: LovFacade,
      private readonly financialClaimsFacade: FinancialClaimsFacade,
      private readonly configProvider: ConfigurationProvider,
    private readonly intl: IntlService,
  ) {}

  ngOnInit(): void {
    this.batchId =   this.route.snapshot.queryParams['bid'];
    this.loadBatchName();
  }

  loadBatchLogListGrid(event: any) {
    this.dataExportParameters = event
    const batchId = this.route.snapshot.queryParams['bid'];
    const params = new GridFilterParam(event.skipCount, event.pagesize, event.sortColumn, event.sortType, JSON.stringify(event.filter));
    this.financialPharmacyClaimsFacade.loadBatchLogListGrid(batchId, event.isReconciled, params, this.claimsType);
  }
  
  getPharmacyClaim(paymentRequestId: string) {
    this.financialPharmacyClaimsFacade.getPharmacyClaim(paymentRequestId);
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

      this.documentFacade.getExportFile(vendorPageAndSortedRequest,`payment-batches/${batchId}/payments?isReconciled=${data.isReconciled}` , fileName)
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

  loadBatchName(){
    const batchId = this.route.snapshot.queryParams['bid'];
    this.financialPharmacyClaimsFacade.loadBatchName(batchId);
  }

  
  searchPharmacies(searchText: string) {
    this.financialPharmacyClaimsFacade.searchPharmacies(searchText);
  }

  searchClients(searchText: string) {
    this.financialPharmacyClaimsFacade.searchClients(searchText);
  }
  searchDrug(ndcCodeSearch: any) {
    this.financialPharmacyClaimsFacade.searchDrug(ndcCodeSearch?.searchText , ndcCodeSearch?.isClientRestricted);
  }

  getDrugUnitTypeLov()
  {
    this.lovFacade.getDeliveryMethodLovs();
  }

  getCoPaymentRequestTypeLov()
  {
    this.lovFacade.getCoPaymentRequestTypeLov();
  }

  updatePharmacyClaim(data: any) {
   
    this.getPcaCode(data,true);
  }

  private getPcaCode(claim: any,edit : any) {
    this.isEditForm = edit
    const totalAmountDue = (claim.prescriptionFillDto as []).reduce((acc, cur) => acc + (cur as any)?.copayAmountPaid ?? 0, 0);
    const minServiceStartDate = this.getMinServiceStartDate(claim.prescriptionFillDto);
    const maxServiceEndDate = this.getMaxServiceEndDate(claim.prescriptionFillDto);
    const request = {
      clientId: claim.clientId,
      clientCaseEligibilityId: claim.clientCaseEligibilityId,
      claimAmount: totalAmountDue,
      serviceStartDate: minServiceStartDate,
      serviceEndDate: maxServiceEndDate,
      paymentRequestId: claim.paymentRequestId,
      objectLedgerName : 'Pharmacy'
    };
    this.financialClaimsFacade.showLoader();
    this.financialClaimsFacade.getPcaCode(request) .subscribe({
      next: (response: any) => {
        this.financialClaimsFacade.hideLoader()
        if (response) {
          claim.pcaSelectionResponseDto = response;
          this.claimData = claim
          if (response?.isReAssignmentNeeded === true) {
            this.chosenPcaForReAssignment = response;
            this.onPcaReportAlertClicked(this.pcaExceptionDialogTemplate);
            return;
          }
         
       this.save(edit, this.claimData)
        
        }
      },
      error: (error: any) => {
        this.financialClaimsFacade.hideLoader()
        this.financialClaimsFacade.showHideSnackBar(
          SnackBarNotificationType.ERROR,
          error
        );
      },
    });
  }

  onConfirmPcaAlertClicked(chosenPca: any) {
    this.chosenPcaForReAssignment = chosenPca;
    this.save(this.isEditForm , this.claimData);
  }

  save(isEdit : boolean , claimData : any)
  { 
    if(isEdit === true)
    {
      this.financialPharmacyClaimsFacade.updatePharmacyClaim(claimData);
    }
    else
    {
      this.financialPharmacyClaimsFacade.addPharmacyClaim(claimData);
    }
    this.onPcaAlertCloseClicked(true)
  }
  onPcaReportAlertClicked(template: TemplateRef<unknown>): void {
    this.pcaExceptionDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onPcaAlertCloseClicked(result: any) {
    if (result) {
      this.pcaExceptionDialogService.close();
    }
  }

  
  getMinServiceStartDate(arr: any) {
    const timestamps = arr.map((a: any) => new Date(a.prescriptionFillDate));
    return this.intl.formatDate(new Date(Math.min(...timestamps)), this.configProvider?.appSettings?.dateFormat);
  };

  getMaxServiceEndDate(arr: any) {
    const timestamps = arr.map((a: any) => new Date(a.prescriptionFillDate));
    return this.intl.formatDate(new Date(Math.max(...timestamps)), this.configProvider?.appSettings?.dateFormat);
  };


}
