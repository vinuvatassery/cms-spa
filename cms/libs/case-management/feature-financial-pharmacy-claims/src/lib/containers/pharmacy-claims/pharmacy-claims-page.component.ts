import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { ContactFacade, FinancialClaimsFacade, FinancialPharmacyClaimsFacade, FinancialVendorFacade } from '@cms/case-management/domain';
import { LovFacade } from '@cms/system-config/domain';
import { ConfigurationProvider, SnackBarNotificationType, LoggingService } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'cms-pharmacy-claims-page',
  templateUrl: './pharmacy-claims-page.component.html',
})
export class PharmacyClaimsPageComponent implements OnInit {

  @ViewChild('pcaExceptionDialogTemplate', { read: TemplateRef })
  pcaExceptionDialogTemplate!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  paymentRequestType$ = this.lovFacade.paymentRequestType$;
  deliveryMethodLov$ = this.lovFacade.deliveryMethodLov$;
  batchingClaims$ = this.financialPharmacyClaimsFacade.batchClaims$;

   sortType = this.financialPharmacyClaimsFacade.sortType;
   pageSizes = this.financialPharmacyClaimsFacade.gridPageSizes;
   gridSkipCount = this.financialPharmacyClaimsFacade.skipCount;

   sortValuePharmacyClaimsProcess = this.financialPharmacyClaimsFacade.sortValuePharmacyClaimsProcess;
   sortProcessList = this.financialPharmacyClaimsFacade.sortProcessList;
   sortValuePharmacyClaimsBatch = this.financialPharmacyClaimsFacade.sortValuePharmacyClaimsBatch;
   sortBatchList = this.financialPharmacyClaimsFacade.sortBatchList;
   sortValuePharmacyClaimsPayments = this.financialPharmacyClaimsFacade.sortValuePharmacyClaimsPayments;
   sortPaymentsList = this.financialPharmacyClaimsFacade.sortPaymentsList;

   unbatchClaim$ = this.financialPharmacyClaimsFacade.unbatchClaims$;
   state!: State;
  pharmacyClaimsProcessGridLists$ = this.financialPharmacyClaimsFacade.pharmacyClaimsProcessData$;
  pharmacyClaimsProcessLoader$ = this.financialPharmacyClaimsFacade.pharmacyClaimsProcessLoader$;
  pharmacyClaimsBatchGridLists$ = this.financialPharmacyClaimsFacade.pharmacyClaimsBatchData$;
  pharmacyClaimsBatchGridLoader$ = this.financialPharmacyClaimsFacade.pharmacyClaimsBatchLoader$;

  pharmacyClaimsAllPaymentsGridLists$ = this.financialPharmacyClaimsFacade.pharmacyClaimsAllPaymentsData$;
  pharmacyClaimsAllPaymentsGridLoader$ = this.financialPharmacyClaimsFacade.pharmacyClaimsAllPaymentsLoader$;

  addPharmacyClaim$ = this.financialPharmacyClaimsFacade.addPharmacyClaim$;
  editPharmacyClaim$ = this.financialPharmacyClaimsFacade.editPharmacyClaim$;
  getPharmacyClaim$ = this.financialPharmacyClaimsFacade.getPharmacyClaim$;
  searchPharmacies$ = this.financialPharmacyClaimsFacade.searchPharmacies$;
  searchClients$ = this.financialPharmacyClaimsFacade.searchClients$;
  searchDrugs$ = this.financialPharmacyClaimsFacade.searchDrugs$;
  claimData : any
  searchPharmaciesLoader$ = this.financialPharmacyClaimsFacade.searchPharmaciesLoader$;
  searchClientLoader$ = this.financialPharmacyClaimsFacade.searchClientLoader$;
  searchDrugsLoader$ = this.financialPharmacyClaimsFacade.searchDrugsLoader$;
  tab = 1;
  updateProviderPanelSubject$ =
  this.financialVendorFacade.updateProviderPanelSubject$;
  isShowReasonForException = false;
  pcaExceptionDialogService: any;
  chosenPcaForReAssignment: any;
  
  @ViewChild('providerDetailsTemplate', { read: TemplateRef })
  providerDetailsTemplate!: TemplateRef<any>;
  paymentRequestId: any;
  providerDetailsDialog: any

 ddlStates$ = this.contactFacade.ddlStates$;
 isEditForm = false
 vendorProfile$ = this.financialVendorFacade.providePanelSubject$;
  paymentMethodCode$ = this.lovFacade.paymentMethodType$;
  letterContentList$ = this.financialPharmacyClaimsFacade.letterContentList$;
  letterContentLoader$ = this.financialPharmacyClaimsFacade.letterContentLoader$;
  pharmacyClaimsProcessListProfilePhoto$ = this.financialPharmacyClaimsFacade.pharmacyClaimsProcessListProfilePhotoSubject;
  pharmacyClaimnsAllPaymentsProfilePhoto$ = this.financialPharmacyClaimsFacade.pharmacyClaimnsAllPaymentsProfilePhotoSubject;
  constructor(
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade ,
    private lovFacade: LovFacade, private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,private readonly configProvider: ConfigurationProvider,
    private readonly intl: IntlService,
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly contactFacade: ContactFacade,
    private dialogService: DialogService,
    private readonly financialVendorFacade: FinancialVendorFacade,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(
      (data) => (this.tab = +(data['tab'] ?? 1))
    );
    this.tab = this.financialPharmacyClaimsFacade.selectedClaimsTab;
    this.addNavigationSubscription();
  }

  private addNavigationSubscription() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))

      .subscribe({
        next: () => {        
          this.tab = 1;
          this.cdr.detectChanges();
        },

        error: (err: any) => {
          this.loggingService.logException(err);
        },
      });
  }

  getCoPaymentRequestTypeLov()
  {
    this.lovFacade.getCoPaymentRequestTypeLov();
  }


  getDrugUnitTypeLov()
  {
    this.lovFacade.getDeliveryMethodLovs();
  }

  loadPharmacyClaimsProcessListGrid(event: any) {
    this.financialPharmacyClaimsFacade.selectedClaimsTab = 1;
    this.tab = this.financialPharmacyClaimsFacade.selectedClaimsTab;
    this.financialPharmacyClaimsFacade.loadPharmacyClaimsProcessListGrid(event);
  }

  loadPharmacyClaimsBatchListGrid(event: any) {
    this.financialPharmacyClaimsFacade.selectedClaimsTab = 2;
    this.tab = this.financialPharmacyClaimsFacade.selectedClaimsTab;
    this.financialPharmacyClaimsFacade.loadPharmacyClaimsBatchListGrid(event);
  }

  loadPharmacyClaimsAllPaymentsListGrid(params: any) {
    this.financialPharmacyClaimsFacade.selectedClaimsTab = 3;
    this.tab = this.financialPharmacyClaimsFacade.selectedClaimsTab;
    this.financialPharmacyClaimsFacade.loadPharmacyClaimsAllPaymentsListGrid(params);
  }

  addPharmacyClaim(data: any) {
    this.getPcaCode(data,false);
   
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
    if (result  && this.pcaExceptionDialogService) {
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


  getPharmacyClaim(paymentRequestId: string) {
    this.financialPharmacyClaimsFacade.getPharmacyClaim(paymentRequestId);
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

  onExportAllPayments(event: any){
    this.financialPharmacyClaimsFacade.exportPharmacyClaimAllPayments(event);
  }

  onExportClaimsInProcess(event: any){
    this.financialPharmacyClaimsFacade.exportPharmacyClaimsProcessListGrid(event);
  }

  onExportClaimsInBatch(event: any){
    this.financialPharmacyClaimsFacade.exportPharmacyClaimsBatchListGrid(event);
  }

  onbatchClaimsClicked(event:any){
    this.financialPharmacyClaimsFacade.batchClaims(event);
  }
  ondeleteClaimsClicked(event:any){
    this.financialPharmacyClaimsFacade.deleteClaims(event);
  }

  loadEachLetterTemplate(event:any){
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

  unBatchClaimClick(event: any) {
    this.financialPharmacyClaimsFacade.unbatchPremiums(event.paymentId)
 }

}