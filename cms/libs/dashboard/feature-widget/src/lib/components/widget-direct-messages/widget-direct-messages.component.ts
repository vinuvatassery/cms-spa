import { Component, OnInit } from '@angular/core';
import { WidgetFacade } from '@cms/dashboard/domain';

@Component({
  selector: 'cms-widget-direct-messages',
  templateUrl: './widget-direct-messages.component.html',
  styleUrls: ['./widget-direct-messages.component.scss'],
})
export class WidgetDirectMessagesComponent implements OnInit {
  constructor(private widgetFacade: WidgetFacade) {}
  ngOnInit(): void {}
}
