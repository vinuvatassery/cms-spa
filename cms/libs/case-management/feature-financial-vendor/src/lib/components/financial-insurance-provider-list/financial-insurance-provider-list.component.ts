import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { GridFilterParam, VendorInsurancePlanFacade } from '@cms/case-management/domain';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { DocumentFacade } from '@cms/shared/util-core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { Subject, Subscription } from 'rxjs';
@Component({
  selector: 'cms-financial-insurance-provider-list',
  templateUrl: './financial-insurance-provider-list.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialInsuranceProviderListComponent implements OnInit {
  /* Input Properties */
  @Input() vendorId!: string;

  public formUiStyle: UIFormStyle = new UIFormStyle();
  isInsurancePlanDetailShow = false;
  isInsurancePlanDeactivateShow = false;
  isInsurancePlanDeleteShow = false;
  showExportLoader = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public sortValue = this.vendorInsurancePlanFacade.sortValue;
  public sortType = this.vendorInsurancePlanFacade.sortType;
  public pageSizes = this.vendorInsurancePlanFacade.gridPageSizes;
  public gridSkipCount = this.vendorInsurancePlanFacade.skipCount;
  public sort = this.vendorInsurancePlanFacade.sort;
  public state!: State;
  filter!: any;
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  vendorInsurancePlanGridView$ = this.vendorInsurancePlanFacade.vendorInsurancePlanData$;
  gridLoader$= this.vendorInsurancePlanFacade.vendorInsuranceGridLoader$;
  sortDir = 'Descending';
  sortColumnDesc = 'Insurance Provider';
  filteredByColumnDesc = '';
  columnChangeDesc = 'Default Columns';
  columnsReordered = false;
  insuranceVendorProfilePhoto$ = this.vendorInsurancePlanFacade.insuranceVendorProfilePhotoSubject;

  public emailBillingAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Add plan',
      icon: 'add',
      click: (data: any): void => {
        console.log(data);
        this.clickOpenAddEditInsurancePlanDetails();

      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Provider',
      icon: 'edit',
      click: (data: any): void => {
        console.log(data);
        this.clickOpenAddEditInsurancePlanDetails();

      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Activate Provider',
      icon: 'check',
      click: (data: any): void => {
        console.log(data);
        this.clickOpenDeactivateInsurancePlanDetails();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Deactivate Provider',
      icon: 'block',
      click: (data: any): void => {
        console.log(data);
        this.clickOpenDeleteInsurancePlanDetails();
      },
    },
  ];
  gridColumns: { [key: string]: string } = {
 
    providerName: 'Insurance Provider',
    insurancePlanCount: '# Of Active Plans',
    clientCount: '# Of Active Clients',

  };
  /** Constructor **/
  constructor(private readonly vendorInsurancePlanFacade: VendorInsurancePlanFacade , private documentFacade :  DocumentFacade,) { }

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
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.sortDir = this.sortType === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.filter = stateData?.filter?.filters;
    this.setFilterBy(true, this.filter);
 
    this.loadVendorInsuranceProviderListGrid();
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
    
  }
  resetGrid() {
    this.defaultGridState();
    this.sortValue = 'providerName';
    this.sortType = 'asc';
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : "";
    this.sortDir = this.sort[0]?.dir === 'desc' ? 'Descending' : "";
    this.filter = [];
    this.filteredByColumnDesc = '';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.columnChangeDesc = 'Default Columns';
    this.loadVendorInsuranceProviderListGrid();
  }
  private defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter: { logic: 'and', filters: [] },
    };
  }
  private setFilterBy(isFromGrid: boolean, filter: any = []) {
    this.filteredByColumnDesc = '';
    if (isFromGrid) {
      if (filter.length > 0) {
        const filteredColumns = this.filter?.map((f: any) => {
          const filteredColumns = f.filters?.filter((fld: any) => fld.value)?.map((fld: any) =>
            this.gridColumns[fld.field])
          return ([...new Set(filteredColumns)]);
        });

        this.filteredByColumnDesc = ([...new Set(filteredColumns)])?.sort()?.join(', ') ?? '';
      }
      return;
    }

  }
  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }


  loadVendorInsuranceProviderListGrid() {
    const params = new GridFilterParam(this.state.skip, this.state.take, this.sortValue, this.sortType, JSON.stringify(this.filter))
    this.vendorInsurancePlanFacade.loadVendorInsuranceProviderListGrid(this.vendorId, params);
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
  onClickedExport(){
    const params = {
      SortType: this.sortType,
      Sorting: this.sortValue,
      Filter: JSON.stringify(this.filter)
    };

    this.documentFacade.getExportFile(params,`vendors/${this.vendorId}/insurances-providers` , 'insurances-providers')
  }
}
