/** Angular **/
import { OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CaseDetailsFacade, ClientFacade } from '@cms/case-management/domain';
import { Observable, of, Subscription } from 'rxjs';

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

  constructor(private caseDetailsFacade: CaseDetailsFacade,
    private clientFacade:ClientFacade){
    
  }


  /** Lifecycle hooks **/

  ngOnInit(): void {
    this.saveClickSubscribed();
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
  private saveClickSubscribed():void{
    this.saveClickSubscription = this.caseDetailsFacade.saveAndContinueClicked.subscribe(() => {
      this.clientFacade.save().subscribe((response: boolean) => {
        if(response){
          this.caseDetailsFacade.navigateToNextCaseScreen.next(true);
        }
      })
     });
  }
}
