/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {
  Validators,
  FormGroup,
  FormControl,
  FormBuilder,
} from '@angular/forms';
import { SnackBar } from '@cms/shared/ui-common';
import { Subject } from 'rxjs';
@Component({
  selector: 'case-management-employer-detail',
  templateUrl: './employer-detail.component.html',
  styleUrls: ['./employer-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerDetailComponent {
  /** Input properties **/
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Input() isAdd = true;
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  snackbar$ = this.snackbarSubject.asObservable();
  @Output() sendDetailToEmpList = new EventEmitter<boolean>();
  isEmpoyerDetailsPopupOpen = false;
  @Output() employerSubmitedDetails = new EventEmitter<{
    empName: string;
    empHireDate: string;
  }>();

  empNameMaxValue = 100;
  public empDetailsForm: FormGroup = new FormGroup({
    empName: new FormControl('', []),
    empHireDate: new FormControl('', []),
  });

  public submitEmpDetailsForm(): void {
    this.empDetailsForm.markAllAsTouched();
    console.log(this.empDetailsForm);
    this.empDetailsForm.controls['empName'].setValidators([
      Validators.required,
    ]);
    this.empDetailsForm.controls['empHireDate'].setValidators([
      Validators.required,
    ]);
    this.empDetailsForm.controls['empName'].updateValueAndValidity();
    this.empDetailsForm.controls['empHireDate'].updateValueAndValidity();
    // this.onDoneClicked();
    if (this.empDetailsForm.valid) {
      this.sendDetailToEmpList.emit(this.isEmpoyerDetailsPopupOpen);
      this.employerSubmitedDetails.emit({
        empName: this.empDetailsForm.controls['empName'].value ?? '',
        empHireDate: this.empDetailsForm.controls['empHireDate'].value ?? '',
      });
      const snackbarMessage: SnackBar = {
        title: 'Success!',
        subtitle: 'Employer Successfully Added.',
        type: 'success',
      };
      this.snackbarSubject.next(snackbarMessage);
    }
  }

  public closeEmpDetailPoup(): void {
    this.empDetailsForm.reset();
    this.sendDetailToEmpList.emit(this.isEmpoyerDetailsPopupOpen);
  }
}
