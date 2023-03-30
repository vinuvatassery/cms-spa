/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/** Facades **/
import { ClientEligibilityFacade, EligibilityRequestType, AcceptedApplication, CaseFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { LovFacade } from '@cms/system-config/domain';
import { LoaderService, ConfigurationProvider, SnackBarNotificationType } from '@cms/shared/util-core';
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
  @Input() clientId : any
  @Input() clientCaseId : any
  @Input() isEdit : any
  @Output() isModalSavedClicked = new EventEmitter();
  /** Public properties **/
  //ddlGroups$ = this.clientEligibilityFacade.ddlGroups$;
  ddlStatus$ = this.lovFacade.eligibilityStatus$;
  showEligibilityStatusLoader = this.lovFacade.showLoaderOnEligibilityStatus$;
  ddlGroups$ =  this.caseFacade.ddlGroups$ ;
  disableFields: Array<string>=[];
  eligibilityPeriodForm!:FormGroup;
  currentEligibility!:any;
  eligibilityDetails!:any;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  acceptedApplication= new AcceptedApplication();
  

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
    this.loadDdlStatus();
    this.buildEligibilityPeriodForm();
    this.getCurrentEligibility();
    this.loadGroupCode();
  }

  /** Public methods **/
  onEligibilityStatusChanged(){
    this.disableFieldsByStatus( this.eligibilityPeriodForm.controls['eligibilityStatus'].value);
    this.enableAllFields();
    this.disableFormFields();

  }  
  startNewEligibility(){
    this.loaderService.show();
    this.validateForm();
    if(this.eligibilityPeriodsOverlapCheck(
      new Date(this.currentEligibility.eligibilityStartDate), 
      this.currentEligibility.eligibilityEndDate ===""?null:new Date(this.currentEligibility.eligibilityEndDate),
      this.eligibilityPeriodForm.controls['statusStartDate'].value === ""?null:  this.eligibilityPeriodForm.controls['statusStartDate'].value ,
      this.eligibilityPeriodForm.controls['statusEndDate'].value === ""? null:  this.eligibilityPeriodForm.controls['statusEndDate'].value))
      {
         this.clientEligibilityFacade.showHideSnackBar(
          SnackBarNotificationType.WARNING,
          'There cannot be two eligibility periods with overlapping date ranges.'
        );
      }
      this.acceptedApplication.clientCaseId= this.clientCaseId;
      this.acceptedApplication.clientCaseEligibilityId= this.clientCaseEligibilityId
      this.acceptedApplication.eligibilityStartDate = new Date(this.intl.formatDate(this.eligibilityPeriodForm.controls['statusStartDate'].value, this.dateFormat));
      this.acceptedApplication.eligibilityEndDate = new Date(this.intl.formatDate(this.eligibilityPeriodForm.controls['statusEndDate'].value, this.dateFormat));
      this.acceptedApplication.groupCode =  this.eligibilityPeriodForm.controls['group'].value
      this.acceptedApplication.groupCodeId = null;
      this.acceptedApplication.assignedCwUserId = null;
      this.acceptedApplication.eligibilityStatusCode = this.eligibilityPeriodForm.controls['eligibilityStatus'].value;
      this.acceptedApplication.caseStatusCode = this.currentEligibility.caseStatusCode;
      this.clientEligibilityFacade.saveNewStatusPeriod(this.acceptedApplication,this.clientCaseId,this.clientCaseEligibilityId).subscribe({
        next: (response) => {
          this.clientEligibilityFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS,"New Eligibility Periods created successfully.")
          this.loaderService.hide();
          this.isModalSavedClicked.emit(true);
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
  onModalCloseClicked() {
    this.clientEligibilityFacade.eligibilityPeriodPopupOpenSubject.next(false);
  }
  /** Private methods **/
  private getCurrentEligibility(){
    this.loaderService.show();
    this.clientEligibilityFacade.getEligibility(this.clientId,this.clientCaseId,this.clientCaseEligibilityId,EligibilityRequestType.acceptedEligibility).subscribe(data=>{
      this.currentEligibility = data;
      this.clientCaseEligibilityId = this.currentEligibility.clientCaseEligibilityId;
      if(this.isEdit){
        this.bindEligibilityToForm(this.currentEligibility);
      }     
      this.cd.detectChanges();
      this.loaderService.hide();
    });
  }
  private loadDdlStatus()
  {
    this.lovFacade.getEligibilityStatusLovs();
  }
  private loadGroupCode()
  {
    this.caseFacade.loadGroupCode();
  }
  private disableFieldsByStatus(status:string)
  {   
    let currentEligibilityEndDate=new Date(this.currentEligibility.eligibilityEndDate);
    this.eligibilityPeriodForm.controls['statusStartDate'].reset();
    this.eligibilityPeriodForm.controls['statusEndDate'].reset();
    this.eligibilityPeriodForm.controls['group'].reset();
    let today = new Date(); 
    switch(status.toUpperCase())
    {      
      case 'ACCEPT' :
        this.disableFields = []; 
        if(currentEligibilityEndDate){
          this.eligibilityPeriodForm.controls['statusStartDate'].setValue(this.addDays(currentEligibilityEndDate,1));
          this.eligibilityPeriodForm.controls['statusEndDate'].setValue(new Date(currentEligibilityEndDate.getFullYear(), currentEligibilityEndDate.getMonth()+7, 0));
        }
        else{
          this.eligibilityPeriodForm.controls['statusStartDate'].setValue(today);
          this.eligibilityPeriodForm.controls['statusEndDate'].setValue(new Date(today.getFullYear(), today.getMonth()+7, 0));
        }
        break;
      case 'INCOMPLETE':
        this.disableFields = [
          'group',
        ];
        if(currentEligibilityEndDate){
          this.eligibilityPeriodForm.controls['statusStartDate'].setValue(this.addDays(currentEligibilityEndDate,1));
          let startDateValue=this.eligibilityPeriodForm.controls['statusStartDate'].value;
          this.eligibilityPeriodForm.controls['statusEndDate'].setValue(this.addDays(startDateValue,45));
        }
        else{
          this.eligibilityPeriodForm.controls['statusStartDate'].setValue(today);
          this.eligibilityPeriodForm.controls['statusEndDate'].setValue(this.addDays(today,45));
        }
        break;
      case 'REJECT':
        this.disableFields = [
          'group',
        ]; 
        if(currentEligibilityEndDate){
          this.eligibilityPeriodForm.controls['statusStartDate'].setValue(this.addDays(currentEligibilityEndDate,1));
          this.eligibilityPeriodForm.controls['statusEndDate'].setValue(today);
        }
        break;
      case 'RESTRICTED':
          this.disableFields = [];  
          if(currentEligibilityEndDate){
            this.eligibilityPeriodForm.controls['statusStartDate'].setValue(this.addDays(currentEligibilityEndDate,1));
            let startDateValue=this.eligibilityPeriodForm.controls['statusStartDate'].value;
            this.eligibilityPeriodForm.controls['statusEndDate'].setValue(new Date(startDateValue.getFullYear(), startDateValue.getMonth()+4, 0));
          }
          else{
            this.eligibilityPeriodForm.controls['statusStartDate'].setValue(today);
            let startDateValue=this.eligibilityPeriodForm.controls['statusStartDate'].value;
            this.eligibilityPeriodForm.controls['statusEndDate'].setValue(new Date(startDateValue.getFullYear(), startDateValue.getMonth()+4, 0));
          }
      break;
      case 'DISENROLLED':
        this.disableFields = [
          'group',
        ]; 
        this.eligibilityPeriodForm.controls['statusStartDate'].setValue(today);
        this.eligibilityPeriodForm.controls['statusEndDate'].setValue(today);
        break;
      case 'WAITLIST':
        this.disableFields = [
          'statusEndDate',
          'group',
        ]; 
        this.eligibilityPeriodForm.controls['statusStartDate'].setValue(today);
        this.eligibilityPeriodForm.controls['statusEndDate'].setValue(null);
        break;     
    }
  }
  private disableFormFields() {
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
      group: [null]
    });

  }
  private eligibilityPeriodsOverlapCheck(currentStartDate: Date, currentEndDate: Date|null, newStartDate: Date, newEndDate: Date) {
    
    if (currentEndDate === null && newEndDate === null && currentStartDate === newStartDate){
     return true;
    }
    if (currentEndDate === null && currentStartDate >= newStartDate && currentStartDate <= newEndDate) {
      return true;
    }    
    if (newEndDate === null && newStartDate >= currentStartDate && currentEndDate !==null && newStartDate <= currentEndDate) {
      return true;
    }
    if (currentStartDate <= newStartDate  && currentEndDate !==null &&  newStartDate <= currentEndDate) {
      return true;
    }
    if (currentStartDate <= newEndDate  && currentEndDate !==null && newEndDate <= currentEndDate) {
      return true;
    }
    if (newStartDate < currentStartDate  && currentEndDate !==null && currentEndDate < newEndDate) {
      return true;
    }
    return false;
  }

  private addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  private validateForm(){
    this.eligibilityPeriodForm.controls['eligibilityStatus'].setValidators([Validators.required]);
    this.eligibilityPeriodForm.controls['eligibilityStatus'].updateValueAndValidity();
    let eligibilityStatusValue=this.eligibilityPeriodForm.controls['eligibilityStatus'].value;
    if(eligibilityStatusValue){
      switch(eligibilityStatusValue.toUpperCase())
      {      
        case 'ACCEPT' :
          this.setAllFieldsEligibilityValidations();
          break;
        case 'INCOMPLETE':
          this.setStartEndValidations();
          break;
        case 'REJECT':
          this.setStartEndValidations();
          break;
        case 'RESTRICTED':
          this.setAllFieldsEligibilityValidations();
        break;
        case 'DISENROLLED':
          this.setStartEndValidations();
          break;
        case 'WAITLIST':
          this.setStartDateEligibilityValidations();
          break;     
      }
    }
    else{
      this.removeValidation();
    }
  }

  setAllFieldsEligibilityValidations(){
    this.eligibilityPeriodForm.controls['statusStartDate'].setValidators([Validators.required]);
    this.eligibilityPeriodForm.controls['statusEndDate'].setValidators([Validators.required]);
    this.eligibilityPeriodForm.controls['group'].setValidators([Validators.required]);
    this.eligibilityPeriodForm.controls['statusStartDate'].updateValueAndValidity();
    this.eligibilityPeriodForm.controls['statusEndDate'].updateValueAndValidity();
    this.eligibilityPeriodForm.controls['group'].updateValueAndValidity();
  }

  setStartEndValidations(){
    this.eligibilityPeriodForm.controls['statusStartDate'].setValidators([Validators.required]);
    this.eligibilityPeriodForm.controls['statusEndDate'].setValidators([Validators.required]);
    this.eligibilityPeriodForm.controls['group'].removeValidators(Validators.required);
    this.eligibilityPeriodForm.controls['statusStartDate'].updateValueAndValidity();
    this.eligibilityPeriodForm.controls['statusEndDate'].updateValueAndValidity();
    this.eligibilityPeriodForm.controls['group'].updateValueAndValidity();
  }
  
  setStartDateEligibilityValidations(){
    this.eligibilityPeriodForm.controls['statusStartDate'].setValidators([Validators.required]);
    this.eligibilityPeriodForm.controls['statusEndDate'].removeValidators(Validators.required);
    this.eligibilityPeriodForm.controls['group'].removeValidators(Validators.required);
    this.eligibilityPeriodForm.controls['statusStartDate'].updateValueAndValidity();
    this.eligibilityPeriodForm.controls['statusEndDate'].updateValueAndValidity();
    this.eligibilityPeriodForm.controls['group'].updateValueAndValidity();
  }

  removeValidation(){
    this.eligibilityPeriodForm.controls['statusStartDate'].removeValidators([Validators.required]);
    this.eligibilityPeriodForm.controls['statusEndDate'].removeValidators(Validators.required);
    this.eligibilityPeriodForm.controls['group'].removeValidators(Validators.required);
    this.eligibilityPeriodForm.controls['statusStartDate'].updateValueAndValidity();
    this.eligibilityPeriodForm.controls['statusEndDate'].updateValueAndValidity();
    this.eligibilityPeriodForm.controls['group'].updateValueAndValidity();
  }

  updateCurrentEligibility() {
    this.setUpdateEligibilityValidations();
    if (this.eligibilityPeriodForm.valid) {
      if (this.eligibilityPeriodsOverlapCheck(
        new Date(this.currentEligibility.eligibilityStartDate),
        this.currentEligibility.eligibilityEndDate === "" ? null : new Date(this.currentEligibility.eligibilityEndDate),
        this.eligibilityPeriodForm.controls['statusStartDate'].value === "" ? null : this.eligibilityPeriodForm.controls['statusStartDate'].value,
        this.eligibilityPeriodForm.controls['statusEndDate'].value === "" ? null : this.eligibilityPeriodForm.controls['statusEndDate'].value)) {
        this.clientEligibilityFacade.showHideSnackBar(
          SnackBarNotificationType.WARNING,
          'There cannot be two eligibility periods with overlapping date ranges.'
        );
      }
      else {
        this.loaderService.show();
        let editEligibilityData = this.currentEligibility;
        editEligibilityData.eligibilityStartDate = new Date(this.intl.formatDate(this.eligibilityPeriodForm.controls['statusStartDate'].value, this.dateFormat));
        editEligibilityData.eligibilityEndDate = new Date(this.intl.formatDate(this.eligibilityPeriodForm.controls['statusEndDate'].value, this.dateFormat));
        this.clientEligibilityFacade.saveAcceptedApplication(editEligibilityData,this.clientCaseId,this.clientCaseEligibilityId,EligibilityRequestType.eligibilityStatus).subscribe({
          next: (data) => {
            this.clientEligibilityFacade.showHideSnackBar(
              SnackBarNotificationType.SUCCESS,
              'Eligibility period updated!'
            );
            this.isModalSavedClicked.emit(true);
            this.loaderService.hide();
          },
          error: (err) => {
            if (err){
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
    }

  }

  bindEligibilityToForm(currentEligibility:any){
    if(currentEligibility.eligibilityStartDate){
      this.eligibilityPeriodForm.controls['statusStartDate'].setValue(new Date(currentEligibility.eligibilityStartDate));
      this.eligibilityPeriodForm.controls['statusStartDate'].updateValueAndValidity();
    }
    if(currentEligibility.eligibilityEndDate){
      this.eligibilityPeriodForm.controls['statusEndDate'].setValue(new Date(currentEligibility.eligibilityEndDate));
      this.eligibilityPeriodForm.controls['statusEndDate'].updateValueAndValidity();
    }
  }

  setUpdateEligibilityValidations() {
    this.eligibilityPeriodForm.controls['statusStartDate'].setValidators([Validators.required]);
    this.eligibilityPeriodForm.controls['statusEndDate'].setValidators([Validators.required]);
    this.eligibilityPeriodForm.controls['statusStartDate'].updateValueAndValidity();
    this.eligibilityPeriodForm.controls['statusEndDate'].updateValueAndValidity();
  }
}
