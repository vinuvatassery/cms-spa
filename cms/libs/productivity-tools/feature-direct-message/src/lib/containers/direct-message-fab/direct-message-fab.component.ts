/** Angular **/
/** Facades **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FabMenuFacade } from '@cms/productivity-tools/domain';


@Component({
  selector: 'productivity-tools-direct-message-fab',
  templateUrl: './direct-message-fab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectMessageFabComponent {
  constructor(
    public readonly fabMenuFacade: FabMenuFacade  
  ) {}
  
  /** Public properties **/
  closeAction() {
   
    this.fabMenuFacade.isShownDirectMessage = !this.fabMenuFacade.isShownDirectMessage;
  }
}
