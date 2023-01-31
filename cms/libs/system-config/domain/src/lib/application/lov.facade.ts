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
  private lovPriorityCodeSubject = new BehaviorSubject<Lov[]>([]);
  private lovPrioritySubject=new BehaviorSubject<Lov[]>([]);
  private lovOtherEthnicitySubject=new BehaviorSubject<Lov[]>([]);
  private lovAptcSubject = new BehaviorSubject<Lov[]>([]);

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
  priorityCodeType$ = this.lovPriorityCodeSubject.asObservable();
  pharmacyPrioritylov$=this.lovPrioritySubject.asObservable();
  otherEthnicitylov$=this.lovOtherEthnicitySubject.asObservable();
  aptclov$=this.lovAptcSubject.asObservable();


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
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}

getRelationShipsLovs(): void {
  this.lovDataService.getLovsbyType(LovType.RelationshipCode).subscribe({
    next: (relationsResponse) => {
      this.lovRelationShipSubject.next(relationsResponse);
    },
    error: (err) => {    
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}
getGenderLovs(): void {
  this.lovDataService.getLovsbyType(LovType.Gender).subscribe({
    next: (lovResponse) => {
      this.lovGenderSubject.next(lovResponse);
    },
    error: (err) => {     
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}

getCaseOriginLovs(): void {
  this.lovDataService.getLovsbyType(LovType.CaseOrigin).subscribe({
    next: (lovcaseoriginResponse) => {
      this.lovcaseoriginSubject.next(lovcaseoriginResponse);
    },
    error: (err) => {   
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });

}
getPronounLovs(): void {
  this.lovDataService.getLovsbyType(LovType.Pronoun).subscribe({
    next: (lovPronounResponse) => {
      this.lovPronounSubject.next(lovPronounResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });

}

getMaterialLovs(): void {
  this.lovDataService.getLovsbyType(LovType.Material).subscribe({
    next: (lovMaterialResponse) => {
      this.lovMaterialSubject.next(lovMaterialResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });

}
getTransgenderLovs(): void {
  this.lovDataService.getLovsbyType(LovType.Transgender).subscribe({
    next: (lovResponse) => {
      this.lovTransgenderSubject.next(lovResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}
getSexAtBirthLovs(): void {
  this.lovDataService.getLovsbyType(LovType.SexAtBirth).subscribe({
    next: (lovResponse) => {
      this.lovSexAtBirthSubject.next(lovResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}
getSexulaIdentityLovs(): void {
  this.lovDataService.getLovsbyType(LovType.SexulaIdentity).subscribe({
    next: (lovResponse) => {
      this.lovSexulaIdentitySubject.next(lovResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}
getContactRelationShipsLovs(): void {
  this.lovDataService.getLovsbyType(LovType.ContactRelationshipCode).subscribe({
    next: (relationsResponse) => {
      this.lovCntRelationshipCodeSubject.next(relationsResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}
getMaterialYesLovs(): void {
  this.lovDataService.getLovsbyParent(LovType.MaterialYes,LovType.Material).subscribe({
    next: (lovMaterialYesResponse) => {
      this.lovMaterialYesSubject.next(lovMaterialYesResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}

getIncomeSourceLovs():void{
  this.lovDataService.getLovsbyType(LovType.IncomeSource).subscribe({
    next: (lovIncomeSourceResponse) => {
      this.lovIncomeSourceSubject.next(lovIncomeSourceResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}
getSpokenWrittenLanguageLovs(): void {
  this.lovDataService.getLovsbyType(LovType.SpokenWrittenLanguage).subscribe({
    next: (LanguageResponse) => {
      this.lovSpokenWriottenLanguageSubject.next(LanguageResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}
getEnglishProficiencyLovs(): void {
  this.lovDataService.getLovsbyType(LovType.EnglishProficiency).subscribe({
    next: (proficiencyResponse) => {
      this.lovEnglishProficiencySubject.next(proficiencyResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}
getRaceLovs(): void {
  this.lovDataService.getLovsbyTypes(LovType.RaceGroup).subscribe({
    next: (response) => {
      this.lovRaceSubject.next(response);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}
getEthnicityLovs(): void {
  this.lovDataService.getLovsbyType(LovType.Ethnicity).subscribe({
    next: (response) => {
      this.lovEthnicitySubject.next(response);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}
getIncomeTypeLovs():void{
  this.lovDataService.getLovsbyType(LovType.IncomeType).subscribe({
    next: (lovIncomeTypeResponse) => {
      this.lovIncomeTypeSubject.next(lovIncomeTypeResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}

getIncomeFrequencyLovs():void{
  this.lovDataService.getLovsbyType(LovType.Frequency).subscribe({
    next: (lovIncomeFrequencyResponse) => {
      this.lovIncomeFrequencySubject.next(lovIncomeFrequencyResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
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
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}
getMetalLevelLovs(): void {
  this.lovDataService.getLovsbyType(LovType.MetalLevel).subscribe({
    next: (lovResponse) => {
      this.lovMetalLevelSubject.next(lovResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}

getPremiumFrequencyLovs(): void {
  this.lovDataService.getLovsbyType(LovType.PremiumFrequency).subscribe({
    next: (lovResponse) => {
      this.lovPremiumFrequencySubject.next(lovResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}
getMedicareCoverageTypeLovs(): void {
  this.lovDataService.getLovsbyType(LovType.MedicareCoverageType).subscribe({
    next: (lovResponse) => {
      this.lovMedicareCoverageTypeSubject.next(lovResponse);
    },
    error: (err) => {     
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
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
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}


getGroupLovs(): void {
  this.lovDataService.getLovsbyType(LovType.Group).subscribe({
    next: (lovResponse) => {
      this.lovGroupSubject.next(lovResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });

}

getCaseCodeLovs(): void {
  this.lovDataService.getLovsbyType(LovType.PriorityCode).subscribe({
    next: (lovCaseStatusResponse) => {
      this.lovPriorityCodeSubject.next(lovCaseStatusResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });

}


getPriorityLovs(): void {
  this.lovDataService.getLovsbyType(LovType.PriorityCode).subscribe({
    next: (lovPriorityResponse) => {
      this.lovPrioritySubject.next(lovPriorityResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });

}

getOtherEthnicityIdentitiesLovs(): void {
  this.lovDataService.getLovsbyType(LovType.EthnicityOtherCategories).subscribe({
    next: (lovotherEthnicityResponse) => {
      this.lovOtherEthnicitySubject.next(lovotherEthnicityResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });

}
getAptcLovs(): void {
  this.lovDataService.getLovsbyType(LovType.Aptc).subscribe({
    next: (lovResponse) => {
      this.lovAptcSubject.next(lovResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}
}


