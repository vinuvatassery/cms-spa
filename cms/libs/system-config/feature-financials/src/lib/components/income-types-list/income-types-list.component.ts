import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'cms-income-types',
  templateUrl: './income-types-list.component.html',
  styleUrls: ['./income-types-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncomeTypesListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
