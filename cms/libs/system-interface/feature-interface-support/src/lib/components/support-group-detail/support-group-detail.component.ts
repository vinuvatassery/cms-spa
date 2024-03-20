import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService} from '@cms/shared/util-core';

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
  notiificationGroupForm!: FormGroup;
  tAreaCessationMaxLength = 200;
  isSubmitted: boolean = false;
  isLoading = false;
  isValidateForm = false;
  supportGroup!: any;


  /** Constructor **/
  constructor(private formBuilder: FormBuilder,
    private readonly loaderService: LoaderService,
    private cd: ChangeDetectorRef) {
    this.createSupportGroupForm();
  }

  ngOnInit(): void {
    //this.buildForm();
    if (this.isEditSupportGroup) {
      this.bindDataToForm(this.selectedSupportGroup)
    }
  }

  createSupportGroupForm() {
    this.notiificationGroupForm = this.formBuilder.group({
      groupCode: [{ value: this.notiificationGroup?.groupCode, disabled: false }, [Validators.required]],
      groupName: [this.notiificationGroup?.groupName, [Validators.required, Validators.maxLength(200)]],
      groupDesc: [this.notiificationGroup?.groupName, [Validators.required, Validators.maxLength(500)]],
    });
  }
  buildForm() {
    this.notiificationGroupForm = this.formBuilder.group({
      groupCode: [''],
      groupName: [''],
      groupDesc: ['']
    });
  }
  bindDataToForm(supportGroup: any) {
    this.supportGroup = supportGroup;
    this.notiificationGroupForm.controls["groupCode"].setValue(supportGroup.groupCode);
    this.notiificationGroupForm.controls["groupName"].setValue(supportGroup.groupName);
    this.notiificationGroupForm.controls["groupDesc"].setValue(supportGroup.groupDesc);
    this.notiificationGroupForm.markAllAsTouched();
    this.cd.detectChanges();
  }
  mapFormValues() {
    const formValues = this.notiificationGroupForm.value;
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
    this.notiificationGroupForm.markAllAsTouched();
  }
  checkValidations() {
    return this.notiificationGroupForm.valid;
  }
  public addAndSaveSupportGroup() {
    this.notiificationGroupForm.markAllAsTouched();
    const res = this.checkValidations();
    this.isSubmitted = true;
    if (!res) {
      return;
    }

    this.validateForm();
    this.isValidateForm = true;

    if (this.notiificationGroupForm.valid) {
      let finalData = this.mapFormValues();

      if (this.isEditSupportGroup) {
        this.editSupportGroupEvent.emit(finalData)
      } else {
        this.addSupportGroupEvent.emit(finalData)
      }

    }
  }

}
