/** Angular **/
import { Component, OnInit, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { CaseFacade } from '@cms/case-management/domain';
import { TodoFacade } from '@cms/productivity-tools/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { SnackBarNotificationType, } from '@cms/shared/util-core';
@Component({
  selector: 'productivity-tools-reminder-detail',
  templateUrl: './reminder-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderDetailComponent implements OnInit {
  currentDate = new Date();
  public formUiStyle: UIFormStyle = new UIFormStyle();

  /** Public properties **/
  clientReminderForm !: FormGroup
  caseSearched$ = this.caseFacade.caseSearched$;
  search$ = this.todoFacade.search$;
  tareaRemindermaxLength = 200;
  tareaReminderCharachtersCount!: number;
  tareaReminderCounter!: string;
  tareaReminderDescription = '';
  isShow = false;
  dateValidator = false;
  @Output() isModalNewReminderCloseClicked = new EventEmitter();

  constructor(private readonly todoFacade: TodoFacade, private readonly caseFacade: CaseFacade,) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.buildForm();
    this.tareaVariablesIntialization();
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
  private buildForm() {
    this.clientReminderForm = new FormGroup({
      dueDate: new FormControl(''),
      time: new FormControl(''),
      description: new FormControl(''),
      addToOutlookCalender: new FormControl(''),
    });
  }
 
  onCloseReminderClicked() 
  {
    this.isModalNewReminderCloseClicked.emit(true);
  }
  setValidators() {
    this.clientReminderForm.markAllAsTouched();
    this.clientReminderForm.controls['dueDate'].setValidators([Validators.required,]);
    this.clientReminderForm.controls['dueDate'].updateValueAndValidity();
    this.clientReminderForm.controls['description'].setValidators([Validators.required,]);
    this.clientReminderForm.controls['description'].updateValueAndValidity();
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

  public save() {
    this.setValidators();
    if (this.clientReminderForm.valid) {
       this.caseFacade.showHideSnackBar( SnackBarNotificationType.SUCCESS, 'Client Reminder added successfully');
       this.isModalNewReminderCloseClicked.emit();
       this.isModalNewReminderCloseClicked.emit();
    }
  }
}
