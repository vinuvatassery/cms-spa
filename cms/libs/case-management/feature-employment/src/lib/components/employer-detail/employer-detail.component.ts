/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientEmployer, EmploymentFacade, WorkflowFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Validators, FormGroup, FormControl,} from '@angular/forms';
import { first } from 'rxjs';
import {  SnackBarNotificationType, ConfigurationProvider } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
@Component({
  selector: 'case-management-employer-detail',
  templateUrl: './employer-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerDetailComponent implements OnInit{
  public employer: ClientEmployer = new ClientEmployer();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  employmentList$ = this.employmentFacade.employers$;
  isRemoveEmployerConfirmationPopupOpened = false;
  empNameMaxValue = 100;
  employerFormSubmitted = false;
  sessionId!: string;
  clientId : any;
  clientCaseId: any;
  clientCaseEligibilityId: any;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  btnDisabled = false;
  /** Input properties **/
  @Input() isAdd = true;
  @Input() sessionClientId! : any;
  @Input() selectedEmployer: ClientEmployer = new ClientEmployer();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() addUpdateEmploymentEvent = new EventEmitter<any>();

  public empDetailsForm: FormGroup = new FormGroup({
    empName: new FormControl('', []),
    empHireDate: new FormControl('', []),
  });

  // constructor
  constructor(private readonly employmentFacade: EmploymentFacade,
    private workflowFacade: WorkflowFacade,
    private readonly router: Router,
    public intl: IntlService,
    private configurationProvider : ConfigurationProvider,
    private route: ActivatedRoute) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadCase();
    this.employer.clientCaseEligibilityId = this.clientCaseEligibilityId;
    if (this.isAdd) {
      this.empDetailsForm.reset();
      this.empDetailsForm = new FormGroup({
        empName: new FormControl( ''),
        empHireDate: new FormControl(''),
      });

    } else{
      this.loadEmployersDetails();
    }
  }
  // loading case details like session id, eligibility id , clientid and clientcaseid
  loadCase(){
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
     this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
     .subscribe((session: any) => {
      this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId
      this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId
      this.clientId =JSON.parse(session.sessionData).clientId
     });
  }
  // loading employment detail based on emploerid
  loadEmployersDetails(){
    this.employmentFacade.showLoader();
    this.employmentFacade.loadEmployersDetails(this.sessionClientId,this.selectedEmployer.clientEmployerId).subscribe({
      next: (response) => {
        this.selectedEmployer = response;
        if (this.selectedEmployer) {
          this.employer.clientEmployerId = this.selectedEmployer.clientEmployerId;
          this.employer.employerName = this.selectedEmployer.employerName;
          this.employer.clientCaseEligibilityId = this.selectedEmployer.clientCaseEligibilityId;
          this.employer.dateOfHire = new Date(this.selectedEmployer.dateOfHire);
          this.employer.concurrencyStamp = this.selectedEmployer.concurrencyStamp;
          this.empDetailsForm.controls['empName'].setValue(this.selectedEmployer.employerName);
          this.empDetailsForm.controls['empHireDate'].setValue(new Date(this.selectedEmployer.dateOfHire));
          this.empDetailsForm.controls['empName'].updateValueAndValidity();
          this.empDetailsForm.controls['empHireDate'].updateValueAndValidity();
        }
        this.employmentFacade.hideLoader();
      },
      error: (err) => {
        this.employmentFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err);
        this.employmentFacade.hideLoader();
      },
    }
    );
  }

  // submiting the employer form details
  saveEmployer() {
 this.employerFormSubmitted = true;
    this.empDetailsForm.markAllAsTouched();
    this.empDetailsForm.controls['empName'].setValidators([  Validators.required,  ]);
    this.empDetailsForm.controls['empHireDate'].setValidators([  Validators.required,  ]);
    this.empDetailsForm.controls['empName'].updateValueAndValidity();
    this.empDetailsForm.controls['empHireDate'].updateValueAndValidity();
          if (this.empDetailsForm.valid) {
            this.employer.clientEmployerId = this.selectedEmployer.clientEmployerId;
            this.employer.employerName =  this.empDetailsForm.controls['empName'].value;
            this.employer.clientCaseEligibilityId =  this.selectedEmployer.clientCaseEligibilityId;
            this.employer.dateOfHire = new Date( this.intl.formatDate(this.empDetailsForm.controls['empHireDate'].value,this.dateFormat));

            if (this.employer) {
              this.btnDisabled = true
              this.employer.clientCaseEligibilityId = this.clientCaseEligibilityId;
              this.employmentFacade.showLoader();
              this.employerFormSubmitted = false;

              if (this.isAdd) {
                this.employmentFacade.createEmployer(this.clientId,this.employer).subscribe({
                  next: (response) => {
                    this.addUpdateEmploymentEvent.next(response);
                    this.closeModal.emit(true);
                    this.employmentFacade.hideLoader();
                    this.employmentFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Employer added successfully') ;
                  },
                  error: (err) => {
                    this.btnDisabled = false
                    this.employmentFacade.hideLoader();
                    this.employmentFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err);
                  },
                });
              } else {

                this.employmentFacade.updateEmployer(this.clientId,this.employer, this.selectedEmployer.clientEmployerId).subscribe({
                  next: (response) => {
                    this.addUpdateEmploymentEvent.next(response);
                    this.employerFormSubmitted = false;
                    this.closeModal.emit(true);
                    this.employmentFacade.hideLoader();
                    this.employmentFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Employer updated successfully') ;
                  },
                  error: (err) => {
                    this.btnDisabled = false
                    this.employmentFacade.hideLoader();
                    this.employmentFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err);
                  },
                });
              }


            }
          }
  }
  // close the employer form details popup
  cancelModal() {
    this.closeModal.emit(true);
  }
  // updating the employment list after saving a new or updated record
  updateEmploymentHandle(response : any){
    this.addUpdateEmploymentEvent.next(response);
  }

  // on clicking on the remove button in edit view
  onRemoveEmployerConfirmationClicked() {
    this.isRemoveEmployerConfirmationPopupOpened = true;
  }
    // closing the remove confirmation popup
  onRemoveEmployerConfirmationClosed() {
    this.closeModal.emit(true);
    this.isRemoveEmployerConfirmationPopupOpened = false;
  }
}
