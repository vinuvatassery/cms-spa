/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { DirectMessageFacade } from '@cms/productivity-tools/domain';

@Component({
  selector: 'productivity-tools-direct-message-page',
  templateUrl: './direct-message-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectMessagePageComponent implements OnInit {
  /** Public properties **/
  directMessages$ = this.directMessageFacade.directMessages$;

  /** Constructor **/
  constructor(private readonly directMessageFacade: DirectMessageFacade) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadDirectMessages();
  }

  /** Private methods **/
  private loadDirectMessages(): void {
    this.directMessageFacade.loadDirectMessages();
  }
}
