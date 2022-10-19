/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Expense } from '../entities/expense';
/** Data services **/
import { ExpenseDataService } from '../infrastructure/expense.data.service';

@Injectable({ providedIn: 'root' })
export class ExpenseFacade {
  /** Private  properties **/
  private expensesSubject = new BehaviorSubject<Expense[]>([]);

  /** Public properties **/
  expenses$ = this.expensesSubject.asObservable();

  /** Constructor **/
  constructor(private readonly expenseDataService: ExpenseDataService) {}

  /** Public methods **/
  loadExpenses(): void {
    this.expenseDataService.loadExpenses().subscribe({
      next: (expensesResponse) => {
        this.expensesSubject.next(expensesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
