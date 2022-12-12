/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ClientEmployer, EmploymentFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import {
  Validators,
  FormGroup,
  FormControl,
 
} from '@angular/forms';
import { SnackBar } from '@cms/shared/ui-common';
import { Subject } from 'rxjs';
import { LoaderService } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-employer-detail',
  templateUrl: './employer-detail.component.html',
  styleUrls: ['./employer-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerDetailComponent {
  employmentList$ = this.employmentFacade.employers$;
  isRemoveEmployerConfirmationPopupOpened = false;
  employer: ClientEmployer = new ClientEmployer();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  empNameMaxValue = 100;
  clientCaseEligibilityId = 'B7D1A86D-833E-4981-8957-6A189F0FC846'
  /** Input properties **/
  @Input() isAdd = true;
  @Input() selectedEmployer: ClientEmployer = new ClientEmployer();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() addUpdateEmploymentEvent = new EventEmitter<any>();

  public empDetailsForm: FormGroup = new FormGroup({
    empName: new FormControl('', []),
    empHireDate: new FormControl(new Date(), []),
  });
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
  constructor(private readonly employmentFacade: EmploymentFacade, 
    private loaderService: LoaderService) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
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
          this.empDetailsForm.controls['empHireDate'].setValue(this.selectedEmployer.dateOfHire);
          this.empDetailsForm.controls['empName'].updateValueAndValidity();
          this.empDetailsForm.controls['empHireDate'].updateValueAndValidity();
        }
      },
      error: (err) => {
      
      },
    }
    );
  }
 

  saveEmployer() {
    this.empDetailsForm.markAllAsTouched();
    this.empDetailsForm.controls['empName'].setValidators([  Validators.required,  ]);
    this.empDetailsForm.controls['empHireDate'].setValidators([  Validators.required,  ]);
    this.empDetailsForm.controls['empName'].updateValueAndValidity();
    this.empDetailsForm.controls['empHireDate'].updateValueAndValidity();

    if (this.empDetailsForm.valid) {
      this.employer.clientEmployerId = this.selectedEmployer.clientEmployerId;
      this.employer.employerName =
        this.empDetailsForm.controls['empName'].value;
      this.employer.clientCaseEligibilityId =
        this.selectedEmployer.clientCaseEligibilityId;
      this.employer.dateOfHire =
        this.empDetailsForm.controls['empHireDate'].value;
      if (this.employer) {
        this.employer.clientCaseEligibilityId = this.clientCaseEligibilityId;
        this.loaderService.show();
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
          this.employmentFacade.updateEmployer(this.employer).subscribe({
            next: (response) => { 
              this.addUpdateEmploymentEvent.next(response);  
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

  cancelModal() {
    this.closeModal.emit(true);
  }

  onRemoveEmployerConfirmationClicked() {
    this.isRemoveEmployerConfirmationPopupOpened = true;
  }
  updateEmploymentHandle(response : any){
    this.addUpdateEmploymentEvent.next(response);  
  }
  onRemoveEmployerConfirmationClosed() {
    this.closeModal.emit(true);
    this.isRemoveEmployerConfirmationPopupOpened = false;
  }
}
