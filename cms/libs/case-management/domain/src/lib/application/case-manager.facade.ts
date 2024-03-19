/** Angular **/
import { Injectable } from '@angular/core';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, ReminderNotificationSnackbarService, ReminderSnackBarNotificationType, SnackBarNotificationType } from '@cms/shared/util-core';
import { UserDataService, UserDefaultRoles, UserManagementFacade } from '@cms/system-config/domain';
import { Subject } from 'rxjs';
import { CompletionChecklist } from '../entities/workflow-stage-completion-status';
import { CaseManagerDataService } from '../infrastructure/case-manager.data.service';
import { WorkflowFacade } from './workflow.facade';
import { SortDescriptor } from '@progress/kendo-data-query';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { StatusFlag } from '@cms/shared/ui-common';

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
private genericCaseManagerSubject = new Subject<any>();
private updateDatesCaseManagerSubject = new Subject<any>();
public showCaseListRequiredSubject  = new BehaviorSubject<boolean>(false);



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
genericCaseManager$ = this.genericCaseManagerSubject.asObservable();
updateDatesCaseManager$ = this.updateDatesCaseManagerSubject.asObservable();
public gridPageSizes =this.configurationProvider.appSettings.gridPageSizeValues;
  public sortValue = ' '
  public sortType = 'asc'
caseManagersProfilePhotoSubject = new Subject();
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
    dir: 'asc' 
  }];
  showCaseListRequired$ = this.showCaseListRequiredSubject.asObservable();

  public skipCount = this.configurationProvider.appSettings.gridSkipCount;

  public sortValueGeneralAPproval = 'batch';
  public sortGeneralList: SortDescriptor[] = [{
    field: this.sortValueGeneralAPproval,
  }];

  public sortValueApprovalPaymentsAPproval = 'batch';
  public sortApprovalPaymentsList: SortDescriptor[] = [{
    field: this.sortValueApprovalPaymentsAPproval,
  }];
  public sortValueImportedClaimsAPproval = 'batch';
  public sortImportedClaimsList: SortDescriptor[] = [{
    field: this.sortValueImportedClaimsAPproval,
  }];
  
    /** Constructor **/
constructor(private readonly userDataService: UserDataService,
  private readonly caseManagerDataService: CaseManagerDataService,
      private readonly loaderService: LoaderService,
      private readonly loggingService : LoggingService ,
      private readonly notificationSnackbarService : NotificationSnackbarService,
      private readonly workflowFacade: WorkflowFacade,
      private readonly reminderNotificationSnackbarService: ReminderNotificationSnackbarService,
      private configurationProvider : ConfigurationProvider,
      private readonly userManagementFacade: UserManagementFacade, ) {}


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
  
  NotifyShowHideSnackBar(type: ReminderSnackBarNotificationType, subtitle: any) {
    if (type == ReminderSnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.reminderNotificationSnackbarService.manageSnackBar(type, subtitle)
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

  loadCaseManagers(caseId : string  , skipcount : number,maxResultCount : number ,sort : string, sortType : string, showDeactivated :boolean): void {
    this.showLoader()
    this.caseManagerDataService.loadCaseManagersGrid(caseId  ,skipcount ,maxResultCount  ,sort , sortType , showDeactivated ).subscribe({
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
        
        if(parseInt(getCaseManagersResponse["items"].filter(function(item : any){
          return item?.activeFlag === 'Y';
        }).length) > 0)
        {          
        this.showAddNewManagerButtonSubject.next(false);
        }
        else
        {
          this.showAddNewManagerButtonSubject.next(true);
        }
        this.workflowFacade.updateChecklist(workFlowdata);
        this.getCaseManagersSubject.next(gridView);  
        this.loadCaseManagersDistinctUserIdsAndProfilePhoto(getCaseManagersResponse["items"]);    
        this.hideLoader();  
        }      
     },
       error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)   
       },
     });
 }

 loadCaseManagersDistinctUserIdsAndProfilePhoto(data: any[]) {
  const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
  if(distinctUserIds){
    this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
    .subscribe({
      next: (data: any[]) => {
        if (data.length > 0) {
          this.caseManagersProfilePhotoSubject.next(data);
        }
      },
    });
  }
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
      this.hideLoader()
        return  this.caseManagerDataService.updateCaseManagerStatus(clientCaseId , hasManager ?? 'NULL', needManager ?? 'NULL')
    }

    updateCaseManagerDates( clientCaseManagerId: string,
      userId: string,
      startDate: Date,
      endDate: Date): void {
      this.showLoader()
      this.caseManagerDataService.updateCaseManagerDates( clientCaseManagerId,
        userId,
        startDate,
        endDate).subscribe({
        next: (updateDateManagerResponse) => {
         this.updateDatesCaseManagerSubject.next(updateDateManagerResponse);
         this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Case Manager Dates Updated')    
       },
         error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
         },
       });
   }

    removeCaseManager(clientCaseId : string, endDate : Date, userId : string): void {
      this.showLoader()
      this.caseManagerDataService.removeCaseManager(clientCaseId, endDate,userId).subscribe({
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


 
 getCaseManagerData(clientCaseId : string): void { 
  this.caseManagerDataService.getCaseManagerData(clientCaseId).subscribe({
    next: (genericCaseManagerResponse) => {
     this.genericCaseManagerSubject.next(genericCaseManagerResponse);   
   },
     error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
     },
   });
}
    
}
