import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseFacade, IncomeFacade, ScreenType } from '@cms/case-management/domain';


@Component({
  selector: 'case-management-profile-income-page',
  templateUrl: './profile-income-page.component.html',
  styleUrls: ['./profile-income-page.component.scss'],
})
export class ProfileIncomePageComponent implements OnInit {

  screenName = ScreenType.Case360Page;    

  /** Constructor**/
  constructor(
    private readonly caseFacade: CaseFacade,
    private readonly incomeFacade: IncomeFacade,
    private route: ActivatedRoute
  ) {
  }

  eligibilityPeriodData$ = this.caseFacade.ddlEligPeriods$
  historyClientCaseEligibilityId!: string;
  clientCaseId!: string;
  clientId!: number;
  clientCaseEligibilityId!: any; 
  tabId! : any
  /** Lifecycle hooks **/
  ngOnInit() {   
    this.loadQueryParams()
  }
  
  loadQueryParams()
  {
    this.clientId = this.route.snapshot.queryParams['id'];
    this.clientCaseEligibilityId = this.route.snapshot.queryParams['e_id'];    
    this.tabId = this.route.snapshot.queryParams['tid'];  
    this.clientCaseId = this.route.snapshot.queryParams['cid'];  
    this.historyClientCaseEligibilityId = this.clientCaseEligibilityId     
    this.caseFacade.loadEligibilityPeriods(this.clientCaseId)
  }
  private loadIncomeData(clientId: any, eligibilityId: any, skipCount: number,
    pageSize: number, sortBy: string, sortType: string) {
    this.incomeFacade.loadIncomes(clientId, eligibilityId, skipCount, pageSize, sortBy, sortType);
  }

  /** Load Incomes **/
  public loadIncomes() {
    this.loadIncomeData(
      this.clientId?.toString(),
      this.clientCaseEligibilityId,
      this.incomeFacade.skipCount,
      this.incomeFacade.gridPageSizes[0].value,
      this.incomeFacade.sortValue,
      this.incomeFacade.sortType);
  }

  loadIncomeListHandle(gridDataRefinerValue: any): void {
    const gridDataRefiner = {
      skipcount: gridDataRefinerValue.skipCount,
      maxResultCount: gridDataRefinerValue.pagesize,
      sortColumn: gridDataRefinerValue.sortColumn,
      sortType: gridDataRefinerValue.sortType,
    };
    this.loadIncomeData(
      this.clientId.toString(),
      this.clientCaseEligibilityId,
      gridDataRefiner.skipcount,
      gridDataRefiner.maxResultCount,
      gridDataRefiner.sortColumn,
      gridDataRefiner.sortType
    );
  }

  onPeriodSelectionChange(value: any) {
    this.clientCaseEligibilityId = value.id;
    this.loadIncomes();
  }
}
