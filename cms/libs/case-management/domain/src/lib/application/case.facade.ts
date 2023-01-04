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
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';



@Injectable({ providedIn: 'root' })
export class CaseFacade {
  /** Private properties **/
  private casesSubject = new BehaviorSubject<Case[]>([]);
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

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  public sortValue = '';
  public sortType = 'asc';
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
    dir: 'asc'
  }];
  constructor(
    private readonly caseDataService: CaseDataService,
    private loggingService : LoggingService,
    private readonly loaderService: LoaderService ,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    public intl: IntlService,
    private configurationProvider : ConfigurationProvider,

  ) { }

  ShowLoader()
  {
    this.loaderService.show();
  }

  HideLoader()
  {
    this.loaderService.hide();
  }

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

  /** Public methods **/
  loadCases(): void {
    this.caseDataService.loadCases().subscribe({
      next: (casesResponse) => {
        this.casesSubject.next(casesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadCaseBySearchText(text : string): void {
    this.caseDataService.loadCaseBySearchText(text).subscribe({
      next: (caseBySearchTextResponse) => {
        this.caseSearchedSubject.next(caseBySearchTextResponse);
      },
      error: (err) => {
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadCasesForAuthuser(): void {
    this.caseDataService.loadCasesForAuthuser().subscribe({
      next: (result) => {
        this.myCasesSubject.next(result);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadRecentCases(): void {
    this.caseDataService.loadRecentCases().subscribe({
      next: (result) => {
        this.recentCaseSubject.next(result);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadLastVisitedCases(): void {
    this.caseDataService.loadLastVisitedCases().subscribe({
      next: (lastVisitedCasesResponse) => {
        this.lastVisitedCasesSubject.next(lastVisitedCasesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlGridColumns(): void {
    this.caseDataService.loadDdlGridColumns().subscribe({
      next: (ddlGridColumnsResponse) => {
        this.ddlGridColumnsSubject.next(ddlGridColumnsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlCommonActions(): void {
    this.caseDataService.loadDdlCommonActions().subscribe({
      next: (ddlCommonActionsResponse) => {
        this.ddlCommonActionsSubject.next(ddlCommonActionsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
  loadCasesById(clientCaseId : string)
  {
    this.ShowLoader();
    this.caseDataService.loadCasesById(clientCaseId).subscribe({
      next: (ddlcaseGetResponse) => {
        this.getCaseSubject.next(ddlcaseGetResponse);
        this.HideLoader();
      },
      error: (err) => {
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }
  loadDdlSendLetters(): void {
    this.caseDataService.loadDdlSendLetters().subscribe({
      next: (ddlSendLettersResponse) => {
        this.ddlSendLettersSubject.next(ddlSendLettersResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlPrograms(): void {
    this.caseDataService.loadDdlPrograms().subscribe({
      next: (ddlProgramsResponse) => {
        this.ddlProgramsSubject.next(ddlProgramsResponse);
      },
      error: (err) => {
        console.error('err', err);
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
        console.error('err', err);
      },
    });
  }

  loadDdlEPEmployments(): void {
    this.caseDataService.loadDdlEPEmployments().subscribe({
      next: (ddlEmploymentEPResponse) => {
        this.ddlEmploymentEPSubject.next(ddlEmploymentEPResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadEPEmploymentData(): void {
    this.caseDataService.loadDdlEPEmployments().subscribe({
      next: (data) => {
        this.ddlEmploymentEPSubject.next(data);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }


  UpdateCase(existingCaseFormData : FormGroup ,clientCaseId : string )
  {
       this.ShowLoader();
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

  updateCaseStatus(ClientCase:any)
  {
    return  this.caseDataService.updateCaseStatus(ClientCase)
  }

}
