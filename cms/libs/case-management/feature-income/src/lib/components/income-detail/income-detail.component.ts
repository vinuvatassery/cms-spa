/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
/** Facades **/
import { IncomeFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'

@Component({
  selector: 'case-management-income-detail',
  templateUrl: './income-detail.component.html',
  styleUrls: ['./income-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeDetailComponent implements OnInit {

  public formUiStyle : UIFormStyle = new UIFormStyle();
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
  constructor(private readonly incomeFacade: IncomeFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadIncomeTypes();
    this.tareaJustificationWordCount();
    this.loadIncomeSources();
    this.loadFrequencies();
    this.loadProofOfIncomeTypes();
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

  /** Internal event methods **/
  onTareaJustificationValueChange(event: any): void {
    this.tareaJustificationCharachtersCount = event.length;
    this.tareaJustificationCounter = `${this.tareaJustificationCharachtersCount}/${this.tareaJustificationMaxLength}`;
  }

  onProofOfIncomeValueChanged() {
    this.hasNoProofOfIncome = !this.hasNoProofOfIncome;
  }
}
