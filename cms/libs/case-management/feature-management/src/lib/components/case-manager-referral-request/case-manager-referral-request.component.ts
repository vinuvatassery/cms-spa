/** Angular **/
import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'case-management-case-manager-referral-request',
  templateUrl: './case-manager-referral-request.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseManagerReferralRequestComponent {
  @Output() submitReferalEvent =  new EventEmitter<any>();
  onSubmitConfirm(confirm : boolean)
  {
      this.submitReferalEvent.emit(confirm);
  }
}
