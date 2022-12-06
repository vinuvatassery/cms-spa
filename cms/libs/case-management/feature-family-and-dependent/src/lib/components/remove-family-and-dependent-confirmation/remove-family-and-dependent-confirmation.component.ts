/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges,  } from '@angular/core';
import { DependentTypeCode } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-remove-family-and-dependent-confirmation',
  templateUrl: './remove-family-and-dependent-confirmation.component.html',
  styleUrls: ['./remove-family-and-dependent-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveFamilyAndDependentConfirmationComponent {
  

    /** Input properties **/
    @Input() deleteRqclientDependentId!: string;
    @Input() deleteRqdependentTypeCode!: string;    
  
    @Output() deleteConfimEvent =  new EventEmitter<any>();

    /******enumeration Alias *****/
    Dependent = DependentTypeCode.Dependent;
    CAClient = DependentTypeCode.CAClient;    

   
    onDeleteConfirm(isDelete : boolean)
    {  
      const deleteConfirmParams =
      {
        isDelete : isDelete ,
        clientDependentId : this.deleteRqclientDependentId
      }
      this.deleteConfimEvent.emit(deleteConfirmParams);
    }
}
