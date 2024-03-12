/** Angular **/
/** Facades **/
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';


@Component({
  selector: 'productivity-tools-direct-message-fab',
  templateUrl: './direct-message-fab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectMessageFabComponent implements OnInit{
  showDirectMessages = false
  /** Public properties **/
  closeAction()
  {
    this.showDirectMessages = false
  }

    /** Lifecycle hooks **/
    ngOnInit(): void {
      
      this.showDirectMessages = true
    }
}
