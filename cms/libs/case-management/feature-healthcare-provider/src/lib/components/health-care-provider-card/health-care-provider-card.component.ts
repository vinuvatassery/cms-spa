/** Angular **/
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'case-management-health-care-provider-card',
  templateUrl: './health-care-provider-card.component.html',
  styleUrls: ['./health-care-provider-card.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthCareProviderCardComponent {
  @Input() gridHoverDataItem!: any;

}
