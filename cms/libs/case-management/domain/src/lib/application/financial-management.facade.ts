/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({ providedIn: 'root' })

export class FinancialManagementFacade {
  vendorSearchBarsubject = new Subject<boolean>();

  vendorSearchBars$ = this.vendorSearchBarsubject.asObservable();

  enableVendorSearch() {
    this.vendorSearchBarsubject.next(true);
  }
}
