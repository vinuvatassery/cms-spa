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
   @Input() clientCaseId!: string;
  
  @Output() deleteConfimEvent =  new EventEmitter<any>();
  btnDisabled = false; 
  onDeleteConfirm(isDelete : boolean)
  {  
    this.btnDisabled = true; 
    this.deleteConfimEvent.emit(isDelete);
  }
}