/** Angular **/
import {    ChangeDetectionStrategy,    Component,     OnInit  } from '@angular/core'; 

  @Component({
    selector: 'productivity-tools-event-log-fab-page',
    templateUrl: './event-log-fab-page.component.html',  
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class EventLogComponentFabPageComponent implements OnInit {

    showEventLogs = false
    /** Public properties **/
    closeAction()
    {
      this.showEventLogs = false
    }
  
      /** Lifecycle hooks **/
      ngOnInit(): void {
        
        this.showEventLogs = true
      }
  }