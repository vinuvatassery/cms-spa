import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService } from '@cms/shared/util-core';

@Component({
  selector: 'system-config-cpt-code-form-details',
  templateUrl: './cpt-code-form-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CptCodeFormDetailsComponent {

  @Input() isEditCptCode: any;
  @Output() closeCptCode = new EventEmitter<any>();
  @Output() addCptCodeEvent = new EventEmitter<any>();

  public formUiStyle: UIFormStyle = new UIFormStyle();
  cptCode: any;
  cptCodeForm!: FormGroup;
  tAreaCessationMaxLength = 100;
  isSubmitted = false;
  isLoading = false;
  isValidateForm = false;
  cptCodeDetail!: any;
  tareaCharachtersCount!: number;
  tareaCounter!: string;
  tareamaxLength = 100;
  tareaDescription = '';
  isChecked: boolean = false; // Property to hold the state of the checkbox

  /** Constructor **/
  constructor(private formBuilder: FormBuilder,
    private readonly loaderService: LoaderService,
    private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.createCptCodeForm();
    if (this.isEditCptCode) {
      //this.bindDataToForm(this.selectedSupportGroup)
    }
    this.tareaVariablesIntialization();
  }

  createCptCodeForm() {
    this.cptCodeForm = this.formBuilder.group({
      cptCode1: ["", [Validators.required, Validators.pattern('^[A-Za-z0-9 -]+$')]],
      serviceDesc: ["", [Validators.required, Validators.maxLength(100)]],
      medicaidRate: [null],
      brigeUppFlag: [this.isChecked]
    });
  }
  mapFormValues() {
    const formValues = this.cptCodeForm.value;
    const dto = {
      cptCode1: formValues.cptCode1,
      serviceDesc: formValues.serviceDesc,
      medicaidRate: formValues.medicaidRate,
      BrigeUppFlag: this.getBridgeUppEligibleFlagValue()
    };
    return dto;
  }
  get cptCodeFormControls() {
    return this.cptCodeForm.controls as any;
  }
  onCancelClick() {
    this.closeCptCode.emit();
  }
  getBridgeUppEligibleFlagValue() {
    return this.cptCodeForm.controls['brigeUppFlag'].value ? "Y" : "N";
  }

  validateForm() {
    this.cptCodeForm.markAllAsTouched();
  }
  checkValidations() {
    return this.cptCodeForm.valid;
  }

  /** Private methods **/
  private tareaVariablesIntialization() {
    this.tareaCharachtersCount = this.tareaDescription
      ? this.tareaDescription.length
      : 0;
    this.tareaCounter = `${this.tareaCharachtersCount}/${this.tareamaxLength}`;
  }
  onTareaValueChange(event: any): void {
    this.tareaCharachtersCount = event.length;
    this.tareaCounter = `${this.tareaCharachtersCount}/${this.tareamaxLength}`;
  }

  public addAndEditCptCode() {
    this.cptCodeForm.markAllAsTouched();
    const res = this.checkValidations();
    this.isSubmitted = true;
    if (!res) {
      return;
    }
    this.validateForm();
    this.isValidateForm = true;
    if (this.cptCodeForm.valid) {
      let finalData = this.mapFormValues();
      if (this.isEditCptCode) {
        // this.editCptCodeEventEvent.emit(finalData)
      } else {
        this.addCptCodeEvent.emit(finalData)
      }
    }
  }
}
