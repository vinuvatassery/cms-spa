/** Angular **/
import { Component,  OnInit,  ChangeDetectionStrategy,  Input,  EventEmitter,  Output,  OnChanges,  ChangeDetectorRef,} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialVendorRefundFacade } from '@cms/case-management/domain';
@Component({
  selector: 'cms-refund-process-list',
  templateUrl: './refund-process-list.component.html',
  styleUrls: ['./refund-process-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundProcessListComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isVendorRefundProcessGridLoaderShow = false;
  public sortValue = this.financialVendorRefundFacade.sortValue;
  public sortType = this.financialVendorRefundFacade.sortType;
  public pageSizes = this.financialVendorRefundFacade.gridPageSizes;
  public gridSkipCount = this.financialVendorRefundFacade.skipCount;
  public sort = this.financialVendorRefundFacade.sort;
  public state!: State;
  vendorRefundProcessGridLists$ = this.financialVendorRefundFacade.vendorRefundProcessData$;

 
  public emailBillingAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
      click: (data: any): void => { 
        console.log(data);
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate',
      icon: 'block',
      click: (data: any): void => {
        console.log(data); 
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (data: any): void => {
        console.log(data); 
      },
    },
  ];

  
  /** Constructor **/
  constructor(private readonly financialVendorRefundFacade: FinancialVendorRefundFacade) {}

  ngOnInit(): void {
    this.loadVendorRefundProcessListGrid();
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
  loadVendorRefundProcessListGrid() {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.financialVendorRefundFacade.loadVendorRefundProcessListGrid();
  }

}
