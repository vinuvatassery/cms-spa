/** Angular **/
import {
  ChangeDetectionStrategy, 
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CaseManagerFacade, ClientProfileTabs,  ManagementFacade } from '@cms/case-management/domain';
import { UserManagementFacade, LabResultLovType} from '@cms/system-config/domain';

/** External libraries **/
import { filter, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'case-management-profile-management-page',
  templateUrl: './profile-management-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileManagementPageComponent implements OnInit, OnDestroy {
 
  pageSizes = this.managementFacade.gridPageSizes;
  sortValue = this.managementFacade.sortValue;
  sortType = this.managementFacade.sortType;
  sort = this.managementFacade.sort;
  clientLabResults$ = this.managementFacade.clientLabResults$;

       /** Constructor **/
   constructor(
    private caseManagerFacade: CaseManagerFacade,
    private route: ActivatedRoute,
    private userManagementFacade : UserManagementFacade,
    private router : Router,
    private managementFacade : ManagementFacade) { }

  /** Public properties **/
isVisible: any;
isSelected = true;
clientCaseId! : string;
sessionId! : string;
clientId ! : number
clientCaseEligibilityId ! : string

getCaseManagers$ = this.caseManagerFacade.getCaseManagers$;
getManagerUsers$ = this.caseManagerFacade.getManagerUsers$;
selectedCaseManagerDetails$= this.caseManagerFacade.selectedCaseManagerDetails$;
assignCaseManagerStatus$ = this.caseManagerFacade.assignCaseManagerStatus$;
removeCaseManager$ = this.caseManagerFacade.removeCaseManager$;
userImage$ = this.userManagementFacade.userImage$;

showAddNewManagerButtonSubject = new Subject<boolean>();
showAddNewManagerButton$ = this.showAddNewManagerButtonSubject.asObservable();
/** Private properties **/
  tabChangeSubscription$ = new Subscription();
  tabIdSubject = new Subject<string>();
  tabId$ = this.tabIdSubject.asObservable();
  profileClientId!: number;
 
  tabId!: any;
  labResultType! : string;
 
  ngOnInit(): void {
    this.loadQueryParams();
    this.routeChangeSubscription()
  }

  /** Private properties **/
  loadQueryParams() {
    this.profileClientId = this.route.snapshot.queryParams['id'];
    this.clientCaseEligibilityId = this.route.snapshot.queryParams['e_id'];
    this.tabId = this.route.snapshot.queryParams['tid'];
    this.clientCaseId = this.route.snapshot.queryParams['cid'];
    if(this.tabId === ClientProfileTabs.MANAGEMENT_CD4)
    {
      this.labResultType = LabResultLovType.CD4_COUNT
    }
    else if(this.tabId === ClientProfileTabs.MANAGEMENT_VRL)
    {
      this.labResultType = LabResultLovType.VRL_LOAD
    }

    this.tabIdSubject.next(this.tabId);    
    
  }
  get clientProfileTabs(): typeof ClientProfileTabs {
    return ClientProfileTabs;
  }
  private routeChangeSubscription() {
    this.tabChangeSubscription$ = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadQueryParams();
      });
  }

  loadClientLabResultsHandle(gridDataRefinerValue: any): void {
    const gridDataRefiner = {
      skipcount: gridDataRefinerValue.skipCount,
      maxResultCount: gridDataRefinerValue.pagesize,
      sort: gridDataRefinerValue.sortColumn,
      sortType: gridDataRefinerValue.sortType ,
      historychkBoxChecked :   gridDataRefinerValue.historychkBoxChecked
    };

    this.pageSizes = this.managementFacade.gridPageSizes;
    this.managementFacade.loadLabResults(
      this.labResultType,
      this.profileClientId,
      this.clientCaseEligibilityId,
      gridDataRefiner.skipcount,
      gridDataRefiner.maxResultCount,
      gridDataRefiner.sort,
      gridDataRefiner.sortType,
      gridDataRefiner.historychkBoxChecked   
    );
  }

 

  ngOnDestroy(): void {
    this.tabChangeSubscription$.unsubscribe();
  }

   


 
   /** Private Methods **/
 

   loadCaseManagers()
   {
     this.caseManagerFacade.loadCaseManagers(this.clientCaseId);
     this.showAddNewManagerButtonSubject.next(true)
   } 
    
 
  removecaseManagerHandler(deleteCaseManagerCaseId : string)
   {    
     this.caseManagerFacade.removeCaseManager(deleteCaseManagerCaseId)
   }
 
   searchTextEventHandler(text : string)
   {
    this.caseManagerFacade.searchUsersByRole(text);
   }
 
   getExistingCaseManagerEventHandler(assignedCaseManagerId : string)
    {        
     if(assignedCaseManagerId)
     {
     this.caseManagerFacade.loadSelectedCaseManagerData(assignedCaseManagerId,this.clientCaseId)
     }
    }
 
 
    assignCaseManagerEventHandler(event : any)
    {       
     if(event?.assignedcaseManagerId)
     {
     this.caseManagerFacade.assignCaseManager(this.clientCaseId ,event?.assignedcaseManagerId)
     }
    }
 
    getCaseManagerImage(assignedCaseManagerId : string)
    {    
        if(assignedCaseManagerId)
        {
        this.userManagementFacade.getUserImage(assignedCaseManagerId);
        }
    } 
 
}
