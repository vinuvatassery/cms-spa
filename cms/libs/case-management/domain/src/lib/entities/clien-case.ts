export class ClientCase{
    clientCaseId !:string;
    clientId :number =0 ;
    programId !:string ;
    assignedCmUserId :string |null = null ;
    assignedCwUserId :string | null =null ;
    caseOriginCode !:string ;
    caseStartDate !:Date;
    caseEndDate :Date|null=null;
    caseStatusCode :string |null = null ;
    creatorId :string |null=null ;
    creationTime? :Date |null=null;
    lastModifierId :string |null=null;
    lastModificationTime? :Date |null=null;
    isDeleted :boolean=false;
    deleterId :string |null=null;
    deletionTime? :Date|null=null;
    extraProperties :string|null=null;
    concurrencyStamp :string|null=null;
    activeFlag :string|null=null
}
