/** Angular **/
import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'case-management-deactivate-email-confirmation',
  templateUrl: './deactivate-email-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeactivateEmailConfirmationComponent {
  @Output() deactivateConfimEvent =  new EventEmitter<boolean>();

  onDeactivateConfirm(isDelete : boolean)
  {  
    this.deactivateConfimEvent.emit(isDelete);
  }
}
