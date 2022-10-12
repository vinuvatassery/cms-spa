/** Angular **/
import { OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CaseDetailsFacade } from '@cms/case-management/domain';
import { Subscription } from 'rxjs';

@Component({
  selector: 'case-management-drug-page',
  templateUrl: './drug-page.component.html',
  styleUrls: ['./drug-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugPageComponent implements OnInit, OnDestroy{
  /** Public properties **/
  isBenefitsChanged = true;

  /** Private properties **/
  private saveClickSubscription !: Subscription;

  /** Constructor **/
  constructor(private caseDetailsFacade: CaseDetailsFacade) { }

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
      this.saveClickSubscription = this.caseDetailsFacade.saveAndContinueClicked.subscribe(() => {
        console.log('save and continue for drug clicked....');
        this.caseDetailsFacade.navigateToNextCaseScreen.next(true);
      });
    });
  }

  /** Internal event methods **/
  onBenefitsValueChange() {
    this.isBenefitsChanged = !this.isBenefitsChanged;
  }
}
