import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WidgetFacade } from '@cms/dashboard/domain';

@Component({
  selector: 'dashboard-widget-direct-messages',
  templateUrl: './widget-direct-messages.component.html',
  styleUrls: ['./widget-direct-messages.component.scss'],
})
export class WidgetDirectMessagesComponent   {
  @Input() isEditDashboard!: any; 
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private widgetFacade: WidgetFacade) {}


  removeWidgetCard(){
    this.removeWidget.emit();
  }
 
}
