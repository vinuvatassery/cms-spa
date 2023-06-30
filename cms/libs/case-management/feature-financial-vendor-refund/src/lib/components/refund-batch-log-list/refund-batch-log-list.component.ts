import { Component,  OnInit,  ChangeDetectionStrategy} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { Router } from '@angular/router';
@Component({
  selector: 'cms-refund-batch-log-list',
  templateUrl: './refund-batch-log-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundBatchLogListComponent implements OnInit{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isBatchLogGridLoaderShow = false;
  public sortValue = this.financialVendorRefundFacade.sortValueBatchLog;
  public sortType = this.financialVendorRefundFacade.sortType;
  public pageSizes = this.financialVendorRefundFacade.gridPageSizes;
  public gridSkipCount = this.financialVendorRefundFacade.skipCount;
  public sort = this.financialVendorRefundFacade.sortBatchLogList;
  public state!: State;
  batchLogGridLists$ = this.financialVendorRefundFacade.batchLogData$;
  
  public batchLogGridActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Refund',
      icon: 'edit',
      
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Unbatch Refund',
      icon: 'undo',
     
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Refund',
      icon: 'delete',
      
    },
  ];
  /** Constructor **/
  constructor(private route: Router, private readonly financialVendorRefundFacade: FinancialVendorRefundFacade) {}

  ngOnInit(): void {
    this.loadBatchLogListGridData();
  }
  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }

  // updating the pagination info based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
  }
  loadBatchLogListGridData() {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.financialVendorRefundFacade.loadBatchLogListGrid();
  }
  onBackClicked(){
    this.route.navigate(['financial-management/vendor-refund']);
  }
}
