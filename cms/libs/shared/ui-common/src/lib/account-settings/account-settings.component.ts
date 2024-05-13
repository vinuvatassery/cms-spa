import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Observable, Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LovFacade, UserManagementFacade } from '@cms/system-config/domain';
import { PronounTypeCode } from '../enums/pronoun-type-code.enum';
import { NullLogger } from '@microsoft/signalr';
import { IntlService } from '@progress/kendo-angular-intl';
import { ConfigurationProvider } from '@cms/shared/util-core';



@Component({
  selector: 'common-account-settings',
  templateUrl: './account-settings.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  @Input() userInfoData$: any;
  @Output() loadUserInfoDataEvent = new EventEmitter<any>();
  @Output() submitUserInfoDataEvent = new EventEmitter<any>();

  userInfo : any;
  private userInfoSubsriction !: Subscription;
  isScheduleOutOfOfficeSection = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  userForm!: FormGroup;
  userDeviceTypeLov$ = this.lovFacade.userDeviceTypeLov$;
  pronounslov$ = this.lovFacade.pronounslov$;
  ddlStates$ = this.userManagementFacade.ddlStates$;
  pronounLovSubscription = new Subscription();
  pronounList : any;
  dateFormat = this.configProvider.appSettings.dateFormat;
  public time: Date = new Date(2000, 2, 10, 13, 30, 0);

   /** Constructor**/
   constructor(private readonly cdr :ChangeDetectorRef,
    private readonly formBuilder: FormBuilder,
    private readonly lovFacade: LovFacade,
    private readonly userManagementFacade: UserManagementFacade,
    private readonly intl: IntlService,
    private readonly configProvider: ConfigurationProvider,
    ) {}

  ngOnInit(): void {
    this.userManagementFacade.loadDdlStates();
    this.lovFacade.getUserPhoneTypeLov();
    this.lovFacade.getPronounLovs();
    this.initUserForm();
    this.loadUserInfoData();
    this.userInfoDataHandle();
    this.pronounLovSubscription = this.pronounslov$.subscribe((response: any) => {
      if (response !== undefined && response !== null) {
        const pronounCodes = Object.values(PronounTypeCode)
        this.pronounList = response.filter((item: any) => pronounCodes.includes(item.lovCode));
      }
    });
  }

  ngOnDestroy(): void {
    this.userInfoSubsriction.unsubscribe();
    this.pronounLovSubscription.unsubscribe();
  }

  initUserForm() {
    this.userForm = this.formBuilder.group({
      loginUserId: [''],
      firstName: [{value: '', disabled:true}],
      lastName: [{value: '', disabled:true}],
      initials: [''],
      pronoun: [''],
      jobTitle:  [''],
      pOrNbr:  [{value: '', disabled:true}],
      email:  [{value: '', disabled:true}],
      phones: new FormArray([]),
      faxNbr : [''],
      address1:  [''],
      address2:  [''],
      city:  [''],
      state:  [''],
      zip:  [''],
      county:  [''],
      loginUserScheduleId: [''],
      startDate:  [''],
      endDate:  [''],
      startTime:  [''],
      endTime:  [''],
      outOfOfficeMsg:  [''],
      notificationSummaryFlag: [null],
    });
  }

  showScheduleOutOfOfficeSection(){
  this.isScheduleOutOfOfficeSection = !this.isScheduleOutOfOfficeSection
  if(!this.isScheduleOutOfOfficeSection)
    {
      this.userForm.controls['startDate'].reset();
      this.userForm.controls['endDate'].reset()
      this.userForm.controls['startTime'].reset();
      this.userForm.controls['endTime'].reset();
      this.userForm.controls['outOfOfficeMsg'].reset();

    }

  }

  loadUserInfoData()
  {
    this.loadUserInfoDataEvent.emit();
  }

  userInfoDataHandle()
  {
    this.userInfoSubsriction = this.userInfoData$.subscribe((response:any)=>{
     if(response)
      {
        this.userInfo = response;
        if(this.userInfo.userTypeCode === 'INTERNAL')
        {
          this.disableFields();
        }
        this.setFormValues(this.userInfo);
        this.cdr.detectChanges();
      }
    })
  }

  get addPhoneForm(): FormArray {
    return this.userForm.get('phones') as FormArray;
  }

  addPhoneGroup() {
    let phoneForm = this.formBuilder.group({
      SmsTextConsentFlag: new FormControl(
        null ),

      PhoneNbr: new FormControl(
        '', [Validators.required]
      ),

      phoneType: new FormControl(
        '', [Validators.required]
      )

    });
    this.addPhoneForm.push(phoneForm);
  }

  setFormValues(userInfo : any)
  {
    this.userForm.controls['loginUserId'].setValue(userInfo.loginUserId);
    this.userForm.controls['firstName'].setValue(userInfo.firstName);
    this.userForm.controls['lastName'].setValue(userInfo.lastName);
    this.userForm.controls['pronoun'].setValue(userInfo.pronouns);
    this.userForm.controls['initials'].setValue(userInfo.initials);
    this.userForm.controls['jobTitle'].setValue(userInfo.jobTitle);
    this.userForm.controls['pOrNbr'].setValue(userInfo.pOrNbr);
    this.userForm.controls['email'].setValue(userInfo.email);
    this.userForm.controls['address1'].setValue(userInfo.address1);
    this.userForm.controls['address2'].setValue(userInfo.address2);
    this.userForm.controls['city'].setValue(userInfo.city);
    this.userForm.controls['state'].setValue(userInfo.state);
    this.userForm.controls['zip'].setValue(userInfo.zip);
    this.userForm.controls['county'].setValue(userInfo.county);
    this.userForm.controls['loginUserScheduleId'].setValue(userInfo?.userSchedules[0]?.loginUserScheduleId);
    this.userForm.controls['startDate'].setValue(userInfo?.userSchedules[0]?.startDate ? new Date(userInfo?.userSchedules[0]?.startDate) : '');
    this.userForm.controls['endDate'].setValue(userInfo?.userSchedules[0]?.endDate ? new Date(userInfo?.userSchedules[0]?.endDate) : '');
    this.userForm.controls['outOfOfficeMsg'].setValue(userInfo?.userSchedules[0]?.message);
    this.userForm.controls['notificationSummaryFlag'].setValue(userInfo.notificationSummaryEmailCheck);
    this.userForm.updateValueAndValidity();
    const startTimeValue = userInfo?.userSchedules[0]?.startTime?.split(':')
    const endTimeValue = userInfo?.userSchedules[0]?.endTime?.split(':')
    this.userForm.controls['startTime'].setValue(startTimeValue? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), startTimeValue[0], startTimeValue[1]) : null);
    this.userForm.controls['endTime'].setValue(endTimeValue? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), endTimeValue[0], endTimeValue[1]) : null);
    if(!userInfo.state && userInfo.userTypeCode === 'EXTERNAL')
    {
      this.userForm.controls["state"].setValue('OR');
    }
    if(userInfo?.userSchedules.length > 0)
      {
        this.isScheduleOutOfOfficeSection = true;
      }
  }

  disableFields()
  {
    this.userForm.controls['address1'].disable();
    this.userForm.controls['address2'].disable();
    this.userForm.controls['city'].disable();
    this.userForm.controls['state'].disable();
    this.userForm.controls['zip'].disable();
    this.userForm.controls['county'].disable();

  }

  onSave()
  {
    this.setFormValidation();
    if(!this.userForm.invalid)
    {
      let payload = {
        loginUserId : this.userForm.controls['loginUserId'].value ? this.userForm.controls['loginUserId'].value : null,
        userTypeCode : this.userInfo.userTypeCode,
        initials:  this.userForm.controls['initials'].value ?? null,
        pronouns: this.userForm.controls['pronoun'].value ?? null,
        jobTitle:  this.userForm.controls['jobTitle'].value ?? null,
        address1:  this.userForm.controls['address1'].value ?? null,
        address2:  this.userForm.controls['address2'].value ?? null,
        city:  this.userForm.controls['city'].value ?? null,
        state:  this.userForm.controls['state'].value ?? null,
        zip:  this.userForm.controls['zip'].value ?? null,
        county: this.userForm.controls['county'].value ?? null,
        notificationSummaryEmailCheck : this.userForm.controls['notificationSummaryFlag'].value,
        userSchedules: [{}],
      }
      if(this.isScheduleOutOfOfficeSection)
      {
        let schedule = {
          loginUserId : this.userForm.controls['loginUserId'].value ? this.userForm.controls['loginUserId'].value : null,
          loginUserScheduleId : this.userForm.controls['loginUserScheduleId'].value ? this.userForm.controls['loginUserScheduleId'].value : null,
          startDate: this.intl.formatDate(this.userForm.controls['startDate'].value,  this.dateFormat ),
          endDate: this.intl.formatDate(this.userForm.controls['endDate'].value,  this.dateFormat ),
          startTime: new Date(this.userForm.controls['startTime'].value).getHours()+":"+new Date(this.userForm.controls['startTime'].value).getMinutes(),
          endTime: new Date(this.userForm.controls['endTime'].value).getHours()+":"+new Date(this.userForm.controls['endTime'].value).getMinutes(),
          message: this.userForm.controls['outOfOfficeMsg'].value ?? null
        }
        payload.userSchedules.push(schedule);
        payload.userSchedules.splice(0, 1);
      }
      else{
        payload.userSchedules = [];
      }
      this.submitUserInfoDataEvent.emit(payload);
    }
  }

  setFormValidation()
  {
    this.userForm.controls['jobTitle'].setValidators(Validators.required);
    this.userForm.controls["jobTitle"].updateValueAndValidity();
    if(this.isScheduleOutOfOfficeSection)
    {
      this.userForm.controls['startDate'].setValidators(Validators.required);
      this.userForm.controls["startDate"].updateValueAndValidity();
      this.userForm.controls['endDate'].setValidators(Validators.required);
      this.userForm.controls['endDate'].updateValueAndValidity();
      this.userForm.controls['startTime'].setValidators(Validators.required);
      this.userForm.controls['startTime'].updateValueAndValidity();
      this.userForm.controls['endTime'].setValidators(Validators.required);
      this.userForm.controls['endTime'].updateValueAndValidity();
      this.userForm.controls['outOfOfficeMsg'].setValidators(Validators.required);
      this.userForm.controls['outOfOfficeMsg'].updateValueAndValidity();

    }
  }

}
