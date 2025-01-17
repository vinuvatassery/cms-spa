/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { BillingEmailAddressFacade } from '@cms/case-management/domain';
/** External Libraries **/
import { State } from '@progress/kendo-data-query';
@Component({
  selector: 'cms-billing-email-address-list',
  templateUrl: './billing-email-address-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingEmailAddressListComponent { 
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isEmailBillingAddressDetailShow = false;
  isEmailBillingAddressDeactivateShow = false;
  isEmailBillingAddressDeleteShow = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isBillingEmailAddressGridLoaderShow = false;
  public sortValue = this.billingEmailAddressFacade.sortValue;
  public sortType = this.billingEmailAddressFacade.sortType;
  public pageSizes = this.billingEmailAddressFacade.gridPageSizes;
  public gridSkipCount = this.billingEmailAddressFacade.skipCount;
  public sort = this.billingEmailAddressFacade.sort;
  public state!: State;
  billingEmailAddressGridView$ = this.billingEmailAddressFacade.billingEmailAddressData$;

 
  public emailBillingAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
      click: (data: any): void => {
        this.clickOpenAddEditEmailBillingAddressDetails();
        console.log(data);
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate',
      icon: 'block',
      click: (data: any): void => {
        console.log(data);
        this.clickOpenDeactivateEmailBillingAddressDetails();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (data: any): void => {
        console.log(data);
        this.clickOpenDeleteEmailBillingAddressDetails();
      },
    },
  ];

  
  /** Constructor **/
  constructor(private readonly billingEmailAddressFacade: BillingEmailAddressFacade) {}

  ngOnInit(): void {
    this.loadBillingEmailAddressListGrid();
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
  loadBillingEmailAddressListGrid() {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.billingEmailAddressFacade.loadBillingEmailAddressListGrid();
  }

  clickOpenAddEditEmailBillingAddressDetails() {
    this.isEmailBillingAddressDetailShow = true;
  }

  clickCloseAddEditEmailBillingAddressDetails() {
    this.isEmailBillingAddressDetailShow = false;
  }

  clickOpenDeactivateEmailBillingAddressDetails() {
    this.isEmailBillingAddressDeactivateShow = true;
  }
  clickCloseDeactivateEmailBillingAddress() {
    this.isEmailBillingAddressDeactivateShow = false;
  }

  clickOpenDeleteEmailBillingAddressDetails() {
    this.isEmailBillingAddressDeleteShow = true;
  }
  clickCloseDeleteEmailBillingAddress() {
    this.isEmailBillingAddressDeleteShow = false;
  }
}
