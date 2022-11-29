export interface Contact {
  id: number;
  name: string;
  description: string;
}


export interface ClientAddress {
  id?: string;
  clientId?: number;
  addressTypeCode?: string;
  sameAsMailingAddressFlag?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  county?: string;
  // startDate?: string;
  // endDate?: string;
  // createUser?: string;
  // createDate: Date;
  // lastUpdateUser?: string;
  // lastUpdateDate?: string;
  // activeFlag?: string;
}

export interface ClientPhone {
  id?: string;
  clientId?: number;
  deviceTypeCode?: string;
  phoneNbr?: string;
  //effectiveDate?: Date;
  preferredFlag?: string;
  applicableFlag?: string;
  detailMsgConsentFlag?: string;
  smsTextConsentFlag?: string;
  otherPhoneNote?: string;
  // createUser?: string;
  // createDate: Date;
  // lastUpdateUser?: string;
  // lastUpdateDate?: string;
  // activeFlag?: string;
}

export interface ClientEmail {
  id?: string;
  clientId?: number;
  email?: string;
  effectiveDate?: Date;
  preferredFlag?: string;
  applicableFlag?: string;
  detailMsgFlag?: string;
  // createUser?: string;
  // createDate: string;
  // lastUpdateUser?: string;
  // lastUpdateDate?: string;
  // activeFlag?: string;
}

export interface FriedsOrFamilyContact {
  contactName?: string;
  contactRelationshipCode?: string;
  contactPhoneNbr?: string;
  noFriendOrFamilyContactFlag?: string;
}

export interface ContactInfo {
  address?: ClientAddress[];
  houseLessFlag?: string;
  noProofOfResidency?: any;
  phone?: ClientPhone[];
  email?: ClientEmail;
  preferredContactCode?: string;
  papperlessFlag?: string;
  friedsOrFamilyContact?: FriedsOrFamilyContact;
  clientCaseEligibilityFlag?: string;
}