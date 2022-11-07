/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Provider } from '../entities/provider';
/** Data services **/
 
import { StatusPeriodDataService } from '../infrastructure/statusperiod.data.service';

@Injectable({ providedIn: 'root' })
export class StatusPeriodFacade {
  /** Private properties **/
  private StatusPeriodSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  StatusPeriod$ = this.StatusPeriodSubject.asObservable();
 

  /** Constructor**/
  constructor(private readonly statusPeriodDataService: StatusPeriodDataService) {}

  /** Public methods **/
  loadStatusPeriod(): void {
    this.statusPeriodDataService.loadStatusPeriod().subscribe({
      next: (StatusPeriodResponse) => {
        this.StatusPeriodSubject.next(StatusPeriodResponse);
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
