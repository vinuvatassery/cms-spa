export interface ClientPharmacy {
    clientPharmacyId: string;
    clientId: number;
    vendorId: string;
    pharmacyNameAndNumber?: string;
    pharmacyName?: string;
    pharmacyNumber?: string;
    priorityName?: string;
    priorityCode?: string;
    city?: string;
    state?: string;
    contactName?: string;
    phone?: string;
    concurrencyStamp?: string;
}

export interface Pharmacy {    
    vendorId?: string;
    vendorName?: string;
    vendorNbr?: string;
    vendorAddressId?:string;
    address1?: string;
    address2?: string;
    cityCode?: string;
    stateCode?: string;
    country?: string;
    priorityCode?:string;
    zip?: string;
    vendorFullName?: string;
}

export interface DrugPharmacy {    
    vendorId?: string;
    vendorName?: string;
    address1?: string;
    tin?: string;
    mailCode?: string;
    effectiveDate?: string;
    fax?: string;
    phone?: string;
    vendorFullName?: string;
}
export interface DrugPurchased {    
    vendorId?: string;
    drugPurchased?: string;
    vendorName?: string;
    prescriptionFillId?: string;
    drugName?: string;
    ndcNbr?: number;
    brandName?: string;
    qty?: any;
    transactionTypeCode?: string;
    reversalDate?: string;
    paymentTypeCode?: string;
    amountRequested?: number;
    calculatedIngredientCost?: string;
    dispensingFeeSubmitted?: string;
    ramsellProcessFee?: number;
    pharmacyTotalPaidAmount?: string;
    uandc?: any;
    revenue?: any;
    entryDate?: string;
    clientGroup?: any;
    
}