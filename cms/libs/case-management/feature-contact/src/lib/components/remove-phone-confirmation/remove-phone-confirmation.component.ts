/** Angular **/
import {    Component,       ChangeDetectionStrategy,     EventEmitter ,    Output  } from '@angular/core';

  @Component({
    selector: 'case-management-phone-remove-confirmation',
    templateUrl: './remove-phone-confirmation.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })

export class RemovePhoneConfirmationComponent
{ 
  
  @Output() deleteConfimEvent =  new EventEmitter<boolean>();

  onDeleteConfirm(isDelete : boolean)
  {  
    this.deleteConfimEvent.emit(isDelete);
  }
}