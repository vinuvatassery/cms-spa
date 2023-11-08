export interface PharmacyClaims {
    paymentRequestId: string
    pharmacyName: string
    paymentMethodCode: string
    clientFullName: string
    insuranceName: string
    clientId: number
    paymentType: string
    amountPaid: number
    indexCode: string
    pcaCode: string
    objectCode: string
    paymentStatus: string
    creationTime: Date
    creatorId: string
  }