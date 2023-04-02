export interface ClientAttachment {
    document?: File;
    clientDocumentId?: string;
    clientId?: number;
    clientCaseId?: string;
    entityId?: string;
    entityTypeCode?: string;
    documentTypeCode?: string;
    clientCaseEligibilityId?: string;
    documentTemplateId?: string;
    documentName?:string;
    documentPath?: string;
    documentFileSize?: number;
}