/** Angular **/
import { Injectable } from '@angular/core';
import { NotificationSnackbarService,SnackBarNotificationType,LoggingService  } from '@cms/shared/util-core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Lov } from '../entities/lov';
import { LovType } from '../enums/lov-types.enum';
import {AcceptedCaseStatusCode} from '@cms/case-management/domain';

/** Data services **/
import { LovDataService } from '../infrastructure/lov.data.service';

@Injectable({ providedIn: 'root' })
export class LovFacade {

  constructor(
    private readonly lovDataService: LovDataService,
    private loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService
  ) { }

  /** Private properties **/
  private lovSubject = new BehaviorSubject<Lov[]>([]);
  private lovcascadeSubject = new BehaviorSubject<Lov[]>([]);
  private lovRelationShipSubject = new BehaviorSubject<Lov[]>([]);
  private lovcaseoriginSubject = new BehaviorSubject<Lov[]>([]);
  private lovCntRelationshipCodeSubject = new BehaviorSubject<Lov[]>([]);
  private lovPronounSubject = new BehaviorSubject<Lov[]>([]);
  private lovMaterialSubject = new BehaviorSubject<Lov[]>([]);
  private lovMaterialYesSubject = new BehaviorSubject<Lov[]>([]);
  private lovTransgenderSubject = new BehaviorSubject<Lov[]>([]);
  private lovSexAtBirthSubject = new BehaviorSubject<Lov[]>([]);
  private lovSexulaIdentitySubject = new BehaviorSubject<Lov[]>([]);
  private lovGenderSubject = new BehaviorSubject<Lov[]>([]);
  private lovSpokenWriottenLanguageSubject = new BehaviorSubject<Lov[]>([]);
  private lovEnglishProficiencySubject = new BehaviorSubject<Lov[]>([]);
  private lovRaceSubject = new BehaviorSubject<Lov[]>([]);
  private lovEthnicitySubject = new BehaviorSubject<Lov[]>([]);
  private lovIncomeSourceSubject = new BehaviorSubject<Lov[]>([]);
  private lovIncomeTypeSubject = new BehaviorSubject<Lov[]>([]);
  private lovIncomeFrequencySubject = new BehaviorSubject<Lov[]>([]);
  private lovProofOfIncomeSubject = new BehaviorSubject<Lov[]>([]);
  private lovInsuranceTypeSubject = new BehaviorSubject<Lov[]>([]);
  private lovMetalLevelSubject = new BehaviorSubject<Lov[]>([]);
  private lovPremiumFrequencySubject = new BehaviorSubject<Lov[]>([]);
  private lovMedicareCoverageTypeSubject = new BehaviorSubject<Lov[]>([]);
  private lovCaseStatusSubject = new BehaviorSubject<Lov[]>([]);
  private lovGroupSubject = new BehaviorSubject<Lov[]>([]);
  private lovCaseStatusTypeSubject = new BehaviorSubject<Lov[]>([]);
      /** Public properties **/
  lovs$ = this.lovSubject.asObservable();
  ovcascade$ = this.lovcascadeSubject.asObservable();
  lovRelationShip$ = this.lovRelationShipSubject.asObservable();
  caseoriginlov$ = this.lovcaseoriginSubject.asObservable();
  lovCntRelationship$ = this.lovCntRelationshipCodeSubject.asObservable();
  pronounslov$ = this.lovPronounSubject.asObservable();
  materialslov$ = this.lovMaterialSubject.asObservable();
  materialsyeslov$ = this.lovMaterialYesSubject.asObservable();
  transgenderlov$ = this.lovTransgenderSubject.asObservable();
  sexAtBirthlov$ = this.lovSexAtBirthSubject.asObservable();
  sexulaIdentitylov$ = this.lovSexulaIdentitySubject.asObservable();
  genderlov$ = this.lovGenderSubject.asObservable();
  spokenWrittenLanguagelov$ = this.lovSpokenWriottenLanguageSubject.asObservable();
  englishProficiencylov$ = this.lovEnglishProficiencySubject.asObservable();
  racelov$ = this.lovRaceSubject.asObservable();
  ethnicitylov$ = this.lovEthnicitySubject.asObservable();
  incomeSourcelov$ = this.lovIncomeSourceSubject.asObservable();
  incomeTypelov$ = this.lovIncomeTypeSubject.asObservable();
  incomeFrequencylov$ = this.lovIncomeFrequencySubject.asObservable();
  proofOfIncomelov$ = this.lovProofOfIncomeSubject.asObservable();
  insuranceTypelov$ = this.lovInsuranceTypeSubject.asObservable();
  metalLevellov$ = this.lovMetalLevelSubject.asObservable();
  premiumFrequencylov$ = this.lovPremiumFrequencySubject.asObservable();
  medicareCoverageType$ = this.lovMedicareCoverageTypeSubject.asObservable();
  caseStatusLov$ = this.lovCaseStatusSubject.asObservable();
  groupLov$ = this.lovGroupSubject.asObservable();
  caseStatusType$ = this.lovCaseStatusTypeSubject.asObservable();


        /** Public methods **/
  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)

  }

 getLovsbyParent(lovType : string,parentCode : string): void {
  this.lovDataService.getLovsbyParent(lovType, parentCode).subscribe({
    next: (lovResponse) => {
      this.lovcascadeSubject.next(lovResponse);
    },
    error: (err) => {
      this.loggingService.logException(err)
    },
  });
}

getRelationShipsLovs(): void {
  this.lovDataService.getLovsbyType(LovType.RelationshipCode).subscribe({
    next: (relationsResponse) => {
      this.lovRelationShipSubject.next(relationsResponse);
    },
    error: (err) => {
      this.loggingService.logException(err)
    },
  });
}
getGenderLovs(): void {
  this.lovDataService.getLovsbyType(LovType.Gender).subscribe({
    next: (lovResponse) => {
      this.lovGenderSubject.next(lovResponse);
    },
    error: (err) => {
      console.error('err', err);
    },
  });
}

getCaseOriginLovs(): void {
  this.lovDataService.getLovsbyType(LovType.CaseOrigin).subscribe({
    next: (lovcaseoriginResponse) => {
      this.lovcaseoriginSubject.next(lovcaseoriginResponse);
    },
    error: (err) => {
      this.loggingService.logException(err)
    },
  });

}
getPronounLovs(): void {
  this.lovDataService.getLovsbyType(LovType.Pronoun).subscribe({
    next: (lovPronounResponse) => {
      this.lovPronounSubject.next(lovPronounResponse);
    },
    error: (err) => {
      this.loggingService.logException(err)
    },
  });

}

getMaterialLovs(): void {
  this.lovDataService.getLovsbyType(LovType.Material).subscribe({
    next: (lovMaterialResponse) => {
      this.lovMaterialSubject.next(lovMaterialResponse);
    },
    error: (err) => {
      console.error('err', err);
    },
  });

}
getTransgenderLovs(): void {
  this.lovDataService.getLovsbyType(LovType.Transgender).subscribe({
    next: (lovResponse) => {
      this.lovTransgenderSubject.next(lovResponse);
    },
    error: (err) => {
      console.error('err', err);
    },
  });
}
getSexAtBirthLovs(): void {
  this.lovDataService.getLovsbyType(LovType.SexAtBirth).subscribe({
    next: (lovResponse) => {
      this.lovSexAtBirthSubject.next(lovResponse);
    },
    error: (err) => {
      console.error('err', err);
    },
  });
}
getSexulaIdentityLovs(): void {
  this.lovDataService.getLovsbyType(LovType.SexulaIdentity).subscribe({
    next: (lovResponse) => {
      this.lovSexulaIdentitySubject.next(lovResponse);
    },
    error: (err) => {
      console.error('err', err);
    },
  });
}
getContactRelationShipsLovs(): void {
  this.lovDataService.getLovsbyType(LovType.ContactRelationshipCode).subscribe({
    next: (relationsResponse) => {
      this.lovCntRelationshipCodeSubject.next(relationsResponse);
    },
    error: (err) => {
      this.loggingService.logException(err)
    },
  });
}
getMaterialYesLovs(): void {
  this.lovDataService.getLovsbyParent(LovType.MaterialYes,LovType.Material).subscribe({
    next: (lovMaterialYesResponse) => {
      this.lovMaterialYesSubject.next(lovMaterialYesResponse);
    },
    error: (err) => {
      console.error('err', err);
    },
  });
}

getIncomeSourceLovs():void{
  this.lovDataService.getLovsbyType(LovType.IncomeSource).subscribe({
    next: (lovIncomeSourceResponse) => {
      this.lovIncomeSourceSubject.next(lovIncomeSourceResponse);
    },
    error: (err) => {
      this.loggingService.logException(err)
    },
  });
}
getSpokenWrittenLanguageLovs(): void {
  this.lovDataService.getLovsbyType(LovType.SpokenWrittenLanguage).subscribe({
    next: (LanguageResponse) => {
      this.lovSpokenWriottenLanguageSubject.next(LanguageResponse);
    },
    error: (err) => {
      console.error('err', err);
    },
  });
}
getEnglishProficiencyLovs(): void {
  this.lovDataService.getLovsbyType(LovType.EnglishProficiency).subscribe({
    next: (proficiencyResponse) => {
      this.lovEnglishProficiencySubject.next(proficiencyResponse);
    },
    error: (err) => {
      console.error('err', err);
    },
  });
}
getRaceLovs(): void {
  this.lovDataService.getLovsbyTypes(LovType.RaceGroup).subscribe({
    next: (response) => {
      this.lovRaceSubject.next(response);
    },
    error: (err) => {
      console.error('err', err);
    },
  });
}
getEthnicityLovs(): void {
  this.lovDataService.getLovsbyType(LovType.Ethnicity).subscribe({
    next: (response) => {
      this.lovEthnicitySubject.next(response);
    },
    error: (err) => {
      console.error('err', err);
    },
  });
}
getIncomeTypeLovs():void{
  this.lovDataService.getLovsbyType(LovType.IncomeType).subscribe({
    next: (lovIncomeTypeResponse) => {
      this.lovIncomeTypeSubject.next(lovIncomeTypeResponse);
    },
    error: (err) => {
      this.loggingService.logException(err)
    },
  });
}

getIncomeFrequencyLovs():void{
  this.lovDataService.getLovsbyType(LovType.Frequency).subscribe({
    next: (lovIncomeFrequencyResponse) => {
      this.lovIncomeFrequencySubject.next(lovIncomeFrequencyResponse);
    },
    error: (err) => {
      this.loggingService.logException(err)
    },
  });
}

getProofOfIncomeTypesLov(parentCode : string) {
  return this.lovDataService.getLovsbyParent(LovType.ProofOfIncomeType, parentCode)
}
getInsuranceTypeLovs(): void {
  this.lovDataService.getLovsbyType(LovType.HealthInsuranceType).subscribe({
    next: (loveInsuranceTypeResponse) => {
      this.lovInsuranceTypeSubject.next(loveInsuranceTypeResponse);
    },
    error: (err) => {
      console.error('err', err);
    },
  });
}
getMetalLevelLovs(): void {
  this.lovDataService.getLovsbyType(LovType.MetalLevel).subscribe({
    next: (lovResponse) => {
      this.lovMetalLevelSubject.next(lovResponse);
    },
    error: (err) => {
      console.error('err', err);
    },
  });
}

getPremiumFrequencyLovs(): void {
  this.lovDataService.getLovsbyType(LovType.PremiumFrequency).subscribe({
    next: (lovResponse) => {
      this.lovPremiumFrequencySubject.next(lovResponse);
    },
    error: (err) => {
      console.error('err', err);
    },
  });
}
getMedicareCoverageTypeLovs(): void {
  this.lovDataService.getLovsbyType(LovType.MedicareCoverageType).subscribe({
    next: (lovResponse) => {
      this.lovMedicareCoverageTypeSubject.next(lovResponse);
    },
    error: (err) => {
      console.error('err', err);
    },
  });
}
getCaseStatusLovs(): void {
  this.lovDataService.getLovsbyType(LovType.CaseStatus).subscribe({
    next: (lovResponse) => {
      const acceptedCaseStatusCodes = Object.values(AcceptedCaseStatusCode)
      const filteredLov = lovResponse.filter((item:any) => acceptedCaseStatusCodes.includes(item.lovCode))
      this.lovCaseStatusSubject.next(filteredLov);
    },
    error: (err) => {
      console.error('err', err);
    },
  });
}
getGroupLovs(): void {
  this.lovDataService.getLovsbyType(LovType.Group).subscribe({
    next: (lovResponse) => {
      this.lovGroupSubject.next(lovResponse);
    },
    error: (err) => {
      console.error('err', err);
    },
  });
}
}


