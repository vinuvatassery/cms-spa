/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/** Facades **/
import { ClientEligibilityFacade, EligibilityRequestType, AcceptedApplication } from '@cms/case-management/domain';
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

  /** Public properties **/
  //ddlGroups$ = this.clientEligibilityFacade.ddlGroups$;
  ddlStatus$ = this.lovFacade.eligibilityStatus$;
  showEligibilityStatusLoader = this.lovFacade.showLoaderOnEligibilityStatus$;
  ddlGroups$ =  this.lovFacade.groupLov$ ;
  disableFields: Array<string>=[];
  eligibilityPeriodForm!:FormGroup;
  currentEligibility!:any;
  eligibilityDetails!:any;
  isCurrentEligibilityPending:boolean=false;
  pageLoaded:boolean=false;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  acceptedApplication= new AcceptedApplication();
  

  /** Constructor **/
  constructor(
    private readonly clientEligibilityFacade: ClientEligibilityFacade, 
    private readonly lovFacade: LovFacade,
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
        
      }
      this.acceptedApplication.clientCaseId= this.clientCaseId;
      this.acceptedApplication.clientCaseEligibilityId= this.clientCaseEligibilityId
      this.acceptedApplication.eligibilityStartDate = new Date(this.intl.formatDate(this.eligibilityPeriodForm.controls['statusStartDate'].value, this.dateFormat));
      this.acceptedApplication.eligibilityEndDate = new Date(this.intl.formatDate(this.eligibilityPeriodForm.controls['statusEndDate'].value, this.dateFormat));
      this.acceptedApplication.groupCode =  this.eligibilityPeriodForm.controls['group'].value
      this.acceptedApplication.assignedCwUserId = null;
      this.acceptedApplication.eligibilityStatusCode = this.eligibilityPeriodForm.controls['eligibilityStatus'].value;
      this.acceptedApplication.caseStatusCode = this.currentEligibility.caseStatusCode;
      this.clientEligibilityFacade.saveNewStatusPeriod(this.acceptedApplication,this.clientCaseId,this.clientCaseEligibilityId).subscribe({
        next: (response) => {
          this.clientEligibilityFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS,"New Eligibility Periods created successfully.")
          this.loaderService.hide();
          this.clientEligibilityFacade.eligibilityPeriodPopupOpenSubject.next(false);
        },
        error: (err) => {
          this.loaderService.hide();
          this.clientEligibilityFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            err
          );
          this.clientEligibilityFacade.eligibilityPeriodPopupOpenSubject.next(false);
        },
      });
  }
  onModalCloseClicked() {
    this.pageLoaded = false;
    this.clientEligibilityFacade.eligibilityPeriodPopupOpenSubject.next(false);
  }
  /** Private methods **/
  private getCurrentEligibility(){
    this.loaderService.show();
    this.clientEligibilityFacade.getEligibility(this.clientId,this.clientCaseId,this.clientCaseEligibilityId,EligibilityRequestType.eligibilityStatus).subscribe(data=>{
      this.pageLoaded =  true;
      this.eligibilityDetails = data;
      this.currentEligibility = this.eligibilityDetails[0];
      if( this.currentEligibility.eligibilityStatusCode === 'PENDING'){
        this.isCurrentEligibilityPending = true;
      }
      this.cd.detectChanges();
      this.loaderService.hide()
    });
  }
  private loadDdlStatus()
  {
    this.lovFacade.getEligibilityStatusLovs();
  }
  private loadGroupCode()
  {
    this.lovFacade.getGroupLovs();
  }
  private disableFieldsByStatus(status:string)
  {   
    switch(status.toUpperCase())
    {      
      case 'ACCEPT' :
      case  'RESTRICTED':
        this.disableFields = [];  
        break;
      case 'INELIGIBLE':
      case 'INCOMPLETE':
      case 'REJECT':
      case 'DISENROLLED':
        this.disableFields = [
          'group',
        ]; 
        break;
      case 'PENDING':
      case 'WAITLIST':
        this.disableFields = [
          'statusEndDate',
          'group',
        ]; 
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
      eligibilityStatus: [''],
      statusStartDate: [''],
      statusEndDate: [''],
      group: ['']
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
  private validateForm(){

  }

  
}
