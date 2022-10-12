/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { HealthInsuranceFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-set-health-insurance-priority',
  templateUrl: './set-health-insurance-priority.component.html',
  styleUrls: ['./set-health-insurance-priority.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetHealthInsurancePriorityComponent implements OnInit {
  /** Public properties **/
  ddlMedicalHealthPlanPriority$ =
    this.healthFacade.ddlMedicalHealthPlanPriority$;

  /** Constructor **/
  constructor(private readonly healthFacade: HealthInsuranceFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlMedicalHealthPlanPriority();
  }

  /** Private methods **/
  private loadDdlMedicalHealthPlanPriority() {
    this.healthFacade.loadDdlMedicalHealthPlanPriority();
  }
}
