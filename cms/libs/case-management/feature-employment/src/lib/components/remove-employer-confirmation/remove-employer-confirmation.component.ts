/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { EmploymentFacade } from '@cms/case-management/domain';
import { ClientEmployer } from 'libs/case-management/domain/src/lib/entities/client-employer';

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
    if (this.selectedEmployer) {
      this.employmentFacade.deleteEmployer(this.selectedEmployer.id).subscribe({
        next: (response) => {
          this.employmentFacade.loadEmployers();
          this.onRemoveEmployerConfirmationClosed();
        },
        error: (err) => {
          console.error('err', err);
        },
      }
      );
    }
  }
}
