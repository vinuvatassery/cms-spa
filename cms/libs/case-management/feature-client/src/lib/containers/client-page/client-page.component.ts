/** Angular **/
import { outputAst } from '@angular/compiler';
import { EventEmitter, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { WorkflowFacade, ClientFacade, NavigationType, CompletionStatusUpdate } from '@cms/case-management/domain';
import { forkJoin, mergeMap, Observable, of, Subscription } from 'rxjs';

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

  /** Public  methods **/
  canDeactivate(): Observable<boolean> {
    //if (!this.isSaved) {
    const result = window.confirm('There are unsaved changes! Are you sure?');
    return of(result);
    //}

    //return of(true);
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

  updatePageCount(completedDataPoints: string[]) {
    if (completedDataPoints?.length > 0) {
      this.workflowFacade.updateChecklist('ApplicantInfo', completedDataPoints);
    }
  }

  updateAdjustmentAttrCount(completedDataPoints: string[]) {
   // this.workflowFacade.calculateAdjustmentAttributeCount('ApplicantInfo', completedDataPoints)
  }
}
