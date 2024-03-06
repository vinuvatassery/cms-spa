/** Angular **/

import { Component, ChangeDetectionStrategy, Output, EventEmitter, OnInit, Input, ChangeDetectorRef, OnDestroy, ElementRef } from '@angular/core';
import {
  ClientProfile, ClientFacade, Client,
  ClientCaseEligibility, ClientPronoun, ClientGender,
  ClientRace, ClientSexualIdentity, ClientCaseEligibilityFlag,
  ClientCaseEligibilityAndFlag, ControlPrefix,
  PronounCode, TransGenderCode, ApplicantInfo,
  CaseFacade
} from '@cms/case-management/domain';
import { MaterialFormat, YesNoFlag, StatusFlag } from '@cms/shared/ui-common';

import { FormGroup, Validators } from '@angular/forms';
import { LoaderService, LoggingService, SnackBarNotificationType, ConfigurationProvider } from '@cms/shared/util-core';
import { Subject, Subscription, of } from 'rxjs';
import { IntlService } from '@progress/kendo-angular-intl';
import { ScrollFocusValidationfacade } from '@cms/system-config/domain';
@Component({
  selector: 'case-management-client-read-only-view',
  templateUrl: './client-read-only-view.component.html',
  styleUrls: ['./client-read-only-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientReadOnlyViewComponent implements OnInit{
  /** Public properties **/
  @Input() clientProfile : any
  @Output() onUpdateApplicantInfo = new EventEmitter();
  @Output() loadReadOnlyClientInfoEvent =  new EventEmitter();
  @Output() loadprofilePhotoEvent =  new EventEmitter<string>();
  @Input() clientId!:any;
  @Input() clientCaseEligibilityId!:any;
  @Input() clientCaseId!:any;
  @Input() ramsellInfo!: any;
  @Input() clientProfile$!: any;
  @Input() userManagerprofilePhoto$!: any;
  @Input() userLastModifierProfilePhoto$!: any;

  applicantInfo = {} as ApplicantInfo;
  isEditClientInformationPopup = false;
  caseManagerHoverDataItem! : any
  appInfoForm!: FormGroup;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  userManagerprofilePhotoSubject = new Subject();
  userLastModifierProfilePhotoSubject = new Subject();
  userFirstName: string  |null=null;
  userLastName: string  |null=null;
  isUserProfilePhotoExist: boolean |null=null;
  creatorId: string  |null=null;
  lastModifierId: string  |null=null;
  clientProfileSubscription = new Subscription();

  constructor(
      private readonly elementRef: ElementRef,
      private loaderService: LoaderService,
      private loggingService: LoggingService,
      private clientFacade: ClientFacade,
      private caseFacade: CaseFacade,
      private intl: IntlService,
      private configurationProvider: ConfigurationProvider,
      private scrollFocusValidationfacade: ScrollFocusValidationfacade){}
   /** Lifecycle hooks **/
 ngOnInit(): void {
  this.loadReadOnlyClientInfoEvent.emit();
}

  /** Internal event methods **/
  onCloseEditClientInformationClicked() {
    this.isEditClientInformationPopup = false;
  }

  onEditClientInformationClicked() {
    if(this.clientId && this.clientCaseId && this.clientCaseEligibilityId){
      this.loadApplicantInfo();
      this.isEditClientInformationPopup = true;
    }
  }


  onManagerHover(clientData : ClientProfile)
  {
    const caseManagerData =
    {
      caseManagerId : clientData?.caseManagerId ,
      caseManagerName   : clientData?.caseManagerName ,
      pNumber   : clientData?.caseManagerPNumber ,
      domainCode   : clientData?.caseManagerDomainCode ,
      assisterGroup   : clientData?.caseManagerAssisterGroup ,
      email   : clientData?.caseManagerEmail ,
      phone   : clientData?.caseManagerPhone ,
      fax   : clientData?.caseManagerFax ,
      address1   : clientData?.caseManagerAddress1 ,
      address2   : clientData?.caseManagerAddress2 ,
      city   : clientData?.caseManagerCity ,
      state   : clientData?.caseManagerState ,
      zip   : clientData?.caseManagerZip ,
    }
    this.caseManagerHoverDataItem = caseManagerData;
  }

  loadprofilePhotoEventHandler(caseManagerId : any)
  {
   this.loadprofilePhotoEvent.emit(caseManagerId)
  }

  private loadApplicantInfo() {
    this.loaderService.show();
    this.clientFacade.load(this.clientId,this.clientCaseId, this.clientCaseEligibilityId).subscribe({
      next: response => {
        if (response) {
          /**Populating Client */
          this.applicantInfo = new ApplicantInfo();
          this.applicantInfo.client = response.client;
          this.applicantInfo.clientCaseId = this.clientCaseId
          /* Populate Client Case Eligibility */
          if (!this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility) {
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility = new ClientCaseEligibility;
          }
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility = response.clientCaseEligibilityAndFlag.clientCaseEligibility;

          /* Populate Client Case Eligibility Flag */
          if (!this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag) {
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag = new ClientCaseEligibilityFlag;
          }
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag = response.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag;

          /*Populate Client Gender, Pronoun, Race and Sexual Identity   */
          this.populateControls(response);

        }
        else {
          this.loaderService.hide();
        }
      },
      error: error => {
        this.loaderService.hide();
        this.clientFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error)
        this.loggingService.logException({ name: SnackBarNotificationType.ERROR, message: error })
      }
    });

  }

  private populateControls(response: any) {
    /*Populate Client Gender */
    response.clientGenderList.forEach((x: any) => {
      const clientGender = new ClientGender()
      clientGender.clientGenderCode = x.clientGenderCode;
      clientGender.clientGenderId = x.clientGenderId;
      clientGender.clientId = x.clientId;
      clientGender.otherDesc = x.otherDesc;
      if (this.applicantInfo.clientGenderList == undefined || null) {
        this.applicantInfo.clientGenderList = []
      }
      this.applicantInfo.clientGenderList.push(clientGender);
    });

    /*Populate Client Pronoun */
    response.clientPronounList.forEach((x: any) => {
      const pronoun = new ClientPronoun()
      pronoun.clientId = x.clientId;
      pronoun.clientPronounCode = x.clientPronounCode;
      pronoun.clientPronounId = x.clientPronounId;
      pronoun.otherDesc = x.otherDesc
      if (this.applicantInfo.clientPronounList == undefined || null) {
        this.applicantInfo.clientPronounList = []
      }
      this.applicantInfo.clientPronounList.push(pronoun);
    })

    /*Populate Client Race */
    response.clientRaceList.forEach((x: any) => {
      const clientRace = new ClientRace();
      clientRace.clientEthnicIdentityCode = x.clientEthnicIdentityCode;
      clientRace.clientId = x.clientId;
      clientRace.clientRaceCategoryCode = x.clientRaceCategoryCode;
      clientRace.clientRaceId = x.clientRaceId;
      clientRace.raceDesc = x.raceDesc;
      clientRace.isPrimaryFlag = x.isPrimaryFlag;
      if (this.applicantInfo.clientRaceList == undefined || null) {
        this.applicantInfo.clientRaceList = []
      }
      this.applicantInfo.clientRaceList.push(clientRace);
    });

    /*Populate Clien Sexual Identity */
    response.clientSexualIdentityList.forEach((x: any) => {
      const clientSexualIdentity = new ClientSexualIdentity();
      clientSexualIdentity.clientId = x.clientId;
      clientSexualIdentity.clientSexualIdentityCode = x.clientSexualIdentityCode;
      clientSexualIdentity.clientSexualyIdentityId = x.clientSexualyIdentityId;
      clientSexualIdentity.otherDesc = x.otherDesc;
      if (this.applicantInfo.clientSexualIdentityList == undefined || null) {
        this.applicantInfo.clientSexualIdentityList = []
      }
      this.applicantInfo.clientSexualIdentityList.push(clientSexualIdentity);
    });

    this.clientFacade.applicationInfoSubject.next(this.applicantInfo);
    this.loaderService.hide();
  }

  setAppInfoForm(appInfoForm: FormGroup) {
    this.appInfoForm = appInfoForm;
  }

  updateApplicantInfo() {
    this.loaderService.show();
    this.validateForm();
    if (this.appInfoForm.valid) {
      this.populateApplicantInfoModel();
      if (this.clientCaseEligibilityId !== null && this.clientCaseEligibilityId !== undefined) {
        this.clientFacade.update(this.applicantInfo, this.clientId).subscribe({
          next: (response: any) => {
            this.loaderService.hide();
            this.clientFacade.showHideSnackBar(
              SnackBarNotificationType.SUCCESS,
              'Applicant Info updated Successfully'
            );
            this.clientFacade.runImportedClaimRules(this.clientId);
            this.onCloseEditClientInformationClicked();
            this.onUpdateApplicantInfo.emit();
            this.clientFacade.reloadClientHeader();
          },
          error: (error: any) => {
            this.loaderService.hide();
            this.clientFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error)
            this.loggingService.logException({ name: SnackBarNotificationType.ERROR, message: error })
          }
        })
      }
      return of(false);
    }
    else {
      this.loaderService.hide();
      const invalidControl = this.scrollFocusValidationfacade.findInvalidControl(this.appInfoForm, this.elementRef.nativeElement,null);
      if (invalidControl) {
        invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalidControl.focus();
      }
      return of(false);
    }
  }

  private validateForm() {
    this.appInfoForm.markAllAsTouched();
    this.appInfoForm.updateValueAndValidity();
    this.setValidationsSectionOne();
    this.setValidationforSexAtBirth();
    this.setTransgenderValidations();
    this.setRegisterToVoteValidation();
    this.setPronounValidation();
    this.setMaterialCodeValidation();
    this.setInterpreterCodeValidation();
    this.setDeafOrHearingCodeValidation();
    this.setBlindCodeValidation();
    this.setLimitingConditionCodeValidation();
    this.setWalkingClimbingDifficultyCodeValidation();
    this.setDifficultyCodeValidation();
    this.setLanguageValidation();
    this.setRaceAndGenderValidation();
    this.appInfoForm.updateValueAndValidity();
  }

  private setValidationforSexAtBirth(){
    let sexAtBirthValue=this.appInfoForm.controls['BirthGender'].value;
    if (sexAtBirthValue === 'NOT_LISTED') {
      this.appInfoForm.controls['BirthGenderDescription'].setValidators(
        Validators.required
      );
    } else {
      this.appInfoForm.controls['BirthGenderDescription'].removeValidators(
        Validators.required
      );
    }
    this.appInfoForm.controls['BirthGenderDescription'].updateValueAndValidity();
  }

  setTransgenderValidations(){
    let transgenderValue=this.appInfoForm.controls['Transgender'].value;
    if (transgenderValue === 'NOT_LISTED') {
      this.appInfoForm.controls['TransgenderDescription'].setValidators(
        Validators.required
      );
    } else {
      this.appInfoForm.controls['TransgenderDescription'].removeValidators(
        Validators.required
      );
      this.appInfoForm.controls[
        'TransgenderDescription'
      ].updateValueAndValidity();
    }
    if(transgenderValue === TransGenderCode.YES) {
      this.appInfoForm.controls['yesTransgender'].setValidators(
        Validators.required
      );
    }
  }

  private setValidationsSectionOne() {
    this.appInfoForm.controls["firstName"].setValidators([Validators.required]);
    this.appInfoForm.controls["firstName"].updateValueAndValidity();
    this.appInfoForm.controls["dateOfBirth"].setValidators([Validators.required]);
    this.appInfoForm.controls["dateOfBirth"].updateValueAndValidity();
    if (this.appInfoForm.controls["chkmiddleName"].value) {
      this.appInfoForm.controls["middleName"].removeValidators(Validators.required);;
      this.appInfoForm.controls["middleName"].updateValueAndValidity();
    }
    else {
      this.appInfoForm.controls["middleName"].setValidators([Validators.required]);
      this.appInfoForm.controls["middleName"].updateValueAndValidity();
    }
    this.appInfoForm.controls["lastName"].setValidators([Validators.required]);
    this.appInfoForm.controls["lastName"].updateValueAndValidity();
    if (this.appInfoForm.controls["prmInsNotApplicable"].value) {
      this.appInfoForm.controls["prmInsFirstName"].removeValidators(Validators.required);;
      this.appInfoForm.controls["prmInsFirstName"].updateValueAndValidity();
      this.appInfoForm.controls["prmInsLastName"].removeValidators(Validators.required);;
      this.appInfoForm.controls["prmInsLastName"].updateValueAndValidity();
    }
    else {
      this.appInfoForm.controls["prmInsFirstName"].setValidators(Validators.required);;
      this.appInfoForm.controls["prmInsFirstName"].updateValueAndValidity();
      this.appInfoForm.controls["prmInsLastName"].setValidators(Validators.required);;
      this.appInfoForm.controls["prmInsLastName"].updateValueAndValidity();
    }
    if (this.appInfoForm.controls["officialIdsNotApplicable"].value) {
      this.appInfoForm.controls["officialIdFirstName"].removeValidators(Validators.required);;
      this.appInfoForm.controls["officialIdFirstName"].updateValueAndValidity();
      this.appInfoForm.controls["officialIdLastName"].removeValidators(Validators.required);;
      this.appInfoForm.controls["officialIdLastName"].updateValueAndValidity();
    }
    else {
      this.appInfoForm.controls["officialIdFirstName"].setValidators(Validators.required);;
      this.appInfoForm.controls["officialIdFirstName"].updateValueAndValidity();
      this.appInfoForm.controls["officialIdLastName"].setValidators(Validators.required);;
      this.appInfoForm.controls["officialIdLastName"].updateValueAndValidity();
    }
    if (this.appInfoForm.controls["ssnNotApplicable"].value) {
      this.appInfoForm.controls["ssn"].removeValidators(Validators.required);;
      this.appInfoForm.controls["ssn"].updateValueAndValidity();
    }
    else {
      let hasError = this.appInfoForm.controls["ssn"].errors;
      this.appInfoForm.controls["ssn"].setValidators(Validators.required);
      this.appInfoForm.controls["ssn"].updateValueAndValidity();
      if (hasError) {
        this.appInfoForm.controls['ssn'].setErrors(hasError);
      }
    }
  }

  private setRegisterToVoteValidation() {
    if (this.appInfoForm.controls["registerToVote"].value == null ||
      this.appInfoForm.controls["registerToVote"].value == '') {
      this.appInfoForm.controls["registerToVote"].setValidators(Validators.required);
      this.appInfoForm.controls["registerToVote"].updateValueAndValidity();
    }
    else {
      this.appInfoForm.controls["registerToVote"].removeValidators(Validators.required);;
      this.appInfoForm.controls["registerToVote"].updateValueAndValidity();
    }

  }

  setPronounValidation(){
    this.appInfoForm.controls["pronouns"].setValidators(Validators.required);
    this.appInfoForm.controls["pronouns"].updateValueAndValidity();
    Object.keys(this.appInfoForm.controls).filter(m => m.includes(ControlPrefix.pronoun)).forEach(pronoun => {
      if (this.appInfoForm.controls[pronoun].value === true) {
        this.appInfoForm.controls['pronouns'].removeValidators(Validators.required)
        this.appInfoForm.controls['pronouns'].updateValueAndValidity();
      }
    });
    if (this.appInfoForm.controls['pronouns'].valid) {
      Object.keys(this.appInfoForm.controls).filter(m => m.includes(ControlPrefix.pronoun)).forEach(pronoun => {
        this.appInfoForm.controls[pronoun].removeValidators(Validators.requiredTrue);
        this.appInfoForm.controls[pronoun].updateValueAndValidity();
        const pronounCode = pronoun.replace(ControlPrefix.pronoun, '');
        if (pronounCode === PronounCode.notListed && this.appInfoForm.controls[pronoun].value) {
          this.appInfoForm.controls['pronoun'].setValidators(Validators.required);
          this.appInfoForm.controls['pronoun'].updateValueAndValidity();
        }
      });
    }
    if (!this.appInfoForm.controls['pronouns'].valid) {
      Object.keys(this.appInfoForm.controls).filter(m => m.includes(ControlPrefix.pronoun)).forEach(pronoun => {
        this.appInfoForm.controls[pronoun].setValidators(Validators.requiredTrue);
        this.appInfoForm.controls[pronoun].updateValueAndValidity();
      });
      this.appInfoForm.controls['pronouns'].setValue(null);
    }
  }

  private setMaterialCodeValidation(){
    this.appInfoForm.controls['materialInAlternateFormatCode'].setValidators(Validators.required);
    this.appInfoForm.controls['materialInAlternateFormatCode'].updateValueAndValidity();
    if (this.appInfoForm.controls['materialInAlternateFormatCode'].value !== '' &&
      this.appInfoForm.controls['materialInAlternateFormatCode'].value !== null) {
      this.appInfoForm.controls['materialInAlternateFormatCode'].setErrors(null);
      this.appInfoForm.controls['materialInAlternateFormatCode'].updateValueAndValidity();
      if (this.appInfoForm.controls['materialInAlternateFormatCode'].value.toUpperCase() == YesNoFlag.Yes.toUpperCase()) {
        this.appInfoForm.controls['materialInAlternateFormatDesc'].setValidators(Validators.required);
        this.appInfoForm.controls['materialInAlternateFormatDesc'].updateValueAndValidity();
        if (
          (this.appInfoForm.controls['materialInAlternateFormatDesc'].value !== null
            && this.appInfoForm.controls['materialInAlternateFormatDesc'].value.toUpperCase() === MaterialFormat.other.toUpperCase())
          && this.appInfoForm.controls['materialInAlternateFormatOther'].value === null
          || this.appInfoForm.controls['materialInAlternateFormatOther'].value === undefined
          || this.appInfoForm.controls['materialInAlternateFormatOther'].value === '') {
          this.appInfoForm.controls['materialInAlternateFormatOther'].setValidators(Validators.required);
          this.appInfoForm.controls['materialInAlternateFormatOther'].updateValueAndValidity();
        }
      }
    }
  }


  private setInterpreterCodeValidation(){
    this.appInfoForm.controls['interpreterCode'].setValidators(Validators.required);
    this.appInfoForm.controls['interpreterCode'].updateValueAndValidity();
    if (this.appInfoForm.controls['interpreterCode'].value !== '' &&
      this.appInfoForm.controls['interpreterCode'].value !== null) {
      this.appInfoForm.controls['interpreterCode'].setErrors(null);
      this.appInfoForm.controls['interpreterCode'].updateValueAndValidity();
      if (this.appInfoForm.controls['interpreterCode'].value.toUpperCase() == YesNoFlag.Yes.toUpperCase()) {
        this.appInfoForm.controls['interpreterType'].setValidators(Validators.required);
        this.appInfoForm.controls['interpreterType'].updateValueAndValidity();
      }
    }
  }

  setDeafOrHearingCodeValidation(){
    this.appInfoForm.controls['deafOrHearingCode'].setValidators(Validators.required);
    this.appInfoForm.controls['deafOrHearingCode'].updateValueAndValidity();
    if (this.appInfoForm.controls['deafOrHearingCode'].value !== '' &&
      this.appInfoForm.controls['deafOrHearingCode'].value !== null) {
      this.appInfoForm.controls['deafOrHearingCode'].setErrors(null);
      this.appInfoForm.controls['deafOrHearingCode'].updateValueAndValidity();
      if (this.appInfoForm.controls['deafOrHearingCode'].value.toUpperCase() == YesNoFlag.Yes.toUpperCase()) {
        this.appInfoForm.controls['startAgeDeafOrHearing'].setValidators(Validators.required);
        this.appInfoForm.controls['startAgeDeafOrHearing'].updateValueAndValidity();
      }
    }
  }

  setBlindCodeValidation(){
    this.appInfoForm.controls['blindSeeingCode'].setValidators(Validators.required);
    this.appInfoForm.controls['blindSeeingCode'].updateValueAndValidity();
    if (this.appInfoForm.controls['blindSeeingCode'].value !== '' &&
      this.appInfoForm.controls['blindSeeingCode'].value !== null) {
      this.appInfoForm.controls['blindSeeingCode'].setErrors(null);
      this.appInfoForm.controls['blindSeeingCode'].updateValueAndValidity();
      if (this.appInfoForm.controls['blindSeeingCode'].value.toUpperCase() == YesNoFlag.Yes.toUpperCase()) {
        this.appInfoForm.controls['startAgeBlindSeeing'].setValidators(Validators.required);
        this.appInfoForm.controls['startAgeBlindSeeing'].updateValueAndValidity();
      }

    }
  }

  setLimitingConditionCodeValidation(){
    this.appInfoForm.controls['limitingConditionCode'].setValidators(Validators.required);
    this.appInfoForm.controls['limitingConditionCode'].updateValueAndValidity();
    if (this.appInfoForm.controls['limitingConditionCode'].value !== '' &&
      this.appInfoForm.controls['limitingConditionCode'].value !== null) {
      this.appInfoForm.controls['limitingConditionCode'].setErrors(null);
      this.appInfoForm.controls['limitingConditionCode'].updateValueAndValidity();
    }
  }

  setWalkingClimbingDifficultyCodeValidation(){
    this.appInfoForm.controls['walkingClimbingDifficultyCode'].setValidators(Validators.required);
    this.appInfoForm.controls['walkingClimbingDifficultyCode'].updateValueAndValidity();
    if (this.appInfoForm.controls['walkingClimbingDifficultyCode'].value !== '' &&
      this.appInfoForm.controls['walkingClimbingDifficultyCode'].value !== null) {
      this.appInfoForm.controls['walkingClimbingDifficultyCode'].setErrors(null);
      this.appInfoForm.controls['walkingClimbingDifficultyCode'].updateValueAndValidity();
      if (this.appInfoForm.controls['walkingClimbingDifficultyCode'].value.toUpperCase() == YesNoFlag.Yes.toUpperCase()) {
        this.appInfoForm.controls['startAgeWalkingClimbingDifficulty'].setValidators(Validators.required);
        this.appInfoForm.controls['startAgeWalkingClimbingDifficulty'].updateValueAndValidity();
      }
    }
  }

  private setDifficultyCodeValidation(){
    this.appInfoForm.controls['dressingBathingDifficultyCode'].setValidators(Validators.required);
    this.appInfoForm.controls['dressingBathingDifficultyCode'].updateValueAndValidity();
    if (this.appInfoForm.controls['dressingBathingDifficultyCode'].value !== '' &&
      this.appInfoForm.controls['dressingBathingDifficultyCode'].value !== null) {
      this.appInfoForm.controls['dressingBathingDifficultyCode'].setErrors(null);
      this.appInfoForm.controls['dressingBathingDifficultyCode'].updateValueAndValidity();
      if (this.appInfoForm.controls['dressingBathingDifficultyCode'].value.toUpperCase() == YesNoFlag.Yes.toUpperCase()) {
        this.appInfoForm.controls['startAgeDressingBathingDifficulty'].setValidators(Validators.required);
        this.appInfoForm.controls['startAgeDressingBathingDifficulty'].updateValueAndValidity();
      }
    }
    this.appInfoForm.controls['concentratingDifficultyCode'].setValidators(Validators.required);
    this.appInfoForm.controls['concentratingDifficultyCode'].updateValueAndValidity();
    if (this.appInfoForm.controls['concentratingDifficultyCode'].value !== '' &&
      this.appInfoForm.controls['concentratingDifficultyCode'].value !== null) {
      this.appInfoForm.controls['concentratingDifficultyCode'].setErrors(null);
      this.appInfoForm.controls['concentratingDifficultyCode'].updateValueAndValidity();
      if (this.appInfoForm.controls['concentratingDifficultyCode'].value.toUpperCase() == YesNoFlag.Yes.toUpperCase()) {
        this.appInfoForm.controls['startAgeConcentratingDifficulty'].setValidators(Validators.required);
        this.appInfoForm.controls['startAgeConcentratingDifficulty'].updateValueAndValidity();
      }

    }
    this.appInfoForm.controls['errandsDifficultyCode'].setValidators(Validators.required);
    this.appInfoForm.controls['errandsDifficultyCode'].updateValueAndValidity();
    if (this.appInfoForm.controls['errandsDifficultyCode'].value !== '' &&
      this.appInfoForm.controls['errandsDifficultyCode'].value !== null) {
      this.appInfoForm.controls['errandsDifficultyCode'].setErrors(null);
      this.appInfoForm.controls['errandsDifficultyCode'].updateValueAndValidity();
      if (this.appInfoForm.controls['errandsDifficultyCode'].value.toUpperCase() == YesNoFlag.Yes.toUpperCase()) {
        this.appInfoForm.controls['startAgeErrandsDifficulty'].setValidators(Validators.required);
        this.appInfoForm.controls['startAgeErrandsDifficulty'].updateValueAndValidity();
      }
    }
  }

  private setLanguageValidation(){
    this.appInfoForm.controls['spokenLanguage'].setValidators(Validators.required);
    if (this.appInfoForm.controls['spokenLanguage'].value !== '' ||
      this.appInfoForm.controls['spokenLanguage'].value !== null) {
      this.appInfoForm.controls['spokenLanguage'].setErrors(null);
    }
    this.appInfoForm.controls['spokenLanguage'].updateValueAndValidity();

    this.appInfoForm.controls['writtenLanguage'].setValidators(Validators.required);
    if (this.appInfoForm.controls['writtenLanguage'].value !== '' ||
      this.appInfoForm.controls['writtenLanguage'].value !== null) {
      this.appInfoForm.controls['writtenLanguage'].setErrors(null);
    }
    this.appInfoForm.controls['writtenLanguage'].updateValueAndValidity();

    this.appInfoForm.controls['englishProficiency'].setValidators(Validators.required);
    if (this.appInfoForm.controls['englishProficiency'].value !== '' ||
      this.appInfoForm.controls['englishProficiency'].value !== null) {
      this.appInfoForm.controls['englishProficiency'].setErrors(null);
    }
    this.appInfoForm.controls['englishProficiency'].updateValueAndValidity();
  }

  private setRaceAndGenderValidation(){
    this.appInfoForm.controls['RaceAndEthnicity'].setValidators(Validators.required);
    this.appInfoForm.controls['RaceAndEthnicity'].updateValueAndValidity();
    const raceAndEthnicity = this.appInfoForm.controls['RaceAndEthnicity'].value;
    if (Array.isArray(raceAndEthnicity)) {
      const raceAndEthnicityNotListed = raceAndEthnicity.some((m: any) => m.lovCode === 'NOT_LISTED');
      if (raceAndEthnicityNotListed) {
        this.appInfoForm.controls['RaceAndEthnicityNotListed'].setValidators(Validators.required);
        this.appInfoForm.controls['RaceAndEthnicityNotListed'].updateValueAndValidity();
      }
    }
    this.appInfoForm.controls['Ethnicity'].setValidators(Validators.required);
    this.appInfoForm.controls['Ethnicity'].updateValueAndValidity();

    this.appInfoForm.controls['RaceAndEthnicityPrimary'].setValidators(Validators.required);
    this.appInfoForm.controls['RaceAndEthnicityPrimary'].updateValueAndValidity();

    this.appInfoForm.controls['GenderGroup'].setValidators(Validators.required);
    this.appInfoForm.controls['GenderGroup'].updateValueAndValidity();


    const genderControls = Object.keys(this.appInfoForm.controls).filter(m => m.includes(ControlPrefix.gender));
    this.appInfoForm.controls['GenderGroup'].setValue(null);
    this.appInfoForm.controls['genderDescription'].updateValueAndValidity();
    genderControls.forEach(gender => {
      if (this.appInfoForm.controls[gender].value === true) {
        this.appInfoForm.controls['GenderGroup'].removeValidators(Validators.required)
        this.appInfoForm.controls['GenderGroup'].updateValueAndValidity();
      }
    });
    if (!this.appInfoForm.controls['GenderGroup'].valid) {
      genderControls.forEach((gender: any) => {
        this.appInfoForm.controls[gender].setValidators(Validators.requiredTrue);
        this.appInfoForm.controls[gender].updateValueAndValidity();
      });
      this.appInfoForm.controls['GenderGroup'].setValue(null);
    }


    this.appInfoForm.controls['Transgender'].setValidators(Validators.required);
    this.appInfoForm.controls['Transgender'].updateValueAndValidity();
    this.appInfoForm.controls['TransgenderDescription'].updateValueAndValidity();

    this.appInfoForm.controls['SexualIdentityGroup'].setValue(null);
    const sexulaIdentity = Object.keys(this.appInfoForm.controls).filter(m => m.includes(ControlPrefix.sexualIdentity));
    sexulaIdentity.forEach(control => {
      if (this.appInfoForm.controls[control].value === true) {
        this.appInfoForm.controls['SexualIdentityGroup'].setValue(control);
        if (control === ControlPrefix.sexualIdentity + 'NOT_LISTED') {
          this.appInfoForm.controls['SexualIdentityDescription'].setValidators(Validators.required);
          this.appInfoForm.controls['SexualIdentityDescription'].updateValueAndValidity();
        }
      }
    });
    this.appInfoForm.controls['SexualIdentityGroup'].setValidators(Validators.required);
    this.appInfoForm.controls['SexualIdentityGroup'].updateValueAndValidity();
    if (!this.appInfoForm.controls['SexualIdentityGroup'].valid) {
      sexulaIdentity.forEach((control: any) => {
        this.appInfoForm.controls[control].setValidators(Validators.requiredTrue);
        this.appInfoForm.controls[control].updateValueAndValidity();
      });
    }



    this.appInfoForm.controls['BirthGender'].setValidators(Validators.required);
    this.appInfoForm.controls['BirthGender'].updateValueAndValidity();

    this.appInfoForm.controls['BirthGenderDescription'].updateValueAndValidity();
  }

  private populateApplicantInfoModel() {

    this.populateClient();
    this.populateClientCaseEligibility();
    this.populateClientPronoun();
    this.populateClientGender();
    this.populateClientSexualIdentity();
    this.populateClientRace();

  }

  private populateClient() {
    if (this.applicantInfo.client == undefined) {
      this.applicantInfo.client = new Client;
    }
    this.applicantInfo.client.firstName = this.appInfoForm.controls["firstName"].value.trim() === '' ? null : this.appInfoForm.controls["firstName"].value;
    if (this.appInfoForm.controls["chkmiddleName"].value ?? false) {
      this.applicantInfo.client.middleName = null;
      this.applicantInfo.client.noMiddleInitialFlag = StatusFlag.Yes;
    }
    else {
      this.applicantInfo.client.middleName = this.appInfoForm.controls["middleName"].value.trim() === '' ? null : this.appInfoForm.controls["middleName"].value.trim();
      this.applicantInfo.client.noMiddleInitialFlag = StatusFlag.No;
    }
    this.applicantInfo.client.lastName = this.appInfoForm.controls["lastName"].value.trim() === '' ? null : this.appInfoForm.controls["lastName"].value;
    this.applicantInfo.client.dob = new Date(this.intl.formatDate(this.appInfoForm.controls['dateOfBirth'].value, this.dateFormat));
    this.applicantInfo.client.genderAtBirthCode = this.appInfoForm.controls["BirthGender"].value;
    if (this.applicantInfo.client.genderAtBirthCode === PronounCode.notListed) {
      this.applicantInfo.client.genderAtBirthDesc = this.appInfoForm.controls["BirthGenderDescription"].value;
    }


    if (this.appInfoForm.controls["ssnNotApplicable"].value) {
      this.applicantInfo.client.ssn = null;
      this.applicantInfo.client.ssnNotApplicableFlag = StatusFlag.Yes;
    }
    else {
      this.applicantInfo.client.ssn = this.appInfoForm.controls["ssn"].value.trim() === '' ? null : this.appInfoForm.controls["ssn"].value;
      this.applicantInfo.client.ssnNotApplicableFlag = StatusFlag.No;
    }
  }

  private populateClientCaseEligibility() {
    if (this.applicantInfo.clientCaseEligibilityAndFlag === undefined) {
      this.applicantInfo.clientCaseEligibilityAndFlag = new ClientCaseEligibilityAndFlag
    }
    if (this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility == undefined) {
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility = new ClientCaseEligibility;
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.clientCaseId = this.clientCaseId;
    }

    const isTransgenderYes = this.appInfoForm.controls['Transgender'].value == TransGenderCode.YES;
    this.applicantInfo.client.clientTransgenderCode = this.appInfoForm.controls[isTransgenderYes ? 'yesTransgender' : 'Transgender'].value;
    this.applicantInfo.client.clientTransgenderDesc = null;

    if (this.appInfoForm.controls["Transgender"].value === PronounCode.notListed) {
      this.applicantInfo.client.clientTransgenderDesc = this.appInfoForm.controls["TransgenderDescription"].value;
    }

    if (this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag == undefined) {
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag = new ClientCaseEligibilityFlag;
    }
    this.assignPrmInsNotApplicable();
    this.assignOfficialIdsNotApplicable();
    this.assignRegisterToVote();
    this.assignMaterialInAlternateFormatCode();
    this.assignInterpreterCode();
    this.assignDeafOrHearingCode();
    this.assignBlindSeeingCode();
    this.applicantInfo.client.limitingConditionCode = this.appInfoForm.controls["limitingConditionCode"].value
    this.assignWalkingClimbingDifficultyCode();
    this.assignDressingBathingDifficultyCode();
    this.assignConcentratingDifficultyCode();
    this.assignErrandsDifficultyCode();
    this.applicantInfo.client.spokenLanguageCode = this.appInfoForm.controls["spokenLanguage"].value;
    this.applicantInfo.client.writtenLanguageCode = this.appInfoForm.controls["writtenLanguage"].value;
    this.applicantInfo.client.englishProficiencyCode = this.appInfoForm.controls["englishProficiency"].value;
  }

  private populateClientPronoun() {
    if (this.applicantInfo.clientPronounList == undefined) {
      this.applicantInfo.clientPronounList = [];
    }
    Object.keys(this.appInfoForm.controls).filter(m => m.includes(ControlPrefix.pronoun)).forEach(pronoun => {
      if (this.appInfoForm.controls[pronoun].value === ""
        || this.appInfoForm.controls[pronoun].value === null
        || this.appInfoForm.controls[pronoun].value === false) {
        this.populateExistingPronoun(pronoun);
      }
      else {
        this.populateNewPronoun(pronoun);
      }

    });

  }

  private populateClientGender() {
    const clientGenderListSaved = this.applicantInfo.clientGenderList;// this is in case of update record
    this.applicantInfo.clientGenderList = [];
    Object.keys(this.appInfoForm.controls).filter(m => m.includes(ControlPrefix.gender)).forEach(control => {
      if (this.appInfoForm.controls[control].value === true) {
        control = control.replace(ControlPrefix.gender, '');
        let clientGender = new ClientGender();
        clientGender.clientGenderCode = control;
        clientGender.clientId = this.clientId;
        if (clientGender.clientGenderCode === PronounCode.notListed) {
          clientGender.otherDesc = this.appInfoForm.controls['genderDescription'].value;
        }
        const Existing = clientGenderListSaved.find(m => m.clientGenderCode === clientGender.clientGenderCode);
        if (Existing !== undefined) {
          clientGender = Existing;
        }
        this.applicantInfo.clientGenderList.push(clientGender);
      }
    });
  }

  private populateClientSexualIdentity() {
    this.applicantInfo.clientSexualIdentityList = [];
    Object.keys(this.appInfoForm.controls).filter(m => m.includes(ControlPrefix.sexualIdentity)).forEach(control => {
      if (this.appInfoForm.controls[control].value === true) {
        control = control.replace(ControlPrefix.sexualIdentity, '');
        const clientSexualIdentity = new ClientSexualIdentity();
        clientSexualIdentity.clientSexualIdentityCode = control;
        clientSexualIdentity.clientId = this.clientId;
        if (clientSexualIdentity.clientSexualIdentityCode === PronounCode.notListed) {
          clientSexualIdentity.otherDesc = this.appInfoForm.controls['SexualIdentityDescription'].value;
        }

        this.applicantInfo.clientSexualIdentityList.push(clientSexualIdentity);
      }
    });
  }

  private populateClientRace() {
    this.applicantInfo.clientRaceList = [];
    const RaceAndEthnicity = this.appInfoForm.controls['RaceAndEthnicity'].value;
    const Ethnicity = [];
    let ethnicityValue = this.appInfoForm.controls['Ethnicity'].value;
    Ethnicity.push(ethnicityValue);
    const RaceAndEthnicityPrimary = this.appInfoForm.controls['RaceAndEthnicityPrimary'].value;
    const checkPrimaryInRaceList = RaceAndEthnicity.filter((lov: any) => lov.lovCode == RaceAndEthnicityPrimary.lovCode);
    if (checkPrimaryInRaceList.length == 0) {
      RaceAndEthnicity.push(RaceAndEthnicityPrimary);
    }
    RaceAndEthnicity.forEach((el: any) => {
      const clientRace = new ClientRace();
      clientRace.clientRaceCategoryCode = el.lovCode;
      clientRace.clientEthnicIdentityCode = "";
      if (RaceAndEthnicityPrimary.lovCode === el.lovCode)
        clientRace.isPrimaryFlag = StatusFlag.Yes;
      clientRace.clientId = this.clientId;
      if (el.lovCode === PronounCode.notListed)
        clientRace.raceDesc = this.appInfoForm.controls['RaceAndEthnicityNotListed'].value;
      this.applicantInfo.clientRaceList.push(clientRace)
    });
    Ethnicity.forEach((el: any) => {
      const clientRace = new ClientRace();
      clientRace.clientEthnicIdentityCode = el.lovCode;
      clientRace.clientRaceCategoryCode = "";
      if (RaceAndEthnicityPrimary.lovCode === el.lovCode)
        clientRace.isPrimaryFlag = StatusFlag.Yes;
      clientRace.clientId = this.clientId;
      this.applicantInfo.clientRaceList.push(clientRace)
    });
  }

  private assignPrmInsNotApplicable() {
    if (this.appInfoForm.controls["prmInsNotApplicable"].value) {
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceFirstName = null;
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceLastName = null;
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.insuranceNameNotApplicableFlag = StatusFlag.Yes;
    }
    else {
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceFirstName = this.appInfoForm.controls["prmInsFirstName"].value.trim() === '' ? null : this.appInfoForm.controls["prmInsFirstName"].value;
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceLastName = this.appInfoForm.controls["prmInsLastName"].value.trim() === '' ? null : this.appInfoForm.controls["prmInsLastName"].value;
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.insuranceNameNotApplicableFlag = StatusFlag.No;
    }
  }

  private assignOfficialIdsNotApplicable() {
    if (this.appInfoForm.controls["officialIdsNotApplicable"].value) {
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdFirstName = null;
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdLastName = null;;
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.officialIdNameNotApplicableFlag = StatusFlag.Yes;
    }
    else {
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdFirstName = this.appInfoForm.controls["officialIdFirstName"].value.trim() === '' ? null : this.appInfoForm.controls["officialIdFirstName"].value;
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdLastName = this.appInfoForm.controls["officialIdLastName"].value.trim() === '' ? null : this.appInfoForm.controls["officialIdLastName"].value;
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.officialIdNameNotApplicableFlag = StatusFlag.No;
    }
  }

  private assignRegisterToVote() {
    if (this.appInfoForm.controls["registerToVote"].value.toUpperCase() === StatusFlag.Yes) {
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.registerToVoteFlag = StatusFlag.Yes;
    }
    else {
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.registerToVoteFlag = StatusFlag.No;
    }
  }

  private assignInterpreterCode() {
    this.applicantInfo.client.interpreterCode = this.appInfoForm.controls["interpreterCode"].value
    if (this.appInfoForm.controls["interpreterCode"].value !== null &&
      this.appInfoForm.controls["interpreterCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()) {
      this.applicantInfo.client.interpreterType = this.appInfoForm.controls["interpreterType"].value
    }
    else {
      this.applicantInfo.client.interpreterType = '';
    }
  }

  private assignDeafOrHearingCode() {
    this.applicantInfo.client.deafOrHearingCode = this.appInfoForm.controls["deafOrHearingCode"].value
    if (this.appInfoForm.controls["deafOrHearingCode"].value !== null &&
      this.appInfoForm.controls["deafOrHearingCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()) {
      this.applicantInfo.client.startAgeDeafOrHearing = this.appInfoForm.controls["startAgeDeafOrHearing"].value
    }
    else {
      this.applicantInfo.client.startAgeDeafOrHearing = null;
    }
  }

  private assignBlindSeeingCode() {
    this.applicantInfo.client.blindSeeingCode = this.appInfoForm.controls["blindSeeingCode"].value
    if (this.appInfoForm.controls["blindSeeingCode"].value !== null &&
      this.appInfoForm.controls["blindSeeingCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()) {
      this.applicantInfo.client.startAgeBlindSeeing = this.appInfoForm.controls["startAgeBlindSeeing"].value
    }
    else {
      this.applicantInfo.client.startAgeBlindSeeing = null;
    }
  }

  private assignWalkingClimbingDifficultyCode() {
    this.applicantInfo.client.walkingClimbingDifficultyCode = this.appInfoForm.controls["walkingClimbingDifficultyCode"].value
    if (this.appInfoForm.controls["walkingClimbingDifficultyCode"].value !== null &&
      this.appInfoForm.controls["walkingClimbingDifficultyCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()) {
      this.applicantInfo.client.startAgeWalkingClimbingDifficulty = this.appInfoForm.controls["startAgeWalkingClimbingDifficulty"].value
    }
    else {
      this.applicantInfo.client.startAgeWalkingClimbingDifficulty = null;
    }
  }

  private assignDressingBathingDifficultyCode() {
    this.applicantInfo.client.dressingBathingDifficultyCode = this.appInfoForm.controls["dressingBathingDifficultyCode"].value
    if (this.appInfoForm.controls["dressingBathingDifficultyCode"].value !== null &&
      this.appInfoForm.controls["dressingBathingDifficultyCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()) {
      this.applicantInfo.client.startAgeDressingBathingDifficulty = this.appInfoForm.controls["startAgeDressingBathingDifficulty"].value
    }
    else {
      this.applicantInfo.client.startAgeDressingBathingDifficulty = null;
    }
  }

  private assignConcentratingDifficultyCode() {
    this.applicantInfo.client.concentratingDifficultyCode = this.appInfoForm.controls["concentratingDifficultyCode"].value
    if (this.appInfoForm.controls["concentratingDifficultyCode"].value !== null &&
      this.appInfoForm.controls["concentratingDifficultyCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()) {
      this.applicantInfo.client.startAgeConcentratingDifficulty = this.appInfoForm.controls["startAgeConcentratingDifficulty"].value
    }
    else {
      this.applicantInfo.client.startAgeConcentratingDifficulty = null;
    }
  }

  private assignErrandsDifficultyCode() {
    this.applicantInfo.client.errandsDifficultyCode = this.appInfoForm.controls["errandsDifficultyCode"].value
    if (this.appInfoForm.controls["errandsDifficultyCode"].value !== null &&
      this.appInfoForm.controls["errandsDifficultyCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()) {
      this.applicantInfo.client.startAgeErrandsDifficulty = this.appInfoForm.controls["startAgeErrandsDifficulty"].value
    }
    else {
      this.applicantInfo.client.startAgeErrandsDifficulty = null;
    }
  }

  private assignMaterialInAlternateFormatCode() {
    this.applicantInfo.client.materialInAlternateFormatCode = this.appInfoForm.controls["materialInAlternateFormatCode"].value
    if (this.appInfoForm.controls["materialInAlternateFormatCode"].value !== null &&
      this.appInfoForm.controls["materialInAlternateFormatCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()) {
      this.applicantInfo.client.materialInAlternateFormatDesc = this.appInfoForm.controls["materialInAlternateFormatDesc"].value
      if (this.applicantInfo.client?.materialInAlternateFormatDesc?.toUpperCase() === MaterialFormat.other.toUpperCase()) {
        this.applicantInfo.client.materialInAlternateFormatOther = this.appInfoForm.controls["materialInAlternateFormatOther"].value;
      }
      else {
        this.applicantInfo.client.materialInAlternateFormatOther = null;
      }
    }
    else {
      this.applicantInfo.client.materialInAlternateFormatDesc = null;
      this.applicantInfo.client.materialInAlternateFormatOther = null;
    }
  }

  private populateExistingPronoun(pronoun: any) {
    const pronounCode = pronoun.replace(ControlPrefix.pronoun, '');
    const existingPronoun = this.applicantInfo.clientPronounList.find(x => x.clientPronounCode === pronounCode)
    if (existingPronoun != null) {
      const index = this.applicantInfo.clientPronounList.indexOf(existingPronoun, 0);
      if (index > -1) {
        this.applicantInfo.clientPronounList.splice(index, 1);
      }
    }
  }

  populateNewPronoun(pronoun: any) {
    const pronounCode = pronoun.replace(ControlPrefix.pronoun, '');
    const existingPronoun = this.applicantInfo.clientPronounList.find(x => x.clientPronounCode === pronounCode)
    if (existingPronoun === null || existingPronoun === undefined) {
      const clientPronoun = new ClientPronoun();
      if (pronounCode === PronounCode.notListed) {
        const pronounCode = pronoun.replace(ControlPrefix.pronoun, '');
        clientPronoun.otherDesc = this.appInfoForm.controls["pronoun"].value;
        clientPronoun.clientPronounCode = pronounCode;
        clientPronoun.clientId = this.clientId;
      }
      else {
        const pronounCode = pronoun.replace(ControlPrefix.pronoun, '');
        clientPronoun.clientPronounCode = pronounCode;
        clientPronoun.clientId = this.clientId;
      }
      this.applicantInfo.clientPronounList.push(clientPronoun);
    }
    else {
      const pronounCode = pronoun.replace(ControlPrefix.pronoun, '');
      if (pronounCode === PronounCode.notListed) {
        const index = this.applicantInfo.clientPronounList.indexOf(existingPronoun, 0);
        this.applicantInfo.clientPronounList[index].clientPronounCode = pronounCode;
        this.applicantInfo.clientPronounList[index].otherDesc = this.appInfoForm.controls["pronoun"].value;
      }
    }
  }
}
