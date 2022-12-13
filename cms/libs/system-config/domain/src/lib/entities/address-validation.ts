
export interface MailAddress {
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip5?: string;
    zip4?: string;
}

export interface AddressValidation {
    isValid: boolean;
    address?: MailAddress;
    fullAddress?: string;
    errorMessage?: any;
    returnText?: any;
}