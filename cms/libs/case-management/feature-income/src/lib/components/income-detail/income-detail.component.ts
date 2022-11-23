/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
/** Facades **/
import { IncomeFacade } from '@cms/case-management/domain';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import {
  Validators,
  FormGroup,
  FormControl,
  FormBuilder,
} from '@angular/forms';
 
import { SnackBar } from '@cms/shared/ui-common';
import { Subject } from 'rxjs';
@Component({
  selector: 'case-management-income-detail',
  templateUrl: './income-detail.component.html',
  styleUrls: ['./income-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeDetailComponent implements OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uploadFileRestrictions: UploadFileRistrictionOptions = new UploadFileRistrictionOptions();
  /** Input properties **/
  @Input() isEditValue!: boolean;
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  snackbar$ = this.snackbarSubject.asObservable();
  @Output() public sendDetailToIncomeList = new EventEmitter<boolean>();
  isIncomeDetailsPopupOpen = false;

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
  incomeTypesOther = '';
  public IncomeDetailsFormData: { incomeAmount: number } = {
    incomeAmount: 0,
  };
  public IncomeDetailsForm: FormGroup = new FormGroup({
    incomeSources: new FormControl('', []),
    incomeTypes: new FormControl('', []),
    incomeAmount: new FormControl('', []),
    incomeFrequencies: new FormControl('', []),
    incomeStartDate: new FormControl('', []),
    incomeEndDate: new FormControl('', []),
    incomeUploadedProof: new FormControl('', []),
    proofOfIncomeTypes: new FormControl('', []),
    tareaJustifications: new FormControl('', []),
    otherProofOfIncome: new FormControl('', []),
  });


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
    if(this.hasNoProofOfIncome){
      this.IncomeDetailsForm.controls['incomeUploadedProof'].setValidators([]);
      this.IncomeDetailsForm.controls['proofOfIncomeTypes'].setValidators([]);
      this.IncomeDetailsForm.controls['incomeUploadedProof'].updateValueAndValidity();
      this.IncomeDetailsForm.controls['proofOfIncomeTypes'].updateValueAndValidity();
    }
  }
  selectProofOfIncome(): void{
    this.incomeTypesOther =  this.IncomeDetailsForm.controls['proofOfIncomeTypes'].value;
  }
  public submitIncomeDetailsForm(): void {
    this.IncomeDetailsForm.markAllAsTouched();

    console.log(this.IncomeDetailsForm);
    this.IncomeDetailsForm.controls['incomeSources'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeTypes'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeAmount'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeFrequencies'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeStartDate'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeEndDate'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['tareaJustifications'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeSources'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeTypes'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeAmount'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeFrequencies'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeStartDate'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeEndDate'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['tareaJustifications'].updateValueAndValidity();
    if (!this.hasNoProofOfIncome) {
      this.IncomeDetailsForm.controls['incomeUploadedProof'].setValidators([Validators.required,]);
      this.IncomeDetailsForm.controls['proofOfIncomeTypes'].setValidators([Validators.required,]);
      this.IncomeDetailsForm.controls['incomeUploadedProof'].updateValueAndValidity();
      this.IncomeDetailsForm.controls['proofOfIncomeTypes'].updateValueAndValidity();   
    
    
    
    
    }  
    if (this.IncomeDetailsForm.valid) {
      this.sendDetailToIncomeList.emit(this.isIncomeDetailsPopupOpen);
      console.log(this.isIncomeDetailsPopupOpen, 'incomedetails');
      const snackbarMessage: SnackBar = {
        title: 'Success!',
        subtitle: 'Income Successfully Added.',
        type: 'success',
      };
      this.snackbarSubject.next(snackbarMessage);
    }
  }
  closeIncomeDetailPoup(): void {
    this.IncomeDetailsForm.reset();
    this.sendDetailToIncomeList.emit(this.isIncomeDetailsPopupOpen);
  }
}
