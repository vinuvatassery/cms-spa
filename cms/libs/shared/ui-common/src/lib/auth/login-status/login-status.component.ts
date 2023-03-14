/** Angular **/
import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, OnInit } from '@angular/core';
import { UserProfileService } from '@cms/shared/util-core';
/** Services **/
import { AuthService } from '@cms/shared/util-oidc';
@Component({
  selector: 'common-login-status',
  templateUrl: './login-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginStatusComponent implements OnInit {
  /** Constructor **/
  userData: any = {};
  isAccountSettingsPopup = false;

  constructor(private authService: AuthService,
    private userProfileService: UserProfileService) { }

  @ViewChild('anchor')
  anchor!: ElementRef;
  @ViewChild('popup', { read: ElementRef })
  popup!: ElementRef;

  data: Array<any> = [{}];
  popupClass = 'user-setting-dropdown';

  ngOnInit() {
    this.getLoggedInUserProfile();
  }


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

  getLoggedInUserProfile() {
    this.userProfileService.getProfile$.subscribe((profile: any) => {
      if (profile) {
        this.userData = profile[0];
      }
    })
  }

  onCloseAccountSettingsClicked() { this.isAccountSettingsPopup = false; }
  onAccountSettingsClicked() { this.isAccountSettingsPopup = true; }
}
