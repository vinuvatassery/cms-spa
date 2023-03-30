import { Component, ViewEncapsulation } from '@angular/core';
import { NotificationSnackbarService } from '@cms/shared/util-core';
import { AuthService, OidcSecurityService } from '@cms/shared/util-oidc';
import { UserDataService, UserManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'cms-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'cms';

  private authenticated!: boolean;
  commonSnackbar$   = this.notificationSnackbarService.snackbar$
  constructor(public readonly oidcSecurityService: OidcSecurityService,private authService: AuthService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly userDataService: UserDataService
    ) 
    {
      this.oidcSecurityService.isAuthenticated$.subscribe(
        ({ isAuthenticated, allConfigsAuthenticated }) => {
          this.authenticated = isAuthenticated;
          if(this.authenticated){           
            this.userDataService.getUserProfileDetails();
          }
        }
      );
    }

  user() {
    return this.authService.getUser();
  }

  onLogOff() {
    this.authService.logOut();
  }

  isAuthenticated() {
    return this.authService.isAuthenticated;
  }
}
