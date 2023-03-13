/** Angular **/
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';

import { Subject } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Case } from '../entities/case';

/** Data services **/
import { CaseDataService } from '../infrastructure/case.data.service';
import { SortDescriptor } from '@progress/kendo-data-query';
import { CaseScreenTab } from '../enums/case-screen-tab.enum';



@Injectable({ providedIn: 'root' })
export class CaseFacade {
  /** Private properties **/  
  private myCasesSubject = new BehaviorSubject<Case[]>([]);
  private recentCaseSubject = new BehaviorSubject<Case[]>([]);
  private caseSearchedSubject = new BehaviorSubject<any>([]);
  private lastVisitedCasesSubject = new BehaviorSubject<any>([]);
  private ddlProgramsSubject = new BehaviorSubject<any>([]);
  private ddlFamilyAndDependentEPSubject = new BehaviorSubject<any>([]);
  private ddlIncomeEPSubject = new BehaviorSubject<any>([]);
  private ddlEmploymentEPSubject = new BehaviorSubject<any>([]);
  private ddlGridColumnsSubject = new BehaviorSubject<any>([]);
  private ddlCommonActionsSubject = new BehaviorSubject<any>([]);
  private ddlSendLettersSubject = new BehaviorSubject<any>([]);
  private updateCaseSubject = new Subject<any>();
  private getCaseSubject = new Subject<any>();
  private getCaseHistorySubject =new BehaviorSubject<any[]>([]);
  private casesSubject  = new Subject<any>();
  private clientProfileSubject  = new Subject<any>();
  private clientProfileHeaderSubject  = new Subject<any>();

  /** Public properties **/
  cases$ = this.casesSubject.asObservable();
  myCases$ = this.myCasesSubject.asObservable();
  recentCases$ = this.recentCaseSubject.asObservable();
  caseSearched$ = this.caseSearchedSubject.asObservable();
  lastVisitedCases$ = this.lastVisitedCasesSubject.asObservable();
  ddlPrograms$ = this.ddlProgramsSubject.asObservable();
  ddlFamilyAndDependentEP$ = this.ddlFamilyAndDependentEPSubject.asObservable();
  ddlIncomeEP$ = this.ddlIncomeEPSubject.asObservable();
  ddlEmploymentEP$ = this.ddlEmploymentEPSubject.asObservable();
  ddlGridColumns$ = this.ddlGridColumnsSubject.asObservable();
  ddlCommonActions$ = this.ddlCommonActionsSubject.asObservable();
  ddlSendLetters$ = this.ddlSendLettersSubject.asObservable();
  updateCase$ = this.updateCaseSubject.asObservable();
  getCase$ = this.getCaseSubject.asObservable(); 
  getCaseHistory$ = this.getCaseHistorySubject.asObservable(); 
  clientProfile$ = this.clientProfileSubject.asObservable(); 
  clientProfileHeader$ = this.clientProfileHeaderSubject.asObservable(); 

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  public sortValue = 'clientFullName';
  public sortType = 'asc';
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
    dir: 'asc'
  }];
  constructor(
    private readonly caseDataService: CaseDataService,
    private readonly loggingService : LoggingService,
    private readonly loaderService: LoaderService ,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    public readonly intl: IntlService,
    private readonly configurationProvider : ConfigurationProvider,

  ) { }

  showLoader()
  {
    this.loaderService.show();
  }

  hideLoader()
  {
    this.loaderService.hide();
  }

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

  /** Public methods **/
  loadClientProfile(clientId : number): void {
    this.showLoader();
    this.caseDataService.loadClientProfile(clientId).subscribe({
      next: (clientProfileResponse) => {
        this.clientProfileSubject.next(clientProfileResponse);
        this.hideLoader();   
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
      },
    });
  }

  loadClientProfileHeader(clientId : number): void {
    this.showLoader();
    this.caseDataService.loadClientProfileHeader(clientId).subscribe({
      next: (clientProfileResponse) => {
        this.clientProfileHeaderSubject.next(clientProfileResponse);
        this.hideLoader();   
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
      },
    });
  }


  loadCaseHistory(): void {
    this.caseDataService.loadCaseHistory().subscribe({
      next: (casesHistoryResponse) => {
        
        this.getCaseHistorySubject.next(casesHistoryResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
      },
    });
  }

  loadCases(CaseScreenType: CaseScreenTab, skipcount : number,maxResultCount : number ,sort : string, sortType : string): void {
    this.showLoader();
    this.caseDataService.loadCases(CaseScreenType, skipcount ,maxResultCount  ,sort , sortType).subscribe({
      next: (casesResponse  : any) => {
        this.casesSubject.next(casesResponse);
        if(casesResponse )
        {      
            const gridView = {
              data : casesResponse["items"] ,        
              total:  casesResponse["totalCount"]  
              };    
          this.casesSubject.next(gridView);
         }
         this.hideLoader();      
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  
      },
    });
  }

  loadCaseBySearchText(text : string): void {
    this.caseDataService.loadCaseBySearchText(text).subscribe({
      next: (caseBySearchTextResponse) => {
        this.caseSearchedSubject.next(caseBySearchTextResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
      },
    });
  }

  loadCasesForAuthuser(): void {
    this.caseDataService.loadCasesForAuthuser().subscribe({
      next: (result) => {
        this.myCasesSubject.next(result);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
      },
    });
  }

  loadRecentCases(): void {
    this.caseDataService.loadRecentCases().subscribe({
      next: (result) => {
        this.recentCaseSubject.next(result);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
      },
    });
  }

  loadLastVisitedCases(): void {
    this.caseDataService.loadLastVisitedCases().subscribe({
      next: (lastVisitedCasesResponse) => {
        this.lastVisitedCasesSubject.next(lastVisitedCasesResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
      },
    });
  }

  loadDdlGridColumns(): void {
    this.caseDataService.loadDdlGridColumns().subscribe({
      next: (ddlGridColumnsResponse) => {
        this.ddlGridColumnsSubject.next(ddlGridColumnsResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
      },
    });
  }

  loadDdlCommonActions(): void {
    this.caseDataService.loadDdlCommonActions().subscribe({
      next: (ddlCommonActionsResponse) => {
        this.ddlCommonActionsSubject.next(ddlCommonActionsResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
      },
    });
  }
  loadCasesById(clientCaseId : string)
  {
    this.showLoader();
    this.caseDataService.loadCasesById(clientCaseId).subscribe({
      next: (ddlcaseGetResponse) => {
        this.getCaseSubject.next(ddlcaseGetResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
      },
    });
  }
  loadDdlSendLetters(): void {
    this.caseDataService.loadDdlSendLetters().subscribe({
      next: (ddlSendLettersResponse) => {
        this.ddlSendLettersSubject.next(ddlSendLettersResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
      },
    });
  }

  loadDdlPrograms(): void {
    this.caseDataService.loadDdlPrograms().subscribe({
      next: (ddlProgramsResponse) => {
        this.ddlProgramsSubject.next(ddlProgramsResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
      },
    });
  }


  loadDdlFamilyAndDependentEP(): void {
    this.caseDataService.loadDdlFamilyAndDependentEP().subscribe({
      next: (ddlFamilyAndDependentEPResponse) => {
        this.ddlFamilyAndDependentEPSubject.next(
          ddlFamilyAndDependentEPResponse
        );
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
      },
    });
  }

  loadDdlEPEmployments(): void {
    this.caseDataService.loadDdlEPEmployments().subscribe({
      next: (ddlEmploymentEPResponse) => {
        this.ddlEmploymentEPSubject.next(ddlEmploymentEPResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
      },
    });
  }

  loadEPEmploymentData(): void {
    this.caseDataService.loadDdlEPEmployments().subscribe({
      next: (data) => {
        this.ddlEmploymentEPSubject.next(data);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
      },
    });
  }


  UpdateCase(existingCaseFormData : FormGroup ,clientCaseId : string )
  {
       this.showLoader();
        const caseData = {
          clientCaseId  : clientCaseId,
          assignedCwUserId : existingCaseFormData?.controls["caseOwnerId"].value ,
          caseOriginCode: existingCaseFormData?.controls["caseOriginCode"].value,
          caseStartDate: existingCaseFormData?.controls["applicationDate"].value ,
          concurrencyStamp :  existingCaseFormData?.controls["concurrencyStamp"].value
        }
        caseData.caseStartDate =this.intl.formatDate(caseData.caseStartDate,this.dateFormat)
        return  this.caseDataService.UpdateCase(caseData)

  }
  
  getSessionInfoByCaseId(clientCaseId:any){
    return  this.caseDataService.getSessionInfoByCaseId(clientCaseId)
  }
    updateCaseStatus(clientCaseId : any,caseStatusCode:any) 
    { 
          const caseData = { 
            caseStatusCode  : caseStatusCode          
          }      
          return  this.caseDataService.updateCaseStatus(caseData,clientCaseId)
    }

  getCaseStatusById(clientCaseId : string ) {    
     return  this.caseDataService.loadCasesStatusById(clientCaseId)
  }

}
