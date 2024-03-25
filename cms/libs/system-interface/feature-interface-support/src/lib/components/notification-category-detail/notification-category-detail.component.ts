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
import { filter, first } from 'rxjs';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

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
  @Input() eventLov: any;
  @Input() subEventLov$: any;
  @Output() close = new EventEmitter<any>();
  @Output() addNotificationCategoryEvent = new EventEmitter<any>();
  @Output() editNotificationCategoryEvent = new EventEmitter<any>();
  @Output() loadSubEventByParentIdEvent = new EventEmitter<any>();

  public formUiStyle: UIFormStyle = new UIFormStyle();
  notificationCategoryForm!: FormGroup;
  memberForm!: FormGroup;
  tAreaCessationMaxLength = 200;
  isSubmitted: boolean = false;
  isLoading = false;
  isValidateForm = false;
  notiificationCategory!: any;
  showEventList: boolean = false;
  isloading: boolean = false;
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
    this.notificationCategoryForm = this.formBuilder.group({
      groupName: new FormControl({ value: '', disabled: true }),
      eventId: new FormControl({ value: '', disabled: false }, [Validators.required]),
      eventListInput: new FormControl({ value: '', disabled: true })
    });

    if (this.selectedGroup)
      this.notificationCategoryForm.controls['groupName'].setValue(this.selectedGroup.groupName);
  }

  bindDataToForm(notificationCategory: any) {
    this.notiificationCategory = notificationCategory;
    this.notificationCategoryForm.controls["groupName"].setValue(this.selectedGroup.groupName);
    this.notificationCategoryForm.controls["eventId"].setValue(notificationCategory.eventId);
    this.onNotificationCategoryChanged(notificationCategory.eventId);
    this.notificationCategoryForm.markAllAsTouched();
    this.cd.detectChanges();
  }

  mapFormValues() {
    const formValues = this.notificationCategoryForm.value;
    const dto = {
      notificationGroupId: this.selectedGroup.notificationGroupId,
      eventId: formValues.eventId,
    };
    return dto;
  }
  onNotificationCategoryChanged(event: any) {
    this.isloading = true;
    this.loadSubEventByParentIdEvent.emit(event);
    this.subEventLov$.pipe(
      first()
    ).subscribe((response: any) => {
      const newResponse = {
        data: response?.["items"] ?? [] // Check for null response or missing items property
      };
      const eventListString = newResponse.data
        .sort((a: any, b: any) => (a?.eventDesc ?? '').localeCompare(b?.eventDesc ?? '')) // Check for null eventDesc
        .map((event: any) => `${event?.eventDesc ?? ''}`)
        .join('\n');
  
      // Check if the form control exists before setting its value
      if (this.notificationCategoryForm?.controls?.['eventListInput']) {
        this.notificationCategoryForm.controls['eventListInput'].setValue(eventListString);
      }
      this.isloading = false;
    });
  
    // Ensure event is not null or undefined before assigning to showEventList
    this.showEventList = !!event;
  }
  
  onCancelClick() {
    this.close.emit();
  }

  validateForm() {
    this.notificationCategoryForm.markAllAsTouched();
  }

  checkValidations() {
    return this.notificationCategoryForm.valid;
  }

  public addAndSaveNotificationCategory() {
    this.notificationCategoryForm.markAllAsTouched();
    const res = this.checkValidations();
    this.isSubmitted = true;
    if (!res) { return; }

    this.validateForm();
    this.isValidateForm = true;

    if (this.notificationCategoryForm.valid) {
      let finalData = this.mapFormValues();
      if (this.isEditNotificationCategory) {
        this.editNotificationCategoryEvent.emit(finalData)
      } else {
        this.addNotificationCategoryEvent.emit(finalData)
      }

    }
  }



}