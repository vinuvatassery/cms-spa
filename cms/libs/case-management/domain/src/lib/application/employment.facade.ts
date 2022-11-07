/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Data services **/
import { ContactDataService } from '../infrastructure/contact.data.service';

@Injectable({ providedIn: 'root' })
export class EmploymentFacade {
  /** Private properties **/
  private employersSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  employers$ = this.employersSubject.asObservable();

  /** Constructor**/
  constructor(private readonly contactDataService: ContactDataService) {}

  /** Public methods **/
  loadEmployers(): void {
    this.contactDataService.loadEmployers().subscribe({
      next: (employersResponse) => {
        this.employersSubject.next(employersResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  save():Observable<boolean>{
    //TODO: save api call   
    return of(true);
  }
}
