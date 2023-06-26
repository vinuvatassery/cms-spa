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
  selector: 'case-management-case-manager-effective-dates',
  templateUrl: './case-manager-effective-dates.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseManagerEffectiveDatesComponent {
  @Input() assignedcaseManagerId: any;
  @Input() clientCaseManagerId: any;

  @Input() endDate!: any;
  @Input() startDate!: any;

  showstartDateError = false

  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() changeDateConfimEvent = new EventEmitter<any>();
  onUnAssignConfirm(confirm: boolean) {
    if (confirm) {
      if (this.startDate) {
        this.showstartDateError = false;
        const existCaseManagerData = {
          startDate: this.startDate,
          endDate: this.endDate,
          confirm: confirm,
          assignedcaseManagerId: this.assignedcaseManagerId,
          clientCaseManagerId: this.clientCaseManagerId,
        };
        this.changeDateConfimEvent.emit(existCaseManagerData);
      } else {       
        if(!this.startDate)
        {
          this.showstartDateError =true;
        }
      }
    } else {
      
      const existCaseManagerData = {     
        confirm: confirm
       
      };
      this.changeDateConfimEvent.emit(existCaseManagerData);
    }
  }
}
