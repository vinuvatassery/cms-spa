/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
/** External libraries **/
import { debounceTime, distinctUntilChanged, forkJoin, mergeMap, of, pairwise, startWith, Subscription } from 'rxjs';
/** Internal Libraries **/
import { WorkflowFacade, SmokingCessationFacade, NavigationType, CaseFacade, CompletionChecklist ,StatusFlag  } from '@cms/case-management/domain';


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
  public formUiStyle : UIFormStyle = new UIFormStyle();
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

  /** Private methods **/
  private buildForm() {
    this.smokingCessationForm = new FormGroup({
      mokingCessation: new FormControl('', Validators.required),
      mokingCessationNote: new FormControl('')
    });
  }

  private smokingCessationFromChanged() {
    this.smokingCessationForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(null), 
        pairwise()
      )
      .subscribe(([prev, curr]: [any, any]) => {
        this.updateFormCompleteCount(prev, curr);
      });
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
      return this.smokingCessationFacade.save();
    }

    return of(false)
  }

  private updateFormCompleteCount(prev: any, curr: any) {
    let completedDataPoints: CompletionChecklist[] = [];
    Object.keys(this.smokingCessationForm.controls).forEach(key => {
      if (prev && curr) {
        if (prev[key] !== curr[key]) {
          let item: CompletionChecklist = {
            dataPointName: key,
            status: curr[key] ? StatusFlag.Yes : StatusFlag.No
          };
          completedDataPoints.push(item);
        }
      }
      else {
        if (this.smokingCessationForm?.get(key)?.value && this.smokingCessationForm?.get(key)?.valid) {
          let item: CompletionChecklist = {
            dataPointName: key,
            status: StatusFlag.Yes
          };

          completedDataPoints.push(item);
        }
      }
    });

    if (completedDataPoints.length > 0) {
      this.workflowFacade.updateChecklist(completedDataPoints);
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
