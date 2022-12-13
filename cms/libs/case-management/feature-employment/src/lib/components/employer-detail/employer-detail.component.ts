/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientEmployer, EmploymentFacade, WorkflowFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import { Validators, FormGroup, FormControl,} from '@angular/forms';
import { SnackBar } from '@cms/shared/ui-common';
import { first, Subject } from 'rxjs';
import { LoaderService } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-employer-detail',
  templateUrl: './employer-detail.component.html',
  styleUrls: ['./employer-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerDetailComponent implements OnInit{
  public employer: ClientEmployer = new ClientEmployer();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  employmentList$ = this.employmentFacade.employers$;
  isRemoveEmployerConfirmationPopupOpened = false;
  empNameMaxValue = 100;
  public currentDate=  new Date;
  public date = new Date();
  public now_utc = Date.UTC(this.date.getUTCFullYear(), this.date.getUTCMonth(),
  this.date.getUTCDate(), this.date.getUTCHours(),
  this.date.getUTCMinutes(), this.date.getUTCSeconds());
  employerFormSubmitted = false;
  sessionId!: string;
  clientId : any;
  clientCaseId: any;
  clientCaseEligibilityId: any;
  /** Input properties **/
  @Input() isAdd = true;
  @Input() selectedEmployer: ClientEmployer = new ClientEmployer();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() addUpdateEmploymentEvent = new EventEmitter<any>();

  public empDetailsForm: FormGroup = new FormGroup({
    empName: new FormControl('', []),
    empHireDate: new FormControl(new Date(), []),
  });

  // Snackbar declaration
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  snackbar$ = this.snackbarSubject.asObservable();
  handleSnackBar(title : string , subtitle : string ,type : string )
  {    
    const snackbarMessage: SnackBar = {
      title: title,
      subtitle: subtitle,
      type: type,
    };
    this.snackbarSubject.next(snackbarMessage);
  }

  // constructor
  constructor(private readonly employmentFacade: EmploymentFacade, 
    private workflowFacade: WorkflowFacade,
    private readonly router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadCase();
    this.employer.clientCaseEligibilityId = this.clientCaseEligibilityId;
    if (this.isAdd) {
      this.empDetailsForm.reset();
      this.empDetailsForm = new FormGroup({
        empName: new FormControl( ''),
        empHireDate: new FormControl(new Date()),
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
    this.employmentFacade.loadEmployersDetails(this.selectedEmployer.clientCaseEligibilityId, this.selectedEmployer.clientEmployerId ).subscribe({
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
      },
      error: (err) => {
        this.handleSnackBar( err.code + ' / ' + err.name ,err.message,'error');   
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
 
 if(this.empDetailsForm.controls['empHireDate'].value <= new Date()){
 

          if (this.empDetailsForm.valid) {
            this.employer.clientEmployerId = this.selectedEmployer.clientEmployerId;
            this.employer.employerName =  this.empDetailsForm.controls['empName'].value;
            this.employer.clientCaseEligibilityId =  this.selectedEmployer.clientCaseEligibilityId;
            let dateOfHire = new Date(this.empDetailsForm.controls['empHireDate'].value);
            this.employer.dateOfHire = new Date(this.empDetailsForm.controls['empHireDate'].value);
          
            if (this.employer) {
              this.employer.clientCaseEligibilityId = this.clientCaseEligibilityId;
              this.loaderService.show();
              this.employerFormSubmitted = false;

              if (this.isAdd) {
                this.employmentFacade.createEmployer(this.employer).subscribe({
                  next: (response) => { 
                    this.addUpdateEmploymentEvent.next(response);  
                    this.closeModal.emit(true);
                    this.loaderService.hide();
                    this.handleSnackBar('Success' ,'Employer Successfully added','success');    
                  },
                  error: (err) => { 
                    this.loaderService.hide();
                    this.handleSnackBar( err.code + ' / ' + err.name ,err.message,'error');   
                  },
                });
              } else {
                this.employer.dateOfHire = new Date(
                  dateOfHire.getUTCFullYear(),
                  dateOfHire.getUTCMonth() ,
                  dateOfHire.getUTCDate() + 1,
                  dateOfHire.getUTCHours(),
                  dateOfHire.getUTCMinutes(),
                  dateOfHire.getUTCSeconds()
                );
                this.employmentFacade.updateEmployer(this.employer).subscribe({
                  next: (response) => { 
                    this.addUpdateEmploymentEvent.next(response); 
                    this.employerFormSubmitted = false; 
                    this.closeModal.emit(true);            
                    this.loaderService.hide();
                    this.handleSnackBar('Success' ,'Employer Successfully added','success') ; 
                  },
                  error: (err) => {
                    this.loaderService.hide(); 
                    this.handleSnackBar( err.code + ' / ' + err.name ,err.message,'error');  
                  },
                });
              }
        

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
