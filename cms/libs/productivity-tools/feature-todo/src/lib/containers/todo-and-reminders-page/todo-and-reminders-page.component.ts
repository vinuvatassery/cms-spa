/** Angular **/
import { publishFacade } from '@angular/compiler';
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectorRef,
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
    private caseFacade : CaseFacade,
    private cdr : ChangeDetectorRef) {  }
    skeletonCounts = [
      1, 2
    ]
    clientProfileHeaderLoader$=  this.caseFacade.clientProfileHeaderLoader$
  todoAndReminders$ = this.todoFacade.clientTodoAndReminders$;
  clientsReminderWithIn7Days!:any[]
  clientsReminderAfter7Days! :any[]
  clientsReminderAfter30Days! : any[]
  clientName = ""
  id:string | null =""
  showLoader = true
  showDataLoader = true

  @Output() onMarkAlertAsDoneGridClicked = new EventEmitter<any>();
  @Output() onDeleteAlertGridClicked = new EventEmitter<any>();
  @Output() editTodoItemEvent = new EventEmitter()
  @Output() onDeleteReminderAlertGridClicked = new EventEmitter();
  @Output() onEditReminderClickedEvent = new EventEmitter()
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params :any) =>{
      this.id = params.get('id')
      if(this.id){
        this.todoFacade.clientTodoAndRemindersLoader$.subscribe(res =>{
            this.showDataLoader = res
            this.cdr.detectChanges()
          
        })
        this.caseFacade.clientProfileHeaderLoader$.subscribe(res =>{
          this.showLoader = res;
          this.cdr.detectChanges()
        })
        this.caseFacade.clientProfileHeader$.subscribe(cp =>{  
           this.clientName = cp?.clientFullName
        })
       this.caseFacade.loadClientProfileHeaderWithOutLoader(+this.id);
        this.todoFacade.todoAndRemindersByClient(this.id);   
      }
     })
  
}
onMarkAlertDoneGrid(event:any){
  this.onMarkAlertAsDoneGridClicked.emit(event)
}

onDeleteAlertGrid(event:any){
 this.onDeleteAlertGridClicked.emit(event)
}

loadReminders(){
  if(this.id){
  this.todoFacade.todoAndRemindersByClient(this.id);
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

  onDeleteReminderAlertGrid(event:any){
    this.onDeleteReminderAlertGridClicked.emit({
      alertId:event,
      type:'delete'
    })
  }
  editTodoItem(event:any){

  this.editTodoItemEvent.emit(event)
  }

  onEditReminderClicked(event:any){
   this.onEditReminderClickedEvent.emit({
    alertId : event, 
    type : 'edit'
   })
  }
}
