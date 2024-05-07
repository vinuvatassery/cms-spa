import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  CaseFacade,
  ContactFacade,
  FinancialClaimsFacade,
  FinancialVendorFacade,
  SearchHeaderType,
} from '@cms/case-management/domain';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { DocumentFacade, LoggingService } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { State } from '@progress/kendo-data-query';
import { filter } from 'rxjs';
@Component({
  selector: 'cms-financial-claims-page',
  templateUrl: './financial-claims-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsPageComponent implements OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  claimsType: any;
  dataExportParameters!: any;

  sortType = this.financialClaimsFacade.sortType;
  pageSizes = this.financialClaimsFacade.gridPageSizes;
  gridSkipCount = this.financialClaimsFacade.skipCount;
  exportButtonShow$ = this.documentFacade.exportButtonShow$;

  sortValueFinancialClaimsProcess =
    this.financialClaimsFacade.sortValueFinancialClaimsProcess;
  sortProcessList = this.financialClaimsFacade.sortProcessList;
  sortValueFinancialClaimsBatch =
    this.financialClaimsFacade.sortValueFinancialClaimsBatch;
  sortBatchList = this.financialClaimsFacade.sortBatchList;
  sortValueFinancialClaimsPayments =
    this.financialClaimsFacade.sortValueFinancialClaimsPayments;
  sortPaymentsList = this.financialClaimsFacade.sortPaymentsList;
  sortValueFinancialInvoices =
    this.financialClaimsFacade.sortValueFinancialInvoiceProcess;
  state!: State;
  financialClaimsProcessGridLists$ =
    this.financialClaimsFacade.financialClaimsProcessData$;
  financialClaimsBatchGridLists$ =
    this.financialClaimsFacade.financialClaimsBatchData$;

  financialClaimsAllPaymentsGridLists$ =
    this.financialClaimsFacade.financialClaimsAllPaymentsData$;
  financialClaimsAllPaymentsDataLoader$ =
    this.financialClaimsFacade.financialClaimsAllPaymentsDataLoader$;

  financialClaimsInvoice$ = this.financialClaimsFacade.financialClaimsInvoice$;

  vendorProfile$ = this.financialVendorFacade.providePanelSubject$;
  updateProviderPanelSubject$ =
    this.financialVendorFacade.updateProviderPanelSubject$;
  ddlStates$ = this.contactFacade.ddlStates$;
  paymentMethodCode$ = this.lovFacade.paymentMethodType$;
  letterContentList$ = this.financialClaimsFacade.letterContentList$;
  letterContentLoader$ = this.financialClaimsFacade.letterContentLoader$;
  providerDetailsDialog: any;
  @ViewChild('providerDetailsTemplate', { read: TemplateRef })
  providerDetailsTemplate!: TemplateRef<any>;
  paymentRequestId: any;
  tab = 1;
  dentalClaimAllPaymentClaimsProfilePhoto$ = this.financialClaimsFacade.dentalClaimAllPaymentClaimsProfilePhotoSubject;
  medicalClaimsProfilePhoto$ = this.financialClaimsFacade.medicalClaimsProfilePhotoSubject;

  constructor(
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
    private documentFacade: DocumentFacade,
    public contactFacade: ContactFacade,
    public lovFacade: LovFacade,
    private dialogService: DialogService,
    private readonly financialVendorFacade: FinancialVendorFacade,
    private caseFacade: CaseFacade,
  ) {}

  ngOnInit(): void {
    this.caseFacade.enableSearchHeader(SearchHeaderType.CaseSearch);
    this.activatedRoute.params.subscribe(
      (data) => (this.claimsType = data['type'])
    );
    this.activatedRoute.queryParams.subscribe(
      (data) => (this.tab = +(data['tab'] ?? 1))
    );
    this.tab = this.financialClaimsFacade.selectedClaimsTab;
    this.addNavigationSubscription();
  }

  private addNavigationSubscription() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))

      .subscribe({
        next: () => {
          this.activatedRoute.params.subscribe(
            (data) => (this.claimsType = data['type'])
          );
          this.tab = 1;
          this.cdr.detectChanges();
        },

        error: (err: any) => {
          this.loggingService.logException(err);
        },
      });
  }

  loadFinancialClaimsProcessListGrid(data: any) {
    this.financialClaimsFacade.selectedClaimsTab = 1;
    this.tab = this.financialClaimsFacade.selectedClaimsTab;
    this.financialClaimsAllPaymentsGridLists$ =
      this.financialClaimsFacade.financialClaimsAllPaymentsData$;
    this.dataExportParameters = data;
    this.financialClaimsFacade.loadFinancialClaimsProcessListGrid(
      data?.skipCount,
      data?.pagesize,
      data?.sortColumn,
      data?.sortType,
      data?.filter,
      this.claimsType
    );
  }

  loadFinancialClaimsBatchListGrid(data: any) {
    this.financialClaimsFacade.selectedClaimsTab = 2;
    this.tab = this.financialClaimsFacade.selectedClaimsTab;
    this.dataExportParameters = data;
    this.financialClaimsFacade.loadFinancialClaimsBatchListGrid(
      data?.skipCount,
      data?.pagesize,
      data?.sortColumn,
      data?.sortType,
      data?.filter,
      this.claimsType
    );
  }

  loadFinancialClaimsAllPaymentsListGrid(data: any) {
    this.financialClaimsFacade.selectedClaimsTab = 3;
    this.tab = this.financialClaimsFacade.selectedClaimsTab;
    this.dataExportParameters = data;
    this.financialClaimsFacade.loadFinancialClaimsAllPaymentsListGrid(
      data?.skipCount,
      data?.pagesize,
      data?.sortColumn,
      data?.sortType,
      data?.filter,
      this.claimsType
    );
  }

  exportClaimsProcessGridData() {
    const data = this.dataExportParameters;
    if (data) {
      const filter = JSON.stringify(data?.filter);

      const vendorPageAndSortedRequest = {
        SortType: data?.sortType,
        Sorting: data?.sortColumn,
        SkipCount: data?.skipcount,
        MaxResultCount: data?.maxResultCount,
        Filter: filter,
      };
      let fileName =
        this.claimsType[0].toUpperCase() +
        this.claimsType.substr(1).toLowerCase() +
        ' Claims';

      this.documentFacade.getExportFile(
        vendorPageAndSortedRequest,
        `claims/${this.claimsType}`,
        fileName
      );
    }
  }

  exportClaimsBatchGridData(input:any) {
    const data = this.dataExportParameters;
    if (data) {
      const filter = JSON.stringify(data?.filter);

      const vendorPageAndSortedRequest = {
        SortType: data?.sortType,
        Sorting: data?.sortColumn,
        SkipCount: data?.skipcount,
        MaxResultCount: data?.maxResultCount,
        Filter: filter,
        excludeColumns : input,
      };
      let fileName =
        this.claimsType[0].toUpperCase() +
        this.claimsType.substr(1).toLowerCase() +
        ' Claims Batches';

      this.documentFacade.getExportFile(
        vendorPageAndSortedRequest,
        `claims/${this.claimsType}/batches`,
        fileName
      );
    }
  }

  exportClaimsPaymentsGridData() {
    const data = this.dataExportParameters;
    if (data) {
      const filter = JSON.stringify(data?.filter);

      const vendorPageAndSortedRequest = {
        SortType: data?.sortType,
        Sorting: data?.sortColumn,
        SkipCount: data?.skipcount,
        MaxResultCount: data?.maxResultCount,
        Filter: filter,
      };
      let fileName =
        this.claimsType[0].toUpperCase() +
        this.claimsType.substr(1).toLowerCase() +
        ' Claims Payments';

      this.documentFacade.getExportFile(
        vendorPageAndSortedRequest,
        `claims/${this.claimsType}/payments`,
        fileName
      );
    }
  }

  onProviderNameClick(event: any) {
    this.paymentRequestId = event;
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
    this.financialVendorFacade.getProviderPanel(event);
  }

  updateProviderProfile(event: any) {
    console.log(event);
    this.financialVendorFacade.updateProviderPanel(event);
  }

  OnEditProviderProfileClick() {
    this.contactFacade.loadDdlStates();
    this.lovFacade.getPaymentMethodLov();
  }

  loadEachLetterTemplate(event:any){
    this.financialClaimsFacade.loadEachLetterTemplate(this.claimsType, event);  
  }
}
