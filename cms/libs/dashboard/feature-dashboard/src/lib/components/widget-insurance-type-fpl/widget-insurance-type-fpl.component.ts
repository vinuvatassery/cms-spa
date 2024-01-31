import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { WidgetFacade } from '@cms/dashboard/domain';

@Component({
  selector: 'dashboard-widget-insurance-type-fpl',
  templateUrl: './widget-insurance-type-fpl.component.html',
  styleUrls: ['./widget-insurance-type-fpl.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetInsuranceTypeFplComponent {
  @Input() isEditDashboard!: any; 
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private widgetFacade: WidgetFacade) {}


  removeWidgetCard(){
    this.removeWidget.emit();
  }
}
