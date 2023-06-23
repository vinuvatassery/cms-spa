/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'case-management-disenrollment-letter-later',
  templateUrl: './disenrollment-letter-later.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisEnrollmentLaterComponent {
  @Input() clientId: any;
  @Output() closeLetterModalEvent = new EventEmitter();
  constructor(private readonly router: Router) {}

  onModalClose()
  {
    this.closeLetterModalEvent.emit()
  }

  navigateProfile() {
    this.onModalClose()
    this.router.navigate([`/case-management/cases/case360/${this.clientId}`]);
  }
}
