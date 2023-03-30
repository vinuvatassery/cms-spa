import { Component, OnInit, Input } from '@angular/core';
import { CaseFacade, IncomeFacade, ScreenType } from '@cms/case-management/domain';
import { filter, first, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'case-management-profile-income-page',
  templateUrl: './profile-income-page.component.html',
  styleUrls: ['./profile-income-page.component.scss'],
})
export class ProfileIncomePageComponent implements OnInit {

  screenName = ScreenType.Case360Page;
  
  @Input() clientId = 0;
  @Input() clientCaseEligibilityId!: string;
  @Input() historyClientCaseEligibilityId: string = "";
  @Input() clientCaseId!: string;
  @Input() eligibilityPeriodData: any = [];

  /** Constructor**/
  constructor(
    private readonly caseFacade: CaseFacade,
    private readonly incomeFacade: IncomeFacade
  ) {
  }

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadIncomes();
  }

  private loadIncomeData(clientId: any, eligibilityId: any, skipCount: number,
    pageSize: number, sortBy: string, sortType: string) {
    this.incomeFacade.loadIncomes(clientId, eligibilityId, skipCount, pageSize, sortBy, sortType);
  }

  /** Load Incomes **/
  public loadIncomes() {
    this.loadIncomeData(
      this.clientId.toString(),
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
