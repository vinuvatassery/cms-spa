import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { Observable } from 'rxjs';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'support-group-detail',
  templateUrl: './support-group-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportGroupDetailComponent implements OnInit {
  @Input() interfaceSupportGroupLov: any;
  @Input() addSupportGroup$: any;
  @Output() close = new EventEmitter<any>();
  @Output() addSupportGroupEvent = new EventEmitter<any>();
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


  /** Constructor **/
  constructor(private formBuilder: FormBuilder,
    private readonly lovFacade: LovFacade,
    private readonly loaderService: LoaderService,
    private cd: ChangeDetectorRef) {
    this.createSupportGroupForm();
  }

  ngOnInit(): void {

  }

  createSupportGroupForm() {
    this.notiificationGroupForm = this.formBuilder.group({
      groupCode: [{ value: this.notiificationGroup?.groupCode, disabled: false }, [Validators.required]],
      groupName: [this.notiificationGroup?.groupName, [Validators.required, Validators.maxLength(200)]],
      groupDesc: [this.notiificationGroup?.groupName, [Validators.required, Validators.maxLength(500)]],
    });
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
  public save() {
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
      //this.showLoader();
      this.addSupportGroupEvent.emit(finalData)
      this.addSupportGroup$
        .subscribe((addResponse: any) => {
          if (addResponse) {
            this.onCancelClick();
            this.notiificationGroupForm.reset();
            this.isValidateForm = false;
            this.cd.detectChanges();
          }

        })
    }
  }

}
