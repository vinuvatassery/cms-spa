import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseFacade, GridFilterParam, IncomeFacade, ScreenType } from '@cms/case-management/domain';
import { LovFacade } from '@cms/system-config/domain';


@Component({
  selector: 'case-management-profile-income-page',
  templateUrl: './profile-income-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileIncomePageComponent implements OnInit {

  screenName = ScreenType.Case360Page;    

  /** Constructor**/
  constructor(
    private readonly caseFacade: CaseFacade,
    private readonly incomeFacade: IncomeFacade,
    private route: ActivatedRoute,
    private readonly lovFacade : LovFacade
  ) {
  }

  eligibilityPeriodData$ = this.caseFacade.ddlEligPeriods$
  currentClientCaseEligibilityId!: string;
  clientCaseId!: string;
  clientId!: number;
  clientCaseEligibilityId!: any; 
  lovProofOfIncomeByType$  = this.lovFacade.lovProofOfIncomeByType$;
  incomeSourcelov$ = this.lovFacade.incomeSourcelov$;
  incomeTypelov$ = this.lovFacade.incomeTypelov$;
  incomeFrequencylov$  = this.lovFacade.incomeFrequencylov$;
  incomesLoader$ = this.incomeFacade.incomesLoader$;
  tabId! : any
  historyStatus: boolean = false;
  public pageSize = 5;
  public gridSkipCount = this.incomeFacade.skipCount;
  sortValue:any ='incomeSourceCodeDesc';
  sortType:any='asc'
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
    this.currentClientCaseEligibilityId = this.clientCaseEligibilityId     
    this.caseFacade.loadEligibilityPeriods(this.clientCaseId);
    this.loadIncomes();
    this.lovFacade.getProofOfIncomeTypesByTypeLov();
    this.lovFacade.getIncomeSourceLovs();
    this.lovFacade.getIncomeFrequencyLovs();
    this.lovFacade.getIncomeTypeLovs();
  }
  private loadIncomeData(clientId: any, eligibilityId: any, gridFilterParam:any) {
     
    this.incomeFacade.loadIncomes(clientId, eligibilityId, gridFilterParam);
  }

  /** Load Incomes **/
  public loadIncomes() {

    const gridFilterParam = new GridFilterParam(this.gridSkipCount, this.pageSize, this.sortValue, this.sortType, JSON.stringify(null));   
    this.loadIncomeData(
      this.clientId?.toString(),
      this.clientCaseEligibilityId,
      gridFilterParam);
  }

  loadIncomeListHandle(gridDataRefinerValue: any): void {
    const gridFilterParam = new GridFilterParam(gridDataRefinerValue.skipCount, gridDataRefinerValue.pageSize, gridDataRefinerValue.sortColumn, gridDataRefinerValue.sortType, JSON.stringify(gridDataRefinerValue.filter));   
    this.loadIncomeData(
      this.clientId.toString(),
      this.clientCaseEligibilityId,
      gridFilterParam
    );
  }

  onPeriodSelectionChange(value: any) {
    this.clientCaseEligibilityId = value.id;
    this.loadIncomes();
  }

  updateHistoryStatus(historyStatus: boolean) {
    this.historyStatus = historyStatus;
  }
}
