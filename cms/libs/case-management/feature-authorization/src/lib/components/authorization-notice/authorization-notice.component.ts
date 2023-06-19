/** Angular **/
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'case-management-authorization-notice',
  templateUrl: './authorization-notice.component.html',
  styleUrls: ['./authorization-notice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationNoticeComponent {
  @Input() templateNotice$ : any
}
