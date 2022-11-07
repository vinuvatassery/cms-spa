/** Angular **/
import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';

import { UIFormStyle } from '@cms/shared/ui-tpa' 

@Component({
  selector: 'system-config-eid-lifetime-period-detail',
  templateUrl: './eid-lifetime-period-detail.component.html',
  styleUrls: ['./eid-lifetime-period-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EidLifetimePeriodDetailComponent {
currentDate = new Date();
public formUiStyle : UIFormStyle = new UIFormStyle();
}
