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
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.workflowFacade.navigate(navigationType);
      }
    });
  }

  private save() {
    let isValid = true;
    // TODO: validate the form
    if (isValid) {
      return this.healthInsuranceFacade.save();
    }

    return of(false)
  }

}
