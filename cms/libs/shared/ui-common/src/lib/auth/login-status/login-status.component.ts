import { LoginUser } from '@cms/system-config/domain';
/** Angular **/
import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, OnInit, ChangeDetectorRef,   HostListener, ViewEncapsulation } from '@angular/core';
/** Services **/
import { AuthService } from '@cms/shared/util-oidc';
import { UserDataService } from '@cms/system-config/domain';
import { Subject } from 'rxjs';
import { UserManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'common-login-status',
  templateUrl: './login-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LoginStatusComponent  implements OnInit{
  /** Constructor **/
  @ViewChild('accountSettingsPopover', { read: ElementRef })
  public accountSettingsPopover!: ElementRef;
  @ViewChild('profileAnchor')
  profileAnchor!: ElementRef;
  userInfoData$ = this.userManagementFacade.userInfoData$;

  isAccountSettingsPopup = false;
  isProfilePopoverOpen = false;

  userImageSubject = new Subject<any>();
  imageLoaderVisible = true;
  data: Array<any> = [{}];
  popupClass = 'user-setting-dropdown';
  userInfo!:any;


  constructor(private authService: AuthService,
    private readonly userDataService: UserDataService,private readonly cd: ChangeDetectorRef,
    private readonly userManagementFacade: UserManagementFacade,
  ) { }




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

  loadProfilePhoto() {
    this.userDataService.getProfile$.subscribe((users: any[]) => {
      if (users.length > 0) {
        this.userInfo = users[0];
        this.userDataService.getUserImage(this.userInfo?.loginUserId).subscribe({
          next: (userImageResponse: any) => {
            this.userImageSubject.next(userImageResponse);
            this.imageLoaderVisible = true;
            this.cd.detectChanges();
          },
        });
      }
    })
  }
  onLoad() {
    this.imageLoaderVisible = false;
  }
  onCloseAccountSettingsClicked() { this.isAccountSettingsPopup = false; }
  onAccountSettingsClicked() { this.isAccountSettingsPopup = true; }

  loadUserInfoData()
  {
    if(this.userInfo?.loginUserId)
    {
      this.userManagementFacade.loadUserInfoData(this.userInfo?.loginUserId);
    }
  }
}
