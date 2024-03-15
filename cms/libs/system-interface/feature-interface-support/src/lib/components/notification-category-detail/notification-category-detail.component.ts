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
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'notification-category-detail',
  templateUrl: './notification-category-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class NotiificationCategoryDetailComponent implements OnInit {
  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }
  @Input() selectedGroup: any;
  @Input() isEditNotificationCategory: any;
  @Input() selectedMemberData: any;
  @Input() selectedNotificationCategory: any;
  @Input() eventLov: any
  @Output() close = new EventEmitter<any>();
  @Output() addNotificationCategoryEvent = new EventEmitter<any>();
  @Output() editNotificationCategoryEvent = new EventEmitter<any>();

  public formUiStyle: UIFormStyle = new UIFormStyle();
  notiificationCategoryForm!: FormGroup;
  memberForm!: FormGroup;
  tAreaCessationMaxLength = 200;
  isSubmitted: boolean = false;
  isLoading = false;
  isValidateForm = false;
  notiificationCategory!: any;


  constructor(private formBuilder: FormBuilder,
    private readonly loaderService: LoaderService,
    private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.createNotiificationCategoryForm();
    if (this.isEditNotificationCategory) {
      this.bindDataToForm(this.selectedNotificationCategory)
    }
  }


  createNotiificationCategoryForm() {
    this.notiificationCategoryForm = this.formBuilder.group({
      groupName: new FormControl({ value: '', disabled: true }),
      eventId: new FormControl({ value: '', disabled: false }, [Validators.required]),
    });

    if (this.selectedGroup)
      this.notiificationCategoryForm.controls['groupName'].setValue(this.selectedGroup.groupName);
  }

  bindDataToForm(notificationCategory: any) {
    this.notiificationCategory = notificationCategory;
    this.notiificationCategoryForm.controls["groupName"].setValue(this.selectedGroup.groupName);
    this.notiificationCategoryForm.controls["eventId"].setValue(notificationCategory.eventId);
    this.notiificationCategoryForm.markAllAsTouched();
    this.cd.detectChanges();
  }

  mapFormValues() {
    const formValues = this.notiificationCategoryForm.value;
    const dto = {
      notificationGroupId: this.selectedGroup.notificationGroupId,
      eventId: formValues.eventId,
    };
    return dto;
  }


  onCancelClick() {
    this.close.emit();
  }

  validateForm() {
    this.notiificationCategoryForm.markAllAsTouched();
  }

  checkValidations() {
    return this.notiificationCategoryForm.valid;
  }

  public addAndSaveNotificationCategory() {
    this.notiificationCategoryForm.markAllAsTouched();
    const res = this.checkValidations();
    this.isSubmitted = true;
    if (!res) { return; }

    this.validateForm();
    this.isValidateForm = true;

    if (this.notiificationCategoryForm.valid) {
      let finalData = this.mapFormValues();
      if (this.isEditNotificationCategory) {
        this.editNotificationCategoryEvent.emit(finalData)
      } else {
        this.addNotificationCategoryEvent.emit(finalData)
      }

    }
  }



}