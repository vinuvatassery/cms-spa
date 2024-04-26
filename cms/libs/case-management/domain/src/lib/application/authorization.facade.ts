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

    loadAuthorization(eligibilityId: string, typeCode: string) {
        this.showLoader();
        return this.authorizationDataService.loadAuthorization(eligibilityId, typeCode).subscribe({
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
        let formData = this.prepareFormData(data);
        return this.authorizationDataService.updateAuthorization(formData);
    }

    prepareFormData(data: any) {
        const formData: any = new FormData();
        formData.append('ClientCaseEligibilityId', data?.clientCaseEligibilityId ?? '');
        formData.append('ApplicantSignedDate', data?.applicantSignedDate ?? '');
        formData.append('SignatureNotedDate', data?.signatureNotedDate ?? '');
        formData.append('SignedApplicationDocument', data?.signedApplicationDocument ?? '');
        formData.append('SignedApplication[DocumentId]', data?.signedApplication?.documentId ?? '');
        formData.append('SignedApplication[DocumentName]', data?.signedApplication?.documentName ?? '');
        formData.append('SignedApplication[DocumentSize]', data?.signedApplication?.documentSize ?? '');
        formData.append('SignedApplication[DocumentTypeCode]', data?.signedApplication?.documentTypeCode ?? '');
        return formData;
    }

    saveDateSignedAndSignedFile(data: any) {
        let formData = this.prepareFormData(data);
        return this.authorizationDataService.saveDateAndSignedDocument(formData);
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

    bindAuthorizationDetails(clientCaseEligibility: any, typeCode: string) {
        return this.authorizationDataService.loadAuthorization(clientCaseEligibility, typeCode);
      }
}
