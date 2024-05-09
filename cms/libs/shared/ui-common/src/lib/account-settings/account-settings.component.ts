import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Observable, Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
   constructor(private readonly  cdr :ChangeDetectorRef,
    private formBuilder: FormBuilder,
    ) {}

  ngOnInit(): void {
    this.initUserForm();
    this.loadUserInfoData();
    this.userInfoDataHandle();
  }

  ngOnDestroy(): void {
    this.userInfoSubsriction.unsubscribe();
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
        this.cdr.detectChanges();
      }
    })
  }

  get addPhoneForm(): FormArray {
    return this.userForm.get('phones') as FormArray;
  }

  // addPhoneGroup() {
  //   let phoneForm = this.formBuilder.group({
  //     serviceStartDate: new FormControl(
  //       startDate ? startDate : this.medicalClaimServices.serviceStartDate,
  //       [Validators.required]
  //     ),

  //   });
  //   this.addClaimServicesForm.push(claimForm);
  //   this.addExceptionClaimForm();
  // }

}
