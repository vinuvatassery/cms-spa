export interface ClientInsurancePlans {
    isPlanSelected: boolean
    clientId: number
    clientInsurancePolicyId: string
    insuranceId: string
    insuranceIdNbr: string
    insurancePlanId: string
    vendorId: string
    vendorAddressId: string
    vendorName: string
    carrierName: string
    healthInsuranceType: string
    startDate: Date
    endDate: Date
    premiumAmt: number
    eligibilityEndDate: Date
    eligibilityStartDate: Date
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
    exceptionReasonRequired?: boolean
    makeExceptionFlag?: boolean
    exceptionText?: string
    premiumCoverageDateList?: PremiumCoverageDates[]
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
    exceptionFlag?: string
    exceptionType?: string
    exceptionReason?: string
}

export interface PolicyPremiumCoverage {
    clientInsurancePolicyId?: string
    coverageStartDate?: string
    coverageEndDate?: string
}


export interface InsurancePremiumDetails {
    insurancePremiumId: string
    paymentRequestId: string
    clientId: number
    clientFullName: string
    vendorName: string
    healthInsuranceType: string
    insurancePlanName: string
    coverageStartDate: string
    coverageEndDate: string
    nextPremiumDueDate: string
    premiumAmount: number
    isSpotsPayment: boolean
    premiumAdjustments: PremiumAdjustment[]
    premiumAmountRequired: boolean
}

export interface PremiumAdjustment {
    paymentRequestId?: string
    adjustmentId?: string
    coverageStartDate?: string
    coverageEndDate?: string
    adjustmentAmount?: number
    isPositiveAdjustment?: boolean
    adjustmentAmountRequired: boolean
    coverageDatesRequired: boolean
    duplicateCoverage: boolean
}

export interface PremiumCoverageDates {
    coverageStartDate?: string
    coverageDate?: string
}