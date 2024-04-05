/** Angular **/
import { Component, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FabMenuFacade, NotificationStatsFacade, AlertEntityTypeCode, StatsTypeCode } from '@cms/productivity-tools/domain';
import { SignalrEventHandlerService } from '@cms/shared/util-common';
/** External libraries **/
import { DialItem } from '@progress/kendo-angular-buttons';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'productivity-tools-common-actions',
  templateUrl: './common-actions.component.html',
  styleUrls: ['./common-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonActionsComponent implements OnInit, OnDestroy{
  /** Public properties **/
 
  clickedContact!: any;
  item: Array<DialItem> = [{}];
  entityId : any;
  eventLogCount = 0;
  directMessageCount = 0;
  alertCount = 0;
  totalCount = 0;
  updateStatsSubscription = new Subscription();
  getStatsSubscription = new Subscription();
  resetStatsSubscription = new Subscription();
  navigationSubscription = new Subscription();
  
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cd: ChangeDetectorRef,
    public readonly fabMenuFacade : FabMenuFacade,
    public notificationStatsFacade : NotificationStatsFacade,
  ) {}
  
  ngOnInit(): void {
    this.updateStatsSubscription = this.notificationStatsFacade.updateStats$.subscribe((response: any) => {
      if(response.data){
        this.notificationStatsFacade.getStats(this.entityId, response.statsTypeCode);
      }
    });

    this.getStatsSubscription = this.notificationStatsFacade.getStats$.subscribe((res:any) => {
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
        this.cd.detectChanges();
      }
    });

    this.resetStatsSubscription = this.notificationStatsFacade.resetStats$.subscribe((response: any) => {
      if(response.data){
        this.notificationStatsFacade.getStats(this.entityId, response.statsTypeCode);
      }
    });


    const clientId = this.route.snapshot.params['id'];
    if(clientId){
      this.entityId = clientId.toString();
      this.notificationStatsFacade.updateStats(this.entityId, AlertEntityTypeCode.Client);
    }
    this.addSessionChangeSubscription();
  }

  private addSessionChangeSubscription() {
    this.navigationSubscription = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
    ).subscribe(() => {
       const newClientId = this.route.snapshot.queryParams['id'];
      if (newClientId && newClientId !== this.entityId) {
        this.entityId = newClientId.toString();
        this.notificationStatsFacade.updateStats(this.entityId, AlertEntityTypeCode.Client);
      }
    });
  }

  ngOnDestroy(): void {
    this.updateStatsSubscription?.unsubscribe();
    this.getStatsSubscription?.unsubscribe();
    this.resetStatsSubscription?.unsubscribe();
    this.navigationSubscription?.unsubscribe();
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
