export interface Authorization {
  id: number;
  name: string;
  description: string;
}

export interface AuthorizationApplicationSignature {
  clientCaseEligibilityId?: string;
  applicantSignedDate?: Date;
  signatureNotedDate?: Date;
  signedApplicationDocument?: string;
  signedApplication?:SignedApplication;
}

export interface SignedApplication {
  documentId:string;
  documentName:string;
  documentSize:string;
  documentPath:string;
  documentTypeCode:string;
}
