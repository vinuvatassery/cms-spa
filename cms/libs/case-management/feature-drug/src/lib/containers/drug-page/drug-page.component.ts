/** Angular **/
import { OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
/** External libraries **/
import { forkJoin, mergeMap, of, Subscription } from 'rxjs';
/** Facades **/
import { DrugPharmacyFacade,  WorkflowFacade } from '@cms/case-management/domain';
/** Enums **/
import {  NavigationType } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-drug-page',
  templateUrl: './drug-page.component.html',
  styleUrls: ['./drug-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugPageComponent implements OnInit, OnDestroy {
  /** Public properties **/
  isBenefitsChanged = true;

  /** Private properties **/
  private saveClickSubscription !: Subscription;

  /** Constructor **/
  constructor(private workflowFacade: WorkflowFacade, private drugPharmacyFacade: DrugPharmacyFacade) { }

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
      return this.drugPharmacyFacade.save();
    }

    return of(false)
  }

  /** Internal event methods **/
  onBenefitsValueChange() {
    this.isBenefitsChanged = !this.isBenefitsChanged;
  }
}
