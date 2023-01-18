/** Angular **/
import { Injectable } from '@angular/core';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { UserDataService } from '@cms/system-config/domain';
import { Observable, of, Subject } from 'rxjs';
import { CaseManager } from '../entities/case-manager';
import { CompletionChecklist } from '../entities/workflow-stage-completion-status';
import { StatusFlag } from '../enums/status-flag.enum';
import { UserDefaultRoles } from '../enums/user-default-roles.enum';
import { YesNoFlag } from '../enums/yes-no-flag.enum';
import { CaseManagerDataService } from '../infrastructure/case-manager.data.service';
import { WorkflowFacade } from './workflow.facade';

@Injectable({ providedIn: 'root' })
export class CaseManagerFacade {
/** Private properties **/
private getManagerUsersSubject = new Subject<any>();
private getCaseManagersSubject = new Subject<any>();
private getCaseManagerHasManagerStatusSubject = new Subject<any>();
private getCaseManagerNeedManagerStatusSubject = new Subject<any>();
private showAddNewManagerButtonSubject = new Subject<boolean>();
private updateCaseManagerNeedManagerStatusSubject = new Subject<any>();
private removeCaseManagerSubject = new Subject<any>();
private selectedCaseManagerDetailsSubject = new Subject<any>();
private assignCaseManagerSubject = new Subject<any>();


/** Public properties **/
getManagerUsers$ = this.getManagerUsersSubject.asObservable();
getCaseManagers$ = this.getCaseManagersSubject.asObservable();
getCaseManagerHasManagerStatus$ = this.getCaseManagerHasManagerStatusSubject.asObservable();
getCaseManagerNeedManagerStatus$ = this.getCaseManagerNeedManagerStatusSubject.asObservable();
showAddNewManagerButton$ = this.showAddNewManagerButtonSubject.asObservable();
updateCaseManagerNeedManagerStatus$ = this.updateCaseManagerNeedManagerStatusSubject.asObservable();
removeCaseManager$ = this.removeCaseManagerSubject.asObservable();
selectedCaseManagerDetails$ = this.selectedCaseManagerDetailsSubject.asObservable();
assignCaseManagerStatus$ = this.assignCaseManagerSubject.asObservable();
    
    /** Constructor **/
 constructor(private readonly userDataService: UserDataService,
  private readonly caseManagerDataService: CaseManagerDataService,
      private readonly loaderService: LoaderService,
      private readonly loggingService : LoggingService ,
      private readonly notificationSnackbarService : NotificationSnackbarService,
      private readonly workflowFacade: WorkflowFacade ) {}


  showHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {        
      if(type == SnackBarNotificationType.ERROR)
      {
        const err= subtitle;    
        this.loggingService.logException(err)
      }  
        this.notificationSnackbarService.manageSnackBar(type,subtitle)
        this.hideLoader();   
  }
    
  showLoader()
  {
    this.loaderService.show();
  }
    
  hideLoader()
  {
    this.loaderService.hide();
  }

  searchUsersByRole(text : string): void {
     this.userDataService.searchUsersByRole(UserDefaultRoles.CACaseManager ,text).subscribe({
       next: (getManagerUsersResponse) => {
        Object.values(getManagerUsersResponse).forEach((key) => {   
          key.fullCustomName = key.fullName +' '+ key.pOrNbr  + ' '+ key.phoneNbr
        });
        this.getManagerUsersSubject.next(getManagerUsersResponse);
      },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
        },
      });
  }

  loadCaseManagers(clientCaseId : string): void {
    this.showLoader()
    this.caseManagerDataService.loadCaseManagers(clientCaseId).subscribe({
      next: (getCaseManagersResponse : any) => {
       
        if(getCaseManagersResponse)
        {
          const gridView = {
            data : getCaseManagersResponse["items"] ,        
            total:  getCaseManagersResponse["totalCount"]  
            };       
        const workFlowdata: CompletionChecklist[] = [{
          dataPointName: 'caseManager',
          status: (parseInt(getCaseManagersResponse["totalCount"]) > 0) ? StatusFlag.Yes : StatusFlag.No
        }]; 
        if(parseInt(getCaseManagersResponse["totalCount"]) > 0)
        {          
        this.showAddNewManagerButtonSubject.next(false);
        }
        else
        {
          this.showAddNewManagerButtonSubject.next(true);
        }
        this.workflowFacade.updateChecklist(workFlowdata);
        this.getCaseManagersSubject.next(gridView);      
        this.hideLoader();  
        }      
     },
       error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)   
       },
     });
 }

    getCaseManagerStatus(clientCaseId : string): void {
      this.showLoader()
      this.caseManagerDataService.getCaseManagerStatus(clientCaseId).subscribe({
        next: (getManagerStatusResponse : any) => {    
          let hasManager! : any;
          let needManager! : any;
          if(getManagerStatusResponse?.hasManager === StatusFlag.Yes)  
          {
            hasManager =true;
          }
          else  if(getManagerStatusResponse?.hasManager === StatusFlag.No)  
          {
            hasManager =false;
          }   
          
          if(getManagerStatusResponse?.needManager === StatusFlag.Yes)  
          {
            needManager =true;
          }
          else  if(getManagerStatusResponse?.needManager === StatusFlag.No)  
          {
            needManager =false;
          }   
        this.getCaseManagerHasManagerStatusSubject.next(hasManager);
        this.getCaseManagerNeedManagerStatusSubject.next(needManager);
        this.hideLoader()
      },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
        },
      }); 
    }

    
    updateCaseManagerStatus(clientCaseId : string ,  hasManager :string, needManager : string) {
      this.showLoader()
      if(hasManager === StatusFlag.Yes)
      {
        needManager ='NULL'
      }
        return  this.caseManagerDataService.updateCaseManagerStatus(clientCaseId , hasManager ?? 'NULL', needManager ?? 'NULL')
    }

    removeCaseManager(clientCaseId : string): void {
      this.showLoader()
      this.caseManagerDataService.removeCaseManager(clientCaseId).subscribe({
        next: (removeManagerResponse) => {
         this.removeCaseManagerSubject.next(removeManagerResponse);
         this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Case Manager Removed')    
       },
         error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
         },
       });
   }


   
   loadSelectedCaseManagerData(assignedCaseManagerId: string ,clientCaseId : string): void {
    this.showLoader()
    this.caseManagerDataService.loadSelectedCaseManagerData(assignedCaseManagerId,clientCaseId).subscribe({
      next: (selectedCaseManagerDetailsResponse) => {
       this.selectedCaseManagerDetailsSubject.next(selectedCaseManagerDetailsResponse);    
       this.hideLoader()   
     },
       error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
       },
     });
 }



  assignCaseManager(clientCaseId : string, assignedCaseManagerId : string): void {
  this.showLoader()
  this.caseManagerDataService.assignCaseManager(clientCaseId,assignedCaseManagerId).subscribe({
    next: (assignCaseManagerResponse) => {
     this.assignCaseManagerSubject.next(assignCaseManagerResponse);
     this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Case Manager Assiged Successfully')    
   },
     error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
     },
   });
 }

 updateWorkFlow(statusData : boolean)
 {
  const workFlowdata: CompletionChecklist[] = [{
    dataPointName: 'wouldYouLikeOne',
    status: statusData === true ? StatusFlag.Yes : StatusFlag.No 
  }]; 

  this.workflowFacade.updateChecklist(workFlowdata);
 }
    
}
