/** Angular **/
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FabMenuFacade, NotificationStatsFacade, AlertEntityTypeCode, StatsTypeCode } from '@cms/productivity-tools/domain';
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
  totalCount = 0;
  
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    public readonly fabMenuFacade : FabMenuFacade,
    public notificationStatsFacade : NotificationStatsFacade,
    //public todoFacade : TodoFacade
  ) {}

  ngOnInit(): void {
    this.notificationStatsFacade.updateStats$.subscribe((res: any) => {
      if(res){
        this.notificationStatsFacade.getStats(this.entityId);
      }
    });
    this.notificationStatsFacade.getStats$.subscribe((res:any) => {
      if(res.length>0){
        let eventLogStats = res.filter((stat:any) => stat.statsTypeCode == StatsTypeCode.EventLog);
        if(eventLogStats && eventLogStats.length > 0){
          this.eventLogCount = eventLogStats[0].statsCount;
        }
        let directMessageStats = res.filter((stat:any) => stat.statsTypeCode == StatsTypeCode.DirectMessage);
        if(directMessageStats && directMessageStats.length > 0){
          this.directMessageCount = directMessageStats[0].statsCount;
        }
        let alertStats = res.filter((stat:any) => stat.statsTypeCode == StatsTypeCode.Alert);
        if(alertStats && alertStats.length > 0){
          this.alertCount = alertStats[0].statsCount;
        }
        this.totalCount = this.eventLogCount + this.directMessageCount + this.alertCount;
      }
    });

    this.clientId = this.route.snapshot.params['id'];
    //this.vendorId = this.route.snapshot.queryParams['v_id'];
    if(this.clientId){
      this.entityId = this.clientId.toString();
      this.notificationStatsFacade.updateStats(this.entityId, AlertEntityTypeCode.Client);
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
    this.notificationStatsFacade.resetStats(this.entityId, StatsTypeCode.EventLog);  
  }

  handleShowDirectMessageClicked() {
    this.fabMenuFacade.isShownDirectMessage = !this.fabMenuFacade.isShownDirectMessage;
    this.fabMenuFacade.isShownEventLog = false;
    this.fabMenuFacade.isShownTodoReminders = false;
    this.notificationStatsFacade.resetStats(this.entityId, StatsTypeCode.DirectMessage);
  }

  handleShowTodoRemindersClicked() {
    this.fabMenuFacade.isShownTodoReminders = !this.fabMenuFacade.isShownTodoReminders;
    this.fabMenuFacade.isShownDirectMessage = false;
    this.fabMenuFacade.isShownEventLog = false;
    this.notificationStatsFacade.resetStats(this.entityId, StatsTypeCode.Alert);
  }
}
