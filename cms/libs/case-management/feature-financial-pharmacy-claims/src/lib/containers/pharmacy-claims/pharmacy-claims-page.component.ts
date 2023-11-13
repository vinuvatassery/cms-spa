import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialPharmacyClaimsFacade, GridFilterParam } from '@cms/case-management/domain';
import { LovFacade } from '@cms/system-config/domain';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { LoggingService } from '@cms/shared/util-core';
@Component({
  selector: 'cms-pharmacy-claims-page',
  templateUrl: './pharmacy-claims-page.component.html',
})
export class PharmacyClaimsPageComponent implements OnInit {
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
  pharmacyClaimsBatchGridLoader$ = this.financialPharmacyClaimsFacade.pharmacyClaimsBatchLoader$;

  pharmacyClaimsAllPaymentsGridLists$ = this.financialPharmacyClaimsFacade.pharmacyClaimsAllPaymentsData$;
  pharmacyClaimsAllPaymentsGridLoader$ = this.financialPharmacyClaimsFacade.pharmacyClaimsAllPaymentsLoader$;

  addPharmacyClaim$ = this.financialPharmacyClaimsFacade.addPharmacyClaim$;
  editPharmacyClaim$ = this.financialPharmacyClaimsFacade.editPharmacyClaim$;
  getPharmacyClaim$ = this.financialPharmacyClaimsFacade.getPharmacyClaim$;
  searchPharmacies$ = this.financialPharmacyClaimsFacade.searchPharmacies$;
  searchClients$ = this.financialPharmacyClaimsFacade.searchClients$;
  searchDrugs$ = this.financialPharmacyClaimsFacade.searchDrugs$;

  searchPharmaciesLoader$ = this.financialPharmacyClaimsFacade.searchPharmaciesLoader$;
  searchClientLoader$ = this.financialPharmacyClaimsFacade.searchClientLoader$;
  searchDrugsLoader$ = this.financialPharmacyClaimsFacade.searchDrugsLoader$;
  tab = 1;

  constructor(
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade ,
    private lovFacade: LovFacade, private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
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

  loadPharmacyClaimsAllPaymentsListGrid(params: GridFilterParam) {
    this.financialPharmacyClaimsFacade.selectedClaimsTab = 3;
    this.tab = this.financialPharmacyClaimsFacade.selectedClaimsTab;
    this.financialPharmacyClaimsFacade.loadPharmacyClaimsAllPaymentsListGrid(params);
  }

  addPharmacyClaim(data: any) {
    this.financialPharmacyClaimsFacade.addPharmacyClaim(data);
  }

  updatePharmacyClaim(data: any) {
    this.financialPharmacyClaimsFacade.updatePharmacyClaim(data);
  }

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

  onExportClaimsInBatch(event: any){
    this.financialPharmacyClaimsFacade.exportPharmacyClaimsBatchListGrid(event);
  }

  onExportAllPayments(event: any){
  }

  onbatchClaimsClicked(event:any){
    this.financialPharmacyClaimsFacade.batchClaims(event);
  }
  ondeleteClaimsClicked(event:any){
    this.financialPharmacyClaimsFacade.deleteClaims(event);
  }
}
