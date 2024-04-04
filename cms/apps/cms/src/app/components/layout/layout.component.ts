/** Angular **/
import { Component, HostListener } from '@angular/core';
import { NotificationFacade } from '@cms/productivity-tools/domain';
import { ReminderNotificationSnackbarService } from '@cms/shared/util-core';
import { UserDataService } from '@cms/system-config/domain';

@Component({
  selector: 'cms-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  commonReminderSnackbar$   = this.reminderNotificationSnackbarService.snackbar$
  notificationList$ = this.notificationFacade.notificationList$;
  constructor(private readonly userDataService: UserDataService,
    public notificationFacade: NotificationFacade, 
    private readonly reminderNotificationSnackbarService : ReminderNotificationSnackbarService) {}

  /** Public properties **/
  isSideMenuToggled = false;
  isOpenMobileMenu = false;

  /** Internal event methods **/

  onSideMenuToggleClicked() {
    this.isSideMenuToggled = !this.isSideMenuToggled;
  }

  openMobileMenu() {
    this.isOpenMobileMenu = !this.isOpenMobileMenu;
  }

  @HostListener('window:resize', ['$event'])
  sizeChange(event: any) {
    let screenSize = event.currentTarget.window.innerWidth;
    if (screenSize <= 1024) {
      this.isSideMenuToggled = true;
    }

  
  }

  @HostListener('window:load', ['$event'])
  onLoadEvent(event: any) {
    this.sizeChange(event);
  }

  onloadReminderAndNotificationsGrid(isViewAll :boolean){
    this.notificationFacade.loadNotificationsAndReminders(isViewAll);
  }
  
  onSnoozeReminder(event:any){ 
    this.notificationFacade.SnoozeReminder(event.reminderId,event.duration);
  }
}
