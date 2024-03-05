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
import { LoaderService } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'distribution-detail',
  templateUrl: './distribution-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributionDetailComponent implements OnInit {
  @Input() groupsDropDownList: any;
  @Input() addMember$: any;
  @Output() close = new EventEmitter<any>();
  @Output() addMemberEvent = new EventEmitter<any>();
  
  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  public formUiStyle: UIFormStyle = new UIFormStyle();
  notiificationGroup: any;
  memberForm!: FormGroup;
  tAreaCessationMaxLength = 200;
  isSubmitted: boolean = false;
  isLoading = false;
  isValidateForm = false;


  /** Constructor **/
  constructor(private formBuilder: FormBuilder,
    private readonly lovFacade: LovFacade,
    private readonly loaderService: LoaderService,
    private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.memberForm = this.formBuilder.group({
      groupId: ['', [Validators.required, Validators.maxLength(200)]],
      firstName: ['', [Validators.required, Validators.maxLength(200)]],
      lastName: ['', [Validators.maxLength(200)]],
      emailAddress: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  mapFormValues() {
    const formValues = this.memberForm.value;
    const dto = {
      groupId: formValues.groupId,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      emailAddress: formValues.emailAddress,
      //activeFlag: this.hasCreateUpdatePermission ? StatusFlag.Yes : StatusFlag.No,
    };
    return dto;
  }

  onCancelClick() {
    this.close.emit();
  }

  validateForm() {
    this.memberForm.markAllAsTouched();
  }

  checkValidations() {
    return this.memberForm.valid;
  }

  public save() {
    debugger;
    this.memberForm.markAllAsTouched();
    const res = this.checkValidations();
    this.isSubmitted = true;
    if (!res) {
      return;
    }

    this.validateForm();
    this.isValidateForm = true;

    if (this.memberForm.valid) {
      let finalData = this.mapFormValues();
      //this.showLoader();
      this.addMemberEvent.emit(finalData)
      this.addMember$
        .subscribe((addResponse: any) => {
          if (addResponse) {
            this.onCancelClick();
            this.memberForm.reset();
            this.isValidateForm = false;
            this.cd.detectChanges();
          }

        })
    }
  }

}
