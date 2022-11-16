import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'system-config-expense-types-list',
  templateUrl: './expense-types-list.component.html',
  styleUrls: ['./expense-types-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpenseTypesListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
