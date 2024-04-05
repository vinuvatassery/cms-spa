/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FabMenuFacade } from '@cms/productivity-tools/domain';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'productivity-tools-event-log-fab-page',
  templateUrl: './event-log-fab-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventLogComponentFabPageComponent
{
  /** Public properties **/
  clientId : any;
  vendorId : any;
  entityId : any;

  eventAttachmentTypeLov$ = this.lovFacade.eventAttachmentTypeLov$
  constructor(
    public readonly fabMenuFacade: FabMenuFacade,
    private readonly lovFacade: LovFacade,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
      this.clientId = this.route.snapshot.queryParams['id'];
      this.vendorId = this.route.snapshot.queryParams['v_id'];
      if(this.clientId){
        this.entityId = this.clientId.toString();
      }
      else if(this.vendorId){
        this.entityId = this.vendorId.toString();
      }
      
  }

  closeAction() {

    this.fabMenuFacade.isShownEventLog = !this.fabMenuFacade.isShownEventLog;
  }

}
