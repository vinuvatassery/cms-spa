/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Case } from '../entities/case';
/** Data services **/
import { CaseDataService } from '../infrastructure/case.data.service';
import { ScreenRouteDataService } from '../infrastructure/screen-route.data.service';

@Injectable({ providedIn: 'root' })
export class CaseFacade {
  /** Private properties **/
  private casesSubject = new BehaviorSubject<Case[]>([]);
  private myCasesSubject = new BehaviorSubject<Case[]>([]);
  private recentCaseSubject = new BehaviorSubject<Case[]>([]);
  private caseSearchedSubject = new BehaviorSubject<any>([]);
  private lastVisitedCasesSubject = new BehaviorSubject<any>([]);
  private caseOwnersSubject = new BehaviorSubject<any>([]);
  private ddlProgramsSubject = new BehaviorSubject<any>([]);
  private ddlCaseOriginsSubject = new BehaviorSubject<any>([]);
  private ddlFamilyAndDependentEPSubject = new BehaviorSubject<any>([]);
  private ddlIncomeEPSubject = new BehaviorSubject<any>([]);
  private ddlEmploymentEPSubject = new BehaviorSubject<any>([]);
  private ddlGridColumnsSubject = new BehaviorSubject<any>([]);
  private ddlCommonActionsSubject = new BehaviorSubject<any>([]);
  private ddlSendLettersSubject = new BehaviorSubject<any>([]);
  private routesSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  cases$ = this.casesSubject.asObservable();
  myCases$ = this.myCasesSubject.asObservable();
  recentCases$ = this.recentCaseSubject.asObservable();
  caseSearched$ = this.caseSearchedSubject.asObservable();
  lastVisitedCases$ = this.lastVisitedCasesSubject.asObservable();
  caseOwners$ = this.caseOwnersSubject.asObservable();
  ddlPrograms$ = this.ddlProgramsSubject.asObservable();
  ddlCaseOrigins$ = this.ddlCaseOriginsSubject.asObservable();
  ddlFamilyAndDependentEP$ = this.ddlFamilyAndDependentEPSubject.asObservable();
  ddlIncomeEP$ = this.ddlIncomeEPSubject.asObservable();
  ddlEmploymentEP$ = this.ddlEmploymentEPSubject.asObservable();
  ddlGridColumns$ = this.ddlGridColumnsSubject.asObservable();
  ddlCommonActions$ = this.ddlCommonActionsSubject.asObservable();
  ddlSendLetters$ = this.ddlSendLettersSubject.asObservable();
  routes$ = this.routesSubject.asObservable();

  constructor(
    private readonly caseDataService: CaseDataService,
    private readonly routeService: ScreenRouteDataService
  ) {}

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

  loadCaseBySearchText(): void {
    this.caseDataService.loadCaseBySearchText().subscribe({
      next: (caseBySearchTextResponse) => {
        this.caseSearchedSubject.next(caseBySearchTextResponse);
      },
      error: (err) => {
        console.error('err', err);
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

  loadRoutes(
    screen_flow_type_code: string,
    program_id: number,
    case_id?: number
  ) {
    this.routeService
      .load(screen_flow_type_code, program_id, case_id)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.routesSubject.next(data);
        },
        error: (err) => {
          console.log('Error', err);
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

  loadCaseOwners(): void {
    this.caseDataService.loadCaseOwners().subscribe({
      next: (caseOwnersResponse) => {
        this.caseOwnersSubject.next(caseOwnersResponse);
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

  loadDdlCaseOrigins(): void {
    this.caseDataService.loadDdlCaseOrigins().subscribe({
      next: (ddlCaseOriginsResponse) => {
        this.ddlCaseOriginsSubject.next(ddlCaseOriginsResponse);
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

}
