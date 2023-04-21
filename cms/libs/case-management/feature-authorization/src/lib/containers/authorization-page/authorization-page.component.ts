/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'case-management-authorization-page',
  templateUrl: './authorization-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationPageComponent {
  btnDisabled = false; 
  isCerForm = true;
}
