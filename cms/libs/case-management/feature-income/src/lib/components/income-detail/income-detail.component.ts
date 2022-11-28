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
  @Output() public sendDetailToIncomeList = new EventEmitter<any>();
  @Output() public closePopup = new EventEmitter<any>();
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
    incomeSourceCode: new FormControl('', []),
    incomeTypeCode: new FormControl('', []),
    incomeAmt: new FormControl('', []),
    incomeFrequencyCode: new FormControl('', []),
    incomeStartDate: new FormControl('', []),
    incomeEndDate: new FormControl('', []),
    noIncomeProofFlag: new FormControl('', []),
    incomeNote: new FormControl('', []),
    incomeUploadedProof: new FormControl('', []),
    proofOfIncomeTypes: new FormControl('', []),
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
      this.IncomeDetailsForm.controls['noIncomeProofFlag'].setValue("Y")
    }
    else{
      this.IncomeDetailsForm.controls['noIncomeProofFlag'].setValue("N")
    }
  }
  selectProofOfIncome(): void{
    this.incomeTypesOther =  this.IncomeDetailsForm.controls['proofOfIncomeTypes'].value;
  }
  public submitIncomeDetailsForm(): void {
  // this.setValidators();
    if (this.IncomeDetailsForm.valid) {
      this.sendDetailToIncomeList.emit({popupState:this.isIncomeDetailsPopupOpen,incomeDetails:this.IncomeDetailsForm.value});
    
    }
  }
  closeIncomeDetailPoup(): void {
    this.IncomeDetailsForm.reset();
    this.closePopup.emit(this.isIncomeDetailsPopupOpen);
  }

  setValidators(){
    this.IncomeDetailsForm.markAllAsTouched();
    this.IncomeDetailsForm.controls['incomeSourceCode'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeTypeCode'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeAmt'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeFrequencyCode'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeStartDate'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeEndDate'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeNote'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeSourcecode'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeTypecode'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeAmt'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeFrequencyCode'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeStartDate'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeEndDate'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeNote'].updateValueAndValidity();
    if (!this.hasNoProofOfIncome) {
      this.IncomeDetailsForm.controls['incomeUploadedProof'].setValidators([Validators.required,]);
      this.IncomeDetailsForm.controls['proofOfIncomeTypes'].setValidators([Validators.required,]);
      this.IncomeDetailsForm.controls['incomeUploadedProof'].updateValueAndValidity();
      this.IncomeDetailsForm.controls['proofOfIncomeTypes'].updateValueAndValidity(); 
    }  
  }
}
