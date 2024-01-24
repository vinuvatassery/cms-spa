import { Component } from '@angular/core';
import { WidgetFacade } from '@cms/dashboard/domain';

@Component({
  selector: 'dashboard-widget-direct-messages',
  templateUrl: './widget-direct-messages.component.html',
  styleUrls: ['./widget-direct-messages.component.scss'],
})
export class WidgetDirectMessagesComponent   {
  constructor(private widgetFacade: WidgetFacade) {}
 
}
