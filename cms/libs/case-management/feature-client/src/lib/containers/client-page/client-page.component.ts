/** Angular **/
import {
  AfterViewInit,
  OnInit,
  OnDestroy,
  Component,
  ChangeDetectionStrategy,
  ElementRef,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
/** External libraries **/
import {
  catchError,
  first,
  forkJoin,
  mergeMap,
  of,
  Subscription,
  tap,
} from 'rxjs';
import { IntlService } from '@progress/kendo-angular-intl';

/** Internal libraries **/
import {
  WorkflowFacade,
  ClientFacade,
  ApplicantInfo,
  Client,
  ClientCaseEligibility,
  ClientPronoun,
  ClientGender,
  ClientRace,
  ClientSexualIdentity,
  ClientCaseEligibilityFlag,
  ClientCaseEligibilityAndFlag,
  CaseFacade,
  ControlPrefix,
  CompletionChecklist,
  NavigationType,
  PronounCode,
  TransGenderCode,
  WorkflowTypeCode
} from '@cms/case-management/domain';
import { MaterialFormat, YesNoFlag, StatusFlag } from '@cms/shared/ui-common';

import {
  LoaderService,
  LoggingService,
  SnackBarNotificationType,
  ConfigurationProvider,
} from '@cms/shared/util-core';
import { ScrollFocusValidationfacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-client-page',
  templateUrl: './client-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientPageComponent implements OnInit, OnDestroy, AfterViewInit {
  /** Private properties **/
  private saveClickSubscription!: Subscription;
  private loadSessionSubscription!: Subscription;
  private saveForLaterClickSubscription!: Subscription;
  private saveForLaterValidationSubscription!: Subscription;
  private discardChangesSubscription!: Subscription;
  /** Public properties **/
  isValid: boolean = true;
  applicantInfo = {} as ApplicantInfo;
  appInfoForm!: FormGroup;
  applicantName: string = '';
  case$ = this.caseFacade.getCase$;
  pronounList!: any;
  showErrorMessage: boolean = false;
  clientCaseId!: string;
  clientId!: number;
  clientCaseEligibilityId!: string;
  sessionId!: string;
  message!: string;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  isCerForm = false;
  prevClientCaseEligibilityId!: string;
  nform!: FormGroup;
  workflowTypeCode:any;
  /** Constructor **/
  constructor(
    private workFlowFacade: WorkflowFacade,
    private clientFacade: ClientFacade,
    private route: ActivatedRoute,
    private caseFacade: CaseFacade,
    private loaderService: LoaderService,
    private loggingService: LoggingService,
    private router: Router,
    private intl: IntlService,
    private configurationProvider: ConfigurationProvider,
    private scrollFocusValidationfacade: ScrollFocusValidationfacade,
    private elementRef: ElementRef
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadSessionData();
    this.addSaveSubscription();
    this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();
    this.addDiscardChangesSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.loadSessionSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
    this.discardChangesSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.workFlowFacade.enableSaveButton();
  }

  /** Private methods **/
  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workFlowFacade.saveAndContinueClicked$
      .pipe(
        tap(() => this.workFlowFacade.disableSaveButton()),
        mergeMap((navigationType: NavigationType) =>
          forkJoin([of(navigationType), this.saveAndUpdate()])
        )
      )
      .subscribe({
        next: ([navigationType, isSaved]) => {
          if (isSaved) {
            this.clientFacade.showHideSnackBar(
              SnackBarNotificationType.SUCCESS,
              this.message
            );
            this.workFlowFacade.navigate(navigationType);
          } else {
            this.workFlowFacade.enableSaveButton();
          }
        },
        error: (error: any) => {
          this.clientFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            error
          );
        },
      });
  }

  private loadSessionData() {
    this.loaderService.show();
    this.applicantInfo = new ApplicantInfo();
    this.applicantInfo.clientPronounList = [];
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowTypeCode = this.route.snapshot.queryParams['wtc'];
    this.workFlowFacade.loadWorkFlowSessionData(this.sessionId);
    this.loadSessionSubscription = this.workFlowFacade.sessionDataSubject$
      .pipe(first((sessionData) => sessionData.sessionData != null))
      .subscribe((session: any) => {
        this.clientFacade.applicationInfoSubject.next(this.applicantInfo);
        if (session && session?.sessionData) {
          this.clientCaseId = JSON.parse(session.sessionData)?.ClientCaseId;
          this.clientId =
            JSON.parse(session.sessionData)?.clientId ?? this.clientId;
          this.clientCaseEligibilityId = JSON.parse(
            session.sessionData
          )?.clientCaseEligibilityId;
          this.prevClientCaseEligibilityId = JSON.parse(
            session.sessionData
          )?.prevClientCaseEligibilityId;
          if (this.prevClientCaseEligibilityId) {
            this.isCerForm = true;
          }
          if (this.clientCaseId) {
            this.applicantInfo.clientCaseId = this.clientCaseId;
            this.applicantInfo.workFlowSessionId = this.sessionId;
            if (this.clientCaseEligibilityId) {
              this.initializeClientCaseEligibility();
            }
          }
          this.loaderService.hide();
        }
      });
  }

  private initializeClientCaseEligibility() {
    if (this.applicantInfo.client === undefined) {
      this.applicantInfo.client = new Client();
    }
    if (this.applicantInfo.clientCaseEligibilityAndFlag === undefined) {
      this.applicantInfo.clientCaseEligibilityAndFlag =
        new ClientCaseEligibilityAndFlag();
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility =
        new ClientCaseEligibility();
    }
    if (
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility ===
      undefined
    ) {
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility =
        new ClientCaseEligibility();
    }
    this.applicantInfo.client.clientId = this.clientId;
    this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.clientCaseEligibilityId =
      this.clientCaseEligibilityId;
    this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.clientCaseId =
      this.clientCaseId;

    this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.prevClientCaseEligibilityId =
      this.prevClientCaseEligibilityId;
    this.loadApplicantInfo();
  }

  private loadApplicantInfo() {
    this.loaderService.show();
    if (this.applicantInfo.client == undefined) {
      this.applicantInfo.client = new Client();
    }

    if (this.applicantInfo.clientCaseEligibilityAndFlag === undefined) {
      this.applicantInfo.clientCaseEligibilityAndFlag =
        new ClientCaseEligibilityAndFlag();
    }
    this.clientFacade
      .load(this.clientId, this.clientCaseId, this.clientCaseEligibilityId)
      .subscribe({
        next: (response) => {
          if (response) {
            this.clientFacade.hideLoader()
            /**Populating Client */
            this.applicantInfo.client = response.client;

            /* Populate Client Case Eligibility */
            if (
              this.applicantInfo.clientCaseEligibilityAndFlag
                .clientCaseEligibility === undefined
            ) {
              this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility =
                new ClientCaseEligibility();
            }
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility =
              response.clientCaseEligibilityAndFlag.clientCaseEligibility;

            /* Populate Client Case Eligibility Flag */
            if (
              this.applicantInfo.clientCaseEligibilityAndFlag
                .clientCaseEligibilityFlag === undefined
            ) {
              this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag =
                new ClientCaseEligibilityFlag();
            }
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag =
              response.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag;

            /*Populate Client Gender, Pronoun, Race and Sexual Identity   */
            this.populateControls(response);
          } else {
            this.loaderService.hide();
          }
        },
        error: (error) => {
          this.loaderService.hide();
          this.clientFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            error
          );
          this.loggingService.logException({
            name: SnackBarNotificationType.ERROR,
            message: error,
          });
        },
      });
  }

  private populateControls(response: any) {
    /*Populate Client Gender */
    response.clientGenderList.forEach((x: any) => {
      const clientGender = new ClientGender();
      clientGender.clientGenderCode = x.clientGenderCode;
      clientGender.clientGenderId = x.clientGenderId;
      clientGender.clientId = x.clientId;
      clientGender.otherDesc = x.otherDesc;
      if (this.applicantInfo.clientGenderList == undefined || null) {
        this.applicantInfo.clientGenderList = [];
      }
      this.applicantInfo.clientGenderList.push(clientGender);
    });

    /*Populate Client Pronoun */
    response.clientPronounList.forEach((x: any) => {
      const pronoun = new ClientPronoun();
      pronoun.clientId = x.clientId;
      pronoun.clientPronounCode = x.clientPronounCode;
      pronoun.clientPronounId = x.clientPronounId;
      pronoun.otherDesc = x.otherDesc;
      if (this.applicantInfo.clientPronounList == undefined || null) {
        this.applicantInfo.clientPronounList = [];
      }
      this.applicantInfo.clientPronounList.push(pronoun);
    });

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
        this.applicantInfo.clientRaceList = [];
      }
      this.applicantInfo.clientRaceList.push(clientRace);
    });

    /*Populate Clien Sexual Identity */
    response.clientSexualIdentityList.forEach((x: any) => {
      const clientSexualIdentity = new ClientSexualIdentity();
      clientSexualIdentity.clientId = x.clientId;
      clientSexualIdentity.clientSexualIdentityCode =
        x.clientSexualIdentityCode;
      clientSexualIdentity.clientSexualyIdentityId = x.clientSexualyIdentityId;
      clientSexualIdentity.otherDesc = x.otherDesc;
      if (this.applicantInfo.clientSexualIdentityList == undefined || null) {
        this.applicantInfo.clientSexualIdentityList = [];
      }
      this.applicantInfo.clientSexualIdentityList.push(clientSexualIdentity);
    });

    this.clientFacade.applicationInfoSubject.next(this.applicantInfo);
    this.loaderService.hide();
  }

  private saveAndUpdate() {
    this.loaderService.show();
    this.validateForm();
    if (this.appInfoForm.valid) {
      this.populateApplicantInfoModel();
      if (
        this.clientCaseEligibilityId !== null &&
        this.clientCaseEligibilityId !== undefined
      ) {
        this.message = 'Applicant Info updated Successfully';
        return this.clientFacade.update(this.applicantInfo, this.clientId).pipe(
          catchError((error: any) => {
            if (error) {
              this.clientFacade.showHideSnackBar(
                SnackBarNotificationType.ERROR,
                error
              );
              return of(false);
            }
            return of(false);
          })
        );
      } else {
        this.message = 'Applicant info saved successfully';
        return this.clientFacade.save(this.applicantInfo).pipe(
          catchError((error: any) => {
            if (error) {
              this.clientFacade.showHideSnackBar(
                SnackBarNotificationType.ERROR,
                error
              );
              return of(false);
            }
            return of(false);
          }),
          tap(() => this.caseFacade.loadActiveSession())
        );
      }
    } else {
      this.loaderService.hide();
      const frmControls = this.reorderControls(this.getFormOrder());
      const invalidControl = this.scrollFocusValidationfacade.findInvalidControl(frmControls, this.elementRef.nativeElement,null);
      if (invalidControl) {
        invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalidControl.focus();
      }
      return of(false);
    }
  }

  private populateApplicantInfoModel() {
    this.populateClient();
    this.populateClientCaseEligibility();
    if (!this.isCerForm) {
      this.populateClientPronoun();
      this.populateClientGender();
      this.populateClientSexualIdentity();
      this.populateClientRace();
    }
  }

  private populateClient() {
    if (this.applicantInfo.client == undefined) {
      this.applicantInfo.client = new Client();
    }
    if(this.isCerForm)
    {
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.cerReceivedDate = new Date(
        this.intl.formatDate(
          this.appInfoForm.controls['cerReceivedDate'].value,
          this.dateFormat
        )
      );
    }


    this.applicantInfo.client.firstName =
      this.appInfoForm.controls['firstName'].value.trim() === ''
        ? null
        : this.appInfoForm.controls['firstName'].value;
    if (this.appInfoForm.controls['chkmiddleName'].value ?? false) {
      this.applicantInfo.client.middleName = null;
      this.applicantInfo.client.noMiddleInitialFlag = StatusFlag.Yes;
    } else {
      this.applicantInfo.client.middleName =
        this.appInfoForm.controls['middleName'].value.trim() === ''
          ? null
          : this.appInfoForm.controls['middleName'].value.trim();
      this.applicantInfo.client.noMiddleInitialFlag = StatusFlag.No;
    }
    this.applicantInfo.client.lastName =
      this.appInfoForm.controls['lastName'].value.trim() === ''
        ? null
        : this.appInfoForm.controls['lastName'].value;
    this.applicantInfo.client.dob = new Date(
      this.intl.formatDate(
        this.appInfoForm.controls['dateOfBirth'].value,
        this.dateFormat
      )
    );

    this.populateClientCERForm();

    if (this.appInfoForm.controls['ssnNotApplicable'].value) {
      this.applicantInfo.client.ssn = null;
      this.applicantInfo.client.ssnNotApplicableFlag = StatusFlag.Yes;
    } else {
      this.applicantInfo.client.ssn =
        this.appInfoForm.controls['ssn'].value.trim() === ''
          ? null
          : this.appInfoForm.controls['ssn'].value;
      this.applicantInfo.client.ssnNotApplicableFlag = StatusFlag.No;
    }
  }

  private populateClientCERForm()
  {
    if (!this.isCerForm) {
      this.applicantInfo.client.genderAtBirthCode =
        this.appInfoForm.controls['BirthGender'].value;
      if (
        this.applicantInfo.client.genderAtBirthCode === PronounCode.notListed
      ) {
        this.applicantInfo.client.genderAtBirthDesc =
          this.appInfoForm.controls['BirthGenderDescription'].value;
      }
    }
  }

  private populateClientCaseEligibility() {
    if (this.applicantInfo.clientCaseEligibilityAndFlag === undefined) {
      this.applicantInfo.clientCaseEligibilityAndFlag =
        new ClientCaseEligibilityAndFlag();
    }
    if (
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility ==
      undefined
    ) {
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility =
        new ClientCaseEligibility();
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.clientCaseId =
        this.clientCaseId;
    }

    this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.prevClientCaseEligibilityId =
      this.prevClientCaseEligibilityId;

    if (!this.isCerForm) {
      const isTransgenderYes =
        this.appInfoForm.controls['Transgender'].value == TransGenderCode.YES;
      this.applicantInfo.client.clientTransgenderCode =
        this.appInfoForm.controls[
          isTransgenderYes ? 'yesTransgender' : 'Transgender'
        ].value;
      this.applicantInfo.client.clientTransgenderDesc = null;

      if (
        this.appInfoForm.controls['Transgender'].value === PronounCode.notListed
      ) {
        this.applicantInfo.client.clientTransgenderDesc =
          this.appInfoForm.controls['TransgenderDescription'].value;
      }
    }
    if (
      this.applicantInfo.clientCaseEligibilityAndFlag
        .clientCaseEligibilityFlag == undefined
    ) {
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag =
        new ClientCaseEligibilityFlag();
    }

    this.assignOfficialIdsNotApplicable();
    this.assignPrmInsNotApplicable();

    if (!this.isCerForm) {
      this.assignRegisterToVote();
      this.assignMaterialInAlternateFormatCode();
      this.assignInterpreterCode();
      this.assignDeafOrHearingCode();
      this.assignBlindSeeingCode();
      this.applicantInfo.client.limitingConditionCode =
        this.appInfoForm.controls['limitingConditionCode'].value;
      this.assignWalkingClimbingDifficultyCode();
      this.assignDressingBathingDifficultyCode();
      this.assignConcentratingDifficultyCode();
      this.assignErrandsDifficultyCode();
    }
    this.applicantInfo.client.spokenLanguageCode =
      this.appInfoForm.controls['spokenLanguage'].value;
    this.applicantInfo.client.writtenLanguageCode =
      this.appInfoForm.controls['writtenLanguage'].value;
    this.applicantInfo.client.englishProficiencyCode =
      this.appInfoForm.controls['englishProficiency'].value;
  }

  private assignPrmInsNotApplicable() {
    if (this.appInfoForm.controls['prmInsNotApplicable'].value) {
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceFirstName =
        null;
        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceMiddleName =
        null;
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceLastName =
        null;
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.insuranceNameNotApplicableFlag =
        StatusFlag.Yes;
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.insuranceMiddleNameNotApplicableFlag =
        StatusFlag.Yes;
    } else {
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceFirstName =
        this.appInfoForm.controls['prmInsFirstName'].value.trim() === ''
          ? null
          : this.appInfoForm.controls['prmInsFirstName'].value;

      if(this.appInfoForm.controls['chkPrmInsMiddleName'].value ?? false) {
        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceMiddleName = null;
        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.insuranceMiddleNameNotApplicableFlag = StatusFlag.Yes;
          } else {
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceMiddleName =
            this.appInfoForm.controls['prmInsMiddleName'].value.trim() === ''
            ? null
            : this.appInfoForm.controls['prmInsMiddleName'].value;
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.insuranceMiddleNameNotApplicableFlag = StatusFlag.No;
          }
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceLastName =
        this.appInfoForm.controls['prmInsLastName'].value.trim() === ''
          ? null
          : this.appInfoForm.controls['prmInsLastName'].value;
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.insuranceNameNotApplicableFlag =
        StatusFlag.No;
    }
  }

  private assignOfficialIdsNotApplicable() {
    if (this.appInfoForm.controls['officialIdsNotApplicable'].value) {
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdFirstName =
        null;
        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdMiddleName =
        null;
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdLastName =
        null;
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.officialIdNameNotApplicableFlag =
        StatusFlag.Yes;
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.officialIdMiddleNameNotApplicableFlag =
        StatusFlag.Yes;
    } else {
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdFirstName =
        this.appInfoForm.controls['officialIdFirstName'].value.trim() === ''
          ? null
          : this.appInfoForm.controls['officialIdFirstName'].value;

         if(this.appInfoForm.controls['chkOfficialIdMiddleName'].value ?? false) {
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdMiddleName = null;
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.officialIdMiddleNameNotApplicableFlag = StatusFlag.Yes;
              } else {
                this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdMiddleName =
                this.appInfoForm.controls['officialIdMiddleName'].value.trim() === ''
                ? null
                : this.appInfoForm.controls['officialIdMiddleName'].value;
              this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.officialIdMiddleNameNotApplicableFlag  = StatusFlag.No;
              }
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdLastName =
        this.appInfoForm.controls['officialIdLastName'].value.trim() === ''
          ? null
          : this.appInfoForm.controls['officialIdLastName'].value;
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.officialIdNameNotApplicableFlag =
        StatusFlag.No;
    }
  }

  private assignRegisterToVote() {
    if (
      this.appInfoForm.controls['registerToVote'].value.toUpperCase() ===
      StatusFlag.Yes
    ) {
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.registerToVoteFlag =
        StatusFlag.Yes;
    } else {
      this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.registerToVoteFlag =
        StatusFlag.No;
    }
  }

  private assignInterpreterCode() {
    this.applicantInfo.client.interpreterCode =
      this.appInfoForm.controls['interpreterCode'].value;
    if (
      this.appInfoForm.controls['interpreterCode'].value !== null &&
      this.appInfoForm.controls['interpreterCode'].value.toUpperCase() ===
        YesNoFlag.Yes.toUpperCase()
    ) {
      this.applicantInfo.client.interpreterType =
        this.appInfoForm.controls['interpreterType'].value;
    } else {
      this.applicantInfo.client.interpreterType = '';
    }
  }

  private assignDeafOrHearingCode() {
    this.applicantInfo.client.deafOrHearingCode =
      this.appInfoForm.controls['deafOrHearingCode'].value;
    if (
      this.appInfoForm.controls['deafOrHearingCode'].value !== null &&
      this.appInfoForm.controls['deafOrHearingCode'].value.toUpperCase() ===
        YesNoFlag.Yes.toUpperCase()
    ) {
      this.applicantInfo.client.startAgeDeafOrHearing =
        this.appInfoForm.controls['startAgeDeafOrHearing'].value;
    } else {
      this.applicantInfo.client.startAgeDeafOrHearing = null;
    }
  }

  private assignBlindSeeingCode() {
    this.applicantInfo.client.blindSeeingCode =
      this.appInfoForm.controls['blindSeeingCode'].value;
    if (
      this.appInfoForm.controls['blindSeeingCode'].value !== null &&
      this.appInfoForm.controls['blindSeeingCode'].value.toUpperCase() ===
        YesNoFlag.Yes.toUpperCase()
    ) {
      this.applicantInfo.client.startAgeBlindSeeing =
        this.appInfoForm.controls['startAgeBlindSeeing'].value;
    } else {
      this.applicantInfo.client.startAgeBlindSeeing = null;
    }
  }

  private assignWalkingClimbingDifficultyCode() {
    this.applicantInfo.client.walkingClimbingDifficultyCode =
      this.appInfoForm.controls['walkingClimbingDifficultyCode'].value;
    if (
      this.appInfoForm.controls['walkingClimbingDifficultyCode'].value !==
        null &&
      this.appInfoForm.controls[
        'walkingClimbingDifficultyCode'
      ].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()
    ) {
      this.applicantInfo.client.startAgeWalkingClimbingDifficulty =
        this.appInfoForm.controls['startAgeWalkingClimbingDifficulty'].value;
    } else {
      this.applicantInfo.client.startAgeWalkingClimbingDifficulty = null;
    }
  }

  private assignDressingBathingDifficultyCode() {
    this.applicantInfo.client.dressingBathingDifficultyCode =
      this.appInfoForm.controls['dressingBathingDifficultyCode'].value;
    if (
      this.appInfoForm.controls['dressingBathingDifficultyCode'].value !==
        null &&
      this.appInfoForm.controls[
        'dressingBathingDifficultyCode'
      ].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()
    ) {
      this.applicantInfo.client.startAgeDressingBathingDifficulty =
        this.appInfoForm.controls['startAgeDressingBathingDifficulty'].value;
    } else {
      this.applicantInfo.client.startAgeDressingBathingDifficulty = null;
    }
  }

  private assignConcentratingDifficultyCode() {
    this.applicantInfo.client.concentratingDifficultyCode =
      this.appInfoForm.controls['concentratingDifficultyCode'].value;
    if (
      this.appInfoForm.controls['concentratingDifficultyCode'].value !== null &&
      this.appInfoForm.controls[
        'concentratingDifficultyCode'
      ].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()
    ) {
      this.applicantInfo.client.startAgeConcentratingDifficulty =
        this.appInfoForm.controls['startAgeConcentratingDifficulty'].value;
    } else {
      this.applicantInfo.client.startAgeConcentratingDifficulty = null;
    }
  }

  private assignErrandsDifficultyCode() {
    this.applicantInfo.client.errandsDifficultyCode =
      this.appInfoForm.controls['errandsDifficultyCode'].value;
    if (
      this.appInfoForm.controls['errandsDifficultyCode'].value !== null &&
      this.appInfoForm.controls['errandsDifficultyCode'].value.toUpperCase() ===
        YesNoFlag.Yes.toUpperCase()
    ) {
      this.applicantInfo.client.startAgeErrandsDifficulty =
        this.appInfoForm.controls['startAgeErrandsDifficulty'].value;
    } else {
      this.applicantInfo.client.startAgeErrandsDifficulty = null;
    }
  }

  private assignMaterialInAlternateFormatCode() {
    this.applicantInfo.client.materialInAlternateFormatCode =
      this.appInfoForm.controls['materialInAlternateFormatCode'].value;
    if (
      this.appInfoForm.controls['materialInAlternateFormatCode'].value !==
        null &&
      this.appInfoForm.controls[
        'materialInAlternateFormatCode'
      ].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()
    ) {
      this.applicantInfo.client.materialInAlternateFormatDesc =
        this.appInfoForm.controls['materialInAlternateFormatDesc'].value;
      if (
        this.applicantInfo.client?.materialInAlternateFormatDesc?.toUpperCase() ===
        MaterialFormat.other.toUpperCase()
      ) {
        this.applicantInfo.client.materialInAlternateFormatOther =
          this.appInfoForm.controls['materialInAlternateFormatOther'].value;
      } else {
        this.applicantInfo.client.materialInAlternateFormatOther = null;
      }
    } else {
      this.applicantInfo.client.materialInAlternateFormatDesc = null;
      this.applicantInfo.client.materialInAlternateFormatOther = null;
    }
  }

  private populateClientPronoun() {
    if (this.applicantInfo.clientPronounList == undefined) {
      this.applicantInfo.clientPronounList = [];
    }
    Object.keys(this.appInfoForm.controls)
      .filter((m) => m.includes(ControlPrefix.pronoun))
      .forEach((pronoun) => {
        if (
          this.appInfoForm.controls[pronoun].value === '' ||
          this.appInfoForm.controls[pronoun].value === null ||
          this.appInfoForm.controls[pronoun].value === false
        ) {
          this.populateExistingPronoun(pronoun);
        } else {
          this.populateNewPronoun(pronoun);
        }
      });
  }

  private populateExistingPronoun(pronoun: any) {
    const pronounCode = pronoun.replace(ControlPrefix.pronoun, '');
    const existingPronoun = this.applicantInfo.clientPronounList.find(
      (x) => x.clientPronounCode === pronounCode
    );
    if (existingPronoun != null) {
      const index = this.applicantInfo.clientPronounList.indexOf(
        existingPronoun,
        0
      );
      if (index > -1) {
        this.applicantInfo.clientPronounList.splice(index, 1);
      }
    }
  }

  populateNewPronoun(pronoun: any) {
    const pronounCode = pronoun.replace(ControlPrefix.pronoun, '');
    const existingPronoun = this.applicantInfo.clientPronounList.find(
      (x) => x.clientPronounCode === pronounCode
    );
    if (existingPronoun === null || existingPronoun === undefined) {
      const clientPronoun = new ClientPronoun();
      if (pronounCode === PronounCode.notListed) {
        const pronounCode = pronoun.replace(ControlPrefix.pronoun, '');
        clientPronoun.otherDesc = this.appInfoForm.controls['pronoun'].value;
        clientPronoun.clientPronounCode = pronounCode;
        clientPronoun.clientId = this.clientId;
      } else {
        const pronounCode = pronoun.replace(ControlPrefix.pronoun, '');
        clientPronoun.clientPronounCode = pronounCode;
        clientPronoun.clientId = this.clientId;
      }
      this.applicantInfo.clientPronounList.push(clientPronoun);
    } else {
      const pronounCode = pronoun.replace(ControlPrefix.pronoun, '');
      if (pronounCode === PronounCode.notListed) {
        const index = this.applicantInfo.clientPronounList.indexOf(
          existingPronoun,
          0
        );
        this.applicantInfo.clientPronounList[index].clientPronounCode =
          pronounCode;
        this.applicantInfo.clientPronounList[index].otherDesc =
          this.appInfoForm.controls['pronoun'].value;
      }
    }
  }

  private populateClientGender() {
    const clientGenderListSaved = this.applicantInfo.clientGenderList; // this is in case of update record
    this.applicantInfo.clientGenderList = [];
    Object.keys(this.appInfoForm.controls)
      .filter((m) => m.includes(ControlPrefix.gender))
      .forEach((control) => {
        if (this.appInfoForm.controls[control].value === true) {
          control = control.replace(ControlPrefix.gender, '');
          let clientGender = new ClientGender();
          clientGender.clientGenderCode = control;
          clientGender.clientId = this.clientId;
          if (clientGender.clientGenderCode === PronounCode.notListed) {
            clientGender.otherDesc =
              this.appInfoForm.controls['genderDescription'].value;
          }
          const Existing = clientGenderListSaved.find(
            (m) => m.clientGenderCode === clientGender.clientGenderCode
          );
          if (Existing !== undefined) {
            clientGender = Existing;
          }
          this.applicantInfo.clientGenderList.push(clientGender);
        }
      });
  }
  private populateClientRace() {
    this.applicantInfo.clientRaceList = [];
    const RaceAndEthnicity =
      this.appInfoForm.controls['RaceAndEthnicity'].value;
    const Ethnicity = [];
    let ethnicityValue = this.appInfoForm.controls['Ethnicity'].value;
    Ethnicity.push(ethnicityValue);
    const RaceAndEthnicityPrimary =
      this.appInfoForm.controls['RaceAndEthnicityPrimary'].value;
    const checkPrimaryInRaceList = RaceAndEthnicity.filter(
      (lov: any) => lov.lovCode == RaceAndEthnicityPrimary.lovCode
    );
    if (checkPrimaryInRaceList.length == 0) {
      RaceAndEthnicity.push(RaceAndEthnicityPrimary);
    }
    RaceAndEthnicity.forEach((el: any) => {
      const clientRace = new ClientRace();
      clientRace.clientRaceCategoryCode = el.lovCode;
      clientRace.clientEthnicIdentityCode = '';
      if (RaceAndEthnicityPrimary.lovCode === el.lovCode)
        clientRace.isPrimaryFlag = StatusFlag.Yes;
      clientRace.clientId = this.clientId;
      if (el.lovCode === PronounCode.notListed)
        clientRace.raceDesc =
          this.appInfoForm.controls['RaceAndEthnicityNotListed'].value;
      this.applicantInfo.clientRaceList.push(clientRace);
    });
    Ethnicity.forEach((el: any) => {
      const clientRace = new ClientRace();
      clientRace.clientEthnicIdentityCode = el.lovCode;
      clientRace.clientRaceCategoryCode = '';
      if (RaceAndEthnicityPrimary.lovCode === el.lovCode)
        clientRace.isPrimaryFlag = StatusFlag.Yes;
      clientRace.clientId = this.clientId;
      this.applicantInfo.clientRaceList.push(clientRace);
    });
  }
  private populateClientSexualIdentity() {
    this.applicantInfo.clientSexualIdentityList = [];
    Object.keys(this.appInfoForm.controls)
      .filter((m) => m.includes(ControlPrefix.sexualIdentity))
      .forEach((control) => {
        if (this.appInfoForm.controls[control].value === true) {
          control = control.replace(ControlPrefix.sexualIdentity, '');
          const clientSexualIdentity = new ClientSexualIdentity();
          clientSexualIdentity.clientSexualIdentityCode = control;
          clientSexualIdentity.clientId = this.clientId;
          if (
            clientSexualIdentity.clientSexualIdentityCode ===
            PronounCode.notListed
          ) {
            clientSexualIdentity.otherDesc =
              this.appInfoForm.controls['SexualIdentityDescription'].value;
          }

          this.applicantInfo.clientSexualIdentityList.push(
            clientSexualIdentity
          );
        }
      });
  }

  /** Public  methods **/
  updatePageCount(data: {
    completedDataPoints: CompletionChecklist[];
    updateWorkflowCount: boolean;
  }) {
    if (data?.completedDataPoints?.length > 0) {
      this.workFlowFacade.updateChecklist(
        data?.completedDataPoints,
        data?.updateWorkflowCount
      );
    }
  }

  updateAdjustmentAttrCount(ajustData: CompletionChecklist[]) {
    if (ajustData) {
      this.workFlowFacade.updateBasedOnDtAttrChecklist(ajustData);
    }
  }

  private validateForm() {
    this.appInfoForm.markAllAsTouched();
    this.appInfoForm.updateValueAndValidity();

    this.setValidationsSectionOne();
    this.setLanguageValidation();
    if (!this.isCerForm) {
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
      this.setRaceAndGenderValidation();
    }
    this.appInfoForm.updateValueAndValidity();
  }

  private setValidationforSexAtBirth() {
    let sexAtBirthValue = this.appInfoForm.controls['BirthGender'].value;
    if (sexAtBirthValue === 'NOT_LISTED') {
      this.appInfoForm.controls['BirthGenderDescription'].setValidators(
        Validators.required
      );
    } else {
      this.appInfoForm.controls['BirthGenderDescription'].removeValidators(
        Validators.required
      );
    }
    this.appInfoForm.controls[
      'BirthGenderDescription'
    ].updateValueAndValidity();
  }

  setTransgenderValidations() {
    let transgenderValue = this.appInfoForm.controls['Transgender'].value;
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
    if (transgenderValue === TransGenderCode.YES) {
      this.appInfoForm.controls['yesTransgender'].setValidators(
        Validators.required
      );
      this.appInfoForm.controls[
        'yesTransgender'
      ].updateValueAndValidity();
    }else{
      this.appInfoForm.controls['yesTransgender'].removeValidators(
        Validators.required
      );
      this.appInfoForm.controls[
        'yesTransgender'
      ].updateValueAndValidity();
    }
  }

  private setValidationsSectionOne() {
    if (this.isCerForm) {
      this.appInfoForm.controls['cerReceivedDate'].setValidators([
        Validators.required,
      ]);
      this.appInfoForm.controls['cerReceivedDate'].updateValueAndValidity();
    }
    this.appInfoForm.controls['firstName'].setValidators([Validators.required]);
    this.appInfoForm.controls['firstName'].updateValueAndValidity();
    this.appInfoForm.controls['dateOfBirth'].setValidators([
      Validators.required,
    ]);
    if(this.appInfoForm.controls['dateOfBirth'].value){
      const hasDateError = this.appInfoForm.controls['dateOfBirth'].errors;
      this.appInfoForm.controls['dateOfBirth'].updateValueAndValidity();
      if(hasDateError){
        this.appInfoForm.controls['dateOfBirth'].setErrors(hasDateError);
      }
    }else{
      this.appInfoForm.controls['dateOfBirth'].updateValueAndValidity();
    }
    if (this.appInfoForm.controls['chkmiddleName'].value) {
      this.appInfoForm.controls['middleName'].removeValidators(
        Validators.required
      );
      this.appInfoForm.controls['middleName'].updateValueAndValidity();
    } else {
      this.appInfoForm.controls['middleName'].setValidators([
        Validators.required,
      ]);
      this.appInfoForm.controls['middleName'].updateValueAndValidity();
    }
    this.appInfoForm.controls['lastName'].setValidators([Validators.required]);
    this.appInfoForm.controls['lastName'].updateValueAndValidity();
    if (this.appInfoForm.controls['prmInsNotApplicable'].value) {
      this.appInfoForm.controls['prmInsFirstName'].removeValidators(
        Validators.required
      );
      this.appInfoForm.controls['prmInsFirstName'].updateValueAndValidity();
      this.appInfoForm.controls['prmInsMiddleName'].removeValidators(
        Validators.required
      );
      this.appInfoForm.controls['prmInsMiddleName'].updateValueAndValidity();
      this.appInfoForm.controls['prmInsLastName'].removeValidators(
        Validators.required
      );
      this.appInfoForm.controls['prmInsLastName'].updateValueAndValidity();
    } else {
      this.appInfoForm.controls['prmInsFirstName'].setValidators(
        Validators.required
      );
      this.appInfoForm.controls['prmInsFirstName'].updateValueAndValidity();

      if (this.appInfoForm.controls['chkPrmInsMiddleName'].value) {
        this.appInfoForm.controls['prmInsMiddleName'].removeValidators(
          Validators.required
        );
        this.appInfoForm.controls['prmInsMiddleName'].updateValueAndValidity();
      } else {
        this.appInfoForm.controls['prmInsMiddleName'].setValidators([
          Validators.required,
        ]);
        this.appInfoForm.controls['prmInsMiddleName'].updateValueAndValidity();
      }

      this.appInfoForm.controls['prmInsLastName'].setValidators(
        Validators.required
      );
      this.appInfoForm.controls['prmInsLastName'].updateValueAndValidity();
    }
    if (this.appInfoForm.controls['officialIdsNotApplicable'].value) {
      this.appInfoForm.controls['officialIdFirstName'].removeValidators(
        Validators.required
      );
      this.appInfoForm.controls['officialIdFirstName'].updateValueAndValidity();

      this.appInfoForm.controls['officialIdMiddleName'].removeValidators(
        Validators.required
      );
      this.appInfoForm.controls['officialIdMiddleName'].updateValueAndValidity();

      this.appInfoForm.controls['officialIdLastName'].removeValidators(
        Validators.required
      );
      this.appInfoForm.controls['officialIdLastName'].updateValueAndValidity();
    } else {
      this.appInfoForm.controls['officialIdFirstName'].setValidators(
        Validators.required
      );
      this.appInfoForm.controls['officialIdFirstName'].updateValueAndValidity();

      if (this.appInfoForm.controls['chkOfficialIdMiddleName'].value) {
        this.appInfoForm.controls['officialIdMiddleName'].removeValidators(
          Validators.required
        );
        this.appInfoForm.controls['officialIdMiddleName'].updateValueAndValidity();
      } else {
        this.appInfoForm.controls['officialIdMiddleName'].setValidators([
          Validators.required,
        ]);
        this.appInfoForm.controls['officialIdMiddleName'].updateValueAndValidity();
      }

      this.appInfoForm.controls['officialIdLastName'].setValidators(
        Validators.required
      );
      this.appInfoForm.controls['officialIdLastName'].updateValueAndValidity();
    }
    if (this.appInfoForm.controls['ssnNotApplicable'].value) {
      this.appInfoForm.controls['ssn'].removeValidators(Validators.required);
      this.appInfoForm.controls['ssn'].updateValueAndValidity();
    } else {
      let hasError = this.appInfoForm.controls['ssn'].errors;
      this.appInfoForm.controls['ssn'].setValidators(Validators.required);
      this.appInfoForm.controls['ssn'].updateValueAndValidity();
      if (hasError) {
        this.appInfoForm.controls['ssn'].setErrors(hasError);
      }
    }
  }

  private setRegisterToVoteValidation() {
    if (
      this.appInfoForm.controls['registerToVote'].value == null ||
      this.appInfoForm.controls['registerToVote'].value == ''
    ) {
      this.appInfoForm.controls['registerToVote'].setValidators(
        Validators.required
      );
      this.appInfoForm.controls['registerToVote'].updateValueAndValidity();
    } else {
      this.appInfoForm.controls['registerToVote'].removeValidators(
        Validators.required
      );
      this.appInfoForm.controls['registerToVote'].updateValueAndValidity();
    }
  }

  setPronounValidation() {
    this.appInfoForm.controls['pronouns'].setValidators(Validators.required);
    this.appInfoForm.controls['pronouns'].updateValueAndValidity();
    Object.keys(this.appInfoForm.controls)
      .filter((m) => m.includes(ControlPrefix.pronoun))
      .forEach((pronoun) => {
        if (this.appInfoForm.controls[pronoun].value === true) {
          this.appInfoForm.controls['pronouns'].removeValidators(
            Validators.required
          );
          this.appInfoForm.controls['pronouns'].updateValueAndValidity();
        }
      });
    if (this.appInfoForm.controls['pronouns'].valid) {
      Object.keys(this.appInfoForm.controls)
        .filter((m) => m.includes(ControlPrefix.pronoun))
        .forEach((pronoun) => {
          this.appInfoForm.controls[pronoun].removeValidators(
            Validators.requiredTrue
          );
          this.appInfoForm.controls[pronoun].updateValueAndValidity();
          const pronounCode = pronoun.replace(ControlPrefix.pronoun, '');
          if (
            pronounCode === PronounCode.notListed &&
            this.appInfoForm.controls[pronoun].value
          ) {
            this.appInfoForm.controls['pronoun'].setValidators(
              Validators.required
            );
            this.appInfoForm.controls['pronoun'].updateValueAndValidity();
          }
        });
    }
    if (!this.appInfoForm.controls['pronouns'].valid) {
      Object.keys(this.appInfoForm.controls)
        .filter((m) => m.includes(ControlPrefix.pronoun))
        .forEach((pronoun) => {
          this.appInfoForm.controls[pronoun].setValidators(
            Validators.requiredTrue
          );
          this.appInfoForm.controls[pronoun].updateValueAndValidity();
        });
      this.appInfoForm.controls['pronouns'].setValue(null);
    }
  }

  private setMaterialCodeValidation() {
    this.appInfoForm.controls['materialInAlternateFormatCode'].setValidators(
      Validators.required
    );
    this.appInfoForm.controls[
      'materialInAlternateFormatCode'
    ].updateValueAndValidity();
    if (
      this.appInfoForm.controls['materialInAlternateFormatCode'].value !== '' &&
      this.appInfoForm.controls['materialInAlternateFormatCode'].value !== null
    ) {
      this.appInfoForm.controls['materialInAlternateFormatCode'].setErrors(
        null
      );
      this.appInfoForm.controls[
        'materialInAlternateFormatCode'
      ].updateValueAndValidity();
      if (
        this.appInfoForm.controls[
          'materialInAlternateFormatCode'
        ].value.toUpperCase() == YesNoFlag.Yes.toUpperCase()
      ) {
        this.appInfoForm.controls[
          'materialInAlternateFormatDesc'
        ].setValidators(Validators.required);
        this.appInfoForm.controls[
          'materialInAlternateFormatDesc'
        ].updateValueAndValidity();
        if (
          (this.appInfoForm.controls['materialInAlternateFormatDesc'].value !==
            null &&
            this.appInfoForm.controls[
              'materialInAlternateFormatDesc'
            ].value.toUpperCase() === MaterialFormat.other.toUpperCase() &&
            this.appInfoForm.controls['materialInAlternateFormatOther']
              .value === null) ||
          this.appInfoForm.controls['materialInAlternateFormatOther'].value ===
            undefined ||
          this.appInfoForm.controls['materialInAlternateFormatOther'].value ===
            ''
        ) {
          this.appInfoForm.controls[
            'materialInAlternateFormatOther'
          ].setValidators(Validators.required);
          this.appInfoForm.controls[
            'materialInAlternateFormatOther'
          ].updateValueAndValidity();
        }
      }
    }
  }

  private setInterpreterCodeValidation() {
    this.appInfoForm.controls['interpreterCode'].setValidators(
      Validators.required
    );
    this.appInfoForm.controls['interpreterCode'].updateValueAndValidity();
    if (
      this.appInfoForm.controls['interpreterCode'].value !== '' &&
      this.appInfoForm.controls['interpreterCode'].value !== null
    ) {
      this.appInfoForm.controls['interpreterCode'].setErrors(null);
      this.appInfoForm.controls['interpreterCode'].updateValueAndValidity();
      if (
        this.appInfoForm.controls['interpreterCode'].value.toUpperCase() ==
        YesNoFlag.Yes.toUpperCase()
      ) {
        this.appInfoForm.controls['interpreterType'].setValidators(
          Validators.required
        );
        this.appInfoForm.controls['interpreterType'].updateValueAndValidity();
      }
    }
  }

  setDeafOrHearingCodeValidation() {
    this.appInfoForm.controls['deafOrHearingCode'].setValidators(
      Validators.required
    );
    this.appInfoForm.controls['deafOrHearingCode'].updateValueAndValidity();
    if (
      this.appInfoForm.controls['deafOrHearingCode'].value !== '' &&
      this.appInfoForm.controls['deafOrHearingCode'].value !== null
    ) {
      this.appInfoForm.controls['deafOrHearingCode'].setErrors(null);
      this.appInfoForm.controls['deafOrHearingCode'].updateValueAndValidity();
      if (
        this.appInfoForm.controls['deafOrHearingCode'].value.toUpperCase() ==
        YesNoFlag.Yes.toUpperCase()
      ) {
        this.appInfoForm.controls['startAgeDeafOrHearing'].setValidators(
          Validators.required
        );
        this.appInfoForm.controls[
          'startAgeDeafOrHearing'
        ].updateValueAndValidity();
      }
    }
  }

  setBlindCodeValidation() {
    this.appInfoForm.controls['blindSeeingCode'].setValidators(
      Validators.required
    );
    this.appInfoForm.controls['blindSeeingCode'].updateValueAndValidity();
    if (
      this.appInfoForm.controls['blindSeeingCode'].value !== '' &&
      this.appInfoForm.controls['blindSeeingCode'].value !== null
    ) {
      this.appInfoForm.controls['blindSeeingCode'].setErrors(null);
      this.appInfoForm.controls['blindSeeingCode'].updateValueAndValidity();
      if (
        this.appInfoForm.controls['blindSeeingCode'].value.toUpperCase() ==
        YesNoFlag.Yes.toUpperCase()
      ) {
        this.appInfoForm.controls['startAgeBlindSeeing'].setValidators(
          Validators.required
        );
        this.appInfoForm.controls[
          'startAgeBlindSeeing'
        ].updateValueAndValidity();
      }
    }
  }

  setLimitingConditionCodeValidation() {
    this.appInfoForm.controls['limitingConditionCode'].setValidators(
      Validators.required
    );
    this.appInfoForm.controls['limitingConditionCode'].updateValueAndValidity();
    if (
      this.appInfoForm.controls['limitingConditionCode'].value !== '' &&
      this.appInfoForm.controls['limitingConditionCode'].value !== null
    ) {
      this.appInfoForm.controls['limitingConditionCode'].setErrors(null);
      this.appInfoForm.controls[
        'limitingConditionCode'
      ].updateValueAndValidity();
    }
  }

  setWalkingClimbingDifficultyCodeValidation() {
    this.appInfoForm.controls['walkingClimbingDifficultyCode'].setValidators(
      Validators.required
    );
    this.appInfoForm.controls[
      'walkingClimbingDifficultyCode'
    ].updateValueAndValidity();
    if (
      this.appInfoForm.controls['walkingClimbingDifficultyCode'].value !== '' &&
      this.appInfoForm.controls['walkingClimbingDifficultyCode'].value !== null
    ) {
      this.appInfoForm.controls['walkingClimbingDifficultyCode'].setErrors(
        null
      );
      this.appInfoForm.controls[
        'walkingClimbingDifficultyCode'
      ].updateValueAndValidity();
      if (
        this.appInfoForm.controls[
          'walkingClimbingDifficultyCode'
        ].value.toUpperCase() == YesNoFlag.Yes.toUpperCase()
      ) {
        this.appInfoForm.controls[
          'startAgeWalkingClimbingDifficulty'
        ].setValidators(Validators.required);
        this.appInfoForm.controls[
          'startAgeWalkingClimbingDifficulty'
        ].updateValueAndValidity();
      }
    }
  }

  private setDifficultyCodeValidation() {
    this.appInfoForm.controls['dressingBathingDifficultyCode'].setValidators(
      Validators.required
    );
    this.appInfoForm.controls[
      'dressingBathingDifficultyCode'
    ].updateValueAndValidity();
    if (
      this.appInfoForm.controls['dressingBathingDifficultyCode'].value !== '' &&
      this.appInfoForm.controls['dressingBathingDifficultyCode'].value !== null
    ) {
      this.appInfoForm.controls['dressingBathingDifficultyCode'].setErrors(
        null
      );
      this.appInfoForm.controls[
        'dressingBathingDifficultyCode'
      ].updateValueAndValidity();
      if (
        this.appInfoForm.controls[
          'dressingBathingDifficultyCode'
        ].value.toUpperCase() == YesNoFlag.Yes.toUpperCase()
      ) {
        this.appInfoForm.controls[
          'startAgeDressingBathingDifficulty'
        ].setValidators(Validators.required);
        this.appInfoForm.controls[
          'startAgeDressingBathingDifficulty'
        ].updateValueAndValidity();
      }
    }
    this.appInfoForm.controls['concentratingDifficultyCode'].setValidators(
      Validators.required
    );
    this.appInfoForm.controls[
      'concentratingDifficultyCode'
    ].updateValueAndValidity();
    if (
      this.appInfoForm.controls['concentratingDifficultyCode'].value !== '' &&
      this.appInfoForm.controls['concentratingDifficultyCode'].value !== null
    ) {
      this.appInfoForm.controls['concentratingDifficultyCode'].setErrors(null);
      this.appInfoForm.controls[
        'concentratingDifficultyCode'
      ].updateValueAndValidity();
      if (
        this.appInfoForm.controls[
          'concentratingDifficultyCode'
        ].value.toUpperCase() == YesNoFlag.Yes.toUpperCase()
      ) {
        this.appInfoForm.controls[
          'startAgeConcentratingDifficulty'
        ].setValidators(Validators.required);
        this.appInfoForm.controls[
          'startAgeConcentratingDifficulty'
        ].updateValueAndValidity();
      }
    }
    this.appInfoForm.controls['errandsDifficultyCode'].setValidators(
      Validators.required
    );
    this.appInfoForm.controls['errandsDifficultyCode'].updateValueAndValidity();
    if (
      this.appInfoForm.controls['errandsDifficultyCode'].value !== '' &&
      this.appInfoForm.controls['errandsDifficultyCode'].value !== null
    ) {
      this.appInfoForm.controls['errandsDifficultyCode'].setErrors(null);
      this.appInfoForm.controls[
        'errandsDifficultyCode'
      ].updateValueAndValidity();
      if (
        this.appInfoForm.controls[
          'errandsDifficultyCode'
        ].value.toUpperCase() == YesNoFlag.Yes.toUpperCase()
      ) {
        this.appInfoForm.controls['startAgeErrandsDifficulty'].setValidators(
          Validators.required
        );
        this.appInfoForm.controls[
          'startAgeErrandsDifficulty'
        ].updateValueAndValidity();
      }
    }
  }

  private setLanguageValidation() {
    this.appInfoForm.controls['spokenLanguage'].setValidators(
      Validators.required
    );
    if (
      this.appInfoForm.controls['spokenLanguage'].value !== '' ||
      this.appInfoForm.controls['spokenLanguage'].value !== null
    ) {
      this.appInfoForm.controls['spokenLanguage'].setErrors(null);
    }
    this.appInfoForm.controls['spokenLanguage'].updateValueAndValidity();

    this.appInfoForm.controls['writtenLanguage'].setValidators(
      Validators.required
    );
    if (
      this.appInfoForm.controls['writtenLanguage'].value !== '' ||
      this.appInfoForm.controls['writtenLanguage'].value !== null
    ) {
      this.appInfoForm.controls['writtenLanguage'].setErrors(null);
    }
    this.appInfoForm.controls['writtenLanguage'].updateValueAndValidity();

    this.appInfoForm.controls['englishProficiency'].setValidators(
      Validators.required
    );
    if (
      this.appInfoForm.controls['englishProficiency'].value !== '' ||
      this.appInfoForm.controls['englishProficiency'].value !== null
    ) {
      this.appInfoForm.controls['englishProficiency'].setErrors(null);
    }
    this.appInfoForm.controls['englishProficiency'].updateValueAndValidity();
  }

  private setRaceAndGenderValidation() {
    this.appInfoForm.controls['RaceAndEthnicity'].setValidators(
      Validators.required
    );
    this.appInfoForm.controls['RaceAndEthnicity'].updateValueAndValidity();
    const raceAndEthnicity =
      this.appInfoForm.controls['RaceAndEthnicity'].value;
    if (Array.isArray(raceAndEthnicity)) {
      const raceAndEthnicityNotListed = raceAndEthnicity.some(
        (m: any) => m.lovCode === 'NOT_LISTED'
      );
      if (raceAndEthnicityNotListed) {
        this.appInfoForm.controls['RaceAndEthnicityNotListed'].setValidators(
          Validators.required
        );
        this.appInfoForm.controls[
          'RaceAndEthnicityNotListed'
        ].updateValueAndValidity();
      }
    }
    this.appInfoForm.controls['Ethnicity'].setValidators(Validators.required);
    this.appInfoForm.controls['Ethnicity'].updateValueAndValidity();

    this.appInfoForm.controls['RaceAndEthnicityPrimary'].setValidators(
      Validators.required
    );
    this.appInfoForm.controls[
      'RaceAndEthnicityPrimary'
    ].updateValueAndValidity();

    this.appInfoForm.controls['GenderGroup'].setValidators(Validators.required);
    this.appInfoForm.controls['GenderGroup'].updateValueAndValidity();

    const genderControls = Object.keys(this.appInfoForm.controls).filter((m) =>
      m.includes(ControlPrefix.gender)
    );
    this.appInfoForm.controls['GenderGroup'].setValue(null);
    this.appInfoForm.controls['genderDescription'].updateValueAndValidity();
    genderControls.forEach((gender) => {
      if (this.appInfoForm.controls[gender].value === true) {
        this.appInfoForm.controls['GenderGroup'].removeValidators(
          Validators.required
        );
        this.appInfoForm.controls['GenderGroup'].updateValueAndValidity();
      }
    });
    if (!this.appInfoForm.controls['GenderGroup'].valid) {
      genderControls.forEach((gender: any) => {
        this.appInfoForm.controls[gender].setValidators(
          Validators.requiredTrue
        );
        this.appInfoForm.controls[gender].updateValueAndValidity();
      });
      this.appInfoForm.controls['GenderGroup'].setValue(null);
    }

    this.appInfoForm.controls['Transgender'].setValidators(Validators.required);
    this.appInfoForm.controls['Transgender'].updateValueAndValidity();
    this.appInfoForm.controls[
      'TransgenderDescription'
    ].updateValueAndValidity();

    this.appInfoForm.controls['SexualIdentityGroup'].setValue(null);
    const sexulaIdentity = Object.keys(this.appInfoForm.controls).filter((m) =>
      m.includes(ControlPrefix.sexualIdentity)
    );
    sexulaIdentity.forEach((control) => {
      if (this.appInfoForm.controls[control].value === true) {
        this.appInfoForm.controls['SexualIdentityGroup'].setValue(control);
        if (control === ControlPrefix.sexualIdentity + 'NOT_LISTED') {
          this.appInfoForm.controls['SexualIdentityDescription'].setValidators(
            Validators.required
          );
          this.appInfoForm.controls[
            'SexualIdentityDescription'
          ].updateValueAndValidity();
        }
      }
    });
    this.appInfoForm.controls['SexualIdentityGroup'].setValidators(
      Validators.required
    );
    this.appInfoForm.controls['SexualIdentityGroup'].updateValueAndValidity();
    if (!this.appInfoForm.controls['SexualIdentityGroup'].valid) {
      sexulaIdentity.forEach((control: any) => {
        this.appInfoForm.controls[control].setValidators(
          Validators.requiredTrue
        );
        this.appInfoForm.controls[control].updateValueAndValidity();
      });
    }

    this.appInfoForm.controls['BirthGender'].setValidators(Validators.required);
    this.appInfoForm.controls['BirthGender'].updateValueAndValidity();

    this.appInfoForm.controls[
      'BirthGenderDescription'
    ].updateValueAndValidity();
  }

  setAppInfoForm(appInfoForm: FormGroup) {
    this.appInfoForm = appInfoForm;
  }

  setApplicantName(name: any) {
    this.applicantName = name;
  }

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription =
      this.workFlowFacade.saveForLaterClicked$.subscribe(
        (statusResponse: any) => {
          if (this.checkValidations()) {
            this.saveAndUpdate().subscribe((response: any) => {
              if (response) {
                this.loaderService.hide();
                if (this.workflowTypeCode === WorkflowTypeCode.NewCase) {
                  this.router.navigate(['/case-management/case-detail/application-review/send-letter'], {
                    queryParamsHandling: "preserve"
                  });
                }
                else
                {
                  this.router.navigate(['/case-management/cer-case-detail/application-review/send-letter'], {
                    queryParamsHandling: "preserve"
                  });
                }
              }
            });
          } else if(this.workflowTypeCode === WorkflowTypeCode.NewCase){
            this.router.navigate(['/case-management/case-detail/application-review/send-letter'], {
              queryParamsHandling: "preserve"
            });
          }
          else
          {
            this.router.navigate(['/case-management/cer-case-detail/application-review/send-letter'], {
              queryParamsHandling: "preserve"
            });
          }
        }
      );
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription =
      this.workFlowFacade.saveForLaterValidationClicked$.subscribe((val) => {
        if (val) {
          if (!this.checkValidations()) {
            this.workFlowFacade.showCancelApplicationPopup(true);
          } else {
            this.workFlowFacade.showSaveForLaterConfirmationPopup(true);
          }
        }
      });
  }

  checkValidations() {
    this.validateForm();
    return this.appInfoForm.valid;
  }

  private addDiscardChangesSubscription(): void {
    this.discardChangesSubscription =
      this.workFlowFacade.discardChangesClicked$.subscribe((response: any) => {
        if (response) {
          this.removeValidators();
          if (this.clientId == null || this.clientCaseEligibilityId == null) {
            this.clientFacade.applicationInfoSubject.next(this.applicantInfo);
            this.appInfoForm.reset();
            this.appInfoForm.updateValueAndValidity();
          } else {
            this.loadApplicantInfo();
          }
        }
      });
  }

  public removeValidators() {
    for (const key in this.appInfoForm.controls) {
      this.appInfoForm.controls[key].setValidators(null);
      this.appInfoForm.controls[key].updateValueAndValidity();
    }
  }

  private reorderControls(controlOrder: string[]) {
    const controlsCopy: { [key: string]: any } = {}; // Provide an index signature
    controlOrder.forEach((controlName, index) => {
      controlsCopy[controlName] = this.appInfoForm.controls[controlName];
    });
    return new FormGroup(controlsCopy);
  }

  public getFormOrder() {
    return ([
      "firstName",
      "middleName",
      "lastName",
      "chkmiddleName",
      "prmInsFirstName",
      "prmInsMiddleName",
      "prmInsLastName",
      "prmInsNotApplicable",
      "chkPrmInsMiddleName",
      "officialIdFirstName",
      "officialIdMiddleName",
      "officialIdLastName",
      "chkOfficialIdMiddleName",
      "officialIdsNotApplicable",
      "dateOfBirth",
      "ssn",
      "ssnNotApplicable",
      "registerToVote",
      "pronoun",
      "pronouns",
      "pronoun_SHE_HER_HERS",
      "pronoun_HE_HIM_HIS",
      "pronoun_THEY_THEM_THEIRS",
      "pronoun_ELLA",
      "pronoun_EL",
      "pronoun_ELLES",
      "pronoun_NO_PRONOUN",
      "pronoun_NOT_LISTED",
      "pronoun_DONT_KNOW",
      "pronoun_DONT_WANT",
      "GenderGroup",
      "gender_WOMAN_OR_GIRL",
      "gender_MAN_OR_BOY",
      "gender_AGENDER_OR_NO_GENDER",
      "gender_FEMININE_LEARNING",
      "gender_MASCULINE_LEARNING",
      "gender_NON_BINARY",
      "gender_QUESTIONING",
      "gender_NOT_LISTED",
      "gender_DONT_KNOW",
      "gender_DONT_KNOW_ANSWER",
      "gender_DONT_KNOW_QUESTION",
      "genderDescription",
      "Transgender",
      "TransgenderDescription",
      "yesTransgender",
      "SexualIdentityDescription",
      "SexualIdentityGroup",
      "sexualIdentity_ASEXUAL",
      "sexualIdentity_BISEXUAL",
      "sexualIdentity_DONT_KNOW",
      "sexualIdentity_DONT_KNOW_QUESTION",
      "sexualIdentity_DONT_WANT",
      "sexualIdentity_GAY",
      "sexualIdentity_LESBIAN",
      "sexualIdentity_NOT_LISTED",
      "sexualIdentity_PANSEXUAL",
      "sexualIdentity_QUEER",
      "sexualIdentity_QUESTIONING",
      "sexualIdentity_SAME_GENDER_LOVING",
      "sexualIdentity_STRAIGHT",
      "BirthGender",
      "BirthGenderDescription",
      "Ethnicity",
      "RaceAndEthnicity",
      "RaceAndEthnicityNotListed",
      "RaceAndEthnicityPrimary",
      "materialInAlternateFormatCode",
      "materialInAlternateFormatDesc",
      "materialInAlternateFormatOther",
      "spokenLanguage",
      "englishProficiency",
      "writtenLanguage",
      "interpreterCode",
      "interpreterType",
      "deafOrHearingCode",
      "startAgeDeafOrHearing",
      "startAgeBlindSeeing",
      "blindSeeingCode",
      "limitingConditionCode",
      "startAgeWalkingClimbingDifficulty",
      "walkingClimbingDifficultyCode",
      "startAgeDressingBathingDifficulty",
      "dressingBathingDifficultyCode",
      "concentratingDifficultyCode",
      "startAgeConcentratingDifficulty",
      "startAgeErrandsDifficulty",
      "errandsDifficultyCode",
    ]);
  }

}
