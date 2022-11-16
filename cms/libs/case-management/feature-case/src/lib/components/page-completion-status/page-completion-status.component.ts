/** Angular **/
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
/** External libraries **/
import { Observable, Subscription } from 'rxjs';
/** Internal Libraries **/
import { WorkflowFacade, WorkflowProcessCompletionStatus } from '@cms/case-management/domain';

@Component({
  selector: 'page-completion-status',
  templateUrl: './page-completion-status.component.html',
  styleUrls: ['./page-completion-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageCompletionStatusComponent implements OnInit, OnDestroy {

  /** Input Properties **/
  @Input() workflowProcessId !: string;
  @Input() completionStatus$ !: Observable<WorkflowProcessCompletionStatus[]>;

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
    this.statusSubscription = this.completionStatus$
      .subscribe((wfCompStatus: WorkflowProcessCompletionStatus[]) => {
        let currentWfStep = wfCompStatus.filter(wf => wf.processId == this.workflowProcessId)[0];
        this.completed = currentWfStep?.completedCount ?? 0;
        this.total = currentWfStep?.calcualtedTotalCount ?? 0;
      });
  }
}
