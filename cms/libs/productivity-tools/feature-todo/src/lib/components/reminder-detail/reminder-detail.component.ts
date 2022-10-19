/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CaseFacade } from '@cms/case-management/domain';
import { TodoFacade } from '@cms/productivity-tools/domain';
import {
  DateInputSize,
  DateInputRounded,
  DateInputFillMode,
} from '@progress/kendo-angular-dateinputs';

@Component({
  selector: 'productivity-tools-reminder-detail',
  templateUrl: './reminder-detail.component.html',
  styleUrls: ['./reminder-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderDetailComponent implements OnInit {
currentDate = new Date();
  public size: DateInputSize = 'medium';
  public rounded: DateInputRounded = 'full';
  public fillMode: DateInputFillMode = 'outline';
  
  /** Public properties **/
  caseSearched$ = this.caseFacade.caseSearched$;
  search$ = this.todoFacade.search$;
  tareaRemindermaxLength = 200;
  tareaReminderCharachtersCount!: number;
  tareaReminderCounter!: string;
  tareaReminderDescription = '';
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
}
