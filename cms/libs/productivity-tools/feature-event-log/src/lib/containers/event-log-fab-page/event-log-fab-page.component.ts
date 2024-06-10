/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AlertEntityTypeCode, FabMenuFacade, NotificationStatsFacade, StatsTypeCode } from '@cms/productivity-tools/domain';
import { FabBadgeFacade, LovFacade } from '@cms/system-config/domain';
import { Subject, Subscription, filter } from 'rxjs';

@Component({
  selector: 'productivity-tools-event-log-fab-page',
  templateUrl: './event-log-fab-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventLogComponentFabPageComponent implements OnInit, OnDestroy
{
  /** Public properties **/
  entityId : any;
  entityTypeCode: any;
  clientCaseEligibilityId: any;
  eventAttachmentTypeLov$ = this.lovFacade.eventAttachmentTypeLov$;
  navigationSubject: Subject<any> = new Subject<any>();


  navigationSubscription = new Subscription();
  reloadFabBadgeSubscription = new Subscription();

  constructor(
    public readonly fabMenuFacade: FabMenuFacade,
    public readonly fabBadgeFacade: FabBadgeFacade,
    private readonly lovFacade: LovFacade,
    private readonly router: Router,
    private route: ActivatedRoute,
    public readonly notificationStatsFacade: NotificationStatsFacade,
  ) {
  }

  ngOnInit() {
      const clientId = this.route.snapshot.queryParams['id'];
      const vendorId = this.route.snapshot.queryParams['v_id'];
      if(clientId){
        this.entityId = clientId.toString();
        this.clientCaseEligibilityId = this.route.snapshot.queryParams['e_id'];
        this.entityTypeCode = AlertEntityTypeCode.Client;
      }
      else if(vendorId){
        this.entityId = vendorId.toString();
        this.entityTypeCode = AlertEntityTypeCode.Vendor;
      }
      this.addSessionChangeSubscription();
      this.addReloadFabBadgeSubscription();
  }

  ngOnDestroy(): void {
    this.navigationSubscription?.unsubscribe();
    this.reloadFabBadgeSubscription?.unsubscribe();
  }

  private addSessionChangeSubscription() {
    this.navigationSubscription = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
    ).subscribe(() => {
       const newClientId = this.route.snapshot.queryParams['id'];
      if (newClientId && newClientId !== this.entityId) {
        this.entityId = newClientId.toString();
        this.clientCaseEligibilityId = this.route.snapshot.queryParams['e_id'];
        this.entityTypeCode = AlertEntityTypeCode.Client;
        const data = {
          EntityId: this.entityId,
          ClientCaseEligibilityId: this.clientCaseEligibilityId,
          EntityTypeCode: this.entityTypeCode,
        }
        this.navigationSubject.next(data);
      }
    });
  }

  private addReloadFabBadgeSubscription(){
    this.reloadFabBadgeSubscription = this.fabBadgeFacade.fabMenuReload$.subscribe((entity: any) => {
      if(this.fabMenuFacade.isShownEventLog) {
        const data = {
          EntityId: entity.entityId,
          ClientCaseEligibilityId: this.route.snapshot.queryParams['e_id'],
          EntityTypeCode: entity.entityTypeCode,
        }
        this.navigationSubject.next(data);
      }
    });
  }

  closeAction() {

    this.fabMenuFacade.isShownEventLog = !this.fabMenuFacade.isShownEventLog;
    this.notificationStatsFacade.resetStats(this.entityId, StatsTypeCode.EventLog);
  }

}
