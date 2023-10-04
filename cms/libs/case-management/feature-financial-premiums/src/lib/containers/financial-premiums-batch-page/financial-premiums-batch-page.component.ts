import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import {FinancialPremiumsFacade, GridFilterParam } from '@cms/case-management/domain';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { DocumentFacade, LoggingService } from '@cms/shared/util-core';

@Component({
  selector: 'cms-financial-premiums-batch-page',
  templateUrl: './financial-premiums-batch-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsBatchPageComponent implements OnInit{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  sortValue = this.financialPremiumsFacade.sortValueBatchLog;
  sortType = this.financialPremiumsFacade.sortType;
  pageSizes = this.financialPremiumsFacade.gridPageSizes;
  gridSkipCount = this.financialPremiumsFacade.skipCount;
  sort = this.financialPremiumsFacade.sortBatchLogList;
  exportButtonShow$ = this.documentFacade.exportButtonShow$
  state!: State;
  batchLogGridLists$ = this.financialPremiumsFacade.batchLogData$;
  batchLogServicesData$ = this.financialPremiumsFacade.batchLogServicesData$;
  unbatchPremiums$ = this.financialPremiumsFacade.unbatchPremiums$;
  unbatchEntireBatch$ = this.financialPremiumsFacade.unbatchEntireBatch$;
  batchId!:string;
  dataExportParameters! : any
  premiumType: any;
  constructor(
    private readonly financialPremiumsFacade: FinancialPremiumsFacade,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
    private documentFacade :  DocumentFacade
  ) {}
  ngOnInit(): void {
    this.batchId =   this.activatedRoute.snapshot.queryParams['bid'];
    this.premiumType = this.financialPremiumsFacade.getPremiumType(this.router)
    this.addNavigationSubscription();
    this.loadBatchName();
  }
  private addNavigationSubscription() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: () => {
          this.premiumType =this.financialPremiumsFacade.getPremiumType(this.router)
          this.cdr.detectChanges();
        },

        error: (err: any) => {
          this.loggingService.logException(err);
        },
      });
  }

  loadBatchName(){
    const batchId = this.activatedRoute.snapshot.queryParams['bid'];
    this.financialPremiumsFacade.loadBatchName(batchId);
  }

  loadBatchLogListGrid(event: any) {
    this.dataExportParameters = event
    const batchId = this.activatedRoute.snapshot.queryParams['bid'];
    const params = new GridFilterParam(event.skipCount, event.pagesize, event.sortColumn, event.sortType, JSON.stringify(event.filter));
    this.financialPremiumsFacade.loadBatchLogListGrid(this.premiumType, batchId, params);
  }


  loadFinancialPremiumBatchInvoiceList(event: any) {
    const params = new GridFilterParam(event.skipCount, event.pagesize, event.sortColumn, event.sortType, JSON.stringify(event.filter));
    this.financialPremiumsFacade.loadPremiumServicesByPayment(this.premiumType, event.paymentRequestId, params);
  }

  exportPremiumBatchesGridData(){

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
      const batchId = this.activatedRoute.snapshot.queryParams['bid'];
      const fileName = (this.premiumType[0].toUpperCase() + this.premiumType.substr(1).toLowerCase())  +' Premium Batch Payments'

      this.documentFacade.getExportFile(vendorPageAndSortedRequest,`premium/${this.premiumType}/payment-batches/${batchId}/payments` , fileName)
    }
  }

  unBatchEntireBatchClick(event:any){
   this.financialPremiumsFacade.unbatchEntireBatch(event.batchId,event.premiumsType)
  }
  unBatchPremiumClick(event:any){
    this.financialPremiumsFacade.unbatchPremiums(event.paymentId,event.premiumsType)
  }
}
