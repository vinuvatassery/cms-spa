export interface ClientInsurancePlans {
    isPlanSelected: boolean
    clientId: number
    clientInsurancePolicyId: string
    insurancePlanId: string
    vendorId:string
    vendorName: string
    carrierName: string
    healthInsuranceType: string
    startDate: Date
    endDate: Date
    premiumAmt: number
    coverages: InsurancePremiumCoverage[]
}

export interface InsurancePremiumCoverage {
    id: string
    coverageDates?: string
    premiumAmount?: number
    comment?: string
    commentCount?: string
    exceptionReason?: string
    exceptionReasonCount?: string
    coverageDateRequired?: boolean
    premiumAmountRequired?: boolean
    makeAnException?: boolean
    coverageDatesExist?: boolean
}

export interface InsurancePremium {
    clientInsurancePolicyId?: string
    clientCaseEligibilityId?: string
    clientCaseEligibilityGroupId?: string
    vendorId?: string
    insuranceTypeCode?: string
    policyNbr?: string
    clientFirstName?: string
    clientLastName?: string
    coverageStartDate?: string
    coverageEndDate?: string
    premiumAmount?: number
}