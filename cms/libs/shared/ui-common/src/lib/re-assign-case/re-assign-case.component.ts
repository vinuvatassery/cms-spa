/** Angular **/
import { Input, Output, Component, ChangeDetectionStrategy, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { StatusFlag } from '../enums/status-flag.enum';

@Component({
  selector: 'common-re-assign-case',
  templateUrl: './re-assign-case.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReAssignCaseComponent implements OnInit, OnChanges {
  @Input() hasReassignPermission: boolean = false;
  @Input() caseOwners !: any;
  @Input() caseWorkerId: any;
  @Input() clientId: any;
  @Input() clientCaseId: any;
  @Output() reassignClicked = new EventEmitter<any>();
  @Output() cancelClicked = new EventEmitter();
  
  public caseOwnerfilterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "startsWith",
  };

  public formUiStyle: UIFormStyle = new UIFormStyle();
  caseReassignForm !: FormGroup;
  isValidateForm: boolean = false;
  caseOwnersObject!: any;
  tAreaReasonForReassignMaxLength:any = 250;
  tAreaReasonForReassignCounter:any = 0;

  constructor(
    private readonly formBuilder: FormBuilder,
 ) {  }

  ngOnInit(){
    this.calculateCharacterCount();
    this.createCaseReassignForm();
  }

  createCaseReassignForm(){
    this.caseReassignForm = this.formBuilder.group({
      newCaseWorkerId: [''],
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

  calculateCharacterCount(reason?: any) {
    let tAreaReasonForReassignCharactersCount = reason ? reason.length : 0;
    this.tAreaReasonForReassignCounter = `${tAreaReasonForReassignCharactersCount}/${this.tAreaReasonForReassignMaxLength}`;
  }

  save() {
    this.validateForm();
    this.isValidateForm = true;
    if (this.caseReassignForm.valid) {
      let reassignData = this.mapReassignData();
      this.reassignClicked.emit(reassignData);
    }
  }
  onCancel(){
    this.cancelClicked.emit();
  }

  validateForm() {
    this.caseReassignForm.markAllAsTouched();
    if(this.hasReassignPermission){
      this.caseReassignForm.controls['newCaseWorkerId'].setValidators([Validators.required]);
      this.caseReassignForm.controls['newCaseWorkerId'].updateValueAndValidity();
    }
  }
  mapReassignData(){
    let formValues = this.caseReassignForm.value;
    const reassignData = this.createReassignData(formValues)
    return reassignData;
  }

  createReassignData(formValues: any) {
    let reassignData = {
      newCaseWorkerId: this.hasReassignPermission ? formValues.newCaseWorkerId : null,
      reasonForReassign: formValues.reasonForReassign,
      caseWorkerId: this.caseWorkerId,
      clientId: this.clientId,
      clientCaseId: this.clientCaseId,
      activeFlag: this.hasReassignPermission ? StatusFlag.Yes : StatusFlag.No,
    }
    return reassignData;
  }
}
