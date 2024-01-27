
export class Contacts{
  vendorId: string| null = null;
  vendorAddressId: string| null = null;
  mailCode: string| null = null;
  vendorContacts: VendorContacts[] | null = null;
}

export class VendorContacts {
  vendorContactId: string| null = null;
  vendorAddressId: string| null = null;
  vendorContactPhoneId: string| null = null;
  vendorContactEmailId: string| null = null;
  contactName: string| null = null;
  contactDesc: string| null = null;
  jobTitle: string| null = null;
  phoneTypeCode: string| null = null;
  phoneNbr: string| null = null;
  emailAddressTypeCode: string| null = null;
  emailAddress: string| null = null;
  faxNbr: string| null = null;
  vendorName: string| null = null;
  effectiveDate: any | null = null;
  preferredFlag: string| null = null;
}
export interface ContactResponse {
  
  vendorContactId: string;
  vendorAddressId: string;
  vendorContactPhoneId: string;
  vendorContactEmailId: string;
  creatorId: string;
  contactName: string;
  contactDesc: string;
  jobTitle: any;
  phoneTypeCode: any;
  phoneNbr: string;
  emailAddressTypeCode: any;
  emailAddress: string;
  faxNbr: string;
  vendorName: any;
  effectiveDate: any;
}