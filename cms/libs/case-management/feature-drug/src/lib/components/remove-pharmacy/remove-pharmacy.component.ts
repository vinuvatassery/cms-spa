/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'case-management-remove-pharmacy',
  templateUrl: './remove-pharmacy.component.html',
  styleUrls: ['./remove-pharmacy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemovePharmacyComponent {
  /** Input properties **/
  @Input() clientPharmacyId!: string;

  /** Output properties **/
  @Output() removeConfirmEvent = new EventEmitter<any>();

    /** public properties **/
  onRemoveOrCancelClick(isDelete : boolean)
  {  
    const deleteConfirmParams =
    {
      isDelete : isDelete ,
      clientPharmacyId : this.clientPharmacyId
    }

    this.removeConfirmEvent.emit(deleteConfirmParams);
  }
}
