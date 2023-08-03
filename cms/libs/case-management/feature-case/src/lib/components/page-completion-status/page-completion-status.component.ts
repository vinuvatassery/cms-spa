/** Angular **/
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
/** External libraries **/
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
/** Internal Libraries **/
import { WorkflowFacade, WorkflowProcessCompletionStatus } from '@cms/case-management/domain';

@Component({
  selector: 'page-completion-status',
  templateUrl: './page-completion-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageCompletionStatusComponent implements OnInit, OnDestroy {

  /** Input Properties **/
  @Input() workflowProcessId !: string;
  @Input() completionStatus$ !: Observable<WorkflowProcessCompletionStatus[]>;

  /**Public properties **/
  completed!: number;
  total!: number;
  showCountCalculationLoader$ = new BehaviorSubject(false);

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
    this.statusSubscription = this.completionStatus$
      .subscribe((wfCompStatus: WorkflowProcessCompletionStatus[]) => {
      this.showCountCalculationLoader$.next(true);
        let currentWfStep = wfCompStatus.filter(wf => wf.processId == this.workflowProcessId)[0];
        this.completed = currentWfStep?.completedCount ?? 0;
        this.total = currentWfStep?.calculatedTotalCount ?? 0;
        this.showCountCalculationLoader$.next(false);
      });
  }
}
