/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { EmploymentFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { ClientEmployer } from 'libs/case-management/domain/src/lib/entities/client-employer';
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
  /** Input properties **/
  @Input() isAdd = true;
  @Input() selectedEmployer: ClientEmployer = new ClientEmployer();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  constructor(private readonly employmentFacade: EmploymentFacade) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.populateForm()
  }

  populateForm() {
    if (this.selectedEmployer) {
      this.employer.id = this.selectedEmployer.id;
      this.employer.employerName = this.selectedEmployer.employerName;
      this.employer.clientCaseEligibilityId = this.selectedEmployer.clientCaseEligibilityId;
      this.employer.dateOfHire = new Date(this.selectedEmployer.dateOfHire)
    }
  }

  saveEmployer() {
    if (this.employer) {
      if (this.isAdd) {
        this.employer.clientCaseEligibilityId = '17A142D4-9D2E-4F66-82A1-234D33D3D5D0'
        this.employmentFacade.createEmployer(this.employer).subscribe(
          {
            next: (response) => {
              this.employmentFacade.loadEmployers();
              this.closeModal.emit(true);
            },
            error: (err) => {
              console.error('err', err);
            },
          }
        );
      }
      else {
        this.employmentFacade.updateEmployer(this.employer).subscribe({
          next: (response) => {
            this.employmentFacade.loadEmployers();
            this.closeModal.emit(true);
          },
          error: (err) => {
            console.error('err', err);
          },
        });
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
