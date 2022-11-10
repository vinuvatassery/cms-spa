/** Angular **/
import { OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
/** External libraries **/
import { forkJoin, mergeMap, Observable, of, Subscription } from 'rxjs';
/** Facade **/
import { WorkflowFacade, ClientFacade } from '@cms/case-management/domain';
/** Entities **/
import { CompletionChecklist } from '@cms/case-management/domain';
/** Enums **/
import { NavigationType } from '@cms/case-management/domain';



@Component({
  selector: 'case-management-client-page',
  templateUrl: './client-page.component.html',
  styleUrls: ['./client-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientPageComponent implements OnInit, OnDestroy {

  /** Public properties **/

  /** Private properties **/
  private saveClickSubscription !: Subscription;

  constructor(private workflowFacade: WorkflowFacade,
    private clientFacade: ClientFacade) {

  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.addSaveSubscription();
  }
  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  /** Private methods **/
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
      return this.clientFacade.save();
    }

    return of(false)
  }
  
  /** Public  methods **/
  updatePageCount(completedDataPoints: CompletionChecklist[]) {
    if (completedDataPoints?.length > 0) {
      this.workflowFacade.updateChecklist(completedDataPoints);
    }
  }

  updateAdjustmentAttrCount(ajustData: CompletionChecklist[]) {
   if(ajustData){
    this.workflowFacade.updateBasedOnDtAttrChecklist(ajustData);
   }
  }
}
