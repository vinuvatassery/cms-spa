/** Angular **/
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import {
  DateInputSize,
  DateInputRounded,
  DateInputFillMode,
} from '@progress/kendo-angular-dateinputs';

@Component({
  selector: 'case-management-employer-detail',
  templateUrl: './employer-detail.component.html',
  styleUrls: ['./employer-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerDetailComponent {
 currentDate = new Date();
  public size: DateInputSize = 'medium';
  public rounded: DateInputRounded = 'full';
  public fillMode: DateInputFillMode = 'outline';
  /** Input properties **/
  @Input() isAdd = true;
}
