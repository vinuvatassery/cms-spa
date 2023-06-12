import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { InsuranceProviderFacade } from '@cms/case-management/domain';
import { State } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
@Component({
  selector: 'cms-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
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
  public state!: State;
  providerClientGridView$ = this.insuranceProviderFacade.providerClientsData$;
  @Input() providerId:any;
  addressGridView = [];
  @Input() tabCode: any;

  /** Constructor **/
  constructor(private readonly insuranceProviderFacade: InsuranceProviderFacade,private readonly router: Router,) {}

  ngOnInit(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
    this.providerId='F49E42C5-1F8A-4297-A06A-C84F8EF187BF'
    this.loadClientsListGrid();
  }

  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }

  public actions = [
    {
      buttonType: "btn-h-primary",
      text: "Edit Address",
      icon: "edit",
      click: (address:any): void => {


      },
    },
    {
      buttonType: "btn-h-primary",
      text: "Deactivate Address",
      icon: "block",
      click: (address:any): void => {

      },
    },
    {
      buttonType: "btn-h-danger",
      text: "Delete Address",
      icon: "delete",
      click: (address:any): void => {

      },
    },




  ];

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.insuranceProviderFacade.clientsSortValue;
    this.sortType = stateData.sort[0]?.dir ?? this.insuranceProviderFacade.sortType;
    this.state = stateData;
    this.loadClientsListGrid();
  }
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadClientsListGrid();
  }
  loadClientsListGrid()
  {
    this.insuranceProviderFacade.loadProviderClientsListGrid(this.providerId,this.tabCode,this.state.skip ?? 0 ,this.state.take ?? 0,this.sortValue , this.sortType);
  }
  onClientClicked(clientId: any) {
    this.router.navigate([`/case-management/cases/case360/${clientId}`]);

}
}
