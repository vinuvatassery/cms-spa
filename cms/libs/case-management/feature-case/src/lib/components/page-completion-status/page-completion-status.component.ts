import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { WorkflowFacade, WorkflowStageCompletionStatus } from '@cms/case-management/domain';
import { Subscription } from 'rxjs';

@Component({
  selector: 'page-completion-status',
  templateUrl: './page-completion-status.component.html',
  styleUrls: ['./page-completion-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageCompletionStatusComponent implements OnInit, OnDestroy {

  /** Input Properties **/
  @Input() workflowStepId !: string;

  /**Public properties **/
  completed!: number;
  total!: number;
  /** Private Properties */
  private statusSubscription!: Subscription;
  /** constructor **/
  constructor(public workflowFacade: WorkflowFacade) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.addCompletionStatusSubscription();
  }

  ngOnDestroy(): void {
    this.statusSubscription.unsubscribe();
  }

  /** Private Methods **/
  private addCompletionStatusSubscription() {
    this.statusSubscription = this.workflowFacade.wfStageCompletionStatus$
      .subscribe((wfSteps: WorkflowStageCompletionStatus[]) => {
        let currentWfStep = wfSteps.filter(wf => wf.workflowStepId == this.workflowStepId)[0];
        this.completed = currentWfStep?.dataPointsCompleted ?? 0;
        this.total = currentWfStep?.dataPointsTotal ?? 0;
      });
  }
}
