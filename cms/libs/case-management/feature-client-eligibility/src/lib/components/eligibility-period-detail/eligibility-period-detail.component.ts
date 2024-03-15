/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/** Internal Libraries **/
import { ClientEligibilityFacade, EligibilityRequestType, AcceptedApplication, CaseFacade, EligibilityStatus } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { LovFacade } from '@cms/system-config/domain';
import { LoaderService, ConfigurationProvider, SnackBarNotificationType } from '@cms/shared/util-core';

/** External Libraries**/
import { IntlService } from '@progress/kendo-angular-intl';

@Component({
  selector: 'case-management-eligibility-period-detail',
  templateUrl: './eligibility-period-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EligibilityPeriodDetailComponent implements OnInit {
  public formUiStyle : UIFormStyle = new UIFormStyle();
  currentDate = new Date();

   /** InPut properties **/
  @Input() clientCaseEligibilityId : any
  @Input() currentActiveClientCaseEligibilityId : any
  @Input() clientId : any
  @Input() clientCaseId : any
  @Input() isEdit : any
  @Input() isStatusPeriodEdit: boolean=false;
  @Input() isCopyPeriod: boolean=false;
  @Output() isModalSavedClicked = new EventEmitter();
  @Output() isModalPeriodCloseClicked = new EventEmitter();
  /** Public properties **/
  ddlStatus$ = this.lovFacade.eligibilityStatusCp$;
  disenrollmentReason$ = this.lovFacade.disenrollmentReason$
  showEligibilityStatusLoader = this.lovFacade.showLoaderOnEligibilityStatus$;
  ddlGroups$ =  this.caseFacade.ddlGroups$ ;
  disableFields: Array<string>=[ 'statusEndDate','group','statusStartDate'];
  requiredFields: Array<string>=[];
  eligibilityPeriodForm!:FormGroup;
  currentEligibility!:any;
  eligibilityDetails!:any;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  acceptedApplication= new AcceptedApplication();
  eligibleStatuses:Array<string>=[];
  statusEndDateIsGreaterThanStartDate:boolean = true;
  eligibilityStatusAllowed:boolean =true;
  dayOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
  };
  maxLengthTen:number=10;
  groupList!: any;
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  isStartDateChange = true;
  isEndDateChange = true;

  /** Constructor **/
  constructor(
    private readonly clientEligibilityFacade: ClientEligibilityFacade,
    private readonly lovFacade: LovFacade,
    private readonly caseFacade: CaseFacade,
    private formBuilder: FormBuilder,
    private readonly cd: ChangeDetectorRef,
    private loaderService: LoaderService,
    public intl: IntlService,
    private configurationProvider: ConfigurationProvider
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.buildEligibilityPeriodForm();
    if(!this.isCopyPeriod)
    {
      this.disableFormFields();
    }
    this.getCurrentEligibility();
    this.loadLovs();
    this.getGroupData();

  }

  /** Public methods **/
  onEligibilityStatusChanged(){
    this.statusEndDateIsGreaterThanStartDate = true;
    this.setStartDateEndDateByStatus( this.eligibilityPeriodForm.controls['eligibilityStatus'].value);
    this.enableAllFields();
    this.disableFormFields();
    this.checkEligibilityStatusAllowed();

  }

  startNewEligibility() {
    this.validateForm();
    this.eligibilityPeriodForm.markAllAsTouched();
    if (this.eligibilityPeriodForm.valid) {
      if (this.eligibilityPeriodsOverlapCheck(
        new Date(this.currentEligibility.eligibilityStartDate),
        this.eligibilityPeriodForm.controls['statusStartDate'].value === "" ? null : this.eligibilityPeriodForm.controls['statusStartDate'].value,
        this.eligibilityPeriodForm.controls['statusEndDate'].value === "" ? null : this.eligibilityPeriodForm.controls['statusEndDate'].value)) {
        this.clientEligibilityFacade.showHideSnackBar(
          SnackBarNotificationType.WARNING,
          'There cannot be two eligibility periods with overlapping date ranges.'
        );
      }
      else{
      this.loaderService.show();
        this.acceptedApplication.clientCaseId = this.clientCaseId;
        this.acceptedApplication.clientCaseEligibilityId = this.clientCaseEligibilityId;
        this.acceptedApplication.eligibilityStartDate = new Date(this.intl.formatDate(this.eligibilityPeriodForm.controls['statusStartDate'].value, this.dateFormat));
        this.acceptedApplication.eligibilityEndDate = new Date(this.intl.formatDate(this.eligibilityPeriodForm.controls['statusEndDate'].value, this.dateFormat));
        this.acceptedApplication.groupCode = this.eligibilityPeriodForm.controls['group'].value;
        this.acceptedApplication.groupCodeId = null;
        this.acceptedApplication.assignedCwUserId = null;
        this.acceptedApplication.eligibilityStatusCode = this.eligibilityPeriodForm.controls['eligibilityStatus'].value;
        this.acceptedApplication.caseStatusCode = this.currentEligibility.caseStatusCode;
        this.acceptedApplication.reasonCode = this.eligibilityPeriodForm.controls['reasonCode'].value;
        this.acceptedApplication.otherReasonDesc = this.eligibilityPeriodForm.controls['otherReasonDesc'].value
        this.clientEligibilityFacade.saveNewStatusPeriod(this.acceptedApplication, this.clientCaseId, this.clientCaseEligibilityId).subscribe({
          next: (response) => {
            if(response)
            {
              this.clientEligibilityFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, "Status changed and new Eligibility Period started!.")
              this.loaderService.hide();
              this.isModalSavedClicked.emit(true);
            }
            else{
              this.clientEligibilityFacade.showHideSnackBar(
                SnackBarNotificationType.WARNING,
                'There cannot be two eligibility periods with overlapping date ranges.'
              );
            }
          },
          error: (err) => {
            this.loaderService.hide();
            this.clientEligibilityFacade.showHideSnackBar(
              SnackBarNotificationType.ERROR,
              err
            );
            this.onModalCloseClicked();
          },
        });
      }
    }
  }
  updateCurrentEligibility() {
    this.setUpdateEligibilityValidations();
    if (this.eligibilityPeriodForm.valid && this.isStartDateChange && this.isEndDateChange) {
      let editEligibilityData = this.currentEligibility;
      editEligibilityData.eligibilityStartDate = new Date(this.intl.formatDate(this.eligibilityPeriodForm.controls['statusStartDate'].value, this.dateFormat));
      editEligibilityData.eligibilityEndDate = new Date(this.intl.formatDate(this.eligibilityPeriodForm.controls['statusEndDate'].value, this.dateFormat));
      this.loaderService.show();
      this.clientEligibilityFacade.saveAcceptedApplication(editEligibilityData, this.clientCaseId, this.clientCaseEligibilityId, EligibilityRequestType.eligibilityStatus).subscribe({
        next: (data) => {
          if(data){
            this.clientEligibilityFacade.showHideSnackBar(
              SnackBarNotificationType.SUCCESS,
              'Eligibility period updated!'
            );
            let periodDates = {
              eilgibilityStartDate:editEligibilityData.eligibilityStartDate,
              eligibilityEndDate:editEligibilityData.eligibilityEndDate
            }
            if(this.currentActiveClientCaseEligibilityId === this.currentEligibility?.clientCaseEligibilityId)
            {
              this.clientEligibilityFacade.eligibilityDateSubject.next(periodDates);
            }
            this.isModalSavedClicked.emit(true);
          }
          else{
            this.clientEligibilityFacade.showHideSnackBar(
              SnackBarNotificationType.WARNING,
              'There cannot be two eligibility periods with overlapping date ranges.'
            );
          }
          this.loaderService.hide();
        },
        error: (err) => {
          if (err) {
            this.loaderService.hide();
            this.clientEligibilityFacade.showHideSnackBar(
              SnackBarNotificationType.ERROR,
              err
            );
            this.onModalCloseClicked();
          }
        },
      });
    }
    this.isStartDateChange = true;
    this.isEndDateChange = true;
  }
  endDateValueChange(date: Date) {
    this.statusEndDateIsGreaterThanStartDate = false;

  }
  startDateOnChange() {
    if (this.eligibilityPeriodForm.controls['statusEndDate'].value !== null) {
      this.endDateOnChange();
    }

  }
  endDateOnChange() {
    this.canChangeEndDate();
    this.statusEndDateIsGreaterThanStartDate = true;
    if (this.eligibilityPeriodForm.controls['statusStartDate'].value === null) {
      this.eligibilityPeriodForm.controls['statusStartDate'].markAllAsTouched();
      this.eligibilityPeriodForm.controls['statusStartDate'].setValidators([Validators.required]);
      this.eligibilityPeriodForm.controls['statusStartDate'].updateValueAndValidity();

      this.statusEndDateIsGreaterThanStartDate = false;
    }
    else if (this.eligibilityPeriodForm.controls['statusEndDate'].value !== null) {
      const startDate = this.intl.parseDate(
        Intl.DateTimeFormat('en-US').format(
          this.eligibilityPeriodForm.controls['statusStartDate'].value
        )
      );
      const endDate = this.intl.parseDate(
        Intl.DateTimeFormat('en-US').format(
          this.eligibilityPeriodForm.controls['statusEndDate'].value
        )
      );

      if (startDate > endDate) {
        this.eligibilityPeriodForm.controls['statusEndDate'].setErrors({ 'incorrect': true });
        this.statusEndDateIsGreaterThanStartDate = false;
      }
      else {
        this.statusEndDateIsGreaterThanStartDate = true;
        this.eligibilityPeriodForm.controls['statusEndDate'].setErrors(null);
      }
    }
  }
  onModalCloseClicked() {
    this.clientEligibilityFacade.eligibilityPeriodPopupOpenSubject.next(false);
    this.isModalPeriodCloseClicked.emit(true);
  }
  /** Private methods **/
  private getCurrentEligibility(){
    this.loaderService.show();

    let eligibilityRequestType: EligibilityRequestType;

    if (this.isEdit || this.isStatusPeriodEdit) {
      eligibilityRequestType = EligibilityRequestType.clientEligibilityInfo;
    } else if (this.isCopyPeriod) {
      eligibilityRequestType = EligibilityRequestType.copyEligibility;
    } else {
      eligibilityRequestType = EligibilityRequestType.newEligibilityPeriod;
    }

    this.clientEligibilityFacade.getEligibility(this.clientId,this.clientCaseId,this.clientCaseEligibilityId, eligibilityRequestType)
      .subscribe(data=>{
      this.currentEligibility = data;
      this.clientCaseEligibilityId = this.currentEligibility.clientCaseEligibilityId;
      if(this.isEdit || this.isStatusPeriodEdit || this.isCopyPeriod){
        this.bindEligibilityToForm(this.currentEligibility);
      }
      this.cd.detectChanges();
      this.loaderService.hide();
    });
  }
  private checkEligibilityStatusAllowed(){
    this.eligibilityPeriodForm.controls['eligibilityStatus'].markAllAsTouched();
    if(this.currentEligibility.eligibilityStatusCode.toUpperCase() === EligibilityStatus.New.toUpperCase()
     || this.currentEligibility.eligibilityStatusCode.toUpperCase() === EligibilityStatus.Accept.toUpperCase()){
      this.eligibilityStatusAllowed = true;
    }
    if(this.currentEligibility.eligibilityStatusCode.toUpperCase() === EligibilityStatus.Restricted.toUpperCase())
    {
      if(this.eligibilityPeriodForm.controls['eligibilityStatus'].value.toUpperCase() === EligibilityStatus.Accept.toUpperCase()
      || this.eligibilityPeriodForm.controls['eligibilityStatus'].value.toUpperCase() === EligibilityStatus.Disenrolled.toUpperCase())
      {
        this.eligibilityStatusAllowed = true;
      }
      else{

        this.eligibilityPeriodForm.controls['eligibilityStatus'].setErrors({ 'incorrect': true });
        this.eligibilityStatusAllowed = false;
      }

    }
    if(this.currentEligibility.eligibilityStatusCode.toUpperCase() === EligibilityStatus.Disenrolled.toUpperCase())
    {
      this.eligibilityPeriodForm.controls['eligibilityStatus'].setErrors({ 'incorrect': true });
      this.eligibilityStatusAllowed = false;
    }
    if(this.currentEligibility.eligibilityStatusCode.toUpperCase() === EligibilityStatus.Incomplete.toUpperCase())
    {
      if(this.eligibilityPeriodForm.controls['eligibilityStatus'].value.toUpperCase() === EligibilityStatus.Accept.toUpperCase()
      || this.eligibilityPeriodForm.controls['eligibilityStatus'].value.toUpperCase() === EligibilityStatus.Reject.toUpperCase())
      {
        this.eligibilityStatusAllowed = true;
      }
      else{
        this.eligibilityPeriodForm.controls['eligibilityStatus'].setErrors({ 'incorrect': true });
        this.eligibilityStatusAllowed = false;
      }

    }
    if(this.currentEligibility.eligibilityStatusCode.toUpperCase() === EligibilityStatus.Reject.toUpperCase())
    {
      this.eligibilityStatusAllowed = false;
    }

  }

  private loadLovs(){
    this.lovFacade.getEligibilityStatusCpLovs();
    this.caseFacade.loadGroupCode();
    this.lovFacade.getDisenrollmentReasonLovs();
  }
  private getDay(date: Date, locale: string, options?: Intl.DateTimeFormatOptions): string {
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date);
  }
  private setStartDateEndDateByStatus(status:string)
  {
    let currentEligibilityEndDate = this.currentEligibility.eligibilityEndDate ? new Date(this.currentEligibility.eligibilityEndDate) : new Date();
    let dayFromDate = this.getDay(this.addDays(new Date(currentEligibilityEndDate), 1), 'en-US', this.dayOptions);
    this.eligibilityPeriodForm.controls['statusStartDate'].reset();
    this.eligibilityPeriodForm.controls['statusEndDate'].reset();
    this.eligibilityPeriodForm.controls['group'].reset();
    let today = new Date();
    switch (status.toUpperCase()) {
      case EligibilityStatus.Accept.toUpperCase():
        this.setDatesAndDisableFieldsAccept(dayFromDate,today,currentEligibilityEndDate);
        break;
      case EligibilityStatus.Restricted.toUpperCase():
        this. setDatesAndDisableFieldsRestricted(dayFromDate,today,currentEligibilityEndDate);
        break;
      case EligibilityStatus.Disenrolled.toUpperCase():
        this. setDatesAndDisableFieldsDisenrolled(today);
        break;

    }
  }

  private setDatesAndDisableFieldsAccept(dayFromDate:string,today:Date,currentEligibilityEndDate:Date){
    this.disableFields = [];
    let additionalMonth = 0;
    if(dayFromDate === '1'){
      additionalMonth = 6;
    }
    else{
       additionalMonth = 7;
    }

    if (currentEligibilityEndDate) {
      this.eligibilityPeriodForm.controls['statusStartDate'].setValue(this.addDays(currentEligibilityEndDate, 1));
      this.eligibilityPeriodForm.controls['statusEndDate'].setValue(new Date(currentEligibilityEndDate.getFullYear(), currentEligibilityEndDate.getMonth() + additionalMonth, 0));
    }
    else {
      this.eligibilityPeriodForm.controls['statusStartDate'].setValue(today);
      this.eligibilityPeriodForm.controls['statusEndDate'].setValue(new Date(today.getFullYear(), today.getMonth() + 7, 0));
    }
  }

  private setDatesAndDisableFieldsRestricted(dayFromDate:string,today:Date,currentEligibilityEndDate:Date){
        this.disableFields = [];
        let additionalMonth = 0;
        if(dayFromDate === '1'){
          additionalMonth = 3;
        }
        else{
           additionalMonth = 4;
        }

        if (currentEligibilityEndDate) {
          this.eligibilityPeriodForm.controls['statusStartDate'].setValue(this.addDays(currentEligibilityEndDate, 1));
          let startDateValue = this.eligibilityPeriodForm.controls['statusStartDate'].value;
          this.eligibilityPeriodForm.controls['statusEndDate'].setValue(new Date(startDateValue.getFullYear(), startDateValue.getMonth() + additionalMonth, 0));
        }
        else {
          this.eligibilityPeriodForm.controls['statusStartDate'].setValue(today);
          let startDateValue = this.eligibilityPeriodForm.controls['statusStartDate'].value;
          this.eligibilityPeriodForm.controls['statusEndDate'].setValue(new Date(startDateValue.getFullYear(), startDateValue.getMonth() + 4, 0));
        }
  }

  private setDatesAndDisableFieldsDisenrolled(today:Date){
    this.disableFields = [
      'group',
    ];
    this.eligibilityPeriodForm.controls['statusStartDate'].setValue(today);
    this.eligibilityPeriodForm.controls['statusEndDate'].setValue(today);
  }

  private disableFormFields() {
    if(this.isEdit){
      this.disableFields =[];
    }
    if(this.isStatusPeriodEdit){
      if(this.currentEligibility && this.currentEligibility.eligibilityStatusCode == EligibilityStatus.Disenrolled.toUpperCase()){
        this.disableFields = [
          'group',
          'eligibilityStatus'
        ];
      }
      else{
        this.disableFields =['eligibilityStatus'];
      }

    }
    this.disableFields.forEach((key: string) => {
      this.eligibilityPeriodForm.controls[key].disable();
    });
  }
  private enableAllFields() {
    if (this.eligibilityPeriodForm.controls !== null && Object.keys(this.eligibilityPeriodForm.controls).length > 0) {
      Object.keys(this.eligibilityPeriodForm.controls).forEach((key: string) => {
        this.eligibilityPeriodForm.controls[key].enable();
      });

    }
  }
  private buildEligibilityPeriodForm() {
    this.eligibilityPeriodForm = this.formBuilder.group({
      eligibilityStatus: [null],
      statusStartDate: [null],
      statusEndDate: [null],
      group: [null],
      reasonCode: [null],
      otherReasonDesc: [null]
    });

  }

  private addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  private validateForm(){
    this.eligibilityPeriodForm.controls['eligibilityStatus'].setValidators([Validators.required]);
    this.eligibilityPeriodForm.controls['eligibilityStatus'].updateValueAndValidity();
    let eligibilityStatusValue=this.eligibilityPeriodForm.controls['eligibilityStatus'].value;
    if(eligibilityStatusValue === null || eligibilityStatusValue ===''){
      eligibilityStatusValue = EligibilityStatus.New.toUpperCase();
    }
      if(eligibilityStatusValue === EligibilityStatus.New.toUpperCase()
      || eligibilityStatusValue === EligibilityStatus.Accept.toUpperCase()||
      eligibilityStatusValue === EligibilityStatus.Restricted.toUpperCase()){
        this.requiredFields = [
          'statusStartDate',
          'statusEndDate',
          'group',
        ];
      }
      else if(eligibilityStatusValue === EligibilityStatus.Disenrolled.toUpperCase()){
        this.requiredFields = [
          'statusStartDate',
          'reasonCode'
        ];
      }

    else{
      this.removeValidation();
    }
    this.validate();
  }

  private validate(){
    this.requiredFields.forEach((key: string) => {
      this.eligibilityPeriodForm.controls[key].setValidators([Validators.required]);
      this.eligibilityPeriodForm.controls[key].updateValueAndValidity();
    });
  }

  private removeValidation(){
    this.eligibilityPeriodForm.controls['statusStartDate'].removeValidators([Validators.required]);
    this.eligibilityPeriodForm.controls['statusEndDate'].removeValidators(Validators.required);
    this.eligibilityPeriodForm.controls['group'].removeValidators(Validators.required);
    this.eligibilityPeriodForm.controls['statusStartDate'].updateValueAndValidity();
    this.eligibilityPeriodForm.controls['statusEndDate'].updateValueAndValidity();
    this.eligibilityPeriodForm.controls['group'].updateValueAndValidity();
  }

  private bindEligibilityToForm(currentEligibility:any){
    if(currentEligibility.eligibilityStartDate){
      this.eligibilityPeriodForm.controls['statusStartDate'].setValue(new Date(currentEligibility.eligibilityStartDate));
      this.eligibilityPeriodForm.controls['statusStartDate'].updateValueAndValidity();
    }
    if(currentEligibility.eligibilityEndDate){
      this.eligibilityPeriodForm.controls['statusEndDate'].setValue(new Date(currentEligibility.eligibilityEndDate));
      this.eligibilityPeriodForm.controls['statusEndDate'].updateValueAndValidity();
    }
    if(this.isStatusPeriodEdit){
      this.eligibilityPeriodForm.controls['eligibilityStatus'].setValue(currentEligibility.eligibilityStatusCode);
      this.eligibilityPeriodForm.controls['group'].setValue(currentEligibility.groupCode);
      this.eligibilityPeriodForm.controls['group'].updateValueAndValidity()
    }
    if(!this.isCopyPeriod)
    {
      this.disableFormFields();
    }
    else if(this.isCopyPeriod)
    {
      this.eligibilityPeriodForm.controls['eligibilityStatus'].setValue(currentEligibility.eligibilityStatusCode);
      this.setStartDateEndDateByStatus(this.eligibilityPeriodForm.controls['eligibilityStatus'].value);
      this.eligibilityPeriodForm.controls['group'].setValue(currentEligibility.groupCode);
      this.eligibilityPeriodForm.controls['group'].updateValueAndValidity();
    }
  }

  private setUpdateEligibilityValidations() {
    if(this.isEdit){
      this.eligibilityPeriodForm.controls['statusStartDate'].setValidators([Validators.required]);
      this.eligibilityPeriodForm.controls['statusEndDate'].setValidators([Validators.required]);
      this.eligibilityPeriodForm.controls['statusStartDate'].updateValueAndValidity();
      this.eligibilityPeriodForm.controls['statusEndDate'].updateValueAndValidity();
    }
    if(this.isStatusPeriodEdit){
      this.removeValidation();
      let eligibilityStatusValue= this.currentEligibility.eligibilityStatusCode;
      if(eligibilityStatusValue === EligibilityStatus.New.toUpperCase()
      || eligibilityStatusValue === EligibilityStatus.Accept.toUpperCase()||
      eligibilityStatusValue === EligibilityStatus.Restricted.toUpperCase()){
        this.requiredFields = [
          'statusStartDate',
          'statusEndDate',
        ];
      }
      else if(eligibilityStatusValue === EligibilityStatus.Disenrolled.toUpperCase()){
        this.requiredFields = [
          'statusStartDate',
          'reasonCode'
        ];
      }
      this.validate();
    }

  }
  private eligibilityPeriodsOverlapCheck(currentStartDate: Date,  newStartDate: Date, newEndDate: Date) {
    let cuStartDate =this.intl.formatDate(currentStartDate, this.dateFormat) ;
    let nwStartDate = this.intl.formatDate(newStartDate,  this.dateFormat ) ;
    let nwEndDate = this.intl.formatDate(newEndDate,this.dateFormat ) ;

    if (cuStartDate === nwStartDate){
     return true;
    }
    if (nwStartDate <= cuStartDate && nwEndDate >= cuStartDate ) {
      return true;
    }
    return false;
  }

  getGroupData(){
    this.caseFacade.ddlGroups$.subscribe((response:any)=>{
      if(response){
        this.groupList=response;
      }
    })
  }
  onStartDateChange()
  {
    if((this.isEdit || this.isStatusPeriodEdit) && this.currentEligibility.previousEligibilityEndDate)
    {
      let currentEligibilityStartDate =new Date(this.eligibilityPeriodForm.controls['statusStartDate'].value);
      let previousEndDate =new Date(this.currentEligibility.previousEligibilityEndDate);
      previousEndDate.setDate(previousEndDate.getDate() + 1);
      let cuStartDate =this.intl.formatDate(currentEligibilityStartDate, this.dateFormat) ;
      let preEndDate = this.intl.formatDate(previousEndDate,  this.dateFormat ) ;
      if(cuStartDate !== preEndDate)
      {
        this.clientEligibilityFacade.showHideSnackBar(
          SnackBarNotificationType.WARNING,
          'Eligibility Start date cannot be changed.'
        );
        this.eligibilityPeriodForm.controls['statusStartDate'].setValue(new Date(this.currentEligibility.eligibilityStartDate));
        this.isStartDateChange = false;

      }
      else{
        this.isStartDateChange = true;
      }
    }
  }
  canChangeEndDate()
  {
    if((this.isEdit || this.isStatusPeriodEdit) && this.currentEligibility.nextEligibilityStartDate )
    {
      let currentEligibilityEndDate =new Date(this.eligibilityPeriodForm.controls['statusEndDate'].value);
      let nextStartDate =new Date(this.currentEligibility.nextEligibilityStartDate);
      nextStartDate.setDate(nextStartDate.getDate() - 1);
      let cuEndDate =this.intl.formatDate(currentEligibilityEndDate, this.dateFormat) ;
      let nexStartDate = this.intl.formatDate(nextStartDate,  this.dateFormat ) ;
      if(cuEndDate !== nexStartDate)
      {
        this.clientEligibilityFacade.showHideSnackBar(
          SnackBarNotificationType.WARNING,
          'Eligibility End date cannot be changed.'
        );
        this.eligibilityPeriodForm.controls['statusEndDate'].setValue(new Date(this.currentEligibility.eligibilityEndDate));
        this.isEndDateChange = false;

      }
      else{
        this.isEndDateChange = true;
      }
    }
  }

}
