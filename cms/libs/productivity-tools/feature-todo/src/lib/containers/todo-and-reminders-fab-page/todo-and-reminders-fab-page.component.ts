/** Angular **/
import {
    Component,
    ChangeDetectionStrategy,  
    OnInit,
  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
  
  @Component({
    selector: 'productivity-tools-todo-and-reminders-fab-page',
    templateUrl: './todo-and-reminders-fab-page.component.html',  
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class TodoAndRemindersFabPageComponent implements OnInit{
    isShowTodoReminders = false
    showRemindersList = false
    clientId = 0

    constructor( private route: ActivatedRoute) {}
    /** Lifecycle hooks **/
    ngOnInit(): void {        

        this.clientId = this.route.snapshot.queryParams['id'];
        if(this.clientId > 0 )
        {
            this.isShowTodoReminders = true
            this.showRemindersList = false
        }
        else
        {
            this.isShowTodoReminders = false
            this.showRemindersList = true
        }
      }
      closeAction()
      {
        this.isShowTodoReminders = false
      }
  }