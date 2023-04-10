export interface Income {
    clientIncomeId: string;
    clientId:number;
    clientCaseEligibilityId: string;
    clientDependentId: string;
    clientSubsidyId: string;
    incomeSourceCode: string;
    incomeTypeCode: string;
    incomeAmt: number;
    incomeFrequencyCode: string;
    incomeStartDate: Date;
    incomeEndDate: Date;
    noIncomeProofFlag: string;
    incomeNote: string;
    concurrencyStamp: string;
    activeFlag: string;
    creatorId: string;
}