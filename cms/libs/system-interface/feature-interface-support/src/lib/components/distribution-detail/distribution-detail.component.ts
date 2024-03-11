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

  mapFormValues() {
    const formValues = this.memberForm.value;
    const dto = {
      groupId: this.selectedGroup.notificationGroupId,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      userTypeCode: 'EXTERNAL',
      notificationUserId: null,
    };
    if (this.isEditMode)
      dto.notificationUserId = this.selectedMemberData.notificationUserId;
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

  onItemSelected(selectedValue: any) {
    this.selectedUser = this.userDataList.find((item: any) => item.firstName === selectedValue);
    console.log('Selected object:', this.selectedUser);
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
          this.refreshData.emit(true);
          const notificationMessage = response.message;
          this.lovFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, notificationMessage);
          this.hideLoader();
          this.memberForm.reset();
          this.isValidateForm = false;
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
