/** Angular **/
import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'system-config-case-availability-detail',
  templateUrl: './case-availability-detail.component.html',
  styleUrls: ['./case-availability-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseAvailabilityDetailComponent {}
