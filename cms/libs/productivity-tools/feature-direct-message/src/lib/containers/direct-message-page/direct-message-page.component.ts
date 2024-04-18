/** Angular **/
/** Facades **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query'; 
import { DirectMessageFacade } from '@cms/productivity-tools/domain';

@Component({
  selector: 'productivity-tools-direct-message-page',
  templateUrl: './direct-message-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectMessagePageComponent {
  /** Public properties **/
  directMessages$ = this.directMessageFacade.directMessages$;

  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  sortType = this.directMessageFacade.sortType;
  pageSizes = this.directMessageFacade.gridPageSizes;
  gridSkipCount = this.directMessageFacade.skipCount;
  sortValueDirectMsg = this.directMessageFacade.sortValueDirectMsg;
  sortDirectMsg = this.directMessageFacade.sortDirectMsg;
  state!: State;
  directMessagesGridLists$ = this.directMessageFacade.directMessagesLists$;

  /** Constructor **/
  constructor(private readonly directMessageFacade: DirectMessageFacade) {}

 

  /** Private methods **/
  loadDirectMessagesList(event: any): void {
    if(event){ 
      this.directMessageFacade.loadDirectMessagesLists(event);
    }
    
  }
}
