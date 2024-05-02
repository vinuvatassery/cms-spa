import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'client-portal-signin',
  templateUrl: './signin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent {}
