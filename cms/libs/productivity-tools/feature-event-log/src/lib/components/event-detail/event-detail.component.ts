/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { EventLogFacade } from '@cms/productivity-tools/domain';
import {
  DateInputSize,
  DateInputRounded,
  DateInputFillMode,
} from '@progress/kendo-angular-dateinputs';

@Component({
  selector: 'productivity-tools-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailComponent implements OnInit {

  public size: DateInputSize = 'medium';
  public rounded: DateInputRounded = 'full';
  public fillMode: DateInputFillMode = 'outline';
  /** Public properties **/
  ddlEvents$ = this.eventLogFacade.ddlEvents$;

  /** Constructor **/
  constructor(private readonly eventLogFacade: EventLogFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlEvents();
  }

  /** Private methods **/
  private loadDdlEvents() {
    this.eventLogFacade.loadDdlEvents();
  }
}
