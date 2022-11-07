/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CaseDetailsFacade, VerificationFacade } from '@cms/case-management/domain';
import { Subscription } from 'rxjs';

@Component({
  selector: 'case-management-verification-page',
  templateUrl: './verification-page.component.html',
  styleUrls: ['./verification-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationPageComponent implements OnInit, OnDestroy {
  /** Private properties **/
  private saveClickSubscription !: Subscription;

  /** Constructor **/
  constructor(private caseDetailsFacade: CaseDetailsFacade,
    private verificationFacade:VerificationFacade) { }

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
      this.verificationFacade.save().subscribe((response: boolean) => {
        if(response){
          this.caseDetailsFacade.navigateToNextCaseScreen.next(true);
        }
      })
    });
  }
}
