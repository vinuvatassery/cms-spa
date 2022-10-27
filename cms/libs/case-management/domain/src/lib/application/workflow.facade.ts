import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NavigationType } from '../enums/navigation-type.enum';

@Injectable({
  providedIn: 'root'
})
export class WorkflowFacade {

  /** Private properties **/
  private saveAndContinueClickedSubject = new Subject<NavigationType>();
  private navigationTriggerSubject = new Subject<NavigationType>();

  /** Public properties **/
  saveAndContinueClicked$ = this.saveAndContinueClickedSubject.asObservable();
  navigationTrigger$ = this.navigationTriggerSubject.asObservable();

  /** Public methods **/
  save(navigationType: NavigationType) {
    this.saveAndContinueClickedSubject.next(navigationType);
  }

  navigate(navigationType: NavigationType) {
    if (navigationType === NavigationType.Next) {
      this.navigateNext();
    }
    else if (navigationType === NavigationType.Previous) {
      this.navigatePrevious();
    }
  }

  /** private  methods **/
  private navigateNext() {
    this.navigationTriggerSubject.next(NavigationType.Next);
  }

  private navigatePrevious() {
    this.navigationTriggerSubject.next(NavigationType.Previous);
  }
} 
