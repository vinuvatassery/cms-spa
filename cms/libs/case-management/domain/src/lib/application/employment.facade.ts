/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ClientEmployer } from '../entities/client-employer';
/** Data services **/
import { ContactDataService } from '../infrastructure/contact.data.service';

@Injectable({ providedIn: 'root' })
export class EmploymentFacade {
  /** Private properties **/
  private employersSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  employers$ = this.employersSubject.asObservable();

  /** Constructor**/
  constructor(private readonly contactDataService: ContactDataService) { }

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

  save(): Observable<boolean> {
    //TODO: save api call   
    return of(true)
  }

  createEmployer(clientEmployer: ClientEmployer): Observable<any> {
    return this.contactDataService.createClientEmployer(clientEmployer)
  }

  updateEmployer(clientEmployer: ClientEmployer): Observable<any> {
    return this.contactDataService.updateClientEmployer(clientEmployer)
  }

  deleteEmployer(clientEmployerId: string) {
    return this.contactDataService.deleteClientEmployer(clientEmployerId)
  }
}
