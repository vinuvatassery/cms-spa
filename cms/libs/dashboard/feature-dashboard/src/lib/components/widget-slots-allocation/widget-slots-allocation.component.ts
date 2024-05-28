import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { WidgetFacade } from '@cms/dashboard/domain';

@Component({
  selector: 'dashboard-widget-slots-allocation',
  templateUrl: './widget-slots-allocation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetSlotsAllocationComponent {
  public categories: string[] = ['FORMULA', 'OHBHI', 'OSSCR', 'SECURE'];
  public data: number[] = [50, 21, 10, 30];

  public salesData: number[] = [20, 40, 45, 30,  ];
  public purchaseData: number[] = [12, 30, 30, 45,  ]; 

  @Input() isEditDashboard!: any; 
  @Input() dashboardId! : any 
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private widgetFacade: WidgetFacade) {}


  removeWidgetCard(){
    this.removeWidget.emit();
  }
}
