/** Angular **/
import { Injectable } from '@angular/core';
import { LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs';
/** Internal libraries **/
import { NavigationMenuService } from '../infrastructure/navigation-menu.data.service';

@Injectable({ providedIn: 'root' })
export class NavigationMenuFacade {

    /** Private properties **/
    private navigationMenuSubject = new BehaviorSubject<any[]>([]);

    /** Public properties **/
    navigationMenu$ = this.navigationMenuSubject.asObservable();

    /** constructor **/
    constructor(private readonly navigationMenuService: NavigationMenuService,
        private readonly loggingService: LoggingService,
        private readonly notificationSnackbarService: NotificationSnackbarService,) { }

    /** Public methods **/
    getNavigationMenu() {
        return this.navigationMenuService.getNavigationMenu().subscribe({
            next: (menuResponse) => {
                if (menuResponse) {
                    this.navigationMenuSubject.next(menuResponse);
                }
            },
            error: (err: any) => {
                this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
                this.loggingService.logException(err)
            },
        });
    }
}
