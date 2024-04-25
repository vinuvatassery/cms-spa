/** Angular **/
import { Component, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FabMenuFacade, NotificationStatsFacade, StatsTypeCode } from '@cms/productivity-tools/domain';
import { FabBadgeFacade, FabEntityTypeCode } from '@cms/system-config/domain';
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
 
  readonly entityTypeCodeEnum = FabEntityTypeCode;
  clickedContact!: any;
  item: Array<DialItem> = [{}];
  entityId: any;
  entityTypeCode: any;
  eventLogCount = 0;
  directMessageCount = 0;
  alertCount = 0;
  totalCount = 0;
  updateStatsSubscription = new Subscription();
  getStatsSubscription = new Subscription();
  resetStatsSubscription = new Subscription();
  navigationSubscription = new Subscription();
  reloadFabBadgeSubscription = new Subscription();
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cd: ChangeDetectorRef,
    public readonly fabMenuFacade : FabMenuFacade,
    public readonly notificationStatsFacade: NotificationStatsFacade,
    public readonly fabBadgeFacade: FabBadgeFacade,
  ) {}
  
  ngOnInit(): void {
    this.addUpdateStatsSubscription();
    this.addGetStatsSubscription();

    this.resetStatsSubscription = this.notificationStatsFacade.resetStats$.subscribe((response: any) => {
      if(response.data){
        this.notificationStatsFacade.getStats(this.entityId, response.statsTypeCode);
      }
    });

    this.reloadFabBadgeSubscription = this.fabBadgeFacade.fabMenuReload$.subscribe((entity: any) => {
      this.notificationStatsFacade.updateStats(entity.entityId, entity.entityTypeCode);
    });
  

    const clientId = this.route.snapshot.params['id'];
    const vendorId = this.route.snapshot.queryParams['v_id'];
    if(clientId){
      this.entityId = clientId.toString();
      this.entityTypeCode = FabEntityTypeCode.Client;
      this.notificationStatsFacade.updateStats(this.entityId, FabEntityTypeCode.Client);
      this.notificationStatsFacade.directMessageStats(this.entityId,StatsTypeCode.DirectMessage)
    }
    else if (vendorId){
      this.entityId = vendorId.toString();
      this.entityTypeCode = FabEntityTypeCode.Vendor;
      this.notificationStatsFacade.updateStats(this.entityId, FabEntityTypeCode.Vendor);
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
        this.notificationStatsFacade.updateStats(this.entityId, FabEntityTypeCode.Client);
      }
    });
  }

  ngOnDestroy(): void {
    this.updateStatsSubscription?.unsubscribe();
    this.getStatsSubscription?.unsubscribe();
    this.resetStatsSubscription?.unsubscribe();
    this.navigationSubscription?.unsubscribe();
    this.reloadFabBadgeSubscription?.unsubscribe();
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
    //Commenting out the below section since for direct messages there is no need to reset the count to zero.
    //this.notificationStatsFacade.resetStats(this.entityId, StatsTypeCode.DirectMessage);
  }

  handleShowTodoRemindersClicked() {
    this.fabMenuFacade.isShownTodoReminders = !this.fabMenuFacade.isShownTodoReminders;
    this.fabMenuFacade.isShownDirectMessage = false;
    this.fabMenuFacade.isShownEventLog = false;
    this.notificationStatsFacade.resetStats(this.entityId, StatsTypeCode.Alert);
  }

  addUpdateStatsSubscription() {
    this.updateStatsSubscription = this.notificationStatsFacade.updateStats$.subscribe((response: any) => {
      if(response.data){
        // The Below logic handles resetting the correct StatsTypeCode count. One example is, user adds Reminder with Event Log Panel open. 
        if(this.fabMenuFacade.isShownEventLog){
          if (response.statsTypeCode == StatsTypeCode.EventLog || response.statsTypeCode == ''){
            this.notificationStatsFacade.resetStats(this.entityId, StatsTypeCode.EventLog);    
          }
        }
        //Commenting out the below section since for direct messages there is no need to reset the count to zero.
        // else if(this.fabMenuFacade.isShownDirectMessage){
        //   if (response.statsTypeCode == StatsTypeCode.DirectMessage || response.statsTypeCode == ''){
        //     this.notificationStatsFacade.resetStats(this.entityId, StatsTypeCode.DirectMessage);    
        //   }
        // }
        else if(this.fabMenuFacade.isShownTodoReminders){
          if (response.statsTypeCode == StatsTypeCode.Alert || response.statsTypeCode == ''){
            this.notificationStatsFacade.resetStats(this.entityId, StatsTypeCode.Alert);    
          }
        }
        else{
          this.notificationStatsFacade.getStats(this.entityId, response.statsTypeCode);
        }
      }
    });
  }

  addGetStatsSubscription(){
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
  }
}
