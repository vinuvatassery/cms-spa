/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
/** Internal Libraries **/
import { CaseDetailsFacade, CompletionStatusFacade, EmploymentFacade } from '@cms/case-management/domain';
import { Subscription } from 'rxjs';

@Component({
  selector: 'case-management-employment-page',
  templateUrl: './employment-page.component.html',
  styleUrls: ['./employment-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmploymentPageComponent implements OnInit, OnDestroy {
  /** Public Properties */
  isEmploymentGridDisplay = true;
  employers$ = this.employmentFacade.employers$;
  completeStaus$ = this.completionStatusFacade.completionStatus$;
  
    /** Private properties **/
    private saveClickSubscription !: Subscription;
    
  /** Constructor */
  constructor(
    private employmentFacade: EmploymentFacade,
    private completionStatusFacade: CompletionStatusFacade,
    private caseDetailsFacade: CaseDetailsFacade
    ) {}
    
  /** Lifecycle Hooks */
  ngOnInit() {
    this.loadEmployers();
    this.saveClickSubscribed();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }
  
  /** Private Methods */
  loadEmployers(): void {
    this.employmentFacade.loadEmployers();
  }

  updateCompletionStatus(status: any) {
    this.completionStatusFacade.updateCompletionStatus(status);
  }

  
  /** Private Methods **/
  private saveClickSubscribed(): void {
    this.saveClickSubscription = this.caseDetailsFacade.saveAndContinueClicked.subscribe(() => {
      this.employmentFacade.save().subscribe((response: boolean) => {
        if(response){
          this.caseDetailsFacade.navigateToNextCaseScreen.next(true);
        }
      })
    });
  }
  
  /** Internal event methods **/
  onUnEmployedClicked() {
    this.isEmploymentGridDisplay = !this.isEmploymentGridDisplay;
  }
  
  onChangeCounterClick() {
    this.updateCompletionStatus({
      name: 'Employment',
      completed: 15,
      total: 31,
    });
  }
}
