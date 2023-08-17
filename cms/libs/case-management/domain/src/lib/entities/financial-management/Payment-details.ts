export interface PaymentDetail {
  paymentRequestId: string
  paymentNbr: number
  vendorName: string
  vendorId: string
  amountDue: number
  paymentStatusDate: string
  paymentStatusCode: string
}

export interface PaymentBatchName {
  batchNbr: number
  creationTime: string
}