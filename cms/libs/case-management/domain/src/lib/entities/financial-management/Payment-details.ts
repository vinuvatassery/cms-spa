export interface PaymentDetail {
  itemNbr:string
  paymentRequestId: string
  paymentNbr: number
  vendorName: string
  vendorId: string
  amountDue: number
  paymentStatusDate: string
  paymentStatusCode: string
}

export interface PaymentBatchName {
  batchName: string
  batchNbr: number
  creationTime: string
  sendBackNotes:string
}