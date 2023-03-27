/** Angular **/
import { Component, ChangeDetectionStrategy,Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'case-management-delete-email-confirmation',
  templateUrl: './delete-email-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteEmailConfirmationComponent {

  @Output() deleteConfimEvent =  new EventEmitter<boolean>();

  onDeleteConfirm(isDelete : boolean)
  {  
    this.deleteConfimEvent.emit(isDelete);
  }
}