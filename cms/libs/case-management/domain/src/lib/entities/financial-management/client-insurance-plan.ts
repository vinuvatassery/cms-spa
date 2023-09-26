export interface ClientInsurancePlans {
    isPlanSelected: boolean
    clientId: number
    clientInsurancePolicyId: string
    insuranceIdNbr: string,
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
    coverageDateRequired?: boolean
    premiumAmountRequired?: boolean
    makeAnException?: boolean
    coverageDatesExist?: boolean
    exceptionReason?: string
    exceptionReasonCount?: string
    premiumExistException?: boolean
    exceptionReasonRequired?:boolean
    makeExceptionFlag?:boolean
    exceptionText?:string
}

export interface InsurancePremium {
    clientId: number
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
    notes?: string
    exceptionFlag?:string
    exceptionType?:string
    exceptionReason?:string
}

export interface PolicyPremiumCoverage{
    clientInsurancePolicyId?: string
    coverageStartDate?: string
    coverageEndDate?: string
}