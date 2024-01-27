/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'case-management-approval-letter-later',
  templateUrl: './approval-letter-later.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalLaterComponent {
  @Input() clientId: any;
  @Input() paperlessFlag! : any
  @Output() closeApprovalLetterModalEvent = new EventEmitter();
  constructor(private readonly router: Router) {}

  onModalClose()
  {
    this.closeApprovalLetterModalEvent.emit()
  }

  navigateProfile() {
    this.onModalClose()
    this.router.navigate([`/case-management/cases/case360/${this.clientId}`]);
  }
}