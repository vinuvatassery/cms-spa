import { NoIncomeData } from './../../../../../domain/src/lib/entities/no-income-data';

/** Angular **/
import {  Component,  ChangeDetectionStrategy,  Output,  EventEmitter,  Input,  OnDestroy,  OnInit,} from '@angular/core';
/** External libraries **/
import { forkJoin, mergeMap, of, Subscription } from 'rxjs';
/** Internal Libraries **/
import { WorkflowFacade, CompletionStatusFacade, IncomeFacade, NavigationType } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {  Validators,  FormGroup,  FormControl,  FormBuilder, } from '@angular/forms';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-income-page',
  templateUrl: './income-page.component.html',
  styleUrls: ['./income-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomePageComponent implements OnInit, OnDestroy {

  /** Private properties **/
  private saveClickSubscription !: Subscription;  /** Public Methods **/
  incomes$ = this.incomeFacade.incomes$;
  completeStaus$ = this.completionStatusFacade.completionStatus$;
  hasNoIncome = false;
  isNodateSignatureNoted = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  /** Input properties **/
  @Input() isEditValue!: boolean;
  todaysDate = new Date();
  noIncomeData = new NoIncomeData();
  /** Public properties **/
  incomeTypes$ = this.incomeFacade.ddlIncomeTypes$;
  incomeSources$ = this.incomeFacade.ddlIncomeSources$;
  frequencies$ = this.incomeFacade.ddlFrequencies$;
  proofOfIncomeTypes$ = this.incomeFacade.ddlProofOfIncomdeTypes$;
  hasNoProofOfIncome = false;
  incomeNoteCounter!: string;
  incomeNote = '';
  incomeNoteCharachtersCount!: number;
  incomeNoteMaxLength = 300;
  public noIncomeDetailsForm: FormGroup = new FormGroup({
    noIncomeClientSignedDate: new FormControl('', []),
    noIncomeSignatureNotedDate: new FormControl(this.todaysDate, []),
    noIncomeNote: new FormControl('', []),
  });
  /** Constructor **/
  constructor(private readonly incomeFacade: IncomeFacade,
    private completionStatusFacade: CompletionStatusFacade,
    private workflowFacade: WorkflowFacade,
    private lov:LovFacade) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadIncomeTypes();
    this.incomeNoteWordCount();
    this.loadIncomeSources();
    this.loadFrequencies();
    this.loadProofOfIncomeTypes();
    this.addSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  /** Private methods **/
  private incomeNoteWordCount() {
    this.incomeNoteCharachtersCount = this.incomeNote
      ? this.incomeNote.length
      : 0;
    this.incomeNoteCounter = `${this.incomeNoteCharachtersCount}/${this.incomeNoteMaxLength}`;
  }

  private loadIncomeTypes() {
    this.lov.getIncomeTypeLovs();
  }

  private loadIncomeSources() {
    this.lov.getIncomeSourceLovs();
  }

  private loadFrequencies() {
    this.lov.getIncomeFrequencyLovs();
  }

  private loadProofOfIncomeTypes() {
    this.incomeFacade.loadDdlProofOfIncomeTypes();
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
    this.submitIncomeDetailsForm();
    if (this.noIncomeDetailsForm.valid && isValid) {
        return this.incomeFacade.save(this.noIncomeData);
    }

    return of(false)
  }

  /** Internal event methods **/
  onIncomeNoteValueChange(event: any): void {
    this.incomeNoteCharachtersCount = event.length;
    this.incomeNoteCounter = `${this.incomeNoteCharachtersCount}/${this.incomeNoteMaxLength}`;
  }

  onProofOfIncomeValueChanged() {
    this.hasNoProofOfIncome = !this.hasNoProofOfIncome;
  }

  /** Private Methods **/
  private loadIncomes(): void {
    this.incomeFacade.loadIncomes();
  }

  updateCompletionStatus(status: any) {
    this.completionStatusFacade.updateCompletionStatus(status);
  }

  /** Internal Event Methods **/
  onChangeCounterClick() {
    this.updateCompletionStatus({
      name: 'Income',
      completed: 15,
      total: 31,
    });
  }

  onIncomeValueChanged(event: any) {
    this.hasNoIncome = !this.hasNoIncome;
    if(this.hasNoIncome)
    {
      this.noIncomeDetailsForm = new FormGroup({
        noIncomeClientSignedDate: new FormControl('', []),
        noIncomeSignatureNotedDate: new FormControl(this.todaysDate, []),
        noIncomeNote: new FormControl('', []),
      });
      this.isNodateSignatureNoted = true;
    }
    // if(!this.hasNoIncome){
    // this.noIncomeDetailsForm.reset();
    // }

  }

  public submitIncomeDetailsForm(): void {
    this.noIncomeDetailsForm.markAllAsTouched();
    if (this.hasNoIncome) {
      console.log(this.noIncomeDetailsForm);
      this.noIncomeDetailsForm.controls['noIncomeClientSignedDate'].setValidators([
        Validators.required,
      ]);
      this.noIncomeDetailsForm.controls['noIncomeSignatureNotedDate'].setValidators([
        Validators.required,
      ]);
      this.noIncomeDetailsForm.controls['noIncomeNote'].setValidators([
        Validators.required,
      ]);
      this.noIncomeDetailsForm.controls[
        'noIncomeClientSignedDate'
      ].updateValueAndValidity();
      this.noIncomeDetailsForm.controls[
        'noIncomeSignatureNotedDate'
      ].updateValueAndValidity();
      this.noIncomeDetailsForm.controls[
        'noIncomeNote'
      ].updateValueAndValidity();
      // this.onDoneClicked();
      if (this.noIncomeDetailsForm.valid) {
        this.noIncomeData.noIncomeFlag = this.hasNoIncome == true? "Y":"N";
        this.noIncomeData.clientCaseEligibilityId = 'D323838C-80F3-4BB6-8FD4-EF6A9FE37335';
        this.noIncomeData.clientId = 3;
        this.noIncomeData.noIncomeClientSignedDate = this.noIncomeDetailsForm.get("noIncomeClientSignedDate")?.value;
        this.noIncomeData.noIncomeSignatureNotedDate = this.noIncomeDetailsForm.get("noIncomeSignatureNotedDate")?.value;
        this.noIncomeData.noIncomeNote = this.noIncomeDetailsForm.get("noIncomeNote")?.value;
        console.log(this.noIncomeDetailsForm);
      }
    }
  }

  saveIncomeDetails(clientIncomeDetails:any){
    //this.incomeFacade.saveClientIncome(clientIncomeDetails)
  }

}
