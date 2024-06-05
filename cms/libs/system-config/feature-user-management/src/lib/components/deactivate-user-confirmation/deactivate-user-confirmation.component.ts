/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { NotificationSnackbarService, SnackBarNotificationType, NotificationSource ,ConfigurationProvider} from '@cms/shared/util-core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'system-config-deactivate-user-confirmation',
  templateUrl: './deactivate-user-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeactivateUserConfirmationComponent implements OnDestroy {
  @Input() userId: any;
  @Input() status: any;
  @Output() closeDeactivateUsers = new EventEmitter();
  @Output() refreshGrid = new EventEmitter();
  reactivate = "Active";
  deactivate = "Inactive";
  deactivateUserStatus$ = this.userManagementFacade.deactivateUser$;
  deactivatSubscription!: Subscription;

  /** Constructor **/
  constructor(
    private readonly userManagementFacade: UserManagementFacade,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider
  ) {
    this.notifyDeactivation();
  }

  onDeactivateDialogueClose() {
    this.closeDeactivateUsers.emit();
  }

  refreshUsersGrid() {
    this.refreshGrid.emit();
  }

  onDeactivateClick() {
    const userData = {
      userId: this.userId,
      activeFlag: this.status
    };
    this.userManagementFacade.deactivateUser(userData);
  }

  notifyDeactivation() {
    this.deactivatSubscription = this.deactivateUserStatus$.subscribe((response: any) => {
      if (response.status > 0) {
        this.refreshUsersGrid();
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response.message);
      }
      this.onDeactivateDialogueClose();
    });
  }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any, title: string = '') {
    this.notificationSnackbarService.manageSnackBar(type, subtitle, NotificationSource.API, title)
  }

  ngOnDestroy(): void {
    if (this.deactivatSubscription) {
      this.deactivatSubscription.unsubscribe();
    }
  }

}



