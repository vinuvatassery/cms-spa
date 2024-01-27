export interface FinancialClaims {
    vendorId: string;
    serviceStartDate: string;
    serviceEndDate: string;
    paymentType: string;
    cptCode: string;
    pcaCode: string;
    serviceDescription: string;
    serviceCost?: number;
    amoundDue: string;
    reasonForException: string;
    amountDue?: number;
    medicadeRate: number;
    cptCodeId: string;
  }