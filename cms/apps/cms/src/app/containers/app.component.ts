import { Component, ViewEncapsulation } from '@angular/core';
import { NotificationSnackbarService } from '@cms/shared/util-core';
import { AuthService } from '@cms/shared/util-oidc';

@Component({
  selector: 'cms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'cms';

  commonSnackbar$   = this.notificationSnackbarService.snackbar$
  constructor(private authService: AuthService,
    private readonly notificationSnackbarService : NotificationSnackbarService) {}

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
