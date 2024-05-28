/** Angular **/
import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, OnInit, ChangeDetectorRef,   HostListener, ViewEncapsulation } from '@angular/core';
/** Services **/
import { AuthService } from '@cms/shared/util-oidc';
import { UserDataService,UserManagementFacade} from '@cms/system-config/domain';
import { Subject, Subscription } from 'rxjs';

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
  submitUserInfoData$ = this.userManagementFacade.submitUserInfoData$;
  private submitUserInfoSubscription !: Subscription;
  removePhotoResponse$ = this.userManagementFacade.removePhotoResponse$;
  uploadPhotoResponse$ = this.userManagementFacade.uploadPhotoResponse$;
  isAccountSettingsPopup = false;
  isProfilePopoverOpen = false;
  userImageSubject = new Subject<any>();
  imageLoaderVisible = true;
  data: Array<any> = [{}];
  popupClass = 'user-setting-dropdown';
  userInfo!:any;
  userImage$ = this.userManagementFacade.userImage$;


  constructor(private authService: AuthService,
    private readonly userDataService: UserDataService,private readonly cd: ChangeDetectorRef,
    private readonly userManagementFacade: UserManagementFacade,
  ) { }




  ngOnInit(): void {
    this.loadProfilePhoto();
    this.submitUserInfoSubscription = this.submitUserInfoData$.subscribe((response: any) => {
      if (response !== undefined && response !== null) {
        this.isAccountSettingsPopup = false;
        this.cd.detectChanges();
      }
    });

    this.uploadPhotoResponse$.subscribe((response: any) => {
      if (response !== undefined && response !== null) {
        this.userManagementFacade.getUserImage(this.userInfo?.loginUserId);
      }
    });
    
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
        this.userManagementFacade.getUserImage(this.userInfo?.loginUserId);
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

  submitUserInfoData(userInfoData : any)
  {
    this.userManagementFacade.submitUserInfoData(userInfoData);
  }

  removeProfilePhoto(userId : any)
  {
    this.userManagementFacade.removeUserProfilePhoto(userId);
  }

  uploadProfilePhoto(uploadRequest : any)
  {
    this.userManagementFacade.uploadUserProfilePhoto(uploadRequest);
  }
}
