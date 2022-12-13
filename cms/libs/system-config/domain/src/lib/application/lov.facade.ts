/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Lov } from '../entities/lov';
import { LovType } from '../enums/lov-types.enum';
/** Data services **/
import { LovDataService } from '../infrastructure/lov.data.service';

@Injectable({ providedIn: 'root' })
export class LovFacade {

  constructor(
    private readonly lovDataService: LovDataService,

  ) { }
  
  /** Private properties **/
  private lovSubject = new BehaviorSubject<Lov[]>([]);
  private lovcascadeSubject = new BehaviorSubject<Lov[]>([]);
  private lovcaseoriginSubject = new BehaviorSubject<Lov[]>([]);
  private lovPronounSubject = new BehaviorSubject<Lov[]>([]);
  private lovMaterialSubject = new BehaviorSubject<Lov[]>([]);
  private lovMaterialYesSubject = new BehaviorSubject<Lov[]>([]);
  private lovTransgenderSubject = new BehaviorSubject<Lov[]>([]);
  private lovSexAtBirthSubject = new BehaviorSubject<Lov[]>([]);
  private lovSexulaIdentitySubject = new BehaviorSubject<Lov[]>([]);
  private lovGenderSubject = new BehaviorSubject<Lov[]>([]);
  private lovSpokenWriottenLanguageSubject = new BehaviorSubject<Lov[]>([]);
  private lovEnglishProficiencySubject = new BehaviorSubject<Lov[]>([]);

      /** Public properties **/
  lovs$ = this.lovSubject.asObservable();
  ovcascade$ = this.lovcascadeSubject.asObservable();
  caseoriginlov$ = this.lovcaseoriginSubject.asObservable();
  pronounslov$ = this.lovPronounSubject.asObservable();
  materialslov$ = this.lovMaterialSubject.asObservable();
  materialsyeslov$ = this.lovMaterialYesSubject.asObservable();
  transgenderlov$ = this.lovTransgenderSubject.asObservable();
  sexAtBirthlov$ = this.lovSexAtBirthSubject.asObservable();
  sexulaIdentitylov$ = this.lovSexulaIdentitySubject.asObservable();
  genderlov$ = this.lovGenderSubject.asObservable();
  spokenWrittenLanguagelov$ = this.lovSpokenWriottenLanguageSubject.asObservable();
  englishProficiencylov$ = this.lovEnglishProficiencySubject.asObservable();

        /** Public methods **/

 getLovsbyParent(lovType : string,parentCode : string): void {
  this.lovDataService.getLovsbyParent(lovType, parentCode).subscribe({
    next: (lovResponse) => {
      this.lovcascadeSubject.next(lovResponse);
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
      console.error('err', err);
    },
  });
  
}
getPronounLovs(): void {
  this.lovDataService.getLovsbyType(LovType.Pronoun).subscribe({
    next: (lovPronounResponse) => {
      this.lovPronounSubject.next(lovPronounResponse);
    },
    error: (err) => {
      console.error('err', err);
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
}
