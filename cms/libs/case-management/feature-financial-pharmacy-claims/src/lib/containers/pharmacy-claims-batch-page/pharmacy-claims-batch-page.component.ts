import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialPharmacyClaimsFacade, GridFilterParam } from '@cms/case-management/domain';
import { ActivatedRoute } from '@angular/router';
import { DocumentFacade } from '@cms/shared/util-core';

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
  paymentByBatchGridLoader$ =  this.financialPharmacyClaimsFacade.paymentByBatchGridLoader$;
  exportButtonShow$ = this.documentFacade.exportButtonShow$
  claimsType= 'pharmacies';
  batchId!:string;
  dataExportParameters! : any
  constructor(
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade,
    private readonly route: ActivatedRoute, private documentFacade :  DocumentFacade,
  ) {}

  loadBatchLogListGrid(event: any) {
    this.dataExportParameters = event
    const batchId = this.route.snapshot.queryParams['bid'];
    const params = new GridFilterParam(event.skipCount, event.pagesize, event.sortColumn, event.sortType, JSON.stringify(event.filter));
    this.financialPharmacyClaimsFacade.loadBatchLogListGrid(batchId, params, this.claimsType);
  }
  exportPharmacyBatchesGridData(){
    debugger
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
  
}
