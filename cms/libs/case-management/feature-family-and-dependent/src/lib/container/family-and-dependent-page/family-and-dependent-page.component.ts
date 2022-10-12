/** Angular **/
import { OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
/** Internal Libraries **/
import { CaseDetailsFacade, CompletionStatusFacade, FamilyAndDependentFacade } from '@cms/case-management/domain';
import { Subscription } from 'rxjs';

@Component({
  selector: 'case-management-family-and-dependent-page',
  templateUrl: './family-and-dependent-page.component.html',
  styleUrls: ['./family-and-dependent-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FamilyAndDependentPageComponent implements OnInit, OnDestroy {
  /** Public Methods **/
  dependentList$ = this.familyAndDependentFacade.dependents$;
  completeStaus$ = this.completionStatusFacade.completionStatus$;
  isFamilyGridDisplay = true;

  /** Private properties **/
  private saveClickSubscription !: Subscription;

  /** Constructor **/
  constructor(
    private familyAndDependentFacade: FamilyAndDependentFacade,
    private completionStatusFacade: CompletionStatusFacade,
    private caseDetailsFacade: CaseDetailsFacade
  ) { }


  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.loadDependents();
    this.saveClickSubscribed();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  /** Private Methods **/
  private loadDependents(): void {
    this.familyAndDependentFacade.loadDependents();
  }

  updateCompletionStatus(status: any) {
    this.completionStatusFacade.updateCompletionStatus(status);
  }

  private saveClickSubscribed():void{
    this.saveClickSubscription = this.caseDetailsFacade.saveAndContinueClicked.subscribe(() => {
      this.familyAndDependentFacade.save().subscribe((response: boolean) => {
        if(response){
          this.caseDetailsFacade.navigateToNextCaseScreen.next(true);
        }
      })
     });
  }

  /** Internal event methods **/
  onChangeCounterClick() {
    this.updateCompletionStatus({
      name: 'Family & Dependents',
      completed: 15,
      total: 31,
    });
  }

  onNoFamilyMemberClicked() {
    this.isFamilyGridDisplay = !this.isFamilyGridDisplay;
  }
}
