import { Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialClaimsFacade, FinancialPcaFacade, FinancialPharmacyClaimsFacade } from '@cms/case-management/domain'; 
import { LovFacade } from '@cms/system-config/domain';
import { ConfigurationProvider, SnackBarNotificationType } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
@Component({
  selector: 'cms-pharmacy-claims-page',
  templateUrl: './pharmacy-claims-page.component.html',
})
export class PharmacyClaimsPageComponent {
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
   

   state!: State;
  pharmacyClaimsProcessGridLists$ = this.financialPharmacyClaimsFacade.pharmacyClaimsProcessData$;
  pharmacyClaimsProcessLoader$ = this.financialPharmacyClaimsFacade.pharmacyClaimsProcessLoader$;
  pharmacyClaimsBatchGridLists$ = this.financialPharmacyClaimsFacade.pharmacyClaimsBatchData$;

  pharmacyClaimsAllPaymentsGridLists$ = this.financialPharmacyClaimsFacade.pharmacyClaimsAllPaymentsData$;


  addPharmacyClaim$ = this.financialPharmacyClaimsFacade.addPharmacyClaim$;
  editPharmacyClaim$ = this.financialPharmacyClaimsFacade.editPharmacyClaim$;
  getPharmacyClaim$ = this.financialPharmacyClaimsFacade.getPharmacyClaim$;
  searchPharmacies$ = this.financialPharmacyClaimsFacade.searchPharmacies$;
  searchClients$ = this.financialPharmacyClaimsFacade.searchClients$;
  searchDrugs$ = this.financialPharmacyClaimsFacade.searchDrugs$;

  searchPharmaciesLoader$ = this.financialPharmacyClaimsFacade.searchPharmaciesLoader$;
  searchClientLoader$ = this.financialPharmacyClaimsFacade.searchClientLoader$;
  searchDrugsLoader$ = this.financialPharmacyClaimsFacade.searchDrugsLoader$;

  constructor( 
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade ,
    private lovFacade: LovFacade,private readonly configProvider: ConfigurationProvider,
    private readonly intl: IntlService,
    private readonly financialClaimsFacade: FinancialClaimsFacade,
  ) {}

  getCoPaymentRequestTypeLov()
  {
    this.lovFacade.getCoPaymentRequestTypeLov();
  }


  getDrugUnitTypeLov()
  {
    this.lovFacade.getDeliveryMethodLovs();
  }

  loadPharmacyClaimsProcessListGrid(event: any) {
    this.financialPharmacyClaimsFacade.loadPharmacyClaimsProcessListGrid(event);
  }
  

  loadPharmacyClaimsBatchListGrid(event: any) {
 
    this.financialPharmacyClaimsFacade.loadPharmacyClaimsBatchListGrid();
  }

  loadPharmacyClaimsAllPaymentsListGrid(event: any) {
  
    this.financialPharmacyClaimsFacade.loadPharmacyClaimsAllPaymentsListGrid();
  }

  addPharmacyClaim(data: any) {
    this.getPcaCode(data,false);
   
  }

  updatePharmacyClaim(data: any) {
   
    this.getPcaCode(data,true);
  }

  private getPcaCode(claim: any,edit : any) {
    const totalAmountDue = (claim.prescriptionFillDto as []).reduce((acc, cur) => acc + (cur as any)?.copayAmountPaid ?? 0, 0);
    const minServiceStartDate = this.getMinServiceStartDate(claim.prescriptionFillDto);
    const maxServiceEndDate = this.getMaxServiceEndDate(claim.prescriptionFillDto);
    const request = {
      clientCaseEligibilityId: claim.clientCaseEligibilityId,
      claimAmount: totalAmountDue,
      serviceStartDate: minServiceStartDate,
      serviceEndDate: maxServiceEndDate,
      paymentRequestId: claim.paymentRequestId,
      objectLedgerName : 'Pharmaceutical Drugs(ADAP)'
    };
    this.financialClaimsFacade.showLoader();
    this.financialClaimsFacade.getPcaCode(request) .subscribe({
      next: (response: any) => {
        this.financialClaimsFacade.hideLoader()
        if (response) {
          if (response?.isReAssignmentNeeded ?? true) {
            //this.chosenPcaForReAssignment = response;
            //this.onPcaReportAlertClicked(this.pcaExceptionDialogTemplate);
            return;
          }
          claim.pcaSelectionResponseDto = response;
        
          if(edit === true)
          {
            this.financialPharmacyClaimsFacade.updatePharmacyClaim(claim);
          }
          else
          {
            this.financialPharmacyClaimsFacade.addPharmacyClaim(claim);
          }
        
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
  searchDrug(searchText: string) {
    this.financialPharmacyClaimsFacade.searchDrug(searchText);
  }

  onExportClaimsInProcess(event: any){
    this.financialPharmacyClaimsFacade.exportPharmacyClaimsProcessListGrid(event);
  }

  onbatchClaimsClicked(event:any){
    this.financialPharmacyClaimsFacade.batchClaims(event);
  }
}