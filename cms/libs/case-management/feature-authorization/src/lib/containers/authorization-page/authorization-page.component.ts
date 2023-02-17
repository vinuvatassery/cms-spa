/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'case-management-authorization-page',
  templateUrl: './authorization-page.component.html',
  styleUrls: ['./authorization-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationPageComponent {
  btnDisabled = false; 
}
