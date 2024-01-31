import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { WidgetFacade } from '@cms/dashboard/domain';

@Component({
  selector: 'dashboard-widget-rent-overages',
  templateUrl: './widget-rent-overages.component.html',
  styleUrls: ['./widget-rent-overages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetRentOveragesComponent {
  @Input() isEditDashboard!: any; 
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private widgetFacade: WidgetFacade) {}


  removeWidgetCard(){
    this.removeWidget.emit();
  }
}
