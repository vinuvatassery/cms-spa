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
  showNoDataFor7Days= false;
  showNoDataFor30Days = false;
  showNoDataAfter30Days = false;
  noTodoFor7Days = false;
  noTodoFor30Days = false;
  noTodoAfter30Days = false;
  noReminderFor7Days = false;
  noReminderFor30Days = false;
  noReminderAfter30Days = false;
  eid =""
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params :any) =>{
      this.id = params.get('id')
      this.eid = params.get('e_id')
      if(this.id){
        this.loadData()
      }
     })
  
}

loadData(){
  this.todoAndReminders$.subscribe(res =>{
    this.showNoDataFor7Days= false;
    this.showNoDataFor30Days = false;
    this.showNoDataAfter30Days = false;
    this.noTodoFor7Days = false;
    this.noTodoFor30Days = false;
    this.noTodoAfter30Days = false;
    this.noReminderFor7Days = false;
    this.noReminderFor30Days = false;
    this.noReminderAfter30Days = false;
  })
this.todoFacade.clientTodoAndRemindersLoader$.subscribe(res =>{
    this.showDataLoader = res
    this.cdr.detectChanges()
  
})
this.caseFacade.clientProfileDataLoader$.subscribe(res =>{
  this.showLoader = res;
  this.cdr.detectChanges()
})
this.caseFacade.clientProfileData$.subscribe(cp =>{
   this.clientName = cp?.firstName
})
this.caseFacade.loadClientProfileWithOutLoader(this.eid);
this.todoFacade.todoAndRemindersByClient(this.id);
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

  setNoDataTempalate(ndays:any,type:any){
   
    if(ndays == "7"){
      if(type=='todo'){
      this.noTodoFor7Days = true
      }
    if(type == 'reminder'){
    this.noReminderFor7Days = true;
    }
     
      this.showNoDataFor7Days = this.noTodoFor7Days && this.noReminderFor7Days;
    }
    if(ndays == "30"){
      if(type == 'todo'){
        this.noTodoFor30Days = true
        }
        if(type == 'reminder'){
        this.noReminderFor30Days =true;
        }
      this.showNoDataFor30Days = this.noTodoFor30Days && this.noReminderFor30Days;
    }
    if(ndays == "31"){
      if(type == 'todo'){
      this.noTodoAfter30Days = true
      }
      if(type == 'reminder'){
      this.noReminderAfter30Days = true
      }
      this.showNoDataAfter30Days = this.noTodoAfter30Days && this.noReminderAfter30Days;
    }
  }

}
