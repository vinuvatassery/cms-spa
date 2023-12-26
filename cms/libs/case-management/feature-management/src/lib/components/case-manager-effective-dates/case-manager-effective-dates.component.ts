/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
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

  public min: Date = new Date(1917, 0, 1);  

  showstartDateError = false
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() changeDateConfimEvent = new EventEmitter<any>();
  constructor(
    public intl: IntlService,
    private configurationProvider: ConfigurationProvider,
    private readonly notificationSnackbarService : NotificationSnackbarService
  ){
    
  }
  onUnAssignConfirm(confirm: boolean) {
    if (confirm) {
      if(this.startDate < this.min)
      {
         this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, "Start date must be a valid date.", NotificationSource.UI)
         return
      }

      if(this.endDate &&  this.endDate < this.min)
      {
         this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, "End date must be a valid date.", NotificationSource.UI)
         return
      }

      if (this.startDate && this.startDate > this.min) {
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
