/** Angular **/
import { Injectable } from '@angular/core';

/** External libraries **/
import { ClientDocument } from '../entities/client-document';
import { ClientDocumentDataService } from '../infrastructure/client-document.data.service';

@Injectable({ providedIn: 'root' })
export class ClientDocumentFacade {

    /** Constructor**/
    constructor(private readonly clientDocumentDataService: ClientDocumentDataService) { }

    /** Public methods **/
    uploadDocument(doc: ClientDocument) {
        return this.clientDocumentDataService.uploadDocument(doc);
    }

}
