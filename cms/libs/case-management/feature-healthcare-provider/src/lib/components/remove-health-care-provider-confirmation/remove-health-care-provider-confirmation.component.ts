/** Angular **/
import {
    Component,   
    ChangeDetectionStrategy,   
    Input ,
    EventEmitter ,
    Output
  } from '@angular/core';

  @Component({
    selector: 'case-management-health-care-provider-remove-confirmation',
    templateUrl: './remove-health-care-provider-confirmation.component.html',
    styleUrls: ['./remove-health-care-provider-confirmation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })

export class RemoveHealthCareProviderConfirmationComponent
{
  /** Input properties **/
   @Input() prvId!: string;
  
  @Output() deleteConfimEvent =  new EventEmitter<boolean>();

  onDeleteConfirm(isDelete : boolean)
  {  
    this.deleteConfimEvent.emit(isDelete);
  }
}