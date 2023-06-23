/** Angular **/
import { Component, OnInit, Output,ChangeDetectionStrategy, EventEmitter} from '@angular/core';
import { CaseFacade } from '@cms/case-management/domain';
import { TodoFacade } from '@cms/productivity-tools/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'

@Component({
  selector: 'productivity-tools-reminder-detail',
  templateUrl: './reminder-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderDetailComponent implements OnInit {
currentDate = new Date();
public formUiStyle : UIFormStyle = new UIFormStyle();
  
  /** Public properties **/
  caseSearched$ = this.caseFacade.caseSearched$;
  search$ = this.todoFacade.search$;
  tareaRemindermaxLength = 200;
  tareaReminderCharachtersCount!: number;
  tareaReminderCounter!: string;
  tareaReminderDescription = '';
  isCustomReminder= false;
  @Output() isModalNewReminderCloseClicked  = new EventEmitter();

  constructor(private readonly todoFacade: TodoFacade,private readonly caseFacade: CaseFacade,) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
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
  closeReminderDetails(){
    this.isModalNewReminderCloseClicked.emit(true);
  }
}
