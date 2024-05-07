import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CaseScreenTab, HealthInsurancePlan } from '@cms/case-management/domain';
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
  insuranceTypeFPLStats:any; 
  showGraph = false
  constructor(private readonly router: Router,private widgetFacade: WidgetFacade, private readonly cd: ChangeDetectorRef ) {
    this.insuranceTypeFPLStats = new Array();
  }

  ngOnInit(): void {  
    this.loadApplicationCERStats();
  }
  loadApplicationCERStats() {
    this.insuranceTypeFPLStats = null
    this.widgetFacade.loadInsuranceTypeFPLStats(this.dashboardId);
    this.widgetFacade.insuranceTypeFPLStats$ 
      .subscribe({
        next: (response) => {
          this.showGraph = true
            this.insuranceTypeFPLStats = response.insuranceTypeFPLStats; 
            this.cd.detectChanges();           
        }      
      });
  }
  removeWidgetCard(){
    this.removeWidget.emit();
  }

  allClientsNavigate(insuranceType:string)
  {
    let healthInsuranceType = '';
    let operator = '';
    let fplPer = 0;
    if(insuranceType =="OHP"){
      healthInsuranceType = HealthInsurancePlan.OregonHealthPlan;
      operator = 'gt';
      fplPer = 138;
    }else{
      healthInsuranceType = HealthInsurancePlan.OffExchangePlan;
      operator = 'lte';
      fplPer = 138;
    }
    const query = {
      queryParams: {
        tab: CaseScreenTab.ALL,
        healthInsuranceType: healthInsuranceType,
        fplPercentage: fplPer,
        filterOperator:operator
      },
    };
    this.router.navigate(['/case-management/cases'], query) 
  }
}
