/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { ExpenseFacade } from '@cms/financial-management/domain';

@Component({
  selector: 'financial-management-expense-page',
  templateUrl: './expense-page.component.html',
  styleUrls: ['./expense-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensePageComponent implements OnInit {
  /** Public properties **/
  expenses$ = this.expenseFacade.expenses$;

  /** Constructor **/
  constructor(private readonly expenseFacade: ExpenseFacade) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadExpenses();
  }

  /** Private methods **/
  private loadExpenses(): void {
    this.expenseFacade.loadExpenses();
  }
}
