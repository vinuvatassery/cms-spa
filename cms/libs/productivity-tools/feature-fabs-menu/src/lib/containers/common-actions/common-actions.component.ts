/** Angular **/
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FabMenuFacade, NotificationFacade, TodoFacade } from '@cms/productivity-tools/domain';
import { SignalrEventHandlerService } from '@cms/shared/util-common';
/** External libraries **/
import { DialItem } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'productivity-tools-common-actions',
  templateUrl: './common-actions.component.html',
  styleUrls: ['./common-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonActionsComponent {
  /** Public properties **/
 
  clickedContact!: any;
  item: Array<DialItem> = [{}];
  todoAndRemindersCount =0;
  
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    public readonly fabMenuFacade : FabMenuFacade,
    public notificationFacade : NotificationFacade,
    public todoFacade : TodoFacade
  ) {}

  ngOnInit(): void {

    this.notificationFacade.todoAndReminderFabCount$.subscribe((res :any) =>{
     this.todoAndRemindersCount =  res;
    })
    var clientId = this.route.snapshot.queryParams['id'];
    if(clientId){
    this.notificationFacade.todoAndReminderFabCount(clientId);
    }
    this.todoFacade.curdAlert$.subscribe(res =>{
      this.notificationFacade.todoAndReminderFabCount(clientId);
    })
  }
  /** Internal event methods **/
  onDialItemClicked(event: any): void {
    this.clickedContact = event.item;
  }

  /** External event methods **/
  handleShowEventLogClicked() {
    
    this.fabMenuFacade.isShownEventLog = !this.fabMenuFacade.isShownEventLog;
    this.fabMenuFacade.isShownDirectMessage = false;
    this.fabMenuFacade.isShownTodoReminders = false;  
  }

  handleShowDirectMessageClicked() {
    this.fabMenuFacade.isShownDirectMessage = !this.fabMenuFacade.isShownDirectMessage;
    this.fabMenuFacade.isShownEventLog = false;
    this.fabMenuFacade.isShownTodoReminders = false;
   
  }

  handleShowTodoRemindersClicked() {
    this.fabMenuFacade.isShownTodoReminders = !this.fabMenuFacade.isShownTodoReminders;
    this.fabMenuFacade.isShownDirectMessage = false;
    this.fabMenuFacade.isShownEventLog = false;
   
  }
}
