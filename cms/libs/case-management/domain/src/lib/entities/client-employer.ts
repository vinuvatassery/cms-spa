export class ClientEmployer {
    clientEmployerId: any | null;
    clientCaseEligibilityId: string = "";
    employerName: string | null = null;
    dateOfHire: Date = new Date;
    endDate?: Date;
    cerReviewStatusCode?: string;
    concurrencyStamp: string | null = null;
    creatorId: string | null = null;
}
