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
  startDate?: Date;
  concurrencyStamp?: string;
  activeFlag?: string;
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

export interface FriendsOrFamilyContact {
  clientDependentId?: string;
  firstName?: string;
  lastName?: string;
  contactRelationshipCode?: string;
  contactRelationshipDesc?: string;
  otherDesc?: string;
  contactPhoneNbr?: string;
  noFriendOrFamilyContactFlag?: string;
  concurrencyStamp?: string;
  detailMsgConsentFlag?:string;
  smsTextConsentFlag?:string;
}

export interface ContactInfo {
  address?: ClientAddress[];
  phone?: ClientPhone[];
  email?: ClientEmail;
  preferredContactCode?: string;
  friendsOrFamilyContact?: FriendsOrFamilyContact;
  clientCaseEligibility?: ClientCaseElgblty;
  homeAddressProof?: HomeAddressProof;
  isCer?:boolean;
}

export interface ClientCaseElgblty {
  homelessFlag?: string;
  homeAddressProofFlag?: any;
  housingStabilityCode?: string;
  paperlessFlag?: string;
  mailingAddressChangedFlag?: string;
  homeAddressChangedFlag?: string;
  emailAddressChangedFlag?: string;
  phoneNumberChangedFlag?: string;
  friendFamilyChangedFlag?: string;
  previousClientEligibilityId?: string;
  elgbtyFlagConcurrencyStamp?: string;
  elgbtyConcurrencyStamp?: string;
}

export interface HomeAddressProof {
  documentId?: string;
  clientCaseId?: string;
  documentName?: string;
  documentSize?: number;
  documentPath?: string;
  document?: File;
  concurrencyStamp?: string;
  documentTypeCode?: string;
}

export interface PreferredContactLov {
  lovCode: string,
  lovDesc: string,
}

export interface FriendsOrFamilyContactClientProfile {
  clientRelationshipId?: string;
  clientId?: number;
  clientCaseEligibilityId?: string;
  relationshipSubTypeCode?: string;
  firstName?: string;
  lastName?: string;
  phoneNbr?: string;
  activeFlag?: string;
  concurrencyStamp?: string;
  detailMsgConsentFlag:string|null;
  smsTextConsentFlag:string | null;
}
