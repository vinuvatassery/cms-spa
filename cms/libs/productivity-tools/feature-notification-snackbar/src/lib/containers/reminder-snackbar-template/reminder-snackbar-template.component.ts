import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: 'productivity-tools-reminder-snackbar-template',
    templateUrl: './reminder-snackbar-template.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })

  export class ReminderSnackBarTemplateComponent implements OnInit
  {

    @Output() public ignore: EventEmitter<undefined> = new EventEmitter();
    public data = [
        {
          text: 'Edit Reminder',
        },
        {
          text: '15 Minutes Snooze',
        },
        {
          text: '30 Minutes Snooze',
        },
        {
          text: '1 Hour Snooze',
        },
      ];
     message! : any
     entityName = 'any';
     alertText  = 'any';
     dueDateText  = 'any';
     entityId = 'any';
     entityTypeCode = 'any';
     vendorTypeCode = 'any';

     ngOnInit(): void {
       // this.ignore.emit()
     }
     moveSideReminderNotification()
     {

     }

     removePreviousMessage()
     {
        
     }

     onOptionClicked($event: any, alertId :any)
     {

     }

     onEntityNameClick(entityId : any,entityTypeCode : any,vendorTypeCode : any)
     {

     }
  }