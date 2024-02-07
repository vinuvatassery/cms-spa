export class ClientCaseEligibility {
  clientCaseEligibilityId: string | null = null;
  clientCaseId!: string;
  eilgibilityStartDate?: Date;
  eligibilityEndDate?: Date;
  aka: string | null = null;
  insuranceFirstName: string | null = null;
  insuranceMiddleName: string | null = null;
  insuranceLastName: string | null = null;
  officialIdFirstName: string | null = null;
  officialIdMiddleName: string | null = null;
  officialIdLastName: string | null = null;
  groupCode: string | null = null;
  genderDesc!: string;
  noIncomeClientSignedDate?: Date;
  noIncomeSignatureNotedDate?: Date;
  noIncomeNote: string | null = null;
  smokingCessationNote: string | null = null;
  eligibilityStatusCode: string | null = null;
  waitlistStatusCode: string | null = null;
  serviceCoordinationRegionCode: string | null = null;
  serviceCoordinationHcId: number = 0;
  serviceCoordinatorServicePointId: number = 0;
  fplPercentage: number = 0;
  justMemo: string = '';
  prevClientCaseEligibilityId: string | null = null;
  cerReceivedDate = new Date();
  cerSentDate  = new Date();
}
