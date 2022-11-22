export interface ClientCase{
    clientCaseId :string;
    clientId :string;
    programId :string;
    assignedCmUserId :string;
    assignedCwUserId :string;
    caseOriginCode :string;
    caseStartDate :Date;
    caseEndDate :Date;
    caseStatusCode :string;
    creatorId :string;
    creationTime :Date;
    lastModifierId :string;
    lastModificationTime :Date;
    isDeleted :string;
    deleterId :string;
    deletionTime :Date;
    extraProperties :string;
    concurrencyStamp :string;
    activeFlag :string;
}
