import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { WidgetFacade } from '@cms/dashboard/domain';

@Component({
  selector: 'dashboard-widget-service-tracking',
  templateUrl: './widget-service-tracking.component.html',
  styleUrls: ['./widget-service-tracking.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetServiceTrackingComponent {
  @Input() isEditDashboard!: any; 
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private widgetFacade: WidgetFacade) {}


  removeWidgetCard(){
    this.removeWidget.emit();
  }
}
