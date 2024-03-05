import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'common-grid-no-records',
  templateUrl: './grid-no-records.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridNoRecordsComponent {}
