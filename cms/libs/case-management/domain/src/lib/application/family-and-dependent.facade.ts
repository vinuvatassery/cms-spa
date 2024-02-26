/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { Subject } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-angular-intl';
/** Internal libraries **/
import { Dependent } from '../entities/dependent';
import { ClientDependentGroupDesc} from '../enums/client-dependent-group.enum';
import { DependentTypeCode } from '../enums/dependent-type.enum';
import { DependentDataService } from '../infrastructure/dependent.data.service';
import { ConfigurationProvider, LoggingService, NotificationSnackbarService, SnackBarNotificationType, LoaderService, NotificationSource } from '@cms/shared/util-core';
import { WorkflowFacade } from './workflow.facade';
import { CompletionChecklist } from '../entities/workflow-stage-completion-status';
import { SnackBar ,StatusFlag} from '@cms/shared/ui-common';
import { UserManagementFacade } from '@cms/system-config/domain';


@Injectable({ providedIn: 'root' })
export class FamilyAndDependentFacade {
  public gridPageSizes =this.configurationProvider.appSettings.gridPageSizeValues;
  public sortValue = 'fullName'
  public sortType = ''
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
  }];


  /** Private properties **/
  private dependentSearchSubject = new Subject<any>();
  private ddlRelationshipsSubject = new Subject<any>();
  private dependentsSubject = new Subject<any>();
  private previousRelationsSubject = new Subject<any>();
  private clientDependentsSubject = new Subject<any>();
  private productsSubject = new Subject<any>();
  private existdependentStatusSubject =   new Subject<any>();
  private dependentStatusGetSubject = new Subject<any>();
  private dependentAddNewSubject = new Subject<any>();
  private dependentUpdateNewSubject = new Subject<any>();
  private dependentGetNewSubject = new Subject<any>();
  private dependentdeleteSubject = new Subject<any>();
  private dependentGetExistingSubject = new Subject<any>();
  dependentValidSubject = new Subject<boolean>();
  displaydateFormat = this.configurationProvider.appSettings.displaydateFormat;
  /** Public properties **/
  products$ = this.productsSubject.asObservable();

  dependentSearch$ = this.dependentSearchSubject.asObservable();
  ddlRelationships$ = this.ddlRelationshipsSubject.asObservable();
  dependents$ = this.dependentsSubject.asObservable();
  previousRelations$ = this.previousRelationsSubject.asObservable();
  clientDependents$ = this.clientDependentsSubject.asObservable();
  existdependentStatus$ = this.existdependentStatusSubject.asObservable();
  dependentStatusGet$ = this.dependentStatusGetSubject.asObservable();
  dependentAddNewGet$ = this.dependentAddNewSubject.asObservable();
  dependentUpdateNew$ = this.dependentUpdateNewSubject.asObservable();
  dependentGetNew$ = this.dependentGetNewSubject.asObservable();
  dependentdelete$ = this.dependentdeleteSubject.asObservable();
  dependentGetExisting$ = this.dependentGetExistingSubject.asObservable();
  dependentValid$ = this.dependentValidSubject.asObservable();


  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  familyfacadesnackbar$ = this.snackbarSubject.asObservable();
  dependentProfilePhotoSubject= new Subject();

  showHideSnackBar(type : SnackBarNotificationType , subtitle : any, source :  NotificationSource  = NotificationSource.API)
  {
    if(type == SnackBarNotificationType.ERROR)
    {
       const err= subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type,subtitle, source)
    this.hideLoader();
  }


  /** Constructor**/
  constructor(private readonly dependentDataService: DependentDataService,
    private workflowFacade: WorkflowFacade ,   private readonly loaderService: LoaderService ,
    private configurationProvider : ConfigurationProvider ,
    private loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    public intl: IntlService,
    private readonly userManagementFacade: UserManagementFacade, ) {}

  /** Public methods **/
  showLoader()
  {
    this.loaderService.show();
  }

  hideLoader()
  {
    this.loaderService.hide();
  }

  deleteDependent(eligibilityId: string, dependentId: string, isCER: boolean = false, status?: string): void {
    this.showLoader();
    this.dependentDataService.deleteDependent(eligibilityId, dependentId, isCER, status).subscribe({
      next: (deleteResponse) => {
        if (deleteResponse ?? false) {
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Relationship Removed Successfully')
        }
        this.dependentdeleteSubject.next(deleteResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

  addNewDependent(eligibilityId: string, dependent: Dependent): void {
    this.showLoader();
    this.dependentDataService.addNewDependent(eligibilityId, dependent).subscribe({
      next: (addNewdependentsResponse) => {
        if (addNewdependentsResponse) {
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'New Relationship Added Successfully')
        }

        this.dependentAddNewSubject.next(addNewdependentsResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

  updateNewDependent(eligibilityId: string, dependent: Dependent): void {
    this.showLoader();
    this.dependentDataService.updateNewDependent(eligibilityId, dependent).subscribe({
      next: (updateNewdependentsResponse) => {
        if (updateNewdependentsResponse) {
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Relationship data Updated')
        }

        this.dependentUpdateNewSubject.next(updateNewdependentsResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

  getNewDependent(eligibilityId: string, dependentId: string): void {
    this.showLoader();
    this.dependentDataService.getNewDependent(eligibilityId, dependentId).subscribe({
      next: (getNewdependentsResponse) => {
        this.dependentGetNewSubject.next(getNewdependentsResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }


  getExistingClientDependent(eligibilityId: string, clientDependentId: string): void {
    this.showLoader();
    this.dependentDataService.getExistingClientDependent(eligibilityId, clientDependentId, DependentTypeCode.CAClient).subscribe({
      next: (dependentGetExistingResponse) => {
        this.dependentGetExistingSubject.next(dependentGetExistingResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

  loadDependents(eligibilityId: string, clientId: number, skipcount: number, maxResultCount: number, sort: string, sortType: string, type: string = 'All'): void {
    this.showLoader();
    this.dependentDataService.loadDependents(eligibilityId, clientId, skipcount, maxResultCount, sort, sortType, type).subscribe({
      next: (dependentsResponse: any) => {
        if (dependentsResponse) {
          const gridView = {
            data: dependentsResponse["items"],
            total: dependentsResponse["totalCount"]
          };
          const workFlowdata: CompletionChecklist[] = [{
            dataPointName: 'family_dependents',
            status: (parseInt(dependentsResponse["totalCount"]) > 0) ? StatusFlag.Yes : StatusFlag.No
          }];

          this.workflowFacade.updateChecklist(workFlowdata);
          this.dependentsSubject.next(gridView);
          this.loadFamilyDependantDistintUserIdsAndProfilePhotos(dependentsResponse["items"]);
        }
        this.hideLoader();
      },
      error: (err) => {
        this.workflowFacade.updateChecklist([{
          dataPointName: 'family_dependents',
          status: StatusFlag.No
        }]);
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadFamilyDependantDistintUserIdsAndProfilePhotos(data: any[]){
    const distinctUserIds = Array.from(new Set(data?.map(dependent => dependent.creatorId))).join(',');
      if(distinctUserIds){
        this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
        .subscribe({
          next: (data: any[]) => {
            if (data.length > 0) {
              this.dependentProfilePhotoSubject.next(data);
            }
          },
        });
      }
  }

  loadPreviousRelations(previousEligibilityId: string, clientId: number): void {
    this.showLoader();
    this.dependentDataService.loadPreviousRelations(previousEligibilityId, clientId).subscribe({
      next: (relationResponse: any) => {
        if (relationResponse) {
          this.previousRelationsSubject.next(relationResponse);
        }
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  updateDependentStatus(clientCaseEligibilityId : string ,hasDependents : string) {
    this.showLoader();
    return this.dependentDataService.updateDependentStatus(clientCaseEligibilityId , hasDependents);
  }

  updateFamilyChangedStatus(previousEligibilityId : string ,friendFamilyChangedFlag : string) {
    this.showLoader();
    return this.dependentDataService.updateFamilyChangedStatus(previousEligibilityId , friendFamilyChangedFlag);
  }

  updateAdditionalFamilyStatus(previousEligibilityId : string ,hasAdditionalFamilyFlag : string) {
    this.showLoader();
    return this.dependentDataService.updateAdditionalFamilyStatus(previousEligibilityId , hasAdditionalFamilyFlag);
  }

  updateEligibilityStatusDetails(eligibilityId: string, request: any) {
    this.showLoader();
    return this.dependentDataService.updateEligibilityStatusDetails(eligibilityId, request);
  }

  loadDependentsStatus(clientCaseEligibilityId : string) : void {
    this.showLoader();
    this.dependentDataService.loadDependentsStatus(clientCaseEligibilityId).subscribe({
      next: (dependentStatusGetResponse) => {
        this.dependentStatusGetSubject.next(dependentStatusGetResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadDependentSearch(text : string , clientId : number): void {
    this.dependentDataService.searchDependents(text , clientId).subscribe({
      next: (dependentSearchResponse) => {

        Object.values(dependentSearchResponse).forEach((key) => {

          key.fullName = key.firstName + ' ' + key.lastName
          key.ssn=  (key.ssn =='' || key.ssn == null) ? '' : 'xxx-xx-' +key.ssn.slice(-4);

          const dateOB = new Date(key.dob)

          key.dob = ((dateOB.getMonth()+1) +'/'+dateOB.getDate()+'/'+dateOB.getFullYear() )

          key.fullCustomName =key?.fullName + ' DOB '+key?.dob + ((key?.ssn == '' || key?.ssn == null) ? "" :' SSN '+key?.ssn)


          if(key?.clientDependentId === '00000000-0000-0000-0000-000000000000')
          {
            key.memberType = ClientDependentGroupDesc.Clients
          }
          else
          {
            key.memberType = ClientDependentGroupDesc.Dependents
          }
        });
        this.dependentSearchSubject.next(dependentSearchResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }



  addExistingDependent(eligibilityId: string, data: any): void {
    this.showLoader();
    this.dependentDataService.addExistingDependent(eligibilityId, data).subscribe({
      next: (dependentStatusResponse) => {
        if (dependentStatusResponse) {
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Relationship added successfully')
        }

        this.existdependentStatusSubject.next(dependentStatusResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)

      },
    });
  }

  loadClientDependents(clientId: number,caseEligibilityId:any) {
    this.dependentDataService.loadClientDependents(clientId,caseEligibilityId).subscribe({
      next: (dependentsResponse : any) => {
        this.clientDependentsSubject.next(dependentsResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  uploadDependentProofOfSchool(eligibilityId: string, dependentId: string, dependentProof: any) {
    return this.dependentDataService.uploadDependentProofOfSchool(eligibilityId, dependentId, dependentProof);
  }

  saveAndContinueDependents(clientId: number, clientCaseEligibilityId: string, request: any) {
    this.showLoader();
    return this.dependentDataService.saveAndContinueDependents(clientId, clientCaseEligibilityId, request)

  }

  validateCer(isStillFamilyMember: string, haveAdditionalFamilyMember: string, previousRelationsList:any){
    let isValid = true;
    if(!isStillFamilyMember || !haveAdditionalFamilyMember){
      isValid = false;
    }
    if(isStillFamilyMember === StatusFlag.Yes && previousRelationsList){
      previousRelationsList?.forEach((dep:any) => {
          const isSelected = dep?.cerReviewStatusCode === 'ACTIVE' || dep?.cerReviewStatusCode === 'INACTIVE';
          if(!isSelected){
            dep.cerReviewStatusCodeRequired = true;
            isValid = false;
          }
        });

        this.previousRelationsSubject.next(previousRelationsList);
    }

    return isValid;
  }

  reloadPreviousRelations(previousRelationsList:any){
    previousRelationsList?.forEach((dep:any) => {
      dep.cerReviewStatusCodeRequired = false;
    });

    this.previousRelationsSubject.next(previousRelationsList);
  }
}
