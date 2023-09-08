import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { InsuranceProviderFacade, GridFilterParam } from '@cms/case-management/domain';
import { LovFacade } from '@cms/system-config/domain';
import {
  CompositeFilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { FilterService } from '@progress/kendo-angular-grid';

@Component({
  selector: 'cms-clients',
  templateUrl: './clients.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsComponent implements OnInit, OnChanges{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isclientsGridLoaderShow = false;
  public sortValue = this.insuranceProviderFacade.clientsSortValue;
  public sortType = this.insuranceProviderFacade.sortType;
  public pageSizes = this.insuranceProviderFacade.gridPageSizes;
  public gridSkipCount = this.insuranceProviderFacade.skipCount;
  public sort = this.insuranceProviderFacade.clientSort;
  caseStatusType$ = this.lovFacade.caseStatusType$;
  groupLov$ = this.lovFacade.groupLov$;
  caseStatusCodes:any=["CANCELED","REVIEW","NEW"];
  caseStatusTypes:any=[];
  public state!: State;
  providerClientGridView$ = this.insuranceProviderFacade.providerClientsData$;
  @Input() providerId:any;
  addressGridView = [];
  @Input() vendorTypeCode: any;
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  filter!: any;
  groupValue = null;
  statusValue = null;
  /** Constructor **/
  constructor(private readonly insuranceProviderFacade: InsuranceProviderFacade,private readonly router: Router,
    private readonly lovFacade: LovFacade) {}

  ngOnInit(): void {
    this.lovFacade.getGroupLovs();
    this.lovFacade.getCaseStatusLovs();
    this.getCaseStatusLovs();
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
    this.loadClientsListGrid();
    this.insuranceProviderFacade.gridLoaderVisibility$.subscribe(response=>{
      this.isclientsGridLoaderShow = response;
    });
  }

  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.insuranceProviderFacade.clientsSortValue;
    this.sortType = stateData.sort[0]?.dir ?? this.insuranceProviderFacade.sortType;
    this.state = stateData;
    this.filter = stateData?.filter?.filters;
    this.loadClientsListGrid();
  }
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadClientsListGrid();
  }
  loadClientsListGrid()
  {
    const param = new GridFilterParam(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      JSON.stringify(this.filter));
    this.insuranceProviderFacade.loadProviderClientsListGrid(this.providerId,this.vendorTypeCode,param);
  }
  onClientClicked(clientId: any) {
    this.router.navigate([`/case-management/cases/case360/${clientId}`]);

  }
  filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  private getCaseStatusLovs() {
    this.caseStatusType$
    .subscribe({
      next: (data: any) => {
        data=data.filter((item:any) => !this.caseStatusCodes.includes(item.lovCode));
        data.forEach((item: any) => {
          item.lovDesc = item.lovDesc.toUpperCase();
        });
        this.caseStatusTypes=data.sort((value1:any,value2:any) => value1.sequenceNbr - value2.sequenceNbr);
      }
    });
  }
  dropdownFilterChange(field:string, value: any, filterService: FilterService): void {
    filterService.filter({
        filters: [{
          field: field,
          operator: "eq",
          value:value.lovDesc
      }],
        logic: "or"
    });

    if(field == "group"){
      this.groupValue = value;
    }
    if(field == "status"){
      this.statusValue = value;
    }
  }
}
