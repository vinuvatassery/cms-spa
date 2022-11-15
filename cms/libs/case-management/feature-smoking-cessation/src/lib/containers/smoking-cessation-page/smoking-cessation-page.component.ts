/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
/** services **/
import { CaseDetailsFacade, CompletionStatusFacade, SmokingCessationFacade } from '@cms/case-management/domain';
import { debounceTime, distinctUntilChanged, filter, map, Observable, of, Subscription } from 'rxjs';
import {  SmokingCessation}  from '@cms/case-management/domain';

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
  smokingCessation:SmokingCessation= {    
    clientCaseEligibilityId: '68903d50-3aa9-41e6-b6eb-9558ab9d9bad',
    clientCaseId:'c969e9a1-2309-4d02-b762-dd42c8fbe2c1',
    smokingCessationReferralFlag: '',
    smokingCessationNoteApplicableFlag: '',
    smokingCessationNote: ''
  };

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
      smokingCessation: new UntypedFormControl(''),
      smokingCessationNote: new UntypedFormControl('')
    });
  }
  
  private smokingCessationFromChanged() {
    this.smokingCessationForm.valueChanges.subscribe(val => {
      this.updateFormCompleteCount();
    });
  }

  private saveClickSubscribed(): void {
    this.saveClickSubscription = this.caseDetailsFacade.saveAndContinueClicked.subscribe(() => {   
      this.validate();
      if(this.smokingCessationForm.valid){
        this.smokingCessation.smokingCessationNote =this.smokingCessationForm.value.smokingCessationNote;
         this.smokingCessationFacade.updateSmokingCessation( this.smokingCessation)
         .subscribe({         
            next: response => {
               this.caseDetailsFacade.navigateToNextCaseScreen.next(true);
            },
            error: error => {               
                console.error(error);
            }
        });
     }
    });
  }

  private validate():void{
    this.smokingCessationForm.controls["smokingCessation"].setValidators([Validators.required]) 
      if(this.smokingCessationForm.value.smokingCessation =="Yes"){
        this.smokingCessationForm.controls["smokingCessationNote"].setValidators([Validators.required]);
        this.smokingCessation.smokingCessationNoteApplicableFlag ='Y';
        this.smokingCessation.smokingCessationReferralFlag = 'Y';
      }
      else{
        this.smokingCessationForm.controls["smokingCessationNote"].clearValidators();     
        this.smokingCessation.smokingCessationNoteApplicableFlag ='N';
        this.smokingCessation.smokingCessationReferralFlag = 'N';
      }
      this.smokingCessationForm.controls['smokingCessationNote'].updateValueAndValidity()
      this.smokingCessationForm.controls["smokingCessation"].updateValueAndValidity()
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
