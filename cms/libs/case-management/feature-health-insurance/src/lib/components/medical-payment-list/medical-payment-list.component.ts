/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { HealthInsuranceFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-medical-payment-list',
  templateUrl: './medical-payment-list.component.html',
  styleUrls: ['./medical-payment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPaymentListComponent implements OnInit {
  /** Public **/
  medicalPremiumPayments$ = this.healthFacade.medicalPremiumPayments$;
  gridOptionData: Array<any> = [{ text: 'Options' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';

  /** Constructor **/
  constructor(private readonly healthFacade: HealthInsuranceFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadMedicalPremiumPayments();
  }

  /** Private methods **/
  private loadMedicalPremiumPayments() {
    this.healthFacade.loadMedicalPremiumPayments();
  }
}
