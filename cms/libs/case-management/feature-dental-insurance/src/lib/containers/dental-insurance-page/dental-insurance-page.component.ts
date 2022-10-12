/** Angular **/
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
/** Facades **/
import { DentalInsuranceFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-dental-insurance-page',
  templateUrl: './dental-insurance-page.component.html',
  styleUrls: ['./dental-insurance-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalInsurancePageComponent implements OnInit {
  /** Public properties **/
  dentalInsurances$ = this.dentalInsuranceFacade.dentalInsurances$;

  /** Constructor **/
  constructor(private readonly dentalInsuranceFacade: DentalInsuranceFacade) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadDentalInsurances();
  }

  /** Private methods **/
  private loadDentalInsurances(): void {
    this.dentalInsuranceFacade.loadDentalInsurances();
  }
}
