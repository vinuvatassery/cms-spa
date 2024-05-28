import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'client-portal-cp-my-profile',
  templateUrl: './cp-my-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CpMyProfileComponent {}
