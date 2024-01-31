import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dashboard-widget-applications-cers',
  templateUrl: './widget-applications-cers.component.html',
  styleUrls: ['./widget-applications-cers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetApplicationsCersComponent {

  @Input() isEditDashboard!: any; 
  @Output() removeWidget = new EventEmitter<string>();

  removeWidgetCard(){
    this.removeWidget.emit();
  }
}
