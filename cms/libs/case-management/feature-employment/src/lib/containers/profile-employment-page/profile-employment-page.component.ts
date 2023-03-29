import { Component, OnInit, Input } from '@angular/core';
import { CaseFacade, EmploymentFacade, ScreenType } from '@cms/case-management/domain';
import { filter, first, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'case-management-profile-employment-page',
  templateUrl: './profile-employment-page.component.html',
  styleUrls: ['./profile-employment-page.component.scss'],
})
export class ProfileEmploymentPageComponent implements OnInit {

  screenName = ScreenType.Case360Page;
  
  @Input() clientId = 0;
  @Input() clientCaseEligibilityId!: string;
  @Input() historyClientCaseEligibilityId: string = "";
  @Input() clientCaseId!: string;
  @Input() eligibilityPeriodData: any = [];

  /** Constructor**/
  constructor(
    private readonly caseFacade: CaseFacade,
    private readonly employmentFacade: EmploymentFacade,
  ) {
  }

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadEmployments();
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

