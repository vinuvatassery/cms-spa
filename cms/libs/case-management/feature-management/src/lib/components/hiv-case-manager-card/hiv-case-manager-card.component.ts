/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'case-management-hiv-case-manager-card',
  templateUrl: './hiv-case-manager-card.component.html',
  styleUrls: ['./hiv-case-manager-card.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HivCaseManagerCardComponent {
  gridHoverDataItem !: any
  

}
