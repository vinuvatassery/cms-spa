import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dashboard-widget-quick-links',
  templateUrl: './widget-quick-links.component.html',
  styleUrls: ['./widget-quick-links.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetQuickLinksComponent {}
