import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { WidgetFacade } from '@cms/dashboard/domain';

@Component({
  selector: 'dashboard-widget-liheap',
  templateUrl: './widget-liheap.component.html',
  styleUrls: ['./widget-liheap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetLiheapComponent {
  @Input() isEditDashboard!: any; 
  @Input() dashboardId! : any 
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private widgetFacade: WidgetFacade) {}


  removeWidgetCard(){
    this.removeWidget.emit();
  }
}
