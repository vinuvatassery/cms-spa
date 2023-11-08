export enum PaymentStatusCode{
    Hold='HOLD',
    Paid='PAID',
    PendingApproval='PENDING_APPROVAL',
    PaymentRequested='PAYMENT_REQUESTED',
    Denied='DENIED',
    ManagerApproved='MANAGER_APPROVED',
    Submitted='SUBMITTED',
    Failed='FAILED',
}

export enum BatchStatusCode{
    Paid='PAID',
    PaymentRequested='PAYMENT_REQUESTED',
    ManagerApproved='MANAGER_APPROVED',
}

export enum PaymentStatusCodeDescription{
    Paid='Paid',
    PaymentRequested='Payment Requested',
    ManagerApproved='Manager Approved',
}