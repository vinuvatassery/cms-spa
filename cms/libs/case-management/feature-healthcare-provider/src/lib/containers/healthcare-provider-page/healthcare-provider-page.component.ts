/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
/** External libraries **/
import { forkJoin, mergeMap, of, Subscription } from 'rxjs';
/** Facades **/
import { WorkflowFacade, HealthcareProviderFacade } from '@cms/case-management/domain';
/** Enums **/
import { NavigationType } from '@cms/case-management/domain';

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
  constructor(private workflowFacade: WorkflowFacade,
    private healthProviderFacade: HealthcareProviderFacade) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.addSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  /** Private Methods **/
  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.workflowFacade.navigate(navigationType);
      }
    });
  }

  private save() {
    let isValid = true;
    // TODO: validate the form
    if (isValid) {
      return this.healthProviderFacade.save();
    }

    return of(false)
  }

  /** Internal event methods **/
  onProviderValueChanged() {
    this.hasNoProvider = !this.hasNoProvider;
  }
}
