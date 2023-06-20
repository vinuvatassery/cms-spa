import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cms-refund-batches-list',
  templateUrl: './refund-batches-list.component.html',
  styleUrls: ['./refund-batches-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundBatchesListComponent {}
