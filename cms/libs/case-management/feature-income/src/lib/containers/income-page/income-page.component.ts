 
/** Angular **/
import {  Component,  ChangeDetectionStrategy,  Output,  EventEmitter,  Input,  OnDestroy,  OnInit,} from '@angular/core';
/** External libraries **/
import { first, forkJoin, mergeMap, of, Subscription } from 'rxjs';
/** Internal Libraries **/
import { WorkflowFacade, CompletionStatusFacade, IncomeFacade, NavigationType } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {  Validators,  FormGroup,  FormControl,  FormBuilder, } from '@angular/forms';
import { LovFacade } from '@cms/system-config/domain';
import { ActivatedRoute } from '@angular/router';

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
  isNodateSignatureNoted = true;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  /** Input properties **/
  @Input() isEditValue!: boolean;
  todaysDate = new Date();
  /** Public properties **/
  incomeTypes$ = this.incomeFacade.ddlIncomeTypes$;
  incomeSources$ = this.incomeFacade.ddlIncomeSources$;
  frequencies$ = this.incomeFacade.ddlFrequencies$;
  proofOfIncomeTypes$ = this.incomeFacade.ddlProofOfIncomdeTypes$;
  hasNoProofOfIncome = false;
  tareaJustificationCounter!: string;
  tareaJustification = '';
  tareaJustificationCharachtersCount!: number;
  tareaJustificationMaxLength = 300;
  sessionId:any="";
  clientId:string="";
  clientCaseEligibilityId:string="";
  clientCaseId:string="";
  private loadSessionSubscription!:Subscription;
  public noIncomeDetailsForm: FormGroup = new FormGroup({
    dateClientSigned: new FormControl('', []),
    dateSignatureNoted: new FormControl(this.todaysDate, []),
    tareaJustifications: new FormControl('', []),
  });
  /** Constructor **/
  constructor(private readonly incomeFacade: IncomeFacade,
    private completionStatusFacade: CompletionStatusFacade,
    private workflowFacade: WorkflowFacade,
    private lov:LovFacade,
    private route: ActivatedRoute) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadSessionData();
    this.loadIncomeTypes();
    this.tareaJustificationWordCount();
    this.loadIncomeSources();
    this.loadFrequencies();
    this.loadProofOfIncomeTypes();
    this.addSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.loadSessionSubscription.unsubscribe();
  } 
  
  /** Private methods **/
  private tareaJustificationWordCount() {
    this.tareaJustificationCharachtersCount = this.tareaJustification
      ? this.tareaJustification.length
      : 0;
    this.tareaJustificationCounter = `${this.tareaJustificationCharachtersCount}/${this.tareaJustificationMaxLength}`;
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
        return this.incomeFacade.save(); 
    } 
 
    return of(false)
  }

  /** Internal event methods **/
  onTareaJustificationValueChange(event: any): void {
    this.tareaJustificationCharachtersCount = event.length;
    this.tareaJustificationCounter = `${this.tareaJustificationCharachtersCount}/${this.tareaJustificationMaxLength}`;
  }

  onProofOfIncomeValueChanged() {
    this.hasNoProofOfIncome = !this.hasNoProofOfIncome;
  }
 
  /** Private Methods **/
  private loadIncomes(clientId:string,clientCaseEligibilityId:string): void {
    this.incomeFacade.loadIncomes(clientId,clientCaseEligibilityId);
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
    if(!this.hasNoIncome){
 this.noIncomeDetailsForm.reset();
    }
   
  }

  public submitIncomeDetailsForm(): void {
    this.noIncomeDetailsForm.markAllAsTouched();
    if (this.hasNoIncome) {
      console.log(this.noIncomeDetailsForm);
      this.noIncomeDetailsForm.controls['dateClientSigned'].setValidators([
        Validators.required,
      ]);
      this.noIncomeDetailsForm.controls['dateSignatureNoted'].setValidators([
        Validators.required,
      ]);
      this.noIncomeDetailsForm.controls['tareaJustifications'].setValidators([
        Validators.required,
      ]);
      this.noIncomeDetailsForm.controls[
        'dateClientSigned'
      ].updateValueAndValidity();
      this.noIncomeDetailsForm.controls[
        'dateSignatureNoted'
      ].updateValueAndValidity();
      this.noIncomeDetailsForm.controls[
        'tareaJustifications'
      ].updateValueAndValidity();
      // this.onDoneClicked();
      if (this.noIncomeDetailsForm.valid) {
        console.log(this.noIncomeDetailsForm);
      }
    }
  }
  
  saveIncomeDetails(clientIncomeDetails:any){
    //this.incomeFacade.saveClientIncome(clientIncomeDetails)
  }

  loadSessionData(){
    //this.loaderService.show();
    this.sessionId = this.route.snapshot.queryParams['sid'];    
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$ .pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {     
        if(session !== null && session !== undefined && session.sessionData !==undefined){
        this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId ;
        this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId ;
        this.clientId = JSON.parse(session.sessionData).clientId; 
        this.loadIncomes(this.clientId,this.clientCaseEligibilityId);
      }
    });   
  
  }
}
