/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Provider } from '../entities/provider';
/** Data services **/
 
import { StatusPeriodDataService } from '../infrastructure/status-period.data.service';

@Injectable({ providedIn: 'root' })
export class StatusPeriodFacade {
  /** Private properties **/
  private statusPeriodSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  statusPeriod$ = this.statusPeriodSubject.asObservable();
 

  /** Constructor**/
  constructor(private readonly statusPeriodDataService: StatusPeriodDataService) {}

  /** Public methods **/
  loadStatusPeriod(): void {
    this.statusPeriodDataService.loadStatusPeriod().subscribe({
      next: (statusPeriodResponse) => {
        this.statusPeriodSubject.next(statusPeriodResponse);
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
