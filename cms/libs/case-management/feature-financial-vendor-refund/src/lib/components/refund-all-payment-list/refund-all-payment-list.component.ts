import { Component,  ChangeDetectionStrategy,  OnInit} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialVendorRefundFacade } from '@cms/case-management/domain';
@Component({
  selector: 'cms-refund-all-payment-list',
  templateUrl: './refund-all-payment-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundAllPaymentListComponent implements OnInit{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isVendorRefundAllPaymentsGridLoaderShow = false;
  public sortValue = this.financialVendorRefundFacade.sortValueRefundPayments;
  public sortType = this.financialVendorRefundFacade.sortType;
  public pageSizes = this.financialVendorRefundFacade.gridPageSizes;
  public gridSkipCount = this.financialVendorRefundFacade.skipCount;
  public sort = this.financialVendorRefundFacade.sortPaymentsList;
  public state!: State;
  vendorRefundAllPaymentsGridLists$ = this.financialVendorRefundFacade.vendorRefundAllPaymentsData$;
  
  public allPaymentsGridActions = [
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
  constructor(private readonly financialVendorRefundFacade: FinancialVendorRefundFacade) {}

  ngOnInit(): void {
    this.loadVendorRefundAllPaymentsListGrid();
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
  loadVendorRefundAllPaymentsListGrid() {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.financialVendorRefundFacade.loadVendorRefundAllPaymentsListGrid();
  }
}
