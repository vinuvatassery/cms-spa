/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CaseDetailsFacade, HealthcareProviderFacade } from '@cms/case-management/domain';
import { Subscription } from 'rxjs';

@Component({
  selector: 'case-management-healthcare-provider-page',
  templateUrl: './healthcare-provider-page.component.html',
  styleUrls: ['./healthcare-provider-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthcareProviderPageComponent implements OnInit, OnDestroy {
  /** Public properties **/
  hasNoProvider = false;

  /** Private properties **/
  private saveClickSubscription !: Subscription;

  /** Constructor **/
  constructor(private caseDetailsFacade: CaseDetailsFacade,
    private healthProvider:HealthcareProviderFacade) { }

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
      this.healthProvider.save().subscribe((response: boolean) => {
        if(response){
          this.caseDetailsFacade.navigateToNextCaseScreen.next(true);
        }
      })
    });
  }

  /** Internal event methods **/
  onProviderValueChanged() {
    this.hasNoProvider = !this.hasNoProvider;
  }
}
