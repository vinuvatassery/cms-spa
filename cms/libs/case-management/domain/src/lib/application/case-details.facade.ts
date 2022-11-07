import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CaseDetailsFacade {
  saveAndContineClick = new Subject<any>();
  saveAndContinueClicked  = new Subject<any>();
  navigateToNextCaseScreen = new Subject<any>();

  constructor() { }

  save(): void {
    this.saveAndContineClick.next(true);
  }
}
