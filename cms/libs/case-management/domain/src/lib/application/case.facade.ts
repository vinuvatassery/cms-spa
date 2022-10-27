/** Angular **/
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Case } from '../entities/case';
import { UpdateWorkFlowProgress, Workflow, WorkFlowProgress } from '../entities/workflow';
import { NavigationType } from '../enums/navigation-type.enum';

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
  private workflowRoutes!: Workflow[];

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
  currentWorkflowStage!: Workflow;

  constructor(
    private readonly caseDataService: CaseDataService,
    private readonly routeService: ScreenRouteDataService
  ) { }

  private updateWorkflow(data: any, currentWorkflowStage: any) {
    this.workflowRoutes = data;
    this.currentWorkflowStage = currentWorkflowStage === undefined ?
      this.deepCopy(data)?.filter((wf: Workflow) => wf.workFlowProgress[0]?.currentFlag === 'Y')[0]
      : currentWorkflowStage;

    this.routesSubject.next(data);
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
      .loadWorkflow(screen_flow_type_code, program_id, case_id)
      .pipe(
        map(wf => wf.map((workflowItem: Workflow, index) => {
          if (workflowItem.workFlowProgress.length === 0) {
            if (workflowItem?.processMetadata) {
              var processMetadata = JSON.parse(workflowItem.processMetadata);

              let workflowProgress: WorkFlowProgress = {
                currentFlag: index === 5 ? 'Y' : 'N',
                datapointsCompletedCount: 0,
                datapointsTotalCount: Number(processMetadata?.datapointsTotalCount ?? 0)
              };
              workflowItem.workFlowProgress.push(workflowProgress);
            }
          }
          return workflowItem;
        }))
      )
      .subscribe({
        next: (data) => {
          this.updateWorkflow(data, undefined);
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

  getCurrentWorkflowStage(processName: string) {
    return this.deepCopy(this.workflowRoutes)?.filter((wf: Workflow) => wf.processName === processName)[0];
  }

  updateWorkflowStageCount(currentWorkflowStage: Workflow) {
    if (currentWorkflowStage) {
      let currentWorkflowIndex = this.workflowRoutes?.findIndex(wf => wf.workflowStepId === currentWorkflowStage.workflowStepId);
      if (currentWorkflowIndex !== -1) {
        this.workflowRoutes[currentWorkflowIndex] = currentWorkflowStage;
      }

      this.updateWorkflow(this.workflowRoutes, currentWorkflowStage);
    }
  }

  updateAutomaticWorkflowChange(currentWorkflowStage: Workflow, navigationType: NavigationType) {
    if (currentWorkflowStage) {

      let nextWorkflowStage: Workflow = this.deepCopy(this.workflowRoutes)
        .filter((wf: Workflow) =>
          wf.sequenceNbr === (navigationType === NavigationType.Next ?
            (currentWorkflowStage.sequenceNbr + 1)
            : (currentWorkflowStage.sequenceNbr - 1))
        )[0];

      currentWorkflowStage.workFlowProgress[0].currentFlag = 'N';
      currentWorkflowStage.workFlowProgress[0].visitedFlag = 'Y';
      nextWorkflowStage.workFlowProgress[0].currentFlag = 'Y';

      let currentWorkflowIndex = this.workflowRoutes?.findIndex(wf => wf.workflowStepId === currentWorkflowStage.workflowStepId);
      let nextWorkflowStepIndex = this.workflowRoutes?.findIndex(wf => wf.workflowStepId === nextWorkflowStage.workflowStepId);
      if (currentWorkflowIndex !== -1) {
        this.workflowRoutes[currentWorkflowIndex] = currentWorkflowStage;
      }

      if (nextWorkflowStepIndex !== -1) {
        this.workflowRoutes[nextWorkflowStepIndex] = nextWorkflowStage;
      }

      // it will trigger the work flow and update the work current screen.
      this.updateWorkflow(this.workflowRoutes, nextWorkflowStage);
    }
  }

  appyAutomaticWorkflowProgress(updateworkflowProgress: UpdateWorkFlowProgress, currentWorkflowStage: Workflow, navigationType: NavigationType) {
    let resp = this.routeService.saveWorkflowProgress(updateworkflowProgress)
    this.updateAutomaticWorkflowChange(currentWorkflowStage, navigationType);
    return resp;
  }

  applyManualWorkflowChange(currentWorkflowStage: Workflow) {
    let model = {
      clientCaseEligibilityId: currentWorkflowStage?.workFlowProgress[0]?.clientCaseEligibilityId ?? '2500D14F-FB9E-4353-A73B-0336D79418CF',
      workflowStepId: currentWorkflowStage?.workflowStepId,
      workflowProgressId: currentWorkflowStage?.workFlowProgress[0]?.workflowProgressId ?? 'e3b0a899-8a42-4ff7-bc90-ca545f02b3f0',
    }
    let wokflowUpdate = this.routeService.saveManualWorkflowChange(model);
    this.updateManualWorkflowChange(currentWorkflowStage);
    return wokflowUpdate;

  }

  updateManualWorkflowChange(currentWorkflow: Workflow) {
    let previousWorkflow: Workflow[] = this.deepCopy(this.workflowRoutes)
      .filter((wf: Workflow) =>
        wf.workFlowProgress[0].currentFlag === 'Y'
        && wf.workflowStepId != currentWorkflow.workflowStepId);

    let wfWithoutCurrentStage = this.deepCopy(this.workflowRoutes)
      .filter((wf: Workflow) =>
        !previousWorkflow.map(w => w.processName).includes(wf.processName)
        && wf.workflowStepId !== currentWorkflow?.workflowStepId
      );

    previousWorkflow.forEach((i: Workflow) => {
      i.workFlowProgress[0].currentFlag = 'N'
      i.workFlowProgress[0].visitedFlag = 'Y'
      let index = this.deepCopy(this.workflowRoutes)?.findIndex((wf:Workflow) => wf.workflowStepId === i.workflowStepId);
      if (index !== -1) {
        this.workflowRoutes[index] = i;
      }
    });

    currentWorkflow.workFlowProgress[0].currentFlag = 'Y';
    currentWorkflow.workFlowProgress[0].visitedFlag = 'Y';
    let currentWorkflowIndex = this.deepCopy(this.workflowRoutes)?.findIndex((wf:Workflow) => wf.workflowStepId === currentWorkflow.workflowStepId);
    this.workflowRoutes[currentWorkflowIndex] = currentWorkflow;

    this.updateWorkflow(this.workflowRoutes, currentWorkflow);
  }

  deepCopy(data: any): any {
    return JSON.parse(JSON.stringify(data === undefined ? null : data));
  }

}
