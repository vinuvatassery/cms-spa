/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';

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
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() changeDateConfimEvent = new EventEmitter<any>();
  constructor(
    public intl: IntlService,
    private configurationProvider: ConfigurationProvider
  ){
    
  }
  onUnAssignConfirm(confirm: boolean) {
    if (confirm) {
      if (this.startDate) {
        this.showstartDateError = false;
        const existCaseManagerData = {
          startDate: this.intl.formatDate(this.startDate, this.dateFormat),
          endDate: this.endDate?this.intl.formatDate(this.endDate, this.dateFormat):this.endDate,
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
