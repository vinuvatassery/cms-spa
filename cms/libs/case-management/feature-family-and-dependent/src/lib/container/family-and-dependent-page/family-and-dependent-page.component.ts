/** Angular **/
import { OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
/** Internal Libraries **/
import { WorkflowFacade, CompletionStatusFacade, FamilyAndDependentFacade, NavigationType } from '@cms/case-management/domain';
import { forkJoin, mergeMap, of, Subscription } from 'rxjs';

@Component({
  selector: 'case-management-family-and-dependent-page',
  templateUrl: './family-and-dependent-page.component.html',
  styleUrls: ['./family-and-dependent-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FamilyAndDependentPageComponent implements OnInit, OnDestroy {
  /** Public Methods **/
  dependentList$ = this.familyAndDependentFacade.dependents$;
  completeStaus$ = this.completionStatusFacade.completionStatus$;
  isFamilyGridDisplay = true;

  /** Private properties **/
  private saveClickSubscription !: Subscription;

  /** Constructor **/
  constructor(
    private familyAndDependentFacade: FamilyAndDependentFacade,
    private completionStatusFacade: CompletionStatusFacade,
    private workflowFacade: WorkflowFacade
  ) { }


  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.loadDependents();
    this.addSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  /** Private Methods **/
  private loadDependents(): void {
    this.familyAndDependentFacade.loadDependents();
  }

  private updateCompletionStatus(status: any) {
    this.completionStatusFacade.updateCompletionStatus(status);
  }

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
      return this.familyAndDependentFacade.save();
    }

    return of(false)
  }

  /** Internal event methods **/
  onChangeCounterClick() {
    this.updateCompletionStatus({
      name: 'Family & Dependents',
      completed: 15,
      total: 31,
    });
  }

  onNoFamilyMemberClicked() {
    this.isFamilyGridDisplay = !this.isFamilyGridDisplay;
  }
}
