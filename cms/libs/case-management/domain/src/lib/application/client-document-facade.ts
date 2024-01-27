/** Angular **/
import { Injectable } from '@angular/core';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';

/** External libraries **/
import { ClientDocument } from '../entities/client-document';
import { ClientDocumentDataService } from '../infrastructure/client-document.data.service';

@Injectable({ providedIn: 'root' })
export class ClientDocumentFacade {

    /** Constructor**/
    constructor(
        private readonly clientDocumentDataService: ClientDocumentDataService,
        private readonly loaderService: LoaderService,
        private readonly loggingService: LoggingService,
        private readonly snackbarService: NotificationSnackbarService) { }

    /** Public methods **/
    showSnackBar(type: SnackBarNotificationType, subtitle: any) {
        if (type == SnackBarNotificationType.ERROR) {
            const err = subtitle;
            this.loggingService.logException(err)
        }
        this.snackbarService.manageSnackBar(type, subtitle);
    }
    uploadDocument(doc: ClientDocument) {
        return this.clientDocumentDataService.uploadDocument(doc);
    }

    removeDocument(documentId: string) {
        return this.clientDocumentDataService.removeDocument(documentId);
    }
    getClientDocumentsByClientCaseEligibilityId(clientCaseEligibilityId: string) {
        return this.clientDocumentDataService.getClientDocumentsByClientCaseEligibilityId(clientCaseEligibilityId);
    }
    getClientDocumentsViewDownload(clientDocumentId: string) {
        return this.clientDocumentDataService.getClientDocumentsViewDownload(clientDocumentId);
    }

    viewOrDownloadFile(eventType: string, clientDocumentId: string, documentName: string) {
        if (clientDocumentId === undefined || clientDocumentId === '') {
            return;
        }
        this.loaderService.show()
        this.getClientDocumentsViewDownload(clientDocumentId).subscribe({
            next: (data: any) => {

                const fileUrl = window.URL.createObjectURL(data);
                if (eventType === 'view') {
                    window.open(fileUrl, "_blank");
                } else {
                    const downloadLink = document.createElement('a');
                    downloadLink.href = fileUrl;
                    downloadLink.download = documentName;
                    downloadLink.click();
                }
                this.loaderService.hide();
            },
            error: (error: any) => {
                this.loaderService.hide();
                this.showSnackBar(SnackBarNotificationType.ERROR, error)
            }
        })
    }

    getAllClientDocumentsByClientCaseEligibilityId(clientCaseEligibilityId: string) {
        return this.clientDocumentDataService.getAllClientDocumentsByClientCaseEligibilityId(clientCaseEligibilityId);
    }

    getSignedDocumentInfo(typeCode: string, subTypeCode: string, clientCaseEligibilityId: string) {
        return this.clientDocumentDataService.getSignedDocumentInfo(typeCode, subTypeCode, clientCaseEligibilityId);
      }
}
