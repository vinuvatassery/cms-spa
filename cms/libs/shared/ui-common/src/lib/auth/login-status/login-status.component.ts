/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  HostListener,
  ViewEncapsulation,
} from '@angular/core';
/** Services **/
import { AuthService } from '@cms/shared/util-oidc';
@Component({
  selector: 'common-login-status',
  templateUrl: './login-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LoginStatusComponent {
  /** Constructor **/
  @ViewChild('accountSettingsPopover', { read: ElementRef })
  public accountSettingsPopover!: ElementRef;
  @ViewChild('profileAnchor')
  profileAnchor!: ElementRef;

  isAccountSettingsPopup = false;
  isProfilePopoverOpen = false;
  data: Array<any> = [{}];
  popupClass = 'user-setting-dropdown';

  
  constructor(private authService: AuthService) {}
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

  @HostListener('document:keydown', ['$event'])
  public keydown(event: KeyboardEvent): void {
    if (event) {
      if (event.code === 'Escape') {
        this.toggleProfilePopoverOpen(false);
      }
    }
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: KeyboardEvent): void {
    if (event) {
      if (!this.contains(event.target)) {
        this.toggleProfilePopoverOpen(false);
      }
    }
  }

  public toggleProfilePopoverOpen(show?: boolean): void {
    this.isProfilePopoverOpen = show ?? !this.isProfilePopoverOpen;
  }

  private contains(target: any): boolean {
    return (
      this.profileAnchor.nativeElement.contains(target) ||
      (this.accountSettingsPopover
        ? this.accountSettingsPopover.nativeElement.contains(target)
        : false)
    );
  }
  onCloseAccountSettingsClicked() {
    this.isAccountSettingsPopup = false;
  }
  onAccountSettingsClicked() {
    this.isAccountSettingsPopup = true;
  }
}
