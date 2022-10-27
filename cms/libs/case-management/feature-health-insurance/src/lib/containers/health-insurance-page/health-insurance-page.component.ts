/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { WorkflowFacade, HealthInsuranceFacade, NavigationType, UpdateWorkFlowProgress, CaseFacade } from '@cms/case-management/domain';
import { forkJoin, mergeMap, of, Subscription } from 'rxjs';

@Component({
  selector: 'case-management-health-insurance-page',
  templateUrl: './health-insurance-page.component.html',
  styleUrls: ['./health-insurance-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthInsurancePageComponent implements OnInit, OnDestroy {

  /** Private properties **/
  private saveClickSubscription !: Subscription;

  /** Constructor **/
  constructor(private workflowFacade: WorkflowFacade,
    private healthInsuranceFacade: HealthInsuranceFacade,
    private caseFacad: CaseFacade) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.addSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  /** Private Methods **/
  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
      mergeMap(([navigationType, isSaved]) =>
        isSaved ? this.applyWorkflowChanges(navigationType) : of(false))
    ).subscribe();
  }

  private save() {
    let isValid = true;
    // TODO: validate the form
    if (isValid) {
      return this.healthInsuranceFacade.save();
    }

    return of(false)
  }

  private applyWorkflowChanges(navigationType: NavigationType) {
    let clientEligilbilityID =
      this.caseFacad.currentWorkflowStage.workFlowProgress[0].clientCaseEligibilityId ?
        this.caseFacad.currentWorkflowStage.workFlowProgress[0].clientCaseEligibilityId
        : '2500D14F-FB9E-4353-A73B-0336D79418CF'; //TODO: should be from the save response

    let updateWorkFlowProgress: UpdateWorkFlowProgress = {
      clientCaseEligibilityId: clientEligilbilityID,
      workflowStepId: this.caseFacad.currentWorkflowStage.workflowStepId,
      totalDatapointsCount: this.caseFacad.currentWorkflowStage.workFlowProgress[0].datapointsTotalCount,
      datapointsCompletedCount: this.caseFacad.currentWorkflowStage.workFlowProgress[0].datapointsCompletedCount,
    }

    return this.caseFacad.appyAutomaticWorkflowProgress(
      updateWorkFlowProgress,
      this.caseFacad.currentWorkflowStage,
      navigationType);
  }



}
