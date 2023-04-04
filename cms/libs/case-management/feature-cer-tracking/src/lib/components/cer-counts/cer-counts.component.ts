/** Angular **/
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'case-management-cer-counts',
  templateUrl: './cer-counts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CerCountsComponent {
  @Input() cerTrackingCount! :any
}
