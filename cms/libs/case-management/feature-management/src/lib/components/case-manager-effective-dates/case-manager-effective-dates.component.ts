/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';

@Component({
  selector: 'case-management-case-manager-effective-dates',
  templateUrl: './case-manager-effective-dates.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseManagerEffectiveDatesComponent implements OnInit {
  @Input() assignedcaseManagerId: any;
  @Input() clientCaseManagerId: any;

  @Input() endDate!: any;
  @Input() startDate!: any;

  public min: Date = new Date(1917, 0, 1);

  startDateValidator: boolean = false;
  endDateValidator: boolean = false;
  startDateIsGreaterThanEndDate: boolean = false;
  effectiveDatesForm!: FormGroup;
  showstartDateError = false
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() changeDateConfimEvent = new EventEmitter<any>();
  constructor(
    public intl: IntlService,
    private configurationProvider: ConfigurationProvider,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private formBuilder: FormBuilder
  ){

  }

  ngOnInit(): void {
    this.buildEffectiveDatesForm();
  }

  onUnAssignConfirm(confirm: boolean) {
    if (confirm) {
      this.validateModel();
      if(this.effectiveDatesForm.valid){
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
      }
    } else {

      const existCaseManagerData = {
        confirm: confirm

      };
      this.changeDateConfimEvent.emit(existCaseManagerData);
    }
  }

  buildEffectiveDatesForm(){
    this.effectiveDatesForm = this.formBuilder.group({
      startDate: [null],
      endDate: [null]
    });
  }

  dateValidate(type: any) {
    const todayDate = new Date();
    this.startDateIsGreaterThanEndDate = false;
    // eslint-disable-next-line no-case-declarations
    const startDate = this.effectiveDatesForm.controls['startDate'].value;
    // eslint-disable-next-line no-case-declarations
    const endDate = this.effectiveDatesForm.controls['endDate'].value;
    switch (type.toUpperCase()) {
      case "START_DATE":
        this.startDateValidator = false;
        this.effectiveDatesForm.controls['startDate'].setErrors(null);
        break;
      case "END_DATE":
        this.endDateValidator = false;
        this.effectiveDatesForm.controls['endDate'].setErrors(null);
        break
    }
    if(startDate>endDate){
      this.startDateIsGreaterThanEndDate = true;
      this.effectiveDatesForm.controls['endDate'].setErrors({ 'incorrect': true });
    }

  }

  validateModel(){
    this.dateValidate("START_DATE");
    this.dateValidate("END_DATE");
  }

}
