/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { FabMenuFacade } from '@cms/productivity-tools/domain';

@Component({
  selector: 'productivity-tools-event-log-fab-page',
  templateUrl: './event-log-fab-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventLogComponentFabPageComponent 
{  
  constructor(
    public readonly fabMenuFacade: FabMenuFacade  
  ) {}
  
  /** Public properties **/
  closeAction() {
   
    this.fabMenuFacade.isShownEventLog = !this.fabMenuFacade.isShownEventLog;
  }

}
