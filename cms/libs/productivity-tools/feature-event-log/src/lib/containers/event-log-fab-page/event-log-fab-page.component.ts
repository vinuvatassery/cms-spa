/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AlertEntityTypeCode, FabMenuFacade } from '@cms/productivity-tools/domain';
import { LovFacade } from '@cms/system-config/domain';
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
  navigationSubscription = new Subscription();
  navigationSubject: Subject<any> = new Subject<any>();

  constructor(
    public readonly fabMenuFacade: FabMenuFacade,
    private readonly lovFacade: LovFacade,
    private readonly router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
      const clientId = this.route.snapshot.params['id'];
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
  }
  
  ngOnDestroy(): void {
    this.navigationSubscription?.unsubscribe();
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

  closeAction() {

    this.fabMenuFacade.isShownEventLog = !this.fabMenuFacade.isShownEventLog;
  }

}
