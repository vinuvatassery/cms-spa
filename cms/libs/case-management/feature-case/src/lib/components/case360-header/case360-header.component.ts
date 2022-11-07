/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
/** External libraries **/
import { DialItemAnimation } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'case-management-case360-header',
  templateUrl: './case360-header.component.html',
  styleUrls: ['./case360-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Case360HeaderComponent {
  /** Public properties **/
  isAnimationOptionsOpened: boolean | DialItemAnimation = false;
  isStatusPeriodDetailOpened = false;
  isGroupDetailOpened = false;

  /** Internal event methods **/
  onStatusPeriodDetailClosed() {
    this.isStatusPeriodDetailOpened = false;
  }

  onStatusPeriodDetailClicked() {
    this.isStatusPeriodDetailOpened = true;
  }

  onGroupDetailClosed() {
    this.isGroupDetailOpened = false;
  }

  onGroupDetailClicked() {
    this.isGroupDetailOpened = true;
  }
}
