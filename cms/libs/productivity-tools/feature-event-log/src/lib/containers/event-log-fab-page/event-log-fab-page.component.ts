/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertEntityTypeCode, FabMenuFacade } from '@cms/productivity-tools/domain';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'productivity-tools-event-log-fab-page',
  templateUrl: './event-log-fab-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventLogComponentFabPageComponent
{
  /** Public properties **/
  entityId : any;
  entityTypeCode: any;
  clientCaseEligibilityId: any;
  eventAttachmentTypeLov$ = this.lovFacade.eventAttachmentTypeLov$
  constructor(
    public readonly fabMenuFacade: FabMenuFacade,
    private readonly lovFacade: LovFacade,
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
      
  }

  closeAction() {

    this.fabMenuFacade.isShownEventLog = !this.fabMenuFacade.isShownEventLog;
  }

}
