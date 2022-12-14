/** Angular **/
import { Injectable } from '@angular/core';
import { LoggingService } from '@cms/shared/util-core';
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
    private loggingService : LoggingService

  ) { }
  
  /** Private properties **/
  private lovSubject = new BehaviorSubject<Lov[]>([]);
  private lovcascadeSubject = new BehaviorSubject<Lov[]>([]);
  private lovRelationShipSubject = new BehaviorSubject<Lov[]>([]);
  private lovcaseoriginSubject = new BehaviorSubject<Lov[]>([]);
  private lovCntRelationshipCodeSubject = new BehaviorSubject<Lov[]>([]);
  private lovPronounSubject = new BehaviorSubject<Lov[]>([]);
  private lovIncomeSourceSubject = new BehaviorSubject<Lov[]>([]);
  private lovIncomeTypeSubject = new BehaviorSubject<Lov[]>([]);
  private lovIncomeFrequencySubject = new BehaviorSubject<Lov[]>([]);
  private lovProofOfIncomeSubject = new BehaviorSubject<Lov[]>([]);
      /** Public properties **/
  lovs$ = this.lovSubject.asObservable();
  ovcascade$ = this.lovcascadeSubject.asObservable();
  lovRelationShip$ = this.lovRelationShipSubject.asObservable();
  caseoriginlov$ = this.lovcaseoriginSubject.asObservable();
  lovCntRelationship$ = this.lovCntRelationshipCodeSubject.asObservable();

  pronounslov$ = this.lovPronounSubject.asObservable();
  incomeSourcelov$ = this.lovIncomeSourceSubject.asObservable();
  incomeTypelov$ = this.lovIncomeTypeSubject.asObservable();
  incomeFrequencylov$ = this.lovIncomeFrequencySubject.asObservable();
  proofOfIncomelov$ = this.lovProofOfIncomeSubject.asObservable();

        /** Public methods **/

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
  this.lovDataService.getLovsbyType(LovType.Pronouns).subscribe({
    next: (lovPronounResponse) => {
      this.lovPronounSubject.next(lovPronounResponse);
    },
    error: (err) => {
      this.loggingService.logException(err)
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
}
