/** Angular **/
import { OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
/** Internal Libraries **/
import { WorkflowFacade, CompletionStatusFacade, IncomeFacade, NavigationType } from '@cms/case-management/domain';
import { forkJoin, mergeMap, of, Subscription } from 'rxjs';
import { DateInputFillMode, DateInputRounded, DateInputSize } from '@progress/kendo-angular-dateinputs';

@Component({
  selector: 'case-management-income-page',
  templateUrl: './income-page.component.html',
  styleUrls: ['./income-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomePageComponent implements OnInit, OnDestroy {

  /** Private properties **/
  private saveClickSubscription !: Subscription;

  /** Public Methods **/
  incomes$ = this.incomeFacade.incomes$;
  completeStaus$ = this.completionStatusFacade.completionStatus$;
  hasNoIncome = false;



  public size: DateInputSize = 'medium';
  public rounded: DateInputRounded = 'full';
  public fillMode: DateInputFillMode = 'outline';
  /** Input properties **/
  @Input() isEditValue!: boolean;
  currentDate = new Date();
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

  /** Constructor **/
  constructor(private readonly incomeFacade: IncomeFacade,
    private completionStatusFacade: CompletionStatusFacade,
    private workflowFacade: WorkflowFacade) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadIncomeTypes();
    this.tareaJustificationWordCount();
    this.loadIncomeSources();
    this.loadFrequencies();
    this.loadProofOfIncomeTypes();
    this.addSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  /** Private methods **/
  private tareaJustificationWordCount() {
    this.tareaJustificationCharachtersCount = this.tareaJustification
      ? this.tareaJustification.length
      : 0;
    this.tareaJustificationCounter = `${this.tareaJustificationCharachtersCount}/${this.tareaJustificationMaxLength}`;
  }

  private loadIncomeTypes() {
    this.incomeFacade.loadDdlIncomeTypes();
  }

  private loadIncomeSources() {
    this.incomeFacade.loadDdlIncomeSources();
  }

  private loadFrequencies() {
    this.incomeFacade.loadDdlFrequencies();
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
    if (isValid) {
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
  }


}
