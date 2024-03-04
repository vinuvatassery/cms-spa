/** Angular **/
/** Facades **/
import { Component, ChangeDetectionStrategy, OnInit, AfterContentChecked, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'productivity-tools-direct-message-fab',
  templateUrl: './direct-message-fab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectMessageFabComponent implements OnInit {
  showDirectMessages = false
  closeButtonClicked = false


  
  /** Public properties **/
  closeAction()
  {
    
    this.showDirectMessages = false
    this.closeButtonClicked = true
  }

    /** Lifecycle hooks **/
    ngOnInit(): void {
      
      this.showDirectMessages = true
    }
}
