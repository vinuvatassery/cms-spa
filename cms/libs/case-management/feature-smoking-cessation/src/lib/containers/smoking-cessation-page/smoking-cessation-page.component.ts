/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
/** services **/
import { CaseDetailsFacade, CompletionStatusFacade, SmokingCessationFacade } from '@cms/case-management/domain';
import { debounceTime, distinctUntilChanged, filter, map, Observable, of, Subscription } from 'rxjs';

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
  isDisabled =true;
  completeStaus$ = this.completionStatusFacade.completionStatus$;

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
      if(this.smokingCessationForm.value.mokingCessation =="No"){
        this.smokingCessationForm.controls["mokingCessationNote"].clearValidators();
      }
      this.smokingCessationForm.controls['mokingCessationNote'].updateValueAndValidity()
      this.updateFormCompleteCount();
    });
  }

  private saveClickSubscribed(): void {
    this.saveClickSubscription = this.caseDetailsFacade.saveAndContinueClicked.subscribe(() => {    
      if(this.smokingCessationForm.value.mokingCessation =="Yes"){
        this.smokingCessationForm.controls["mokingCessationNote"].setValidators([Validators.required]);
      }
      else{
        this.smokingCessationForm.controls["mokingCessationNote"].clearValidators();
      }
      this.smokingCessationForm.controls['mokingCessationNote'].updateValueAndValidity()
      if(this.smokingCessationForm.valid){
      this.smokingCessationFacade.save().subscribe((response: boolean) => {
        if (response) {
          this.caseDetailsFacade.navigateToNextCaseScreen.next(true);
        }
      })
     }
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

  disableSmokingCessationNote(disable:boolean){
    this.isDisabled = disable;
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
