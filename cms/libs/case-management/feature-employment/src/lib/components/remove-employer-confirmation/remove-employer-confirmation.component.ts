/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { EmploymentFacade } from '@cms/case-management/domain';
import { ClientEmployer } from 'libs/case-management/domain/src/lib/entities/client-employer';
import { SnackBar } from '@cms/shared/ui-common';
import { Subject } from 'rxjs';
@Component({
  selector: 'case-management-remove-employer-confirmation',
  templateUrl: './remove-employer-confirmation.component.html',
  styleUrls: ['./remove-employer-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveEmployerConfirmationComponent {
  /** Public properties **/
  @Input() selectedEmployer: ClientEmployer = new ClientEmployer();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  snackbar$ = this.snackbarSubject.asObservable();
  /** Constructor **/
  constructor(private readonly employmentFacade: EmploymentFacade) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
  }

  /** Internal event methods **/
  onRemoveEmployerConfirmationClosed() {
    this.closeModal.emit(true);
  }

  removeEmployer() {
    this.selectedEmployer.clientCaseEligibilityId =
    '2FC20F89-460B-4BED-8321-681A21DA912D';
    if (this.selectedEmployer) {
      this.employmentFacade.deleteEmployer(this.selectedEmployer.clientCaseEligibilityId, this.selectedEmployer.clientEmployerId ).subscribe({
        next: (response) => {
          this.employmentFacade.loadEmployers();
          this.onRemoveEmployerConfirmationClosed();
          const snackbarMessage: SnackBar = {
            title: 'Sucess',
            subtitle: 'Employer Successfully Removed',
            type: 'info',
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
      }
      );
    }
  }
}
