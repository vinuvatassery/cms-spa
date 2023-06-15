import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { VendorInsurancePlanFacade } from '@cms/case-management/domain';
import { State } from '@progress/kendo-data-query';
@Component({
  selector: 'cms-financial-insurance-provider-list',
  templateUrl: './financial-insurance-provider-list.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialInsuranceProviderListComponent implements OnInit  {
  /* Input Properties */
  @Input() vendorId!: string;

  public formUiStyle: UIFormStyle = new UIFormStyle();
  isInsurancePlanDetailShow = false;
  isInsurancePlanDeactivateShow = false;
  isInsurancePlanDeleteShow = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public sortValue = this.vendorInsurancePlanFacade.sortValue;
  public sortType = this.vendorInsurancePlanFacade.sortType;
  public pageSizes = this.vendorInsurancePlanFacade.gridPageSizes;
  public gridSkipCount = this.vendorInsurancePlanFacade.skipCount;
  public sort = this.vendorInsurancePlanFacade.sort;
  public state!: State;
  vendorInsurancePlanGridView$ = this.vendorInsurancePlanFacade.vendorInsurancePlanData$;
  gridLoader$= this.vendorInsurancePlanFacade.vendorInsuranceGridLoader$;

  public emailBillingAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
      click: (data: any): void => {
        console.log(data);
        this.clickOpenAddEditInsurancePlanDetails();

      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate',
      icon: 'block',
      click: (data: any): void => {
        console.log(data);
        this.clickOpenDeactivateInsurancePlanDetails();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (data: any): void => {
        console.log(data);
        this.clickOpenDeleteInsurancePlanDetails();
      },
    },
  ];

  /** Constructor **/
  constructor(private readonly vendorInsurancePlanFacade: VendorInsurancePlanFacade) { }

  ngOnInit(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadVendorInsuranceProviderListGrid();
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
    this.loadVendorInsuranceProviderListGrid();
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.state = stateData;
    this.loadVendorInsuranceProviderListGrid();
  }

  loadVendorInsuranceProviderListGrid() {
    this.vendorInsurancePlanFacade.loadVendorInsuranceProviderListGrid(this.vendorId, this.state);
  }

  clickOpenAddEditInsurancePlanDetails() {
    this.isInsurancePlanDetailShow = true;
  }

  clickCloseAddEditInsurancePlanDetails() {
    this.isInsurancePlanDetailShow = false;
  }

  clickOpenDeactivateInsurancePlanDetails() {
    this.isInsurancePlanDeactivateShow = true;
  }
  clickCloseDeactivateInsurancePlan() {
    this.isInsurancePlanDeactivateShow = false;
  }

  clickOpenDeleteInsurancePlanDetails() {
    this.isInsurancePlanDeleteShow = true;
  }
  clickCloseDeleteInsurancePlan() {
    this.isInsurancePlanDeleteShow = false;
  }
}
