export class ClientHivVerification {
      clientId :number=0;
      clientCaseEligibilityId :string|null=null;
      clientCaseId :string|null=null;
      verificationToEmail:string|null=null;
      verificationStatusCode: string|null=null;
      verificationMethodCode: string|null=null;
      verificationTypeCode: string|null=null;
      verificationStatusNote:string|null=null;
      hivVerificationDoc?: HivVerificationDocument;
      verificationStatusDate :  Date = new Date();

}

export class HivVerificationDocument {
  documentId?: string;
  documentName?: string;
  documentSize?: number;
  documentPath?: string;
  document?: File;
  concurrencyStamp?: string;
}
