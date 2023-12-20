/** Angular **/
import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
/** Services **/
import { AuthService } from '@cms/shared/util-oidc';
import { UserDataService } from '@cms/system-config/domain';
import { Subject } from 'rxjs';
@Component({
  selector: 'common-login-status',
  templateUrl: './login-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginStatusComponent  implements OnInit{
  /** Constructor **/
 
  isAccountSettingsPopup = false;
  isProfilePopoverOpen = false;
  constructor(private authService: AuthService, 
    private readonly userDataService: UserDataService,private readonly cd: ChangeDetectorRef) { }

  @ViewChild('anchor')
  anchor!: ElementRef;
  @ViewChild('popup', { read: ElementRef })
  popup!: ElementRef;
  userImageSubject = new Subject<any>();
  imageLoaderVisible = true;
  data: Array<any> = [{}];
  popupClass = 'user-setting-dropdown';
  userInfo!:any;

  ngOnInit(): void {
    this.loadProfilePhoto();
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

  loadProfilePhoto() {
    this.userDataService.getProfile$.subscribe(users => {
      this.userInfo = users[0];
      this.userDataService.getUserImage(users[0].loginUserId).subscribe({
        next: (userImageResponse: any) => {
          this.userImageSubject.next(userImageResponse);
          this.imageLoaderVisible = true;
          this.cd.detectChanges();
        },
      });
    })
  }
  onLoad() {
    this.imageLoaderVisible = false;
  }
  onCloseAccountSettingsClicked() { this.isAccountSettingsPopup = false; }
  onAccountSettingsClicked() { this.isAccountSettingsPopup = true; }
}
