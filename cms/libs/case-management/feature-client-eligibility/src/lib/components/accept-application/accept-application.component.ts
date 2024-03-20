/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy,Input,Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
/** Facades **/
import { ClientEligibilityFacade, AcceptedApplication, GroupCode, CaseStatusCode, EligibilityRequestType, CaseFacade, WorkflowFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { LovFacade, UserManagementFacade, UserDefaultRoles } from '@cms/system-config/domain';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService, SnackBarNotificationType,ConfigurationProvider } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { Subscription } from 'rxjs';
import { StatusFlag } from '@cms/shared/ui-common';

@Component({
  selector: 'case-management-accept-application',
  templateUrl: './accept-application.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptApplicationComponent implements OnInit, OnDestroy {

  public formUiStyle : UIFormStyle = new UIFormStyle();
  /** Public properties **/
  buttonText: string = ' Initiate Benefits';
  caseOwner:any
  caseOwnersObject! : any
  ddlAcceptApplications$ = this.clientEligibilityFacade.ddlAcceptApplications$;
  caseStatusList$ = this.lovFacade.caseStatusLov$;
  groupList$ = this.caseFacade.ddlGroups$;
  eligibilityForm!: FormGroup;
  acceptedApplication= new AcceptedApplication();
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  caseOwners$ = this.loginUserFacade.usersByRole$;
  groupCodes!: any[];
  groupCodesSubscription = new Subscription();
  @Input() clientId: string = '';
  @Input() clientCaseId: string = '';
  @Input() clientCaseEligibilityId: string = '';
  @Output() isCloseModalEvent = new EventEmitter();
  @Input() isEdit!: boolean;
  @Input() isCerForm!: boolean;
  btnDisabled = false;
  dayOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
  };

  /** Constructor **/
  constructor(
    private readonly clientEligibilityFacade: ClientEligibilityFacade,
    private readonly caseFacade: CaseFacade,
    private readonly lovFacade: LovFacade,
    private readonly formBuilder: FormBuilder,
    public readonly intl: IntlService,
    private readonly loaderService: LoaderService,
    private readonly configurationProvider : ConfigurationProvider,
    private readonly loginUserFacade : UserManagementFacade,
    private readonly router: Router,
    private readonly workflowFacade: WorkflowFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    if (this.isCerForm){
      this.buttonText = "RENEW ELIGIBILITY";
    }
    if (this.isEdit)
    {
      this.buttonText = "Update";
    }
    this.buildForm();
    this.loadDdlAcceptApplications();
    this.loadLovs();
    this.loaddata();
    this.setGroupCodes();
  }

  ngOnDestroy(): void {
    this.groupCodesSubscription.unsubscribe();
  }

  /** Private methods **/
  private loadDdlAcceptApplications() {
    this.clientEligibilityFacade.loadDdlAcceptApplications();
  }

  private setGroupCodes(){
    this.groupCodesSubscription =  this.groupList$.subscribe((groups: any)=>{
      this.groupCodes = groups;
    });
  }

  private loadLovs()
  {
    this.lovFacade.getCaseStatusLovs();
    this.caseFacade.loadGroupCode();
    this.loginUserFacade.getUsersByRole(UserDefaultRoles.CACaseWorker);
  }
  private buildForm() {
    const now = !this.isEdit? new Date(): '';
    this.eligibilityForm = this.formBuilder.group({
      caseStatusCode: [''],
      groupCode: [''],
      eligibilityStartDate: [now],
      eligibilityEndDate: [''],
      assignedCwUser:[{value:'', disabled: true}]
    });

    this.eligibilityForm.controls['caseStatusCode'].setValue(CaseStatusCode.accept);

  }
  save()
  {
    this.setValidators();
    if (this.eligibilityForm.valid) {
      this.populateEligibility();
      this.loaderService.show();
      this.btnDisabled = true
    this.clientEligibilityFacade.saveAcceptedApplication(this.acceptedApplication,this.clientCaseId,this.clientCaseEligibilityId,EligibilityRequestType.acceptedEligibility).subscribe({
      next: (data) => {
        if(!this.isEdit)
        {
          this.clientEligibilityFacade.showHideSnackBar(
            SnackBarNotificationType.SUCCESS,
            'Eligibility added successfully.'
          );
          this.loaderService.hide();
          this.workflowFacade.sendLetterEmailFlag = StatusFlag.Yes;
          this.workflowFacade.caseStatus = CaseStatusCode.accept;
          this.router.navigate(['/case-management/case-detail/application-review/send-letter'], {
            queryParamsHandling: "preserve"
          });
        }
        else
        {
          this.clientEligibilityFacade.showHideSnackBar(
            SnackBarNotificationType.SUCCESS,
            'Eligibility updated successfully.'
          );
          this.loaderService.hide();
          this.onCancel();
        }
        this.caseFacade.loadActiveSession();
      },
      error: (err) => {
        if (err){
          this.btnDisabled = false
          this.loaderService.hide();
          this.clientEligibilityFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            err
          );
        }
      },
    });
    }
  }
  setValidators()
  {
    this.eligibilityForm.markAllAsTouched();
    this.eligibilityForm.controls['caseStatusCode'].setValidators([Validators.required,]);
    this.eligibilityForm.controls['groupCode'].setValidators([Validators.required,]);
    this.eligibilityForm.controls['eligibilityStartDate'].setValidators([Validators.required,]);
    this.eligibilityForm.controls['eligibilityEndDate'].setValidators([Validators.required,]);
    this.eligibilityForm.controls['caseStatusCode'].updateValueAndValidity();
    this.eligibilityForm.controls['groupCode'].updateValueAndValidity();
    this.eligibilityForm.controls['eligibilityStartDate'].updateValueAndValidity();
  }
  populateEligibility()
  {
    this.acceptedApplication.clientCaseId = this.clientCaseId;
    this.acceptedApplication.clientCaseEligibilityId = this.clientCaseEligibilityId;
    this.acceptedApplication.groupCode = this.eligibilityForm.controls['groupCode'].value;
    this.acceptedApplication.groupCodeId = this.eligibilityForm.controls['groupCode'].value;
    this.acceptedApplication.caseStatusCode = this.eligibilityForm.controls['caseStatusCode'].value;
    this.acceptedApplication.eligibilityStatusCode = this.eligibilityForm.controls['caseStatusCode'].value;
    this.acceptedApplication.eligibilityStartDate = new Date(this.intl.formatDate(this.eligibilityForm.controls['eligibilityStartDate'].value,this.dateFormat));
    this.acceptedApplication.eligibilityEndDate = new Date(this.intl.formatDate(this.eligibilityForm.controls['eligibilityEndDate'].value,this.dateFormat));
    this.acceptedApplication.assignedCwUserId = null;
  }
  startDateOnChange(startDate:Date)
  {
    if( this.eligibilityForm.controls['eligibilityEndDate'].value !==null){
      const endDate=this.eligibilityForm.controls['eligibilityEndDate'].value;

     if (startDate > endDate) {
         this.dateValidate();
       }
     else
      {
        this.eligibilityForm.controls['eligibilityEndDate'].updateValueAndValidity();
      }

    }
    this.assignEnddate();

  }

  assignEnddate()
  {
    const bridgeGroupCodeId = this.groupCodes.find(i => i.groupCode === GroupCode.BRIDGE)?.groupCodeId;
    if(this.eligibilityForm.controls['groupCode'].value !== bridgeGroupCodeId && this.eligibilityForm.controls['caseStatusCode'].value === CaseStatusCode.accept )
    {
      if(this.eligibilityForm.controls['eligibilityStartDate'].value)
      {
        const startdate = new Date(this.eligibilityForm.controls['eligibilityStartDate'].value);
        let today = this.getDay(startdate, 'en-US', this.dayOptions);
        let enddate = startdate.setMonth(startdate.getMonth() + 6);
        let endDateValue = new Date(enddate);
        if (today == "1")
        {
          endDateValue.setDate(endDateValue.getDate() - 1);
          this.eligibilityForm.controls['eligibilityEndDate'].setValue(new Date(endDateValue));
        }
        else
        {
          const newEndDateValue = new Date(endDateValue.getFullYear(), endDateValue.getMonth() + 1, 0)
          this.eligibilityForm.controls['eligibilityEndDate'].setValue(new Date(newEndDateValue));
        }
      }

    }
    else if (this.eligibilityForm.controls['groupCode'].value === bridgeGroupCodeId)
    {
      if(this.eligibilityForm.controls['eligibilityStartDate'].value)
      {
        const startdate = new Date(this.eligibilityForm.controls['eligibilityStartDate'].value);
        let enddate = startdate.setDate(startdate.getDate() + 30);
        this.eligibilityForm.controls['eligibilityEndDate'].setValue(new Date(enddate));
      }
    }
  }
  loaddata()
  {
    this.loaderService.show();
    this.clientEligibilityFacade.getEligibility(this.clientId,this.clientCaseId,this.clientCaseEligibilityId,EligibilityRequestType.acceptedEligibility).subscribe({
      next: (data:any) => {
        if(!this.isEdit)
        {
          this.acceptedApplication.assignedCwUserId = data.assignedCwUserId;
        }
        else
        {
          this.acceptedApplication.assignedCwUserId = data.assignedCwUserId;
          this.bindValues(data);
        }

        this.getCaseOwners();
        this.loaderService.hide();
      },
      error: (err) => {
        if (err){
          this.loaderService.hide();
          this.clientEligibilityFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            err
          );
        }
      },
    });

  }
  getCaseOwners()
  {
    this.caseOwners$.pipe()
    .subscribe((Owners: any[]) => {
      this.caseOwnersObject = [...Owners];
      this.caseOwner = this.caseOwnersObject.find((item:any) => item.loginUserId === this.acceptedApplication.assignedCwUserId);
      if(this.caseOwner != null)
      {
        this.eligibilityForm.controls['assignedCwUser'].setValue(this.caseOwner.fullName);
      }
    });
  }

  onCancel()
  {
    this.isCloseModalEvent.emit();
  }
  bindValues(acceptedApplication: AcceptedApplication)
  {
    this.eligibilityForm.controls['caseStatusCode'].setValue(
      acceptedApplication.caseStatusCode
    );
    this.eligibilityForm.controls['groupCode'].setValue(
      acceptedApplication.groupCodeId
    );
    this.eligibilityForm.controls['eligibilityStartDate'].setValue(
      new Date (acceptedApplication.eligibilityStartDate)
    );
    this.eligibilityForm.controls['eligibilityEndDate'].setValue(
      new Date(acceptedApplication.eligibilityEndDate)
    );
  }
  dateValidate()
  {
    const endDate=this.eligibilityForm.controls['eligibilityEndDate'].value;
    const startDate= this.eligibilityForm.controls['eligibilityStartDate'].value;
    if(endDate<=startDate && this.eligibilityForm.controls['eligibilityEndDate'].value ){
      this.eligibilityForm.controls['eligibilityEndDate'].setErrors({'incorrect':true})
    }
  }
  private getDay(date: Date, locale: string, options?: Intl.DateTimeFormatOptions): string {
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date);
  }


}
