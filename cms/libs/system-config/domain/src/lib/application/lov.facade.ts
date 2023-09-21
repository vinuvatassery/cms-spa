/** Angular **/
import { Injectable } from '@angular/core';
import { NotificationSnackbarService,SnackBarNotificationType,LoggingService  } from '@cms/shared/util-core';
import { Subject } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Lov } from '../entities/lov';
import { AcceptedCaseStatusCode } from '../enums/accepted-case-status-code.enum';
import { ApplicantInfoLovType } from '../enums/applicant-info-lov-types.enum';
import { LovType } from '../enums/lov-types.enum';


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
  private lovSexualIdentitySubject = new BehaviorSubject<Lov[]>([]);
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
  private lovVerificationMethodSubject = new BehaviorSubject<Lov[]>([]);
  private lovApplicantInfoSubject = new BehaviorSubject<Lov[]>([]);
  private lovColumnDroplistSubject = new BehaviorSubject<Lov[]>([]);


  private lovAddressTypeSubject = new BehaviorSubject<Lov[]>([]);
  private showLoaderOnAddressType = new BehaviorSubject<boolean>(false);
  private lovClientPhoneDeviceTypeSubject = new Subject<Lov[]>();
  private showLoaderOnRelationType = new BehaviorSubject<boolean>(false);
  private eligibilityStatusSubject = new BehaviorSubject<Lov[]>([]);
  private eligibilityStatusCpSubject = new BehaviorSubject<Lov[]>([]);
  private showLoaderOnEligibilityStatusSubject = new BehaviorSubject<boolean>(false);
  private showLoaderOnEligibilityStatusCpSubject = new BehaviorSubject<boolean>(false);
  private disenrollmentReasonSubject = new BehaviorSubject<Lov[]>([]);
  private disenrollmentReasonStatusSubject = new BehaviorSubject<boolean>(false);
  private paymentRequestTypeSubject = new BehaviorSubject<Lov[]>([]);
  private paymentReversalSubject = new BehaviorSubject<Lov[]>([]);
  private premiumPaymentTypeSubject = new BehaviorSubject<Lov[]>([]);
  private premiumPaymentReversalSubject = new BehaviorSubject<Lov[]>([]);
  private lovAttachmentsDroplistSubject = new BehaviorSubject<Lov[]>([]);
  private documentTypeCodeSubject = new BehaviorSubject<Lov[]>([]);
  private documentSubTypeCodeSubject = new BehaviorSubject<Lov[]>([]);
  private paymentMethodTypeSubject = new BehaviorSubject<Lov[]>([]);
  private paymentStatusSubject = new BehaviorSubject<Lov[]>([]);
  private paymentRunDateSubject = new BehaviorSubject<Lov[]>([]);
  private lovPaymentMethodVendorSubject = new BehaviorSubject<Lov[]>([]);
  private lovPaymentRunDateSubject = new BehaviorSubject<Lov[]>([]);
  private lovYesOrNoSubject = new BehaviorSubject<Lov[]>([]);
  private pendingApprovalPaymentTypeSubject = new Subject<any>();

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
  sexulaIdentitylov$ = this.lovSexualIdentitySubject.asObservable();
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
  verificationMethod$ = this.lovVerificationMethodSubject.asObservable();
  ColumnDroplistlov$ = this.lovColumnDroplistSubject.asObservable();
  applicantInfolov$=this.lovApplicantInfoSubject.asObservable();
  addressType$ = this.lovAddressTypeSubject.asObservable();
  showLoaderOnAddressType$ = this.showLoaderOnAddressType.asObservable();
  lovClientPhoneDeviceType$=this.lovClientPhoneDeviceTypeSubject.asObservable();
  eligibilityStatus$ = this.eligibilityStatusSubject.asObservable();
  eligibilityStatusCp$ = this.eligibilityStatusCpSubject.asObservable();
  showLoaderOnEligibilityStatus$ = this.showLoaderOnEligibilityStatusSubject.asObservable();
  showLoaderOnEligibilityStatusCp$ = this.showLoaderOnEligibilityStatusCpSubject.asObservable();
  showLoaderOnRelationType$ = this.showLoaderOnRelationType.asObservable();
  disenrollmentReason$ = this.disenrollmentReasonSubject.asObservable();
  disenrollmentReasonStatus$ = this.disenrollmentReasonStatusSubject.asObservable();
  paymentRequestType$ = this.paymentRequestTypeSubject.asObservable();
  paymentReversal$ = this.paymentReversalSubject.asObservable();
  premiumPaymentType$ = this.premiumPaymentTypeSubject.asObservable();
  premiumPaymentReversal$ = this.premiumPaymentReversalSubject.asObservable();
  attachmentTypeDroplistlov$ = this.lovAttachmentsDroplistSubject.asObservable();
  documentTypeCodeSubject$ = this.documentTypeCodeSubject.asObservable();
  documentSubTypeCodeSubject$ = this.documentSubTypeCodeSubject.asObservable();
  paymentMethodType$ = this.paymentMethodTypeSubject.asObservable();
  paymentStatus$ = this.paymentStatusSubject.asObservable();
  paymentRunDates$ = this.paymentRunDateSubject.asObservable();
  pendingApprovalPaymentType$ = this.pendingApprovalPaymentTypeSubject.asObservable();



  paymentMethodVendorlov$ = this.lovPaymentMethodVendorSubject.asObservable();
  paymentRunDatelov$ = this.lovPaymentRunDateSubject.asObservable();
  yesOrNoLov$ = this.lovYesOrNoSubject.asObservable();


        /** Public methods **/
  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)

  }

  getClientPhoneDeviceTypeLovs(): void {
    this.lovDataService.getLovsbyType(LovType.PhoneDeviceTypeCode).subscribe({
      next: (relationsResponse) => {
        this.lovClientPhoneDeviceTypeSubject.next(relationsResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
      },
    });
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
      this.lovSexualIdentitySubject.next(lovResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}
getContactRelationShipsLovs(): void {
  this.showLoaderOnRelationType.next(true);
  this.lovDataService.getLovsbyType(LovType.ContactRelationshipCode).subscribe({
    next: (relationsResponse) => {
      this.lovCntRelationshipCodeSubject.next(relationsResponse);
      this.showLoaderOnRelationType.next(false);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
      this.showLoaderOnRelationType.next(false);
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
getHealthInsuranceTypeLovs(): void {
  this.lovDataService.getLovsbyType(LovType.HealthInsuranceType).subscribe({
    next: (loveInsuranceTypeResponse) => {
      this.lovInsuranceTypeSubject.next(loveInsuranceTypeResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}
getDentalInsuranceTypeLovs(): void {
  this.lovDataService.getLovsbyType(LovType.DentalInsuranceType).subscribe({
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
      this.lovCaseStatusTypeSubject.next(lovResponse);
      const acceptedCaseStatusCodes = Object.values(AcceptedCaseStatusCode)
      const filteredLov = lovResponse.filter((item:any) => acceptedCaseStatusCodes.includes(item.lovCode))
      filteredLov.forEach((item: any) => {
        item.lovDesc = item.lovDesc.toUpperCase();
      });
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
getVerificationMethodLovs(): void {
  this.lovDataService.getLovsbyType(LovType.VerificationMethod).subscribe({
    next: (lovResponse) => {
      this.lovVerificationMethodSubject.next(lovResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}
getColumnDroplistLovs(): void {
  this.lovDataService.getLovsbyType(LovType.ColumnDroplist).subscribe({
    next: (lovResponse) => {
      this.lovColumnDroplistSubject.next(lovResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}

getAddressTypeLovs(): void {
  this.showLoaderOnAddressType.next(true);
  this.lovDataService.getLovsbyType(LovType.AddressType).subscribe({
    next: (lovResponse) => {
      this.lovAddressTypeSubject.next(lovResponse);
      this.showLoaderOnAddressType.next(false);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
      this.showLoaderOnAddressType.next(false);
    },
  });
}

getApplicantInfoLovs(): void {
  const lovTypeArr = Object.values(ApplicantInfoLovType);
  const lovTypes = lovTypeArr.toString();
  const raceIdentityArr : any = [];
  this.lovDataService.getLovsbyTypes(lovTypes).subscribe({
    next: (lovResponse) => {
      lovResponse.forEach((element:any) => {
        if(element.key === ApplicantInfoLovType.EnglishProficiency){
          this.lovEnglishProficiencySubject.next(element.value);
        }
        else if(element.key === ApplicantInfoLovType.Gender){
          this.lovGenderSubject.next(element.value);
        }
        else if(element.key === ApplicantInfoLovType.SpokenWrittenLanguage){
          this.lovSpokenWriottenLanguageSubject.next(element.value);
        }
        else if(element.key === ApplicantInfoLovType.MaterialInAlternateFormat)
        {
          this.lovMaterialSubject.next(element.value);
        }
        else if(element.key === ApplicantInfoLovType.EthnicityOtherCategories)
        {
          this.lovOtherEthnicitySubject.next(element.value);
        }
        else if(element.key === ApplicantInfoLovType.Transgender)
        {
          this.lovTransgenderSubject.next(element.value);
        }
        else if(element.key === ApplicantInfoLovType.SexAtBirth)
        {
          this.lovSexAtBirthSubject.next(element.value);
        }
        else if(element.key === ApplicantInfoLovType.Pronouns)
        {
          this.lovPronounSubject.next(element.value);
        }
        else if(element.key === ApplicantInfoLovType.SexualIdentity)
        {
          this.lovSexualIdentitySubject.next(element.value);
        }
        else if(element.key === ApplicantInfoLovType.Ethnicity || element.key === ApplicantInfoLovType.Race)
        {
          raceIdentityArr.push(element.value);
          if(raceIdentityArr.length === 2)
          {
            this.lovRaceSubject.next(raceIdentityArr);
          }
        }
      });
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}
getEligibilityStatusLovs(): void {
  this.showLoaderOnEligibilityStatusSubject.next(true);
  this.lovDataService.getLovsbyType(LovType.EligibilityStatus).subscribe({
    next: (lovResponse) => {
      this.eligibilityStatusSubject.next(lovResponse);
      this.showLoaderOnEligibilityStatusSubject.next(false);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
      this.showLoaderOnEligibilityStatusSubject.next(false);
    },
  });
}

getDisenrollmentReasonLovs(): void {
  this.disenrollmentReasonStatusSubject.next(true);
  this.lovDataService.getLovsbyType(LovType.CaseReasonCode).subscribe({
    next: (lovResponse) => {
      this.disenrollmentReasonSubject.next(lovResponse);
      this.disenrollmentReasonStatusSubject.next(false);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
      this.disenrollmentReasonStatusSubject.next(false);
    },
  });
}
getAttachmentTypesLovs(): void {
  this.lovDataService.getLovsbyType(LovType.AttachmentsTypes).subscribe({
    next: (lovResponse) => {
      this.lovAttachmentsDroplistSubject.next(lovResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}
getEligibilityStatusCpLovs(): void {
  this.showLoaderOnEligibilityStatusCpSubject.next(true);
  this.lovDataService.getLovsbyType(LovType.EligibilityStatusCp).subscribe({
    next: (lovResponse) => {
      this.eligibilityStatusCpSubject.next(lovResponse);
      this.showLoaderOnEligibilityStatusCpSubject.next(false);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
      this.showLoaderOnEligibilityStatusCpSubject.next(false);
    },
  });
}
getDocumentTypeLovs(): void {
  this.lovDataService.getLovsbyType(LovType.DocumentTypeCode).subscribe({
    next: (lovResponse) => {
      this.documentTypeCodeSubject.next(lovResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
}
getDocumentSubTypeLovs(parentCode : string) {
  return this.lovDataService.getLovsbyParent(LovType.DocumentSubTypeCode, parentCode)
}

  getCoPaymentRequestTypeLov(): void {
    this.lovDataService.getLovsbyType(LovType.CoPaymentType).subscribe({
      next: (lovResponse) => {
        this.paymentRequestTypeSubject.next(lovResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

  getPremiumPaymentTypeLov(): void {
    this.lovDataService.getLovsbyType(LovType.PremiumPaymentType).subscribe({
      next: (lovResponse) => {
        this.premiumPaymentTypeSubject.next(lovResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }
  getPremiumPaymentReversalLov(): void {
    this.lovDataService.getLovsbyType(LovType.PremiumPaymentReversal).subscribe({
      next: (lovResponse) => {
        this.premiumPaymentReversalSubject.next(lovResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      }
    });
  }

  getPaymentMethodLov(): void {
    this.lovDataService.getLovsbyType(LovType.PaymentMethodCode).subscribe({
      next: (lovResponse) => {
        this.paymentMethodTypeSubject.next(lovResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      }
    });
  }

  getPaymentStatusLov(): void {
    this.lovDataService.getLovsbyType(LovType.PaymentStatusCode).subscribe({
      next: (lovResponse) => {
        this.paymentStatusSubject.next(lovResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      }
    });
  }

  getPaymentRunDateLov(): void {
    this.lovDataService.getLovsbyType(LovType.PaymentRunDate).subscribe({
      next: (lovResponse) => {
        this.paymentRunDateSubject.next(lovResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      }
    });
  }
  getVendorPaymentMethodLovs(): void {
    this.lovDataService.getLovsbyType(LovType.PaymentMethodVendor).subscribe({
      next: (resp) => {
        this.lovPaymentMethodVendorSubject.next(resp);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
      },
    });
  }
  getVendorPaymentRunDatesLovs(): void {
    this.lovDataService.getLovsbyType(LovType.PaymentRunDate).subscribe({
      next: (resp) => {
        this.lovPaymentRunDateSubject.next(resp);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
      },
    });
  }
  getYesOrNoLovs(): void {
    this.lovDataService.getLovsbyType(LovType.AcceptPaymentsReports).subscribe({
      next: (resp) => {
        this.lovYesOrNoSubject.next(resp);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
      },
    });
  }

  getPandingApprovalPaymentTypeLov(): void {
    this.lovDataService.getLovsbyType(LovType.PendingApprovalPaymentType).subscribe({
      next: (lovResponse) => {
        this.pendingApprovalPaymentTypeSubject.next(lovResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }
}


