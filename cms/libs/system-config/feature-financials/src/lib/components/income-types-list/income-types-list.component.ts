import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'system-config-income-types-list',
  templateUrl: './income-types-list.component.html',
  styleUrls: ['./income-types-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncomeTypesListComponent {
}
