/** Angular **/
import {
    Component,   
    ChangeDetectionStrategy,   
    Input ,
    EventEmitter ,
    Output
  } from '@angular/core';

  @Component({
    selector: 'case-management-case-manager-remove-confirmation',
    templateUrl: './remove-case-manager-confirmation.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })

export class RemoveCaseManagerConfirmationComponent
{
  /** Input properties **/  
   @Input() assignedcaseManagerId :any
  @Output() deleteConfimEvent =  new EventEmitter<any>();
  btnDisabled = false; 
  onDeleteConfirm(isDelete : boolean)
  {  
    this.btnDisabled = true; 
    const existCaseManagerData = {
      endDate: null,
      confirm: isDelete,
      assignedcaseManagerId: this.assignedcaseManagerId
    };
    this.deleteConfimEvent.emit(existCaseManagerData);
  }
}