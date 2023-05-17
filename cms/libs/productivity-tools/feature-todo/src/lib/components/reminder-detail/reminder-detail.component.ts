/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy,Output, EventEmitter, Input } from '@angular/core';
import { CaseFacade, ClientReminder } from '@cms/case-management/domain';
import { TodoFacade} from '@cms/productivity-tools/domain';
import { UIFormStyle, IntlDateService } from '@cms/shared/ui-tpa';
import {
  ConfigurationProvider,
  LoaderService,
  LoggingService,
  SnackBarNotificationType,
} from '@cms/shared/util-core';

/** Facades **/
import {
 ClientReminderFacade} from '@cms/case-management/domain';
import { Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'productivity-tools-reminder-detail',
  templateUrl: './reminder-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderDetailComponent implements OnInit {
currentDate = new Date();
public formUiStyle : UIFormStyle = new UIFormStyle();
  
  /** Public properties **/
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  caseSearched$ = this.caseFacade.caseSearched$;
  search$ = this.todoFacade.search$;
  tareaRemindermaxLength = 200;
  tareaReminderCharachtersCount!: number;
  tareaReminderCounter!: string;
  tareaReminderDescription = '';
  prevClientCaseEligibilityId! : string;
  sessionId: any = "";
  @Input() clientId: any
  clientCaseEligibilityId: string = "";
  clientCaseId: any;
  isShow=false;
  dateValidator: boolean = false;
  clientReminder = new ClientReminder();
  clientReminderForm !:FormGroup
  @Output() closeReminderEvent = new EventEmitter();
  constructor(
    private readonly todoFacade: TodoFacade,
    private clientReminderFacade:ClientReminderFacade,
    private readonly caseFacade: CaseFacade,
    private readonly loaderService: LoaderService,
    public readonly intl: IntlDateService,
    private readonly configurationProvider: ConfigurationProvider

    ) {
      
    }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.tareaVariablesIntialization();
    this.buildForm();
  }

  /** Private methods **/
  private tareaVariablesIntialization() {
    this.tareaReminderCharachtersCount = this.tareaReminderDescription
      ? this.tareaReminderDescription.length
      : 0;
    this.tareaReminderCounter = `${this.tareaReminderCharachtersCount}/${this.tareaRemindermaxLength}`;
  }

  /** Internal event methods **/
  onTareaReminderValueChange(event: any): void {
    this.tareaReminderCharachtersCount = event.length;
    this.tareaReminderCounter = `${this.tareaReminderCharachtersCount}/${this.tareaRemindermaxLength}`;
  }

  onCloseReminderClicked() 
  {
    this.closeReminderEvent.emit();
  }
  private buildForm() {
    this.clientReminderForm = new FormGroup({
      dueDate: new FormControl(''),
      time: new FormControl(''),
      description:new FormControl(''),
      addToOutlookCalender:new FormControl(''),
    });
  }
  public save (){
    this.setValidators()
      if (this.clientReminderForm.valid && this.dateValidator==false) {
        this.loaderService.show();
        this.populateReminder();
      this.clientReminderFacade
        .saveClientReminder(this.clientReminder).subscribe({
          next: (response: any) =>{
            if(response)
            { 
             this.clientReminderFacade.showHideSnackBar(
               SnackBarNotificationType.SUCCESS,
               'Client Reminder added successfully'
             );
             this.clientReminderFacade.hideLoader();
             this.closeReminderEvent.emit();
            }
           },
           error: (error: any) => {
             this.loaderService.hide();
             this.clientReminderFacade.showHideSnackBar(
               SnackBarNotificationType.ERROR,
               error)
           }
        }
       
        );
      }
    
   
  }
  setValidators()
  {
    this.clientReminderForm.markAllAsTouched();
    this.clientReminderForm.controls['dueDate'].setValidators([Validators.required,]);
    this.clientReminderForm.controls['dueDate'].updateValueAndValidity();
    this.clientReminderForm.controls['description'].setValidators([Validators.required,]);
    this.clientReminderForm.controls['description'].updateValueAndValidity();

  }
  populateReminder()
  {
    this.clientReminder.linkedItemId = this.clientId;
    this.clientReminder.alertDueTime = this.clientReminderForm.controls['time'].value;
    this.clientReminder.alertDueDate = this.intl.formatDate(this.clientReminderForm.controls['dueDate'].value, this.dateFormat);
    this.clientReminder.alertDesc = this.clientReminderForm.controls['description'].value;
    this.clientReminder.addToOutlookFlag = this.clientReminderForm.controls['addToOutlookCalender'].value == true ? "Y": this.clientReminderForm.controls['addToOutlookCalender'].value == false ? "N": null ;
  }
  
  dateValidate(event: Event) {
    this.dateValidator = false;
    const signedDate = this.clientReminderForm.controls['dueDate'].value;
    const todayDate = new Date();
    signedDate.setHours(0, 0, 0, 0);
    todayDate.setHours(0, 0, 0, 0);
    if (signedDate.getTime() === todayDate.getTime()) {
      this.dateValidator = false;
    }
   else if (signedDate < todayDate) {
      this.dateValidator = true;
    }
  }
}
