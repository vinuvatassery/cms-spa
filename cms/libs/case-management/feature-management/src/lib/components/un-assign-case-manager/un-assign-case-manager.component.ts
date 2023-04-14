/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'case-management-un-assign-case-manager',
  templateUrl: './un-assign-case-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnAssignCaseManagerComponent {
  @Input() assignedcaseManagerId :any
  @Input() startDate!: any ;
  endDate!: Date;
  showError = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() unAssignConfimEvent = new EventEmitter<any>();
  onUnAssignConfirm(confirm: boolean) {   
    if (this.endDate) 
    {
      this.showError= false;
      const existCaseManagerData = {
        endDate: this.endDate,
        confirm: confirm,
        assignedcaseManagerId : this.assignedcaseManagerId
      };
      this.unAssignConfimEvent.emit(existCaseManagerData);
    }else
    if(confirm)
    {
      this.showError= true;
    }
   else
    {
      this.showError= false;
      const existCaseManagerData = {      
        confirm: false        
      };
      this.unAssignConfimEvent.emit(existCaseManagerData);
    }
  }
}
