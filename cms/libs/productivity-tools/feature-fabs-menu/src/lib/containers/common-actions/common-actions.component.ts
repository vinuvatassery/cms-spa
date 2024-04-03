/** Angular **/
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FabMenuFacade, NotificationStatsFacade, TodoFacade } from '@cms/productivity-tools/domain';
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
  clientId : any;
  //vendorId : any;
  entityId : any;
  //todoAndRemindersCount =0;
  eventLogCount = 0;
  directMessageCount = 0;
  alertCount = 0;
  
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    public readonly fabMenuFacade : FabMenuFacade,
    public notificationStatsFacade : NotificationStatsFacade,
    //public todoFacade : TodoFacade
  ) {}

  ngOnInit(): void {
    this.notificationStatsFacade.updateStats$.subscribe((res: any) => {
      debugger;
      console.log('updateStats res', res);
      //if(this.entityId){
        this.notificationStatsFacade.getStats(this.entityId);
      //}
    });
    this.notificationStatsFacade.getStats$.subscribe((res:any) => {
      debugger;
      console.log('getStats res', res);
      if(res.length>0){
        let eventLogStats = res.filter((stat:any) => stat.statsTypeCode == 'EVENT_LOG');  //TODO: Remove hard coding
        if(eventLogStats){
          this.eventLogCount = eventLogStats.statsCount;
        }
        let directMessageStats = res.filter((stat:any) => stat.statsTypeCode == 'DIRECT_MESSAGE');  //TODO: Remove hard coding
        if(directMessageStats){
          this.directMessageCount = directMessageStats.statsCount;
        }
        let alertStats = res.filter((stat:any) => stat.statsTypeCode == 'ALERT'); //TODO: Remove hard coding
        if(alertStats){
          this.alertCount = alertStats.statsCount;
        }
      }
    });

    debugger;
    this.clientId = this.route.snapshot.params['id'];
    //this.vendorId = this.route.snapshot.queryParams['v_id'];
    if(this.clientId){
      this.entityId = this.clientId.toString();
      this.notificationStatsFacade.updateStats(this.entityId, 'CLIENT'); //TODO: Remove hard coding
    }
    
      
      
      
      // else if(this.vendorId){
      //   this.entityId = this.vendorId.toString();
      // }
    // this.notificationFacade.todoAndReminderFabCount$.subscribe((res :any) =>{
    //  this.todoAndRemindersCount =  res;
    // })
    // var clientId = this.route.snapshot.queryParams['id'];
    // if(clientId){
    // this.notificationFacade.todoAndReminderFabCount(clientId);
    // }
    // this.todoFacade.curdAlert$.subscribe(res =>{
    //   this.notificationFacade.todoAndReminderFabCount(clientId);
    // })
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
