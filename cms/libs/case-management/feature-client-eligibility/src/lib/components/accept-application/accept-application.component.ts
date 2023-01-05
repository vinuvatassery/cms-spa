/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy,Input,Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
/** Facades **/
import { ClientEligibilityFacade, AcceptedApplication, GroupCode, CaseStatusCode, UserDefaultRoles } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { LovFacade,UserManagementFacade } from '@cms/system-config/domain';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService, SnackBarNotificationType,ConfigurationProvider } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';




@Component({
  selector: 'case-management-accept-application',
  templateUrl: './accept-application.component.html',
  styleUrls: ['./accept-application.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptApplicationComponent implements OnInit {

  public formUiStyle : UIFormStyle = new UIFormStyle();
  /** Public properties **/
  caseOwner:any
  caseOwnersObject! : any
  ddlAcceptApplications$ = this.clientEligibilityFacade.ddlAcceptApplications$;
  caseStatusList$ = this.lovFacade.caseStatusLov$;
  groupList$ = this.lovFacade.groupLov$;
  eligibilityForm!: FormGroup;
  acceptedApplication= new AcceptedApplication();
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  caseOwners$ = this.loginUserFacade.usersByRole$;
  isSave= false;
  @Input() clientCaseId: string = '';
  @Input() clientCaseEligibilityId: string = '';

  /** Constructor **/
  constructor(
    private readonly clientEligibilityFacade: ClientEligibilityFacade,
    private lovFacade: LovFacade,
    private formBuilder: FormBuilder,
    public intl: IntlService,
    private readonly loaderService: LoaderService,
    private configurationProvider : ConfigurationProvider,
    private readonly loginUserFacade : UserManagementFacade,
    private router: Router
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.buildForm();
    this.loadDdlAcceptApplications();
    this.loadLovs();
    this.loaddata();
  }

  /** Private methods **/
  private loadDdlAcceptApplications() {
    this.clientEligibilityFacade.loadDdlAcceptApplications();
  }
  private loadLovs()
  {
    this.lovFacade.getCaseStatusLovs();
    this.lovFacade.getGroupLovs();
    this.loginUserFacade.getUsersByRole(UserDefaultRoles.CACaseWorker);
  }
  private buildForm() {
    this.eligibilityForm = this.formBuilder.group({
      caseStatusCode: ['', Validators.required],
      groupCode: ['', Validators.required],
      eligibilityStartDate: ['', Validators.required],
      eligibilityEndDate: ['', Validators.required],
      assignedCwUser:['']
    });

  }
  save()
  {
    this.isSave = true
    if (this.eligibilityForm.valid) {
      this.populateEligibility();
      this.loaderService.show();
    this.clientEligibilityFacade.saveAcceptedApplication(this.acceptedApplication).subscribe({
      next: (data) => {
        this.clientEligibilityFacade.ShowHideSnackBar(
          SnackBarNotificationType.SUCCESS,
          'Eligibility added successfully.'
        );
        this.loaderService.hide();
        this.router.navigate(['/case-management/case-detail/application-eligibility/send-letter'], {
          // queryParams: {
          //   sid: sessionResp?.workflowSessionId,
          //   eid: sessionData?.entityId
          // },
        });
      },
      error: (err) => {
        if (err){
          this.loaderService.hide();
          this.clientEligibilityFacade.ShowHideSnackBar(
            SnackBarNotificationType.ERROR,
            err
          );
        }
      },
    });
    }
  }
  populateEligibility()
  {
    this.acceptedApplication.clientCaseId = this.clientCaseId;
    this.acceptedApplication.clientCaseEligibilityId = this.clientCaseEligibilityId;
    this.acceptedApplication.groupCode = this.eligibilityForm.controls['groupCode'].value;
    this.acceptedApplication.caseStatusCode = this.eligibilityForm.controls['caseStatusCode'].value;
    this.acceptedApplication.eligibilityStartDate = new Date(this.intl.formatDate(this.eligibilityForm.controls['eligibilityStartDate'].value,this.dateFormat));
    this.acceptedApplication.eligibilityEndDate = new Date(this.intl.formatDate(this.eligibilityForm.controls['eligibilityEndDate'].value,this.dateFormat));
    this.acceptedApplication.assignedCwUserId = null;
  }
  startDateOnChange(startDate:Date)
  {
    if( this.eligibilityForm.controls['eligibilityEndDate'].value !==null){
      var endDate = this.intl.parseDate(
        Intl.DateTimeFormat('en-US').format(
          this.eligibilityForm.controls['eligibilityEndDate'].value
        )
      );
     if (startDate > endDate) {
         this.eligibilityForm.controls['eligibilityEndDate'].setValue(null);
       }

    }
    this.assignEnddate();
  }

  assignEnddate()
  {
    if(this.eligibilityForm.controls['groupCode'].value !== GroupCode.BRIDGE && this.eligibilityForm.controls['caseStatusCode'].value === CaseStatusCode.ACCEPT )
    {
      if(this.eligibilityForm.controls['eligibilityStartDate'].value)
      {
        const startdate = new Date(this.intl.formatDate(this.eligibilityForm.controls['eligibilityStartDate'].value,this.dateFormat));
        let enddate = startdate.setMonth(startdate.getMonth() + 6);
        this.eligibilityForm.controls['eligibilityEndDate'].setValue(new Date(enddate));
      }
    }
    else if (this.eligibilityForm.controls['groupCode'].value === GroupCode.BRIDGE)
    {
      if(this.eligibilityForm.controls['eligibilityStartDate'].value)
      {
        const startdate = new Date(this.intl.formatDate(this.eligibilityForm.controls['eligibilityStartDate'].value,this.dateFormat));
        let enddate = startdate.setDate(startdate.getDate() + 30);
        this.eligibilityForm.controls['eligibilityEndDate'].setValue(new Date(enddate));
      }
    }
  }
  loaddata()
  {
    this.loaderService.show();
    this.clientEligibilityFacade.getAcceptedApplication(this.clientCaseId,this.clientCaseEligibilityId).subscribe({
      next: (data:any) => {
        this.acceptedApplication.assignedCwUserId = data.assignedCwUserId;
        this.getCaseOwners();
        this.loaderService.hide();
      },
      error: (err) => {
        if (err){
          this.loaderService.hide();
          this.clientEligibilityFacade.ShowHideSnackBar(
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
}
