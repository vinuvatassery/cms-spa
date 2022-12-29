/** Angular **/
import { Injectable } from '@angular/core';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { UserDataService } from '@cms/system-config/domain';
import { Observable, of, Subject } from 'rxjs';
import { CompletionChecklist } from '../entities/workflow-stage-completion-status';
import { StatusFlag } from '../enums/status-flag.enum';
import { UserDefaultRoles } from '../enums/user-default-roles.enum';
import { CaseManagerDataService } from '../infrastructure/case-manager.data.service';
import { WorkflowFacade } from './workflow.facade';

@Injectable({ providedIn: 'root' })
export class CaseManagerFacade {
/** Private properties **/
private getManagerUsersSubject = new Subject<any>();
private getCaseManagersSubject = new Subject<any>();


/** Public properties **/
getManagerUsers$ = this.getManagerUsersSubject.asObservable();
getCaseManagers$ = this.getCaseManagersSubject.asObservable();
    
    /** Constructor **/
 constructor(private readonly userDataService: UserDataService,
  private readonly caseManagerDataService: CaseManagerDataService,
      private readonly loaderService: LoaderService,
      private loggingService : LoggingService ,
      private readonly notificationSnackbarService : NotificationSnackbarService,
      private workflowFacade: WorkflowFacade ) {}


  ShowHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {        
      if(type == SnackBarNotificationType.ERROR)
      {
        const err= subtitle;    
        this.loggingService.logException(err)
      }  
        this.notificationSnackbarService.manageSnackBar(type,subtitle)
        this.HideLoader();   
  }
    
  ShowLoader()
  {
    this.loaderService.show();
  }
    
  HideLoader()
  {
    this.loaderService.hide();
  }

  searchUsersByRole(text : string): void {
     this.userDataService.searchUsersByRole(UserDefaultRoles.CACaseManager ,text).subscribe({
       next: (getManagerUsersResponse) => {
        this.getManagerUsersSubject.next(getManagerUsersResponse);
      },
        error: (err) => {
           this.loggingService.logException(err)
        },
      });
  }

  loadCaseManagers(clientCaseId : string): void {
    this.ShowLoader()
    this.caseManagerDataService.loadCaseManagers(clientCaseId).subscribe({
      next: (getCaseManagersResponse : any) => {
       
        if(getCaseManagersResponse)
        {
          const gridView = {
            data : getCaseManagersResponse["items"] ,        
            total:  getCaseManagersResponse["totalCount"]  
            };       
        const workFlowdata: CompletionChecklist[] = [{
          dataPointName: 'hasHivCaseManager',
          status: (parseInt(getCaseManagersResponse["totalCount"]) > 0) ? StatusFlag.Yes : StatusFlag.No
        }]; 

        this.workflowFacade.updateChecklist(workFlowdata);
        this.getCaseManagersSubject.next(gridView);      
        this.HideLoader();  
        }      
     },
       error: (err) => {
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)   
       },
     });
 }
    
}
