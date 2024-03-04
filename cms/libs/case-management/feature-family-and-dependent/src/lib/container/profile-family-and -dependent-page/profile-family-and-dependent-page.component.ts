/** Angular **/
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseFacade, FamilyAndDependentFacade, ScreenType } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-profile-family-and-dependent-page',
  templateUrl: './profile-family-and-dependent-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFamilyAndDependentPageComponent implements OnInit{
  dependentList$ = this.familyAndDependentFacade.dependents$;
  screenName = ScreenType.Case360Page;
  eligibilityPeriodData$ = this.caseFacade.ddlEligPeriods$
  currentClientCaseEligibilityId!: string;
  clientCaseId!: string;
  clientId!: number;
  clientCaseEligibilityId!: any;
  tabId! : any
  pageSizes = this.familyAndDependentFacade.gridPageSizes;
  sortValue  = this.familyAndDependentFacade.sortValue;
  sortType  = this.familyAndDependentFacade.sortType;
  sort  = this.familyAndDependentFacade.sort;
  eligibilityPeriodData: any = [];
  historyStatus: boolean = false;
  dependentProfilePhoto$ = this.familyAndDependentFacade.dependentProfilePhotoSubject;
  /** Constructor**/
  constructor(
    private readonly caseFacade: CaseFacade,
    private familyAndDependentFacade: FamilyAndDependentFacade,
    private route: ActivatedRoute
  ) {
  }


    /** Lifecycle hooks **/
    ngOnInit() {

      this.loadQueryParams()
      this.loadDdlFamilyAndDependentEP();
    }

    private loadDdlFamilyAndDependentEP(): void {
      this.caseFacade.loadDdlFamilyAndDependentEP();
    }
    loadQueryParams()
    {
      this.clientId = this.route.snapshot.queryParams['id'];
      this.clientCaseEligibilityId = this.route.snapshot.queryParams['e_id'];
      this.tabId = this.route.snapshot.queryParams['tid'];
      this.clientCaseId = this.route.snapshot.queryParams['cid'];
      this.currentClientCaseEligibilityId = this.clientCaseEligibilityId
      this.caseFacade.loadEligibilityPeriods(this.clientCaseId)
    }


  loadDependentsHandle( gridDataRefinerValue : any ): void {
    const gridDataRefiner =
    {
      skipcount: gridDataRefinerValue.skipCount,
      maxResultCount : gridDataRefinerValue.pagesize,
      sort : gridDataRefinerValue.sortColumn,
      sortType : gridDataRefinerValue.sortType,
    }
    this.pageSizes = this.familyAndDependentFacade.gridPageSizes;
    this.loadDependentsData(this.clientCaseEligibilityId, this.clientId, gridDataRefiner.skipcount
    ,gridDataRefiner.maxResultCount,gridDataRefiner.sort,gridDataRefiner.sortType)
  }
  loadDependentsData(eligibilityId: any,clientId: any,skipCount: any,pageSize: number, sortBy: string, sortType: string )
  {
    this.familyAndDependentFacade.loadDependents(eligibilityId, this.clientId, skipCount?? 0 ,pageSize ,sortBy , sortType);
  }
  onDependentPeriodSelectionChange(value: any) {
    this.clientCaseEligibilityId = value.id;
    this.loadDependentsData(this.clientCaseEligibilityId, this.clientId, null, this.pageSizes, this.sortValue, this.sortType );
  }
  updateHistoryStatus(historyStatus: boolean) {
    this.historyStatus = historyStatus;
  }
}
