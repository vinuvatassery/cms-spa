import { Component,  OnInit,  ChangeDetectionStrategy,  Input,  EventEmitter,  Output,  OnChanges,  ChangeDetectorRef,} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialVendorRefundFacade } from '@cms/case-management/domain';
@Component({
  selector: 'cms-refund-batches-list',
  templateUrl: './refund-batches-list.component.html',
  styleUrls: ['./refund-batches-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundBatchesListComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isVendorRefundBatchGridLoaderShow = false;
  public sortValue = this.financialVendorRefundFacade.sortValueRefundBatch;
  public sortType = this.financialVendorRefundFacade.sortType;
  public pageSizes = this.financialVendorRefundFacade.gridPageSizes;
  public gridSkipCount = this.financialVendorRefundFacade.skipCount;
  public sort = this.financialVendorRefundFacade.sortBatchList;
  public state!: State;
  vendorRefundBatchGridLists$ = this.financialVendorRefundFacade.vendorRefundBatchData$;
  
  /** Constructor **/
  constructor(private readonly financialVendorRefundFacade: FinancialVendorRefundFacade) {}

  ngOnInit(): void {
    this.loadVendorRefundBatchListGrid();
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
  loadVendorRefundBatchListGrid() {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.financialVendorRefundFacade.loadVendorRefundBatchListGrid();
  }

}
