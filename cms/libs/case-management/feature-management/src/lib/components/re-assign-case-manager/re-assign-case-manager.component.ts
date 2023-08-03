/** Angular **/
import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'case-management-re-assign-case-manager',
  templateUrl: './re-assign-case-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReAssignCaseManagerComponent 
{
  @Input() assignedcaseManagerId :any
  @Output() reAssignConfimEvent =  new EventEmitter<any>();
  onReAssignConfirm(confirm : boolean)
  {
    const existCaseManagerData =
    {
      assignedcaseManagerId : this.assignedcaseManagerId,
      confirm : confirm
    } 
    this.reAssignConfimEvent.emit(existCaseManagerData);
  }
}
