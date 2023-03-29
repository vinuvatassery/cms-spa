/** Angular **/
import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'case-management-deactivate-phone-confirmation',
  templateUrl: './deactivate-phone-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeactivatePhoneConfirmationComponent {
  @Output() deactivateConfimEvent =  new EventEmitter<boolean>();

  onDeactivateConfirm(isDelete : boolean)
  {  
    this.deactivateConfimEvent.emit(isDelete);
  }
}
