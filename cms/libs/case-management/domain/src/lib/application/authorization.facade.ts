/** Angular **/
import { Injectable } from '@angular/core';
import { AuthorizationDataService } from '../infrastructure/authorization.data.service';
import { LoggingService, LoaderService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthorizationFacade {
    private authApplicationSignatureSubject = new BehaviorSubject<any>([]);
    authApplicationSignatureDetails$ = this.authApplicationSignatureSubject.asObservable();
    private authApplicationNoticeSubject = new Subject<any>;
    authApplicationNotice$ = this.authApplicationNoticeSubject.asObservable();

    /** Constructor**/
    constructor(
        private readonly authorizationDataService: AuthorizationDataService,
        private loggingService: LoggingService,
        private readonly loaderService: LoaderService,
        private readonly notificationSnackbarService: NotificationSnackbarService,
    ) { }

    showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
        if (type == SnackBarNotificationType.ERROR) {
            const err = subtitle;
            this.loggingService.logException(err)
        }
        this.notificationSnackbarService.manageSnackBar(type, subtitle)
        this.hideLoader();
    }

    showLoader() {
        this.loaderService.show();
    }

    hideLoader() {
        this.loaderService.hide();
    }

    loadAuthorization(eligibilityId: string) {
        this.showLoader();
        return this.authorizationDataService.loadAuthorization(eligibilityId).subscribe({
            next: (response) => {
                this.hideLoader();
                this.authApplicationSignatureSubject.next(response);
            },
            error: (err) => {
                this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
            },
        });
    }

    updateAuthorization(data: any) {
        return this.authorizationDataService.updateAuthorization(data);
    }

    getNoticeTemplate(documentTemplateTypeCode: string) {
        this.showLoader();
        return this.authorizationDataService.getNoticeTemplate(documentTemplateTypeCode).subscribe({
            next: (response) => {
                this.hideLoader();
                this.authApplicationNoticeSubject.next(response);
            },
            error: (err) => {
                this.hideLoader();
                this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
            },
        });
    }
}
