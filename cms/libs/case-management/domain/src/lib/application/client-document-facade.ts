/** Angular **/
import { Injectable } from '@angular/core';
import { LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';

/** External libraries **/
import { ClientDocument } from '../entities/client-document';
import { ClientDocumentDataService } from '../infrastructure/client-document.data.service';

@Injectable({ providedIn: 'root' })
export class ClientDocumentFacade {

    /** Constructor**/
    constructor(
        private readonly clientDocumentDataService: ClientDocumentDataService,
        private readonly loggingService: LoggingService,
        private readonly snackbarService: NotificationSnackbarService) { }

    /** Public methods **/
    uploadDocument(doc: ClientDocument) {
        return this.clientDocumentDataService.uploadDocument(doc);
    }

    removeDocument(documentId:string){
        return this.clientDocumentDataService.removeDocument(documentId);
    }
    getClientDocumentsByClientCaseEligibilityId(clientCaseEligibilityId:string){
        return this.clientDocumentDataService.getClientDocumentsByClientCaseEligibilityId(clientCaseEligibilityId);
    }
}
