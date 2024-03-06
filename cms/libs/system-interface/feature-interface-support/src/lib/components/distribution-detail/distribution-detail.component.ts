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
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { SystemInterfaceSupportFacade } from '@cms/system-interface/domain';

@Component({
  selector: 'distribution-detail',
  templateUrl: './distribution-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributionDetailComponent implements OnInit {
  @Input() selectedGroup: any;
  @Input() groupsDropDownList: any;
  @Output() closeForm = new EventEmitter<any>();
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
    private readonly systemInterfaceSupportFacade: SystemInterfaceSupportFacade,
    private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.memberForm = this.formBuilder.group({
      groupName: new FormControl({ value: '', disabled: true }),
      firstName: ['', [Validators.required, Validators.maxLength(200)]],
      lastName: ['', [Validators.required, Validators.maxLength(200)]],
      emailAddress: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,60}$/)]],
    });

    if (this.selectedGroup)
      this.memberForm.controls['groupName'].setValue(this.selectedGroup.groupName)
  }

  mapFormValues() {
    const formValues = this.memberForm.value;
    const dto = {
      groupId: this.selectedGroup.notificationGroupId,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      emailAddress: formValues.emailAddress,
      userTypeCode: 'EXTERNAL',
    };
    return dto;
  }

  onCancelClick() {
    this.closeForm.emit();
  }

  validateForm() {
    this.memberForm.markAllAsTouched();
  }

  checkValidations() {
    return this.memberForm.valid;
  }

  getForm(index: number, fieldName: string) {
    return this.memberForm;
  }

  public save() {
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
      this.showLoader();

      this.systemInterfaceSupportFacade.addDistributionListUser(finalData).subscribe({
        next: (response: any) => {
          let notificationMessage = response.message;
          this.onCancelClick();
          this.lovFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, notificationMessage);
          this.hideLoader();
          this.memberForm.reset();
          this.isValidateForm = false;
          // this.loadCarrierSubject.next(true);
          this.cd.detectChanges();
        },
        error: (err: any) => {
          this.hideLoader();
          this.lovFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        }
      });

    }
  }

}
