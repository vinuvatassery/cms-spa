import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Observable, Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LovFacade } from '@cms/system-config/domain';
import { ContactFacade } from '@cms/case-management/domain';


@Component({
  selector: 'common-account-settings',
  templateUrl: './account-settings.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  @Input() userInfoData$: any;
  @Output() loadUserInfoDataEvent = new EventEmitter<any>();

  userInfo : any;
  private userInfoSubsriction !: Subscription;
  isScheduleOutOfOfficeSection = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  userForm!: FormGroup;
  userDeviceTypeLovSubscription = new Subscription();
  userPronounsLovSubjectSubscription = new Subscription();
  userDeviceTypeLov$ = this.lovFacade.userDeviceTypeLov$;
  userPronounsLov$ = this.lovFacade.userPronounsLov$;
  ddlStates$ = this.contactFacade.ddlStates$;

  public listItems = [
 {
  lovDesc: 'Monday',
  lovCode:"MO"
 },
 {
  lovDesc: 'Tuesday',
  lovCode:"TU"
 },
 {
  lovDesc: 'Wednesday',
  lovCode:"WE"
 },
 {
  lovDesc: 'Thursday',
  lovCode:"TH"
 },
 {
  lovDesc: 'Friday',
  lovCode:"FR"
 },
 {
  lovDesc: 'Saturday',
  lovCode:"SA"
 },
 {
  lovDesc: 'Sunday',
  lovCode:"SU"
 },
  ];
  public time: Date = new Date(2000, 2, 10, 13, 30, 0);

   /** Constructor**/
   constructor(private readonly cdr :ChangeDetectorRef,
    private readonly formBuilder: FormBuilder,
    private readonly lovFacade: LovFacade,
    private readonly contactFacade: ContactFacade,
    ) {}

  ngOnInit(): void {
    this.contactFacade.loadDdlStates();
    this.lovFacade.getUserPhoneTypeLov();
    this.lovFacade.getUserPronounsLov();
    this.initUserForm();
    this.loadUserInfoData();
    this.userInfoDataHandle();
    // this.userDeviceTypeLovSubscription = this.userDeviceTypeLov$.subscribe((response: any) => {
    //   if (response !== undefined && response !== null) {
    //    this.eventAttachmentTypeList = response;
    //   }
    // });
    // this.userPronounsLovSubjectSubscription = this.userPronounsLov$.subscribe((response: any) => {
    //   if (response !== undefined && response !== null) {
    //    this.eventAttachmentTypeList = response;
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.userInfoSubsriction.unsubscribe();
    this.userDeviceTypeLovSubscription.unsubscribe();
    this.userPronounsLovSubjectSubscription.unsubscribe();
  }

  initUserForm() {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: [''],
      initials: [''],
      pronoun: [''],
      jobTitle:  [''],
      pOrNbr:  [''],
      email:  [''],
      phones: new FormArray([]),
      address1:  [''],
      address2:  [''],
      city:  [''],
      state:  [''],
      zip:  [''],
      county:  [''],
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
        ''
      ),

      faxNbr: new FormControl(
        ''
      )

    });
    this.addPhoneForm.push(phoneForm);
  }

  setFormValues(userInfo : any)
  {
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
    this.userForm.controls['startDate'].setValue(userInfo?.userSchedules[0]?.startDate ? new Date(userInfo?.userSchedules[0]?.startDate) : '');
    this.userForm.controls['endDate'].setValue(userInfo?.userSchedules[0]?.endDate ? new Date(userInfo?.userSchedules[0]?.endDate) : '');
    this.userForm.controls['startTime'].setValue(userInfo?.userSchedules[0]?.startTime);
    this.userForm.controls['endTime'].setValue(userInfo?.userSchedules[0]?.endTime);
    this.userForm.controls['outOfOfficeMsg'].setValue(userInfo?.userSchedules[0]?.message);
    this.userForm.controls['notificationSummaryFlag'].setValue(userInfo.notificationSummaryEmailCheck);
    this.userForm.updateValueAndValidity();


  }

}
