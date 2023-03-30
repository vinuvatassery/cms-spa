import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseFacade, EmploymentFacade, ScreenType } from '@cms/case-management/domain';


@Component({
  selector: 'case-management-profile-employment-page',
  templateUrl: './profile-employment-page.component.html',
  styleUrls: ['./profile-employment-page.component.scss'],
})
export class ProfileEmploymentPageComponent implements OnInit {

  screenName = ScreenType.Case360Page; 
  eligibilityPeriodData$ = this.caseFacade.ddlEligPeriods$
  historyClientCaseEligibilityId!: string;
  clientCaseId!: string;
  clientId!: number;
  clientCaseEligibilityId!: any; 
  tabId! : any
  /** Constructor**/
  constructor(
    private readonly caseFacade: CaseFacade,
    private readonly employmentFacade: EmploymentFacade,
    private route: ActivatedRoute
  ) {
  }

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
  
  private loadEmploymentData(clientId: any, eligibilityId: any, skipCount: number,
    pageSize: number, sortBy: string, sortType: string) {
    this.employmentFacade.loadEmployers(clientId, eligibilityId, skipCount, pageSize, sortBy, sortType);
  }

  /** Load Employments **/
  public loadEmployments() {
    this.loadEmploymentData(
      this.clientId.toString(),
      this.clientCaseEligibilityId,
      this.employmentFacade.skipCount,
      this.employmentFacade.gridPageSizes[0].value,
      this.employmentFacade.sortValue,
      this.employmentFacade.sortType);
  }

  loadEmploymentsHandle(gridDataRefinerValue: any): void {
    const gridDataRefiner = {
      skipcount: gridDataRefinerValue.skipCount,
      maxResultCount: gridDataRefinerValue.pagesize,
      sort: gridDataRefinerValue.sortColumn,
      sortType: gridDataRefinerValue.sortType,
    };
    this.loadEmploymentData(
      this.clientId.toString(),
      this.clientCaseEligibilityId,
      gridDataRefiner.skipcount,
      gridDataRefiner.maxResultCount,
      gridDataRefiner.sort,
      gridDataRefiner.sortType
    );
  }

  onPeriodSelectionChange(value: any) {
    this.clientCaseEligibilityId = value.id;
    this.loadEmployments();
  }
}

