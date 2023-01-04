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
}

export interface ClientPhone {
  clientPhoneId?: string;
  clientId?: number;
  deviceTypeCode?: string;
  phoneNbr?: string;
  preferredFlag?: string;
  applicableFlag?: string;
  detailMsgConsentFlag?: string;
  smsTextConsentFlag?: string;
  otherPhoneNote?: string;
  concurrencyStamp?: string;
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
}

export interface FriedsOrFamilyContact {
  clientDependentId?: string;
  contactName?: string;
  contactRelationshipCode?: string;
  otherDesc?: string;
  contactPhoneNbr?: string;
  noFriendOrFamilyContactFlag?: string;
  concurrencyStamp?: string;
}

export interface ContactInfo {
  address?: ClientAddress[];
  phone?: ClientPhone[];
  email?: ClientEmail;
  preferredContactCode?: string;
  friedsOrFamilyContact?: FriedsOrFamilyContact;
  clientCaseEligibility?: ClientCaseElgblty;
  homeAddressProof?:HomeAddressProof;
}

export interface ClientCaseElgblty {
  homelessFlag?: string;
  homeAddressProofFlag?: any;
  housingStabilityCode?: string;
  paperlessFlag?: string;
  elgbtyFlagConcurrencyStamp?: string;
  elgbtyConcurrencyStamp?: string;
}

export interface HomeAddressProof{
  documentId?: string;
  clientCaseId?: string;
  documentName?: string;
  documentSize?:number;
  documentPath  ?: string;
  document?: File;
  concurrencyStamp?: string;
}

export interface PreferredContactLov{
  lovCode:string,
  lovDesc:string,
}