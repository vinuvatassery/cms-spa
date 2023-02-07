export class healthInsurancePolicy {
        clientInsurancePolicyId: string | null = null;
        clientId: number | null = null;
        insuranceCarrierId: string | null = null;
        clientCaseEligibilityId: string | null = null;
        insurancePlanId: string | null = null;
        clientMaximumId: string | null = null;
        healthInsuranceTypeCode: string | null = null;
        insuranceIdNbr: string | null = null;
        insuranceGroupPlanTypeCode: string | null = null;
        priorityCode: string | null = null;
        policyHolderFirstName: string | null = null;
        policyHolderLastName: string | null = null;
        metalLevelCode: string | null = null;
        premiumAmt: number | null = null;
        startDate?: Date | null;
        endDate?: Date | null;
        careassistPayingPremiumFlag: string | null = null;
        premiumPaidThruDate?: Date | null;
        premiumFrequencyCode: string | null = null;
        nextPremiumDueDate?: Date | null;
        paymentIdNbrSameAsInsuranceIdNbrFlag: string | null = null;
        paymentIdNbr: string | null = null;
        aptcCode: string | null = null;
        aptcNotTakingFlag: string | null = null;
        aptcMonthlyAmt: number | null = null;
        othersCoveredOnPlanFlag: string | null = null;
        isClientPolicyHolderFlag: string | null = null;
        medicareBeneficiaryIdNbr: string | null = null;
        medicareCoverageTypeCode: string | null = null;
        medicarePartAStartDate?: Date | null;
        medicarePartBStartDate?: Date | null;
        onQmbFlag: string | null = null;
        onLisFlag: string | null = null;
        paymentGroupNumber: number | null = null;
        insuranceFirstName: string | null = null;
        insuranceLastName: string | null = null;
        oonException: number | null = null;
        oonStartDate?: Date;
        oonEndDate?: Date;
        oonPharmacy: string | null = null;
        oonDrugs: string | null = null;
        concurrencyStamp: string | null = null;
        activeFlag: string | null = null;
        creationTime?: Date;
        othersCoveredOnPlan: Array<othersCoveredOnPlan> = [];
        proofOfPremiumFile: any = null;
        proofOfPremiumFileName: string = "";
        proofOfPremiumFileSize: number | null = null;
        proofOfPremiumFileTypeCode: string = "";
        proofOfPremiumFileId: string = "";
        proofOfPremiumFilePath: string = "";
        copyOfInsuranceCardFile: any = null;
        copyOfInsuranceCardFileName: string = "";
        copyOfInsuranceCardFileSize: number | null = null;
        copyOfInsuranceCardFileTypeCode: string = "";
        copyOfInsuranceCardFileId: string = "";
        copyOfInsuranceCardFilePath: string = "";
        copyOfSummaryFile: any = null;
        copyOfSummaryFileName: string = "";
        copyOfSummaryFileSize: number | null = null;
        copyOfSummaryFileTypeCode: string = "";
        copyOfSummaryFileId: string = "";
        copyOfSummaryFilePath: string = "";
        removedOthersCoveredOnPlan: Array<othersCoveredOnPlan> = [];
        medicareCardFile: any = null;
        medicareCardFileName: string = "";
        medicareCardFileSize: number | null = null;
        medicareCardFileTypeCode: string = "";
        medicareCardFileId: string = "";
        medicareCardFilePath: string = "";
}

export class othersCoveredOnPlan {
        relationshipDescription: string = "";
        relationshipCode: string = "";
        firstName: string = "";
        lastName: string = "";
        dob?: Date;
        enrolledInInsuranceFlag: string = "";
}
