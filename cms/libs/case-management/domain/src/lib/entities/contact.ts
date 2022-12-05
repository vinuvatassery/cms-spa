export interface Contact {
  id: number;
  name: string;
  description: string;
}


export interface ClientAddress {
  clientAddressId?: string;
  clientId?: number;
  addressTypeCode?: string;
  sameAsMailingAddressFlag?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  county?: string;
  concurrencyStamp?: string;
  // startDate?: string;
  // endDate?: string;
  // createUser?: string;
  // createDate: Date;
  // lastUpdateUser?: string;
  // lastUpdateDate?: string;
  // activeFlag?: string;
}

export interface ClientPhone {
  clientPhoneId?: string;
  clientId?: number;
  deviceTypeCode?: string;
  phoneNbr?: string;
  //effectiveDate?: Date;
  preferredFlag?: string;
  applicableFlag?: string;
  detailMsgConsentFlag?: string;
  smsTextConsentFlag?: string;
  otherPhoneNote?: string;
  concurrencyStamp?: string;
  // createUser?: string;
  // createDate: Date;
  // lastUpdateUser?: string;
  // lastUpdateDate?: string;
  // activeFlag?: string;
}

export interface ClientEmail {
  clientEmailId?: string;
  clientId?: number;
  email?: string;
  effectiveDate?: Date;
  preferredFlag?: string;
  applicableFlag?: string;
  detailMsgFlag?: string;
  concurrencyStamp?: string;
  // createUser?: string;
  // createDate: string;
  // lastUpdateUser?: string;
  // lastUpdateDate?: string;
  // activeFlag?: string;
}

export interface FriedsOrFamilyContact {
  clientDependentId?: string;
  contactName?: string;
  contactRelationshipCode?: string;
  contactPhoneNbr?: string;
  noFriendOrFamilyContactFlag?: string;
  concurrencyStamp?: string;
}

export interface ContactInfo {
  address?: ClientAddress[];
  homelessFlag?: string;
  homeAddressProofFlag?: any;
  phone?: ClientPhone[];
  email?: ClientEmail;
  preferredContactCode?: string;
  papperlessFlag?: string;
  friedsOrFamilyContact?: FriedsOrFamilyContact;
  elgbtyflagConcurrencyStamp?: string;
}