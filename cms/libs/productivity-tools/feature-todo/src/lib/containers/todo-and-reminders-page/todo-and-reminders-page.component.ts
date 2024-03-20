/** Angular **/
import { publishFacade } from '@angular/compiler';
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseFacade } from '@cms/case-management/domain';
import { TodoFacade } from '@cms/productivity-tools/domain';

@Component({
  selector: 'productivity-tools-todo-and-reminders-page',
  templateUrl: './todo-and-reminders-page.component.html',
  styleUrls: ['./todo-and-reminders-page.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class TodoAndRemindersPageComponent implements OnInit {
  constructor(public todoFacade : TodoFacade,
    private route : ActivatedRoute,
    private caseFacade : CaseFacade) {  }
  todoAndReminders$ = this.todoFacade.clientTodoAndReminders$;
  clientsReminderWithIn7Days!:any[]
  clientsReminderAfter7Days! :any[]
  clientsReminderAfter30Days! : any[]
  clientName = ""
  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id')
    if(id){
    this.caseFacade.clientProfileHeader$.subscribe(cp =>{      
       this.clientName = cp?.clientFullName
    })
   this.caseFacade.loadClientProfileHeader(+id);
    this.todoFacade.todoAndRemindersByClient(id);

  }
}
  /** Output properties **/
  @Output() closeAction = new EventEmitter();

  /** Public properties **/
  isShowTodoReminders = false;

  /** Public methods **/
  onCloseTodoRemindersClicked() {
    this.closeAction.emit();
    this.isShowTodoReminders = !this.isShowTodoReminders;
  }

}
