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
    address1?: string;
    address2?: string;
    cityCode?: string;
    stateCode?: string;
    country?: string;
    zip?: string;
    vendorFullName?: string;
}