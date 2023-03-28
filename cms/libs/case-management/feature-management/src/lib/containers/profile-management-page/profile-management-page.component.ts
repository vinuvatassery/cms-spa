/** Angular **/
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute,  Router } from '@angular/router';
/** External libraries **/
import { catchError, filter, first, forkJoin, mergeMap, of, Subject, Subscription, tap } from 'rxjs';
/** Internal Libraries **/
import { WorkflowFacade,  NavigationType, CaseManagerFacade, StatusFlag, CompletionChecklist } from '@cms/case-management/domain';
import { SnackBarNotificationType, LoaderService } from '@cms/shared/util-core';
import { UserManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-profile-management-page',
  templateUrl: './profile-management-page.component.html',
  styleUrls: ['./profile-management-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileManagementPageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
  
  ) { }
  
  profileClientId!: number;
  clientCaseEligibilityId!: any; 
  tabId! : any
  ngOnInit(): void {
    this. loadQueryParams()
   
  }

  /** Private properties **/
  loadQueryParams()
  {
    this.profileClientId = this.route.snapshot.queryParams['id'];
    this.clientCaseEligibilityId = this.route.snapshot.queryParams['elg_id'];    
    this.tabId = this.route.snapshot.queryParams['tabId'];  
  }
}
