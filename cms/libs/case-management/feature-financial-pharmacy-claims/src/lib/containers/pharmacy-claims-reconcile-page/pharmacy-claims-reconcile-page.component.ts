import {  ChangeDetectionStrategy,  ChangeDetectorRef,  Component, OnInit, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialPharmacyClaimsFacade, GridFilterParam } from '@cms/case-management/domain'; 
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentFacade, LoggingService } from '@cms/shared/util-core';
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
   batchId:any = null;
   sortValueBatch = this.financialPharmacyClaimsFacade.sortValueReconcile;
   sortBatch = this.financialPharmacyClaimsFacade.sortReconcileList;
   exportButtonShow$ = this.documentFacade.exportButtonShow$;
   dataExportParameters! : any
   letterContentList$ = this.financialPharmacyClaimsFacade.letterContentList$;
   letterContentLoader$ = this.financialPharmacyClaimsFacade.letterContentLoader$;
   reconcileBreakoutSummary$ = this.financialPharmacyClaimsFacade.reconcileBreakoutSummary$;
   reconcilePaymentBreakoutList$ = this.financialPharmacyClaimsFacade.reconcilePaymentBreakoutList$;
   reconcilePaymentBreakoutLoaderList$ = this.financialPharmacyClaimsFacade.reconcilePaymentBreakoutLoaderList$ 

  constructor( 
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
    private readonly route: ActivatedRoute,
    public lovFacade: LovFacade,
    private dialogService: DialogService,
    private documentFacade :  DocumentFacade
  ) {}

  ngOnInit(): void {   
    this.getQueryParams();
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
}
