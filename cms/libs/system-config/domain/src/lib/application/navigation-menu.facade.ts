/** Angular **/
import { Injectable } from '@angular/core';
import {
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs';
/** Internal libraries **/
import { NavigationMenuService } from '../infrastructure/navigation-menu.data.service';
import { NavigationMenu } from '../entities/navigation-menu';

@Injectable({ providedIn: 'root' })
export class NavigationMenuFacade {
  /** Private properties **/
  private navigationMenuSubject = new BehaviorSubject<NavigationMenu[]>([]);

  /** Public properties **/
  navigationMenu$ = this.navigationMenuSubject.asObservable();

  /** constructor **/
  constructor(
    private readonly navigationMenuService: NavigationMenuService,
    private readonly loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loaderService: LoaderService
  ) { }

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }
  /** Public methods **/
  getNavigationMenu() {
    this.showLoader()
    return this.navigationMenuService.getNavigationMenu().subscribe({
      next: (menuResponse) => {
        if (menuResponse) {
          menuResponse?.forEach(menu => { menu.filterText = ''; });
          this.navigationMenuSubject.next(menuResponse);
          this.hideLoader()
        }
        this.hideLoader()
      },
      error: (err: any) => {
        this.hideLoader()
        this.notificationSnackbarService.manageSnackBar(
          SnackBarNotificationType.ERROR,
          err
        );
        this.loggingService.logException(err);
      },
    });
  }
}
