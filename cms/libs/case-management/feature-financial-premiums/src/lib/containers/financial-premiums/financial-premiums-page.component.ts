import {
  ChangeDetectionStrategy,
  OnInit,
  Component,
  ChangeDetectorRef,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ContactFacade, FinancialPremiumsFacade, FinancialVendorFacade, GridFilterParam, InsurancePremium, PolicyPremiumCoverage } from '@cms/case-management/domain';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { DocumentFacade, LoggingService } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'cms-financial-premiums-page',
  templateUrl: './financial-premiums-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsPageComponent implements OnInit {

  dataExportParameters!: any
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
  state!: State;
  filter!: any;
  unbatchPremiums$ = this.financialPremiumsFacade.unbatchPremiums$;
  sortType = this.financialPremiumsFacade.sortType;
  pageSizes = this.financialPremiumsFacade.gridPageSizes;
  gridSkipCount = this.financialPremiumsFacade.skipCount;
  sortValueFinancialPremiumsProcess =
    this.financialPremiumsFacade.sortValueFinancialPremiumsProcess;
  sortProcessList = this.financialPremiumsFacade.sortProcessList;
  sortValueFinancialPremiumsBatch =
    this.financialPremiumsFacade.sortValueFinancialPremiumsBatch;
  sortBatchList = this.financialPremiumsFacade.sortBatchList;
  sortValueFinancialPremiumsPayments =
    this.financialPremiumsFacade.sortValueFinancialPremiumsPayments;
  sortPaymentsList = this.financialPremiumsFacade.sortPaymentsList;
  financialPremiumsProcessGridLists$ =
    this.financialPremiumsFacade.financialPremiumsProcessData$;
  financialPremiumsBatchDataLoader$ =
    this.financialPremiumsFacade.financialPremiumsBatchDataLoader$;
  financialPremiumsBatchGridLists$ =
    this.financialPremiumsFacade.financialPremiumsBatchData$;
  financialPremiumsAllPaymentsGridLists$ =
    this.financialPremiumsFacade.financialPremiumsAllPaymentsData$;
  public sortValue = this.financialPremiumsFacade.clientsSortValue;
  insurancePlans$ = this.financialPremiumsFacade.insurancePlans$;
  insurancePlansLoader$ = this.financialPremiumsFacade.insurancePlansLoader$;
  insuranceCoverageDates$ = this.financialPremiumsFacade.insuranceCoverageDates$;
  insuranceCoverageDatesLoader$ = this.financialPremiumsFacade.insuranceCoverageDatesLoader$;
  actionResponse$ = this.financialPremiumsFacade.premiumActionResponse$;
  existingPremiums$ = this.financialPremiumsFacade.existingCoverageDates$;
  batchingPremium$ = this.financialPremiumsFacade.batchPremium$;
  financialPremiumPaymentLoader$ = this.financialPremiumsFacade.financialPremiumPaymentLoader$;
  insurancePremium$ = this.financialPremiumsFacade.insurancePremium$;
  premiumType: any;
  vendorProfile$ = this.financialVendorFacade.providePanelSubject$;
  updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$;
  letterContentList$ = this.financialPremiumsFacade.letterContentList$;
  letterContentLoader$ = this.financialPremiumsFacade.letterContentLoader$;
  ddlStates$ = this.contactFacade.ddlStates$;
  paymentMethodCode$ = this.lovFacade.paymentMethodType$;
  paymentStatusCode$ = this.lovFacade.paymentStatus$;
  exportButtonShow$ = this.documentFacade.exportButtonShow$;
  premiumProcessListProfilePhoto$ = this.financialPremiumsFacade.premiumProcessListProfilePhotoSubject;
  premiumAllPaymentsPremium$ = this.financialPremiumsFacade.premiumAllPaymentsPremiumSubject


  healthInsuranceTypeLov$ = this.lovFacade.insuranceTypelov$;
  providerDetailsDialog: any
  @ViewChild('providerDetailsTemplate', { read: TemplateRef })
  providerDetailsTemplate!: TemplateRef<any>;
  paymentRequestId: any;
  tab = 1;

  constructor(
    private readonly financialPremiumsFacade: FinancialPremiumsFacade,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
    public contactFacade: ContactFacade,
    public lovFacade: LovFacade,
    private dialogService: DialogService,
    private readonly financialVendorFacade: FinancialVendorFacade,
    private documentFacade: DocumentFacade,

  ) { }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (data) => (this.premiumType = data['type'])
    );
    this.activatedRoute.queryParams.subscribe(
      (data) => (this.tab = +(data['tab'] ?? 1))
    );
    this.tab = this.financialPremiumsFacade.selectedClaimsTab;
    this.addNavigationSubscription();
  }
  private addNavigationSubscription() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: () => {
          this.activatedRoute.params.subscribe(
            (data) => (this.premiumType = data['type'])
          );
          this.cdr.detectChanges();
        },

        error: (err: any) => {
          this.loggingService.logException(err);
        },
      });
  }
  deletePayment(paymentId: string) {
    this.financialPremiumsFacade.deletePremiumPayment(this.premiumType, paymentId);
  }
  unBatchPremiumClick(event: any) {
    this.financialPremiumsFacade.unbatchPremiums(event.paymentId, event.premiumsType)
  }
  loadFinancialPremiumsProcessListGrid(gridDataRefinerValue: any): void {

    this.lovFacade.getPaymentMethodLov()
    this.lovFacade.getPaymentStatusLov()
    this.lovFacade.getHealthInsuranceTypeLovs()
    this.financialPremiumsFacade.selectedClaimsTab = 1;
    this.tab = this.financialPremiumsFacade.selectedClaimsTab;
    this.dataExportParameters = gridDataRefinerValue;
    const gridDataRefiner = {
      skipcount: gridDataRefinerValue.skipCount,
      pagesize: gridDataRefinerValue.pagesize,
      sortColumn: gridDataRefinerValue.sortColumn,
      sortType: gridDataRefinerValue.sortType,
      filter: gridDataRefinerValue.filter
    };
    this.pageSizes = this.financialPremiumsFacade.gridPageSizes;
    this.financialPremiumsFacade.loadMedicalPremiumList(gridDataRefiner.skipcount,
      gridDataRefiner.pagesize,
      gridDataRefiner.sortColumn,
      gridDataRefiner.sortType,
      gridDataRefiner.filter,
      this.premiumType);
  }

  loadFinancialPremiumsBatchListGrid(data: GridFilterParam) {
    this.financialPremiumsFacade.selectedClaimsTab = 2;
    this.tab = this.financialPremiumsFacade.selectedClaimsTab;
    this.dataExportParameters = data;
    this.financialPremiumsFacade.loadFinancialPremiumsBatchListGrid(
      data,
      this.premiumType
    );
  }

  loadFinancialPremiumsAllPaymentsListGrid(data: GridFilterParam) {
    this.financialPremiumsFacade.selectedClaimsTab = 3;
    this.tab = this.financialPremiumsFacade.selectedClaimsTab;
    this.dataExportParameters = data
    this.financialPremiumsFacade.loadFinancialPremiumsAllPaymentsListGrid(data, this.premiumType);

  }

  loadInsurancePlans(client: any) {
    this.financialPremiumsFacade.loadInsurancePlans(client, this.premiumType);
  }

  loadInsurancePlansCoverageDates(clientId: number) {
    this.financialPremiumsFacade.loadInsurancePlansCoverageDates(clientId);
  }

  premiumExistValidation(data: { clientId: number, premiums: PolicyPremiumCoverage[] }) {
    this.financialPremiumsFacade.getExistingPremiums(data.clientId, this.premiumType, data.premiums);
  }

  saveInsurancePremiums(premiums: InsurancePremium[]) {
    this.financialPremiumsFacade.savePremiums(this.premiumType, premiums);
  }

  OnbatchClaimsClicked(event: any) {
    this.financialPremiumsFacade.batchPremium(event, this.premiumType);
  }

  loadPremium(premiumId: string) {
    this.financialPremiumsFacade.loadPremium(this.premiumType, premiumId);
  }

  updatePremium(premium: any) {
    this.financialPremiumsFacade.updatePremium(this.premiumType, premium.premiumId, premium);
  }

  onProviderNameClick(event: any) {
    this.paymentRequestId = event
    this.providerDetailsDialog = this.dialogService.open({
      content: this.providerDetailsTemplate,
      animation: {
        direction: 'left',
        type: 'slide',
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });

  }

  onCloseViewProviderDetailClicked(result: any) {
    if (result) {
      this.providerDetailsDialog.close();
    }
  }


  getProviderPanel(event: any) {
    this.financialVendorFacade.getProviderPanel(event)
  }

  updateProviderProfile(event: any) {
    console.log(event)
    this.financialVendorFacade.updateProviderPanel(event)
  }

  OnEditProviderProfileClick() {
    this.contactFacade.loadDdlStates()
    this.lovFacade.getPaymentMethodLov()
  }

  exportClaimsPaymentsGridData() {
    const data = this.dataExportParameters;
    if (data) {
      let fileName =
        this.premiumType[0].toUpperCase() +
        this.premiumType.substr(1).toLowerCase() +
        'Premiums Payments';

      this.documentFacade.getExportFile(
        data,
        `premium/${this.premiumType}/payments`,
        fileName
      );
    }
  }

  loadEachLetterTemplate(event: any) {
    this.financialPremiumsFacade.loadEachLetterTemplate(this.premiumType, event);
  }

  exportPremiumsPaymentsGridData() {
    const data = this.dataExportParameters;
    if (data) {
      const filter = data?.filter;

      const param = {
        SortType: data?.sortType,
        Sorting: data?.sortColumn,
        SkipCount: data?.skipcount,
        MaxResultCount: data?.maxResultCount,
        Filter: filter,
      };
      let fileName =
        this.premiumType[0].toUpperCase() +
        this.premiumType.substr(1).toLowerCase() +
        ' Premiums';

      this.documentFacade.getExportFile(
        param,
        `premium/${this.premiumType}/process/payments`,
        fileName
      );
    }
  }

  exportPremiumsBatchPaymentsGridData() {
    if (this.dataExportParameters) {
      let fileName =
        this.premiumType[0].toUpperCase() +
        this.premiumType.substr(1).toLowerCase() +
        ' Premiums';

      this.documentFacade.getExportFile(
        this.dataExportParameters,
        `premium/${this.premiumType}/batches`,
        fileName
      );
    }
  }
}
