/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ClientProfileTabs, DrugPharmacyFacade, FinancialClaimsFacade, FinancialPharmacyClaimsFacade } from '@cms/case-management/domain';
import { ConfigurationProvider, SnackBarNotificationType } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { IntlService } from '@progress/kendo-angular-intl';
import { filter, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'case-management-profile-drug-page',
  templateUrl: './profile-drug-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDrugPageComponent  implements OnInit , OnDestroy {
  profileClientId!: number;
  clientCaseEligibilityId!: any;
  clientCaseId!: any;
  tabId! : any
  isClientProfile = true;
  claimData : any
  chosenPcaForReAssignment: any;
  pcaExceptionDialogService: any;
  @ViewChild('pcaExceptionDialogTemplate', { read: TemplateRef })
  pcaExceptionDialogTemplate!: TemplateRef<any>;
  constructor(  
    private drugPharmacyFacade: DrugPharmacyFacade,
    private route: ActivatedRoute,
    private readonly router: Router,
    private readonly lovFacade: LovFacade,
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade,
    private readonly configProvider: ConfigurationProvider,
    private readonly intl: IntlService,
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private dialogService: DialogService,
  ) { }

  deliveryMethodLov$ = this.lovFacade.deliveryMethodLov$;
  tabChangeSubscription$ = new Subscription();
  tabIdSubject = new Subject<string>();
  tabId$ = this.tabIdSubject.asObservable();
    //for add pharmacy
    clientpharmacies$ = this.drugPharmacyFacade.clientPharmacies$;
    pharmacysearchResult$ = this.drugPharmacyFacade.pharmacies$;
    searchLoaderVisibility$ = this.drugPharmacyFacade.searchLoaderVisibility$;
    addPharmacyRsp$ = this.drugPharmacyFacade.addPharmacyResponse$;
    editPharmacyRsp$ = this.drugPharmacyFacade.editPharmacyResponse$;
    removePharmacyRsp$ = this.drugPharmacyFacade.removePharmacyResponse$;
    removeDrugPharmacyRsp$ = this.drugPharmacyFacade.removeDrugPharmacyResponse$;
    triggerPriorityPopup$ = this.drugPharmacyFacade.triggerPriorityPopup$;
    selectedPharmacy$ = this.drugPharmacyFacade.selectedPharmacy$;
    
    ngOnInit(): void {

      this.routeChangeSubscription();
      this. loadQueryParams()
     
    }

     /** Private properties **/
  loadQueryParams()
  {
    this.profileClientId = this.route.snapshot.queryParams['id'];
    this.clientCaseEligibilityId = this.route.snapshot.queryParams['e_id'];
    this.tabId = this.route.snapshot.queryParams['tid']; 
    this.tabIdSubject.next(this.tabId)    
  }

  get clientProfileTabs(): typeof ClientProfileTabs {
    return ClientProfileTabs;
  }
  private routeChangeSubscription() {
    this.tabChangeSubscription$ = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {    
          this.loadQueryParams()  
      });
  }

  ngOnDestroy(): void {
    this.tabChangeSubscription$.unsubscribe();
  }

  removePharmacy(clientPharmacyId: string) {
    this.drugPharmacyFacade.removeClientPharmacy(
      this.profileClientId ?? 0,
      clientPharmacyId
    );
  }
  removeDrugPharmacyRsp(data: any) {
    this.drugPharmacyFacade.removeClientPharmacy(
      this.profileClientId ?? 0,
      data.vendorId,
      data.isShowHistoricalData
    );
  }

  searchPharmacy(searchText: string) {
    this.drugPharmacyFacade.searchPharmacies(searchText);
  }
  addPharmacy(data:any) {
    let priorityCode  = !data.isSetAsPrimary ? "" : "P";
    this.drugPharmacyFacade.addDrugPharmacy(
      this.profileClientId,
      data.vendorId,
      data?.vendorAddressId,
      priorityCode,
      data.isShowHistoricalData
    );
  }

  addPharmacyClaim(data: any) {
    this.getPcaCode(data,false);
   
  }

  updatePharmacyClaim(data: any) {
   
    this.getPcaCode(data,true);
  }

  private getPcaCode(claim: any,edit : any) {
    //this.isEditForm = edit
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
         
       this.save(this.claimData)
        
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

  onConfirmPcaAlertClicked(chosenPca: any) {
    this.chosenPcaForReAssignment = chosenPca;
    this.save(this.claimData);
  }

  save(claimData : any)
  { 
  
      this.financialPharmacyClaimsFacade.addPharmacyClaim(claimData);

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

  searchPharmacies(searchText: string) {
    this.financialPharmacyClaimsFacade.searchPharmacies(searchText);
  }

  searchClients(searchText: string) {
    this.financialPharmacyClaimsFacade.searchClients(searchText);
  }
  searchDrug(ndcCodeSearch: any) {
    this.financialPharmacyClaimsFacade.searchDrug(ndcCodeSearch?.searchText , ndcCodeSearch?.isClientRestricted);
  }

  getCoPaymentRequestTypeLov()
  {
    this.lovFacade.getCoPaymentRequestTypeLov();
  }


  getDrugUnitTypeLov()
  {
    this.lovFacade.getDeliveryMethodLovs();
  }


}

