/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

/** services **/
import { WorkflowFacade, SmokingCessationFacade, NavigationType, CaseFacade, Workflow, UpdateWorkFlowProgress } from '@cms/case-management/domain';
import { forkJoin, mergeMap, Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'case-management-smoking-cessation-page',
  templateUrl: './smoking-cessation-page.component.html',
  styleUrls: ['./smoking-cessation-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmokingCessationPageComponent implements OnInit, OnDestroy {

  private saveClickSubscription !: Subscription;

  /** Public properties **/
  tareaCessationMaxLength = 300;
  tareaCessationCharachtersCount!: number;
  tareaCessationCounter!: string;
  tareaCessationNote = '';
  smokingCessationForm!: FormGroup;

  constructor(
    private workflowFacade: WorkflowFacade,
    private smokingCessationFacade: SmokingCessationFacade,
    private caseFacad: CaseFacade) {
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.buildForm();
    this.tareaVariablesIntiation();
    this.addSaveSubscription();
    this.smokingCessationFromChanged();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  canDeactivate(): Observable<boolean> {
    //if (!this.isSaved) {
    //const result = window.confirm('There are unsaved changes! Are you sure?');
    //return of(result);
    if (this.smokingCessationForm?.dirty ?? false) {
      const result = window.confirm('There are unsaved changes! Are you sure?');
      return of(result);
    }
    //}

    return of(true);
  }


  /** Private methods **/
  private buildForm() {
    this.smokingCessationForm = new FormGroup({
      mokingCessation: new FormControl('', Validators.required),
      mokingCessationNote: new FormControl('')
    });
  }

  private smokingCessationFromChanged() {
    this.smokingCessationForm.valueChanges
      .subscribe(val => {
        this.updateFormCompleteCount();
      });
  }

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
      return this.smokingCessationFacade.save();
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

  private updateFormCompleteCount(): void {    
    let filledCount = 0;
    Object.keys(this.smokingCessationForm.controls).forEach(key => {
      if (this.smokingCessationForm?.get(key)?.value && this.smokingCessationForm?.get(key)?.valid) {
        filledCount++;
      }
    });

    if (this.caseFacad.currentWorkflowStage.workFlowProgress[0].datapointsCompletedCount !== filledCount) {
      this.caseFacad.currentWorkflowStage.workFlowProgress[0].datapointsCompletedCount = filledCount;
      this.caseFacad.updateWorkflowStageCount(this.caseFacad.currentWorkflowStage);
    }
  }

  private tareaVariablesIntiation() {
    this.tareaCessationCharachtersCount = this.tareaCessationNote
      ? this.tareaCessationNote.length
      : 0;
    this.tareaCessationCounter = `${this.tareaCessationCharachtersCount}/${this.tareaCessationMaxLength}`;
  }

  /** Internal event methods **/
  onChangeCounterClick() {

  }

  /** Public methods **/
  onTareaCessationValueChange(event: any): void {
    this.tareaCessationCharachtersCount = event.length;
    this.tareaCessationCounter = `${this.tareaCessationCharachtersCount}/${this.tareaCessationMaxLength}`;
  }

  submit(): void {
    console.log('submitted');
  }
}
