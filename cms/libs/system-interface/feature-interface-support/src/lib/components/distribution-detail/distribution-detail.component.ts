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
  @Input() userDataList: any;
  @Input() selectedMemberData: any;
  isEditMode = false;
  @Output() closeForm = new EventEmitter<any>();
  @Output() addMemberEvent = new EventEmitter<any>();
  @Output() refreshData = new EventEmitter<any>();
  selectedUser: any;
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
  isSubmitted = false;
  isLoading = false;
  isValidateForm = false;

  /** Constructor **/
  constructor(private formBuilder: FormBuilder,
    private readonly lovFacade: LovFacade,
    private readonly loaderService: LoaderService,
    private readonly systemInterfaceSupportFacade: SystemInterfaceSupportFacade,
    private cd: ChangeDetectorRef) {
  }

  selectedFirstName: any;
  dataList: any;

  ngOnInit(): void {
    if (this.selectedMemberData)
      this.isEditMode = true;
    this.createForm();

  }

  createForm() {
    this.memberForm = this.formBuilder.group({
      groupName: new FormControl({ value: '', disabled: true }),
      firstName: ['', [Validators.required, Validators.maxLength(200)]],
      lastName: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,60}$/)]],
    });
    if (this.selectedMemberData) {
      this.isEditMode = true;
      this.memberForm.controls['firstName'].setValue(this.selectedMemberData.firstName);
      this.memberForm.controls['lastName'].setValue(this.selectedMemberData.lastName);
      this.memberForm.controls['email'].setValue(this.selectedMemberData.email);
    }

    if (this.selectedGroup)
      this.memberForm.controls['groupName'].setValue(this.selectedGroup.groupName);
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

  mapFormValues() {
    const formValues = this.memberForm.value;
    const dto = {
      notificationGroupId: this.selectedGroup.notificationGroupId,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      userTypeCode: 'EXTERNAL',
      notificationUserId: this.selectedGroup.notificationUserId,
      selectedUserId: this.selectedUser?.notificationUserId,
    };
    if (this.isEditMode)
      dto.notificationUserId = this.selectedMemberData.notificationUserId;
    return dto;
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
      const finalData = this.mapFormValues();
      this.showLoader();

      this.systemInterfaceSupportFacade.addDistributionListUser(finalData, this.isEditMode).subscribe({
        next: (response: any) => {
          if (!this.isEditMode)
            this.refreshData.emit(true);
          else
            this.closeForm.emit();
          const notificationMessage = response.message;
          this.lovFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, notificationMessage);
          this.hideLoader();
          this.memberForm.reset();
          this.isValidateForm = false;
          this.cd.detectChanges();
          this.closeForm.emit();
        },
        error: (err: any) => {
          
          if(err?.error?.error?.code?.includes('USER_ALREADY_EXISTS')){
            this.lovFacade.showHideSnackBar(SnackBarNotificationType.WARNING, err?.error?.error?.message);
            this.hideLoader();
          }else{
            this.lovFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
            this.hideLoader();
          }
          
        }
      });

    }
  }


}
