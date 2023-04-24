export interface Document {
  id?: number;
  name?: string;
  description?: string;
  document?: File;
  clientDocumentId?: string;
  clientId?: number;
  clientCaseId?: string;
  entityId?: string;
  entityTypeCode?: string;
  documentTypeCode?: string;
  clientCaseEligibilityId?: string;
  documentTemplateId?: string;
  documentName?: string;
  documentSize?: number;
  attachmentNote?: string;
  documentPath?: string;
  documentSizeInMB?: string;
}
