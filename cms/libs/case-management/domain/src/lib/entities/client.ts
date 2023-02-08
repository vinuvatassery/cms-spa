export class Client {
  clientId: number = 0;
  firstName: string | null = null;
  middleName: string | null = null;
  noMiddleInitialFlag: string = '';
  lastName: string = '';
  clientFullName: string = '';
  dob: Date = new Date();
  ssn: string | null = null;
  ssnNotApplicableFlag: string = '';
  genderAtBirthCode: string = '';
  genderAtBirthDesc: string = '';
  urn: string = '';
  encryptedUrn: string = '';
  medicareEligibleDate: Date = new Date();
  genderType: string = '';
  materialInAlternateFormatCode!: string;
  clientTransgenderCode!: string;
  clientTransgenderDesc: string | null = null;
  materialInAlternateFormatDesc: string | null = null;
  materialInAlternateFormatOther: string | null = null;
  spokenLanguageCode: string | null = null;
  writtenLanguageCode: string | null = null;
  englishProficiencyCode: string | null = null;
  interpreterCode: string | null = null;
  interpreterType: string | null = null;
  deafOrHearingCode: string | null = null;
  startAgeDeafOrHearing: number | null = null;
  blindSeeingCode: string | null = null;
  startAgeBlindSeeing: number | null = null;
  limitingConditionCode: string | null = null;
  walkingClimbingDifficultyCode: string | null = null;
  startAgeWalkingClimbingDifficulty: number | null = null;
  dressingBathingDifficultyCode: string | null = null;
  startAgeDressingBathingDifficulty: number | null = null;
  concentratingDifficultyCode: string | null = null;
  startAgeConcentratingDifficulty: number | null = null;
  errandsDifficultyCode: string | null = null;
  startAgeErrandsDifficulty: number | null = null;
}

export interface SpecialHandling {
  id: number;
  specialHandling: string;
  answer: string;
}
