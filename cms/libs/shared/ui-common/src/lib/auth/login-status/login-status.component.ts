/** Angular **/
import { Component, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
/** Services **/
import { AuthService } from '@cms/shared/util-oidc';
@Component({
  selector: 'common-login-status',
  templateUrl: './login-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginStatusComponent {
  /** Constructor **/
 
  isAccountSettingsPopup = false;
  isProfilePopoverOpen = false;
  constructor(private authService: AuthService) { }

  @ViewChild('anchor')
  anchor!: ElementRef;
  @ViewChild('popup', { read: ElementRef })
  popup!: ElementRef;

  data: Array<any> = [{}];
  popupClass = 'user-setting-dropdown';
 

  user() {
    return this.authService.getUser();
  }
  onGetUser() {
    return this.authService.getUser();
  }
  onLogOff() {
    this.authService.logOut();
  }
  onLogOffClicked() {
    this.authService.logOut();
  }
  isAuthenticated() {
    console.log('isAuthenticated: ' + this.authService.isAuthenticated);
    return this.authService.isAuthenticated;
  }

  onCloseAccountSettingsClicked() { this.isAccountSettingsPopup = false; }
  onAccountSettingsClicked() { this.isAccountSettingsPopup = true; }
}
