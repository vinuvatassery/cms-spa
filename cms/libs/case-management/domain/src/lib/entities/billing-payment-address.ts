export interface BillingPaymentAddress {
    acceptsCombinedPaymentsFlag: string;
    acceptsReportsFlag: string;
    activeFlag: string;
    address1: string | null = "";
    address2: string | null = "";
    addressTypeCode: string | null = "";
    cityCode: string | null = "";
    mailCode: string | null = "";
    nameOnCheck: string;
    nameOnEnvelope: string;
    paymentMethod: string;
    paymentMethodCode: string;
    paymentRunDateMonthly:Date;
    physicalAddressFlag: string;
    specialHandlingDesc: string;
    state: string;
    stateCode: string;
    vendorAddressId: string;
    vendorContact: any;
    vendorId: string;
    zip: string;
}
//     MailCode: 'XXXXXXXXXX `',
//     NameCheck:'1',
//     NameEnvelope: '3',
//     PaymentMethod: '1,000.00',
//     PaymentRunDate: 'XX/XX/XXXX',
//     AcceptCombinedPayments: 'Yes',
//     AcceptsReports: 'Pending',
//     Address1: 'No',
//     Address2: 'XXXXX',
//     City: 'XXXXX',
//     State: 'XXXXX',
//     Zip: 'XXXXX',
//     SpecialHandling: 'XXXXX',
//     EffectiveDates: 'XXXXX',
//   by: 'No',
