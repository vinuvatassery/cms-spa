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
import { Lov, LovFacade } from '@cms/system-config/domain';
import { RemoveEvent, SelectEvent } from '@progress/kendo-angular-upload';
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
  proofOfIncomeFiles: any;
  proofOfIncomeValidator: boolean = false;

  currentDate = new Date();
  /** Public properties **/
  incomeTypes$: Lov[] = [];
  incomeSources$: Lov[] = [];
  frequencies$: Lov[] = [];
  proofOfIncomeTypes$: Lov[] = [];
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
  constructor(private readonly incomeFacade: IncomeFacade, private lov: LovFacade) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadIncomeTypes();
    this.tareaJustificationWordCount();
    this.loadIncomeSources();
    this.loadFrequencies();
  }

  /** Private methods **/
  private tareaJustificationWordCount() {
    this.tareaJustificationCharachtersCount = this.tareaJustification
      ? this.tareaJustification.length
      : 0;
    this.tareaJustificationCounter = `${this.tareaJustificationCharachtersCount}/${this.tareaJustificationMaxLength}`;
  }

  private loadIncomeTypes() {
    this.lov.incomeTypelov$.subscribe((incomeTypesLov: Lov[]) => {
      this.incomeTypes$ = incomeTypesLov;
    });
  }

  private loadIncomeSources() {
    this.lov.incomeSourcelov$.subscribe((incomeSourceLov: Lov[]) => {
      this.incomeSources$ = incomeSourceLov;
    });
  }

  private loadFrequencies() {
    this.lov.incomeFrequencylov$.subscribe((incomeFrequencyLov: Lov[]) => {
      this.frequencies$ = incomeFrequencyLov;
    });
  }

  loadProofOfIncomeTypes() {
    if (this.IncomeDetailsForm.controls['incomeTypeCode'].value != null && this.IncomeDetailsForm.controls['incomeTypeCode'].value != '') {
      this.lov.getProofOfIncomeTypesLov(this.IncomeDetailsForm.controls['incomeTypeCode'].value).subscribe((proofOfIncomeTypesLov: Lov[]) => {
        this.proofOfIncomeTypes$ = proofOfIncomeTypesLov;
      });
    }
  }

  /** Internal event methods **/
  onTareaJustificationValueChange(event: any): void {
    this.tareaJustificationCharachtersCount = event.length;
    this.tareaJustificationCounter = `${this.tareaJustificationCharachtersCount}/${this.tareaJustificationMaxLength}`;
  }

  onProofOfIncomeValueChanged() {
    this.hasNoProofOfIncome = !this.hasNoProofOfIncome;
    if (this.hasNoProofOfIncome) {
      this.IncomeDetailsForm.controls['proofOfIncomeTypes'].setValidators([]);
      this.IncomeDetailsForm.controls['proofOfIncomeTypes'].updateValueAndValidity();
      this.IncomeDetailsForm.controls['noIncomeProofFlag'].setValue("Y")
      this.proofOfIncomeValidator = false;
    }
    else {
      this.IncomeDetailsForm.controls['noIncomeProofFlag'].setValue("N")
    }
  }
  selectProofOfIncome(): void {
    this.incomeTypesOther = this.IncomeDetailsForm.controls['proofOfIncomeTypes'].value;
  }
  public submitIncomeDetailsForm(): void {
    this.setValidators();
    if (this.IncomeDetailsForm.valid && !this.proofOfIncomeValidator) {
      this.incomeFacade.saveClientIncome(this.IncomeDetailsForm.value, this.proofOfIncomeFiles).subscribe({
        next: (incomeResponse) => {
          this.closeIncomeDetailPoup();
          const snackbarMessage: SnackBar = {
            title: 'Success!',
            subtitle: 'Income Successfully Added.',
            type: 'success',
          };
          this.snackbarSubject.next(snackbarMessage);
          this.incomeFacade.loadIncomes();
        },
        error: (err) => {
          console.log(err)
          const snackbarMessage: SnackBar = {
            title: 'Error!',
            subtitle: err.error.error.message,
            type: 'error',
          };
          this.snackbarSubject.next(snackbarMessage);
        },
      });
    }
  }
  closeIncomeDetailPoup(): void {
    this.IncomeDetailsForm.reset();
    this.closePopup.emit(this.isIncomeDetailsPopupOpen);
  }

  handleFileSelected(event: SelectEvent) {
    this.proofOfIncomeFiles = event.files[0].rawFile
    this.proofOfIncomeValidator = false;
    console.log(this.proofOfIncomeFiles)
  }

  handleFileRemoved(event: RemoveEvent) {
    this.proofOfIncomeFiles = null;
    console.log(this.proofOfIncomeFiles)
  }
  setValidators() {
    this.IncomeDetailsForm.markAllAsTouched();
    this.IncomeDetailsForm.controls['incomeSourceCode'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeTypeCode'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeAmt'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeFrequencyCode'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeStartDate'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeEndDate'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeNote'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeSourceCode'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeTypeCode'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeAmt'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeFrequencyCode'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeStartDate'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeEndDate'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeNote'].updateValueAndValidity();
    if (!this.hasNoProofOfIncome) {
      this.IncomeDetailsForm.controls['proofOfIncomeTypes'].setValidators([Validators.required,]);
      this.IncomeDetailsForm.controls['proofOfIncomeTypes'].updateValueAndValidity();
      if (!this.proofOfIncomeFiles) {
        this.proofOfIncomeValidator = true;
      }
      else {
        this.proofOfIncomeValidator = false;
      }
    }
  }
}
