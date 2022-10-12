/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { IncomeFacade } from '@cms/financial-management/domain';

@Component({
  selector: 'financial-management-income-page',
  templateUrl: './income-page.component.html',
  styleUrls: ['./income-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomePageComponent implements OnInit {
  /** Public properties **/
  incomes$ = this.incomeFacade.incomes$;

  /** Constructor **/
  constructor(private readonly incomeFacade: IncomeFacade) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadIncomes();
  }

  /** Private methods **/
  private loadIncomes(): void {
    this.incomeFacade.loadIncomes();
  }
}
