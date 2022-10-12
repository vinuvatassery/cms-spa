/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'common-user-profile-card',
  templateUrl: './user-profile-card.component.html',
  styleUrls: ['./user-profile-card.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileCardComponent {}
