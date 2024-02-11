import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CaseScreenTab, HealthInsurancePlan, InsuranceTypeCode } from '@cms/case-management/domain';
import { WidgetFacade } from '@cms/dashboard/domain';

@Component({
  selector: 'dashboard-widget-insurance-type-fpl',
  templateUrl: './widget-insurance-type-fpl.component.html',
  styleUrls: ['./widget-insurance-type-fpl.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetInsuranceTypeFplComponent {
  @Input() isEditDashboard!: any; 
  @Input() dashboardId! : any 
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private readonly router: Router,private widgetFacade: WidgetFacade) {}


  removeWidgetCard(){
    this.removeWidget.emit();
  }

  allClientsNavigate()
  {
    const query = {
      queryParams: {
        tab: CaseScreenTab.ALL,
        healthInsuranceType: HealthInsurancePlan.OregonHealthPlan,
        fplPercentage: 138,
        filterOperator:"gt"
      },
    };
    this.router.navigate(['/case-management/cases'], query) 
  }
}
