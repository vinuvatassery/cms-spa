export interface Client {
  clientId :string;
  firstName :string;
  middleName :string;
  lastName :string;
  clientFullName :string;
  dob :Date;
  ssn :string;
  ssnNotApplicableFlag :string;
  genderAtBirthCode :string;
  genderAtBirthDesc :string;
  urn :string;
  encryptedUrn :string;
  medicareEligibleDate :string;
  genderType :string;
  clientTransgenderCode :string;
  clientTransgenderDesc :string;
  materialInAlternateFormatCode :string;
  materialInAlternateFormatDesc :string;
  spokenLanguageCode :string;
  writtenLanguageCode :string;
  englishProficiencyCode :string;
  interpreterCode :string;
  interpreterType :string;
  deafOrHearingCode :string;
  startAgeDeafOrHearing :string;
  blindSeeingCode :string;
  startAgeBlindSeeing :string;
  limitingConditionCode :string;
  startAgeLimitingCondition :string;
  walkingClimbingDifficultyCode :string;
  startAgeWalkingClimbingDifficulty :string;
  dressingBathingDifficultyCode :string;
  startAgeDressingBathingDifficulty :string;
  concentratingDifficultyCode :string;
  startAgeConcentratingDifficulty :string;
  errandsDifficultyCode :string;
  startAgeErrandsDifficulty :string;
  preferredContactCode :string;
  contactName :string;
  contactRelationshipCode :string;
  contactPhoneNbr :string;
  creatorId :string;
  creationTime :Date;
  lastModifierId :string;
  lastModificationTime :Date;
  isDeleted :string;
  deleterId :string;
  deletionTime :Date;
  extraProperties :string;
  concurrencyStamp :string;
  activeFlag :string;
}

export interface SpecialHandling {
  id: number;
  specialHandling: string;
  answer: string;
}
