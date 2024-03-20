/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { FabMenuFacade } from '@cms/productivity-tools/domain';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'productivity-tools-event-log-fab-page',
  templateUrl: './event-log-fab-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventLogComponentFabPageComponent
{
  eventAttachmentTypeLov$ = this.lovFacade.eventAttachmentTypeLov$
  constructor(
    public readonly fabMenuFacade: FabMenuFacade,
    private readonly lovFacade: LovFacade
  ) {
  }

  /** Public properties **/
  closeAction() {

    this.fabMenuFacade.isShownEventLog = !this.fabMenuFacade.isShownEventLog;
  }

}
