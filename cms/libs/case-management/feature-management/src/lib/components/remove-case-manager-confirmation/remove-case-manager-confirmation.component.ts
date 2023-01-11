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
    styleUrls: ['./remove-case-manager-confirmation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })

export class RemoveCaseManagerConfirmationComponent
{
  /** Input properties **/
   @Input() clientCaseId!: string;
  
  @Output() deleteConfimEvent =  new EventEmitter<any>();

  onDeleteConfirm(isDelete : boolean)
  {  
    this.deleteConfimEvent.emit(isDelete);
  }
}