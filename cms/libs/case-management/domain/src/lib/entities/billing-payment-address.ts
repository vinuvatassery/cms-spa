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
