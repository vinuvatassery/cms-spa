/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { EmploymentFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ClientEmployer } from 'libs/case-management/domain/src/lib/entities/client-employer';
import {
  Validators,
  FormGroup,
  FormControl,
  FormBuilder,
} from '@angular/forms';
import { SnackBar } from '@cms/shared/ui-common';
import { Subject } from 'rxjs';
import { json } from 'stream/consumers';

@Component({
  selector: 'case-management-employer-detail',
  templateUrl: './employer-detail.component.html',
  styleUrls: ['./employer-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerDetailComponent {
  isRemoveEmployerConfirmationPopupOpened = false;
  employer: ClientEmployer = new ClientEmployer();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  empNameMaxValue = 100;
  clientCaseEligibilityId = '2FC20F89-460B-4BED-8321-681A21DA912D'
  /** Input properties **/
  @Input() isAdd = true;
  @Input() selectedEmployer: ClientEmployer = new ClientEmployer();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  public empDetailsForm: FormGroup = new FormGroup({
    empName: new FormControl('', []),
    empHireDate: new FormControl(new Date(), []),
  });
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  snackbar$ = this.snackbarSubject.asObservable();
  constructor(private readonly employmentFacade: EmploymentFacade) {}

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
        console.error('err', err);
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
        if (this.isAdd) {
          this.employmentFacade.createEmployer(this.employer).subscribe({
            next: (response) => {
              console.log(response);
              this.employmentFacade.loadEmployers();
              this.closeModal.emit(true);
              const snackbarMessage: SnackBar = {
                title: 'Sucess',
                subtitle: 'Employer Successfully added',
                type: 'success',
              };
              this.snackbarSubject.next(snackbarMessage);
            },
            error: (err) => {
              console.error('err', err);
              const snackbarMessage: SnackBar = {
                title: err.code + ' / ' + err.name,
                subtitle: err.message,
                type: 'error',
              };
              this.snackbarSubject.next(snackbarMessage);
            },
          });
        } else {
          this.employmentFacade.updateEmployer(this.employer).subscribe({
            next: (response) => {
              console.log(response);
              this.employmentFacade.loadEmployers();
              this.closeModal.emit(true);
              const snackbarMessage: SnackBar = {
                title: 'Sucess',
                subtitle: 'Employer Successfully added',
                type: 'success',
              };
              this.snackbarSubject.next(snackbarMessage);
            },
            error: (err) => {
              console.error('err', err);
              const snackbarMessage: SnackBar = {
                title: err.code + ' / ' + err.name,
                subtitle: err.message,
                type: 'error',
              };
              this.snackbarSubject.next(snackbarMessage);
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

  onRemoveEmployerConfirmationClosed() {
    this.closeModal.emit(true);
    this.isRemoveEmployerConfirmationPopupOpened = false;
  }
}
