/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CaseManagerFacade, ClientProfileTabs, StatusFlag } from '@cms/case-management/domain';
import { LoaderService } from '@cms/shared/util-core';
import { UserManagementFacade } from '@cms/system-config/domain';
/** External libraries **/
import { filter, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'case-management-profile-management-page',
  templateUrl: './profile-management-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileManagementPageComponent implements OnInit, OnDestroy {
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

/** Private properties **/
  tabChangeSubscription$ = new Subscription();
  tabIdSubject = new Subject<string>();
  tabId$ = this.tabIdSubject.asObservable();
  profileClientId!: number;
 
  tabId!: any;
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

  ngOnDestroy(): void {
    this.tabChangeSubscription$.unsubscribe();
  }

   
   /** Constructor **/
   constructor(
     private caseManagerFacade: CaseManagerFacade,
     private route: ActivatedRoute,
     private userManagementFacade : UserManagementFacade,
     private router : Router) { }

 
   /** Private Methods **/
 

   loadCaseManagers()
   {
     this.caseManagerFacade.loadCaseManagers(this.clientCaseId);
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
