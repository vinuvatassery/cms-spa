import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LovFacade, UserDeviceType, UserManagementFacade, UserType } from '@cms/system-config/domain';
import { PronounTypeCode } from '../enums/pronoun-type-code.enum';
import { IntlService } from '@progress/kendo-angular-intl';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { StatusFlag } from '../enums/status-flag.enum';



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
  inputMask ='(999) 000-0000';
  userInfo : any;
  private userInfoSubsriction !: Subscription;
  isScheduleOutOfOfficeSection = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  userForm!: FormGroup;
  userDeviceTypeLov$ = this.lovFacade.userDeviceTypeLov$;
  pronounslov$ = this.lovFacade.pronounslov$;
  ddlStates$ = this.userManagementFacade.ddlStates$;
  pronounLovSubscription = new Subscription();
  userDeviceTypeSubscription = new Subscription();
  pronounList : any;
  userDeviceList : any;
  dateFormat = this.configProvider.appSettings.dateFormat;
  public time: Date = new Date(2000, 2, 10, 13, 30, 0);
  endDateValidator = false;
  addressControlsList = ["address1", "address2", "city", "state", "zip", "county"]
  userDeviceType: typeof UserDeviceType = UserDeviceType;

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
    this.userDeviceTypeSubscription = this.userDeviceTypeLov$.subscribe((response: any) => {
      if (response !== undefined && response !== null) {
        this.userDeviceList = response;
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
      loginUserAddressId: [''],
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
      notificationSummaryFlag : [null]
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
        if(this.userInfo.userTypeCode === UserType.Internal)
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
    if(this.addPhoneForm.length > 1 )
    { 
      return;
    }
    let phoneForm = this.formBuilder.group({
      smsTextConsentFlag: new FormControl(
        null ),

      phoneNbr: new FormControl(
        ''
      ),

      phoneType: new FormControl(
        ''
      ),

      loginUserPhoneId: new FormControl(
        ''),
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
    this.userForm.controls['notificationSummaryFlag'].setValue(userInfo?.notificationSummaryEmailCheck);
    
    if(!userInfo.state && userInfo.userTypeCode === UserType.External)
    {
      this.userForm.controls["state"].setValue('OR');
    }
    if(userInfo?.userAddresses?.length > 0)
      {
        this.userForm.controls['loginUserAddressId'].setValue(userInfo?.userAddresses[0]?.loginUserAddressId);
        this.userForm.controls['address1'].setValue(userInfo?.userAddresses[0]?.address1);
        this.userForm.controls['address2'].setValue(userInfo?.userAddresses[0]?.address2);
        this.userForm.controls['city'].setValue(userInfo?.userAddresses[0]?.city);
        this.userForm.controls['state'].setValue(userInfo?.userAddresses[0]?.state);
        this.userForm.controls['zip'].setValue(userInfo?.userAddresses[0]?.zip);
        this.userForm.controls['county'].setValue(userInfo?.userAddresses[0]?.county);
      }
    if(userInfo?.userSchedules?.length > 0)
    {
      this.userForm.controls['loginUserScheduleId'].setValue(userInfo?.userSchedules[0]?.loginUserScheduleId);
      this.userForm.controls['startDate'].setValue(userInfo?.userSchedules[0]?.startDate ? new Date(userInfo?.userSchedules[0]?.startDate) : '');
      this.userForm.controls['endDate'].setValue(userInfo?.userSchedules[0]?.endDate ? new Date(userInfo?.userSchedules[0]?.endDate) : '');
      this.userForm.controls['outOfOfficeMsg'].setValue(userInfo?.userSchedules[0]?.message);
      const startTimeValue = userInfo?.userSchedules[0]?.startTime?.split(':')
      const endTimeValue = userInfo?.userSchedules[0]?.endTime?.split(':')
      this.userForm.controls['startTime'].setValue(startTimeValue? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), startTimeValue[0], startTimeValue[1]) : null);
      this.userForm.controls['endTime'].setValue(endTimeValue? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), endTimeValue[0], endTimeValue[1]) : null);
      this.isScheduleOutOfOfficeSection = true;
    }
    let filteredPhones = userInfo?.userPhones.filter((item : any) => item.deviceTypeCode !== this.userDeviceType.Fax );
    let faxNumber = userInfo?.userPhones.filter((item : any) => item.deviceTypeCode === this.userDeviceType.Fax );
    if(faxNumber?.length > 0)
      {
        this.userForm.controls['faxNbr'].setValue(faxNumber[0].deviceNbr);
      }
    if(filteredPhones?.length > 0)
    {
      this.setPhoneFormValues(filteredPhones);
    }
    else
    {
      this.addPhoneGroup();
    }
    this.userForm.updateValueAndValidity();
  }

  setPhoneFormValues(userPhones : any)
  {
    for (let i = 0; i < userPhones.length; i++) {
      let phone = userPhones[i];
      this.addPhoneGroup();
      if (phone.deviceTypeCode === this.userDeviceType.DeskPhone && this.userInfo.userTypeCode === UserType.Internal)
        {
          this.disablePhoneFields(i);
        }
      let phoneForm = this.addPhoneForm.at(i) as FormGroup;
      phoneForm.controls['smsTextConsentFlag'].setValue(phone.smsTextConsentFlag === StatusFlag.Yes?true:false);
      phoneForm.controls['phoneNbr'].setValue(phone.deviceNbr);
      phoneForm.controls['phoneType'].setValue(phone.deviceTypeCode);
      phoneForm.controls['loginUserPhoneId'].setValue(phone.loginUserPhoneId);

    }
    this.cdr.detectChanges();
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

  disablePhoneFields(index: any)
  {
    const phoneForm = this.addPhoneForm.at(index) as FormGroup;
    phoneForm.controls['smsTextConsentFlag'].disable();
    phoneForm.controls['phoneNbr'].disable();
    phoneForm.controls['phoneType'].disable();
  }

  onSave()
  {
    this.setFormValidation();
    if(!this.userForm.invalid && !this.endDateValidator)
    {
      let payload = {
        loginUserId : this.userForm.controls['loginUserId'].value ? this.userForm.controls['loginUserId'].value : null,
        userTypeCode : this.userInfo.userTypeCode,
        initials:  this.userForm.controls['initials'].value ?? null,
        pronouns: this.userForm.controls['pronoun'].value ?? null,
        jobTitle:  this.userForm.controls['jobTitle'].value ?? null,
        notificationSummaryEmailCheck : this.userForm.controls['notificationSummaryFlag'].value,
        userSchedules: [{}],
        userAddresses: [{}],
        userPhones: [{}],
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
      if(this.checkAddressControls() && this.userInfo.userTypeCode === UserType.External)
        {
          let address = {
            loginUserId : this.userForm.controls['loginUserId'].value ? this.userForm.controls['loginUserId'].value : null,
            loginUserAddressId : this.userForm.controls['loginUserAddressId'].value ? this.userForm.controls['loginUserAddressId'].value : null,
            address1:  this.userForm.controls['address1'].value ? this.userForm.controls['address1'].value: null,
            address2:  this.userForm.controls['address2'].value ? this.userForm.controls['address2'].value: null,
            city:  this.userForm.controls['city'].value ? this.userForm.controls['city'].value: null,
            state:  this.userForm.controls['state'].value ? this.userForm.controls['state'].value: null,
            zip:  this.userForm.controls['zip'].value ? this.userForm.controls['zip'].value: null,
            county: this.userForm.controls['county'].value ? this.userForm.controls['county'].value: null,
          }
          payload.userAddresses.push(address);
          payload.userAddresses.splice(0, 1);
        }
        else{
          payload.userAddresses = [];
        }
        let phoneformValues = this.userForm.value;
        for (let element of phoneformValues.phones) {
          let phone = {
            loginUserPhoneId: element.loginUserPhoneId ? element.loginUserPhoneId: null,
            loginUserId: this.userInfo.loginUserId,
            deviceTypeCode: element.phoneType ? element.phoneType: null,
            deviceNbr: element.phoneNbr ? element.phoneNbr: null,
            smsTextConsentFlag: element.smsTextConsentFlag ? StatusFlag.Yes : StatusFlag.No,
          };
          payload.userPhones.push(phone);
        }
        payload.userPhones.splice(0, 1);

      
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

  validateDate() {
    this.endDateValidator = false;
    const startDate = this.userForm.controls['startDate'].value;
    const endDate = this.userForm.controls['endDate'].value;
    if (startDate > endDate && endDate) {
      this.endDateValidator = true;
    }
  }

  removeForm(i : any)
  {
    if(this.addPhoneForm.length > 1 ){
      let form = this.addPhoneForm.value[i];
      this.addPhoneForm.removeAt(i);
      this.addPhoneForm.removeAt(i);
      }

  }
  checkAddressControls()
  {
   for(let i = 0; i< this.addressControlsList.length; i++)
    {
      const control = this.addressControlsList[i]
      if(this.userForm.controls[control].value)
        return true;
    }
    return false;
  }

}
