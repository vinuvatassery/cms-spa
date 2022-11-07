/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CaseDetailsFacade, HealthInsuranceFacade } from '@cms/case-management/domain';
import { Subscription } from 'rxjs';

@Component({
  selector: 'case-management-health-insurance-page',
  templateUrl: './health-insurance-page.component.html',
  styleUrls: ['./health-insurance-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthInsurancePageComponent implements OnInit, OnDestroy {

  /** Private properties **/
  private saveClickSubscription !: Subscription;

  /** Constructor **/
  constructor(private caseDetailsFacade: CaseDetailsFacade,
    private healthInsuranceFacade:HealthInsuranceFacade) {  }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.saveClickSubscribed();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  /** Private Methods **/
  private saveClickSubscribed(): void {
    this.saveClickSubscription = this.caseDetailsFacade.saveAndContinueClicked.subscribe(() => {
      this.healthInsuranceFacade.save().subscribe((response: boolean) => {
        if(response){
          this.caseDetailsFacade.navigateToNextCaseScreen.next(true);
        }
      })
    });
  }


}
