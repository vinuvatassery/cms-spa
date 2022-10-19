/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs';
/** Entities **/
import { Income } from '../entities/income';
/** Data services **/
import { IncomeDataService } from '../infrastructure/income.data.service';

@Injectable({ providedIn: 'root' })
export class IncomeFacade {
  /** Private properties **/
  private incomesSubject = new BehaviorSubject<Income[]>([]);

  /** Public properties **/
  incomes$ = this.incomesSubject.asObservable();

  /** Constructor **/
  constructor(private readonly incomeDataService: IncomeDataService) {}

  /** Public methods **/
  loadIncomes(): void {
    this.incomeDataService.loadIncomes().subscribe({
      next: (incomesResponse) => {
        this.incomesSubject.next(incomesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
