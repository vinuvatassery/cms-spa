import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { WidgetFacade } from '@cms/dashboard/domain';

@Component({
  selector: 'dashboard-widget-quick-links',
  templateUrl: './widget-quick-links.component.html',
  styleUrls: ['./widget-quick-links.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetQuickLinksComponent {
  @Input() isEditDashboard!: any; 
  @Input() dashboardId! : any 
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private widgetFacade: WidgetFacade) {}


  removeWidgetCard(){
    this.removeWidget.emit();
  }
}
