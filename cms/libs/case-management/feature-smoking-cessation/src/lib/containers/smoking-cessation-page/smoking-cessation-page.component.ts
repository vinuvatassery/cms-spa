/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
/** services **/
import { CaseDetailsFacade, CompletionStatusFacade, SmokingCessationFacade } from '@cms/case-management/domain';
import { debounceTime, distinctUntilChanged, filter, map, Observable, of, Subscription } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa';
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
  smokingCessationForm!: UntypedFormGroup;
  completeStaus$ = this.completionStatusFacade.completionStatus$;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  constructor(
    private caseDetailsFacade: CaseDetailsFacade,
    private smokingCessationFacade: SmokingCessationFacade,
    private completionStatusFacade: CompletionStatusFacade) {
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.buildForm();
    this.tareaVariablesIntiation();
    this.saveClickSubscribed();
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
    this.smokingCessationForm = new UntypedFormGroup({
      mokingCessation: new UntypedFormControl('', Validators.required),
      mokingCessationNote: new UntypedFormControl('')
    });
  }

  private smokingCessationFromChanged() {
    this.smokingCessationForm.valueChanges.subscribe(val => {
      this.updateFormCompleteCount();
    });
  }

  private saveClickSubscribed(): void {
    this.saveClickSubscription = this.caseDetailsFacade.saveAndContinueClicked.subscribe(() => {
      this.smokingCessationFacade.save().subscribe((response: boolean) => {
        if (response) {
          this.caseDetailsFacade.navigateToNextCaseScreen.next(true);
        }
      })
    });
  }

  private updateFormCompleteCount(): void {
    let filledCount = 0;
    Object.keys(this.smokingCessationForm.controls).forEach(key => {
      if (this.smokingCessationForm?.get(key)?.value && this.smokingCessationForm?.get(key)?.valid) {
        filledCount++;
      }
    });

    this.updateCompletionStatus({
      name: 'Cessation',
      completed: filledCount,
      total: 2,
    });
  }

  private tareaVariablesIntiation() {
    this.tareaCessationCharachtersCount = this.tareaCessationNote
      ? this.tareaCessationNote.length
      : 0;
    this.tareaCessationCounter = `${this.tareaCessationCharachtersCount}/${this.tareaCessationMaxLength}`;
  }

  private updateCompletionStatus(status: any) {
    this.completionStatusFacade.updateCompletionStatus(status);
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
