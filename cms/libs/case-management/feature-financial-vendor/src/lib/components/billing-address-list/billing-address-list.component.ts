/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnChanges,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { BillingAddressFacade } from '@cms/case-management/domain';
/** External Libraries **/
import { State } from '@progress/kendo-data-query';
@Component({
  selector: 'cms-billing-address-list',
  templateUrl: './billing-address-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingAddressListComponent implements OnInit, OnChanges {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isBillingAddressDetailShow = false;
  isBillingAddressDeactivateShow = false;
  isBillingAddressDeleteShow = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isBillingAddressGridLoaderShow = false;
  public sortValue = this.billingAddressFacade.sortValue;
  public sortType = this.billingAddressFacade.sortType;
  public pageSizes = this.billingAddressFacade.gridPageSizes;
  public gridSkipCount = this.billingAddressFacade.skipCount;
  public sort = this.billingAddressFacade.sort;
  public state!: State;
  billingAddressGridView$ = this.billingAddressFacade.billingAddressData$;
 
  public billingAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Address',
      icon: 'edit',
      click: (data: any): void => {
        this.clickOpenAddEditBillingAddressDetails();
        console.log(data);
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate Address',
      icon: 'block',
      click: (data: any): void => {
        console.log(data);
        this.clickOpenDeactivateBillingAddressDetails();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Address',
      icon: 'delete',
      click: (data: any): void => {
        console.log(data);
        this.clickOpenDeleteBillingAddressDetails();
      },
    },
  ];

  /** Constructor **/
  constructor(private readonly billingAddressFacade: BillingAddressFacade) {}

  ngOnInit(): void {
    this.loadBillingAddressListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }

  // updating the pagination info based on dropdown selection
  pageSelectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
  }
  loadBillingAddressListGrid() {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.billingAddressFacade.loadBillingAddressListGridService();
  }
  clickOpenAddEditBillingAddressDetails() {
    this.isBillingAddressDetailShow = true;
  }

  clickCloseAddEditBillingAddressDetails() {
    this.isBillingAddressDetailShow = false;
  }

  clickOpenDeactivateBillingAddressDetails() {
    this.isBillingAddressDeactivateShow = true;
  }
  clickCloseDeactivateBillingAddress() {
    this.isBillingAddressDeactivateShow = false;
  }

  clickOpenDeleteBillingAddressDetails() {
    this.isBillingAddressDeleteShow = true;
  }
  clickCloseDeleteBillingAddress() {
    this.isBillingAddressDeleteShow = false;
  }
}
