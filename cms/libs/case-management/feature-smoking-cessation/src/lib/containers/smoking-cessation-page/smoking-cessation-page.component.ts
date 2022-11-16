/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
/** External libraries **/
import { debounceTime, distinctUntilChanged, forkJoin, mergeMap, of, pairwise, startWith, Subscription } from 'rxjs';
/** Internal Libraries **/
import { WorkflowFacade, SmokingCessationFacade, NavigationType, CaseFacade, CompletionChecklist, SmokingCessation, YNFlag, YesNoFlag, StatusFlag } from '@cms/case-management/domain';




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
  smokingCessation:SmokingCessation= {    
    clientCaseEligibilityId: '68903d50-3aa9-41e6-b6eb-9558ab9d9bad',
    clientCaseId:'c969e9a1-2309-4d02-b762-dd42c8fbe2c1',
    smokingCessationReferralFlag: '',
    smokingCessationNoteApplicableFlag: '',
    smokingCessationNote: ''
  };
  isDisabled =true;
  
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
    this.loadSmokingCessation();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  /** Private methods **/
  private buildForm() {
    this.smokingCessationForm = new FormGroup({
      smokingCessation: new FormControl(''),
      smokingCessationNote: new FormControl('')
    });
  }

  private loadSmokingCessation(){
    this.smokingCessationFacade.loadSmokingCessation(this.smokingCessation.clientCaseEligibilityId,
      this.smokingCessation.clientCaseId).subscribe({         
        next: response => {
          this.smokingCessationForm.controls["smokingCessationNote"].setValue(response.smokingCessationNote)
          if(response.smokingCessationReferralFlag == YNFlag.Y){
            this.smokingCessationForm.controls["smokingCessation"].setValue(YesNoFlag.Yes)
            this.isDisabled = false;
          }
          else if(response.smokingCessationReferralFlag == YNFlag.N){
            this.smokingCessationForm.controls["smokingCessation"].setValue(YesNoFlag.No)
            this.isDisabled = true;
          }
       
        },
        error: error => {               
            console.error(error);}
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
    // if (isValid) {
    //   return this.smokingCessationFacade.();
    // }
    this.validate();
    if(this.smokingCessationForm.valid){
      this.smokingCessation.smokingCessationNote =this.smokingCessationForm.value.smokingCessationNote;
       this.smokingCessationFacade.updateSmokingCessation( this.smokingCessation)
       .subscribe({         
          next: response => {
             return true;
          },
          error: error => {               
             return false
          }
      });
   }
    return of(false)
  }
  private validate():void{
    this.smokingCessationForm.controls["smokingCessation"].setValidators([Validators.required]) 
      if(this.smokingCessationForm.value.smokingCessation ==YesNoFlag.Yes){
        this.smokingCessationForm.controls["smokingCessationNote"].setValidators([Validators.required]);
        this.smokingCessation.smokingCessationNoteApplicableFlag =YNFlag.Y;
        this.smokingCessation.smokingCessationReferralFlag = YNFlag.Y;
      }
      else{
        this.smokingCessationForm.controls["smokingCessationNote"].clearValidators();     
        this.smokingCessation.smokingCessationNoteApplicableFlag =YNFlag.N;
        this.smokingCessation.smokingCessationReferralFlag = YNFlag.N;
      }
      this.smokingCessationForm.controls['smokingCessationNote'].updateValueAndValidity()
      this.smokingCessationForm.controls["smokingCessation"].updateValueAndValidity()
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
  disableSmokingCessationNote(disable:boolean){
    if(disable){
       this.smokingCessationForm.controls["smokingCessationNote"].setValue('')
       this.smokingCessationForm.controls["smokingCessationNote"].clearValidators();  
       this.smokingCessationForm.controls["smokingCessationNote"].updateValueAndValidity() 
      }    
    this.isDisabled = disable;
  }
  submit(): void {
    console.log('submitted');
  }
}
