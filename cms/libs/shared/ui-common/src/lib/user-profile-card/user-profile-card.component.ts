/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'common-user-profile-card',
  templateUrl: './user-profile-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileCardComponent {}
