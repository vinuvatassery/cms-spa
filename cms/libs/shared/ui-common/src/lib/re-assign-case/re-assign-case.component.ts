/** Angular **/
import { Input, Output, Component, ChangeDetectionStrategy, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'common-re-assign-case',
  templateUrl: './re-assign-case.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReAssignCaseComponent implements OnChanges {
  @Input() hasReassignPermission: boolean = false;
  @Input() caseOwners !: any;
  @Output() reassignEventClicked = new EventEmitter<any>();
  
  public caseOwnerfilterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "startsWith",
  };

  public formUiStyle: UIFormStyle = new UIFormStyle();
  caseReassignForm !: FormGroup;
  isValidateForm: boolean = false;
  caseOwnersObject!: any;

  constructor(
    private readonly formBuilder: FormBuilder,
    // private readonly cdr: ChangeDetectorRef,
    // private lovFacade: LovFacade,
    // public readonly intl: IntlService,
    // private readonly configurationProvider: ConfigurationProvider,
    // private readonly loaderService: LoaderService,
 ) {
    this.createCaseReassignForm();
  }

  createCaseReassignForm(){
    this.caseReassignForm = this.formBuilder.group({
      newCaseWorkerId: ['',[Validators.required]],
      reasonForReassign: ['', [Validators.required, Validators.maxLength(250)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['caseOwners']?.currentValue?.source != null) {
      this.caseOwners.pipe()
        .subscribe((Owners: any[]) => {
          this.caseOwnersObject = [...Owners];
        });
    }
  }

  save() {
    this.validateForm();
    this.isValidateForm = true;
    if (this.caseReassignForm.valid) {
      let reassignData = this.mapReassignData();
      this.reassignEventClicked.next(reassignData);
    }
  }

  validateForm() {
    this.caseReassignForm.markAllAsTouched();
    // if (this.providerType == this.vendorTypes.MedicalProviders || this.providerType == this.vendorTypes.DentalProviders) {
    //   if (!this.clinicNameNotApplicable) {
    //     this.medicalProviderForm.controls['providerName'].setValidators([Validators.required, Validators.maxLength(500)]);
    //     this.medicalProviderForm.controls['providerName'].updateValueAndValidity();
    //   }
    //   if (!this.firstLastNameNotApplicable) {
    //     this.medicalProviderForm.controls['firstName'].setValidators([Validators.required]);
    //     this.medicalProviderForm.controls['lastName'].setValidators([Validators.required]);
    //     this.medicalProviderForm.controls['firstName'].updateValueAndValidity();
    //     this.medicalProviderForm.controls['lastName'].updateValueAndValidity();
    //   }
    // }
  }
  mapReassignData(){
    let formValues = this.caseReassignForm.value;
    const reassignData = this.createReassignData(formValues)
    return reassignData;
  }

  createReassignData(formValues: any) {
    let reassignData = {
      //vendorId: this.selectedClinicVendorId,
      //vendorName: formValues.providerName,
      reasonForReassign: formValues.reasonForReassign,
      //lastName: formValues.lastName
    }
    return reassignData;
  }
}
