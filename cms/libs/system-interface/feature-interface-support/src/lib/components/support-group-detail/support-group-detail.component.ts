import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService } from '@cms/shared/util-core';

@Component({
  selector: 'support-group-detail',
  templateUrl: './support-group-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportGroupDetailComponent implements OnInit {
  @Input() interfaceSupportGroupLov: any;

  @Input() isEditSupportGroup: any;
  @Input() selectedSupportGroup: any;
  @Output() close = new EventEmitter<any>();
  @Output() addSupportGroupEvent = new EventEmitter<any>();
  @Output() editSupportGroupEvent = new EventEmitter<any>();

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  public formUiStyle: UIFormStyle = new UIFormStyle();
  notiificationGroup: any;
  notificationGroupForm!: FormGroup;
  tAreaCessationMaxLength = 200;
  isSubmitted = false;
  isLoading = false;
  isValidateForm = false;
  supportGroup!: any;
  tareaCharachtersCount!: number;
  tareaCounter!: string;
  tareamaxLength = 200;
  tareaDescription = '';

  /** Constructor **/
  constructor(private formBuilder: FormBuilder,
    private readonly loaderService: LoaderService,
    private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.createSupportGroupForm();
    if (this.isEditSupportGroup) {
      this.bindDataToForm(this.selectedSupportGroup)
    }
    this.tareaVariablesIntialization();
  }

  createSupportGroupForm() {
    this.notificationGroupForm = this.formBuilder.group({
      groupCode: ["", [Validators.required]],
      groupName: ["", [Validators.required, Validators.maxLength(200)]],
      groupDesc: ["", [Validators.required, Validators.maxLength(500)]],
    });
  }
  bindDataToForm(supportGroup: any) {
    this.supportGroup = supportGroup;
    this.notificationGroupForm.controls["groupCode"].setValue(supportGroup.groupCode);
    this.notificationGroupForm.controls["groupName"].setValue(supportGroup.groupName);
    this.notificationGroupForm.controls["groupDesc"].setValue(supportGroup.groupDesc);
    this.notificationGroupForm.markAllAsTouched();
    this.cd.detectChanges();
  }
  mapFormValues() {
    const formValues = this.notificationGroupForm.value;
    const dto = {
      groupCode: formValues.groupCode,
      groupName: formValues.groupName,
      groupDesc: formValues.groupDesc,
      //activeFlag: this.hasCreateUpdatePermission ? StatusFlag.Yes : StatusFlag.No,
    };
    return dto;
  }
  onCancelClick() {
    this.close.emit();
  }
  validateForm() {
    this.notificationGroupForm.markAllAsTouched();
  }
  checkValidations() {
    return this.notificationGroupForm.valid;
  }
  public addAndSaveSupportGroup() {
    this.notificationGroupForm.markAllAsTouched();
    const res = this.checkValidations();
    this.isSubmitted = true;
    if (!res) {
      return;
    }

    this.validateForm();
    this.isValidateForm = true;

    if (this.notificationGroupForm.valid) {
      let finalData = this.mapFormValues();

      if (this.isEditSupportGroup) {
        this.editSupportGroupEvent.emit(finalData)
      } else {
        this.addSupportGroupEvent.emit(finalData)
      }

    }
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

}
