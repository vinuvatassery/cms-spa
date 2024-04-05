/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ElementRef,
  OnDestroy,
  Input,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/** External libraries **/

import {
  ConfigurationProvider,
  LoaderService,
  LoggingService,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  startWith,
  Subscription,
} from 'rxjs';
/** Internal libraries **/
import {
  ApplicantInfo,
  ClientFacade,
  CompletionChecklist,
  TransGenderCode,
  WorkflowFacade,
} from '@cms/case-management/domain';
import { UIFormStyle, IntlDateService, DataQuery } from '@cms/shared/ui-tpa';
import { LovFacade, LovType } from '@cms/system-config/domain';
import { StatusFlag } from '@cms/shared/ui-common';

@Component({
  selector: 'case-management-client-edit-view',
  templateUrl: './client-edit-view.component.html',
  styleUrls: ['./client-edit-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientEditViewComponent implements OnInit, OnDestroy {

  @Input() isCerForm =false
  @Input() clientCaseEligibilityId: string ='';
  /** Output Properties **/
  @Output() AppInfoChanged = new EventEmitter<{
    completedDataPoints: CompletionChecklist[];
    updateWorkflowCount: boolean;
  }>();
  @Output() AdjustAttrChanged = new EventEmitter<CompletionChecklist[]>();
  @Output() ValidateFields = new EventEmitter<FormGroup>();
  @Output() ApplicantNameChange = new EventEmitter<any>();

  /** Public properties **/
  public currentDate = new Date();
  rdoTransgenders$ = this.clientfacade.rdoTransGenders$;
  rdoSexAssigned$ = this.clientfacade.rdoSexAssigned$;

  rdoMaterials$ = this.lovFacade.materialslov$;
  materialsyeslov$ = this.lovFacade.materialsyeslov$;
  spokenWrittenLanguagelov$ = this.lovFacade.spokenWrittenLanguagelov$;
  englishProficiencylov$ = this.lovFacade.englishProficiencylov$;
  rdoDeafs$ = this.clientfacade.rdoDeaf$;
  rdoBlinds$ = this.clientfacade.rdoBlind$;
  rdoWalked$ = this.clientfacade.rdoWalked$;
  rdoDressedorBathed$ = this.clientfacade.rdoDressedorBathed$;
  rdoConcentration$ = this.clientfacade.rdoConcentration$;
  rdoErrands$ = this.clientfacade.rdoErrands$;
  ddlPrimaryIdentities$ = this.clientfacade.ddlPrimaryIdentities$;
  ddlSpokenLanguages$ = this.clientfacade.ddlSpokenLanguages$;
  ddlEnglishProficiencies$ = this.clientfacade.ddlEnglishProficiencies$;
  ddlWrittenLanguages$ = this.clientfacade.ddlWrittenLanguages$;
  ddlRacialIdentities$ = this.clientfacade.ddlRacialIdentities$;
  pronounList$ = this.clientfacade.pronounList$;
  isSSNChecked!: boolean;
  isDescribeGenderChecked!: boolean;
  isPronounsChecked!: boolean;
  isGenderChecked!: boolean;
  isOrientationChecked!: boolean;
  isDescribeOrientaionChecked!: boolean;
  isTransTextBoxDisabled = true;
  isSexAssignedTextBoxDisabled = true;
  isMaterialsTextBoxDisabled = true;
  isInterpreterTextBoxDisabled = true;
  isDeafTextBoxDisabled = true;
  isBlindTextBoxDisabled = true;
  isWalkingTextBoxDisabled = true;
  isDressingorBathingTextBoxDisabled = true;
  isConcentrationTextBoxDisabled = true;
  isErrandsTextBoxDisabled = true;
  transgenderSelectedValue!: number;
  sexAssignedSelectedValue!: number;
  materialsSelectedValue!: number;
  interpreterSelectedValue!: number;
  deafSelectedValue!: number;
  blindSelectedValue!: number;
  walkingSelectedValue!: number;
  dressingOrBathingSelectedValue!: number;
  concentrationSelectedValue!: number;
  errandsSelectedValue!: number;
  tareaRaceAndEthinicityMaxLength = 300;
  tareaRaceAndEthinicityCharachtersCount!: number;
  tareaRaceAndEthinicityCounter!: string;
  tareaRaceAndEthinicity = '';
  racialIdentityOptions!: any;
  popupClassMultiSelect = 'multiSelectSearchPopup';
  public racialName: any = [];
  public formUiStyle: UIFormStyle = new UIFormStyle();
  appInfoForm!: FormGroup;
  ageMinLimit = 1;
  ageMaxLimit = 9999999999;

  textboxDisable!: boolean;
  optionButtonValid!: boolean;
  yesMaterialDisable!: boolean;
  interpreterTypeInputDisable!: boolean;
  startAgeDeafOrHearingInputDisable!: boolean;
  startAgeBlindSeeingInputDisable!: boolean;
  startAgeWalkingClimbingDifficultyInputDisable!: boolean;
  startAgeDressingBathingDifficultyInputDisable!: boolean;
  startAgeConcentratingDifficultyInputDisable!: boolean;
  startAgeErrandsDifficultyInputDisable!: boolean;

  cerSentDateValue!: any;
  pronounForm!: FormGroup;
  adjustmentAttributeList!: string[];
  lengthRestrictThirty = 30;
  lengthRestrictForty = 40;
  maxLengthSsn = 11;
  applicantInfo$ = this.clientfacade.applicantInfo$;
  public value = '';
  isVisible: any;
  isSelected = true;
  applicantInfo = {} as ApplicantInfo;
  pronounList = [];
  raceAndEthnicity = [];
  raceAndEthnicityPrimaryData: Array<any> = [];
  raceAndEthnicityPrimaryNotListed: boolean = false;
  applicantInfoSubscription!: Subscription;
  dateValidator: boolean = false;
  cerDateValidator: boolean = false;

  /** Private properties **/
  private allowWorkflowCountUpdate = false;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  ssnDuplicateFound: boolean = false;
  showDuplicatePopup: boolean = false;
  currentClient: any = {};
  matchingClient: any = {};
  ssnMask = '000-00-0000';
  showNameDuplicateLoader: boolean = false;
  showNameDuplicateLoaderField = '';
  showSsnDuplicateLoader: boolean = false;
  otherEthnicityList: any[] = [];

  /** Constructor**/
  constructor(
    private readonly clientfacade: ClientFacade,
    private readonly elementRef: ElementRef,
    private readonly workflowFacade: WorkflowFacade,
    private readonly formBuilder: FormBuilder,
    private readonly lovFacade: LovFacade,
    public readonly intl: IntlDateService,
    public readonly kendoDataQuery: DataQuery,
    private readonly configurationProvider: ConfigurationProvider,
    private readonly loggingService: LoggingService,
    private readonly loaderService: LoaderService,
    private readonly ref: ChangeDetectorRef
  ) {}

  /** Lifecycle hooks **/

  ngOnInit(): void {
    this.loadDdlRacialIdentities();
    this.loadDdlPrimaryIdentities();
    this.loadDdlSpokenLanguages();
    this.loadDdlWrittenLanguages();
    this.loadDdlEnglishProficiencies();
    this.loadRdoTransGender();
    this.loadRdoSexAssigned();
    this.loadRdoInterpreter();
    this.loadRdoDeaf();
    this.loadRdoBlind();
    this.loadRdoWalking();
    this.loadRdoDressingorBathing();
    this.loadRdoConcentration();
    this.loadRdoErrands();
    this.loadTareaRaceAndEthinicity();
    this.loadLovs();
    this.loadDdlOtherIdentities();
    this.buildForm();
    this.addAppInfoFormChangeSubscription();
    this.loadApplicantInfoSubscription();
    this.ValidateFields.emit(this.appInfoForm);
  }

  ngOnDestroy(): void {
    this.applicantInfoSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    const adjustControls =
      this.elementRef.nativeElement.querySelectorAll('.adjust-attr');
    adjustControls.forEach((control: any) => {
      control.addEventListener('click', this.adjustAttributeChanged.bind(this));
    });
  }

  setRaceAndEthnicityData(value: any) {
    this.raceAndEthnicity = value;
    if (Array.isArray(value) && value.length > 0) {
      this.assignRaceAndEthnicityToForm();
    }
  }
  raceAndEthnicityChange(value: any) {
    const Race = this.appInfoForm.controls['RaceAndEthnicity']?.value;
    this.raceAndEthnicityPrimaryData = [];
    this.raceAndEthnicityPrimaryNotListed = false;

    if (Array.isArray(Race)) {
      Race.forEach((el: any) => {
        this.raceAndEthnicityPrimaryData.push(el);
        if (el.lovCode === LovType.EthnicityNotListed) {
          this.raceAndEthnicityPrimaryNotListed = true;
        }
      });
    }

    if (this.raceAndEthnicityPrimaryData.length > 1) {
      this.raceAndEthnicityPrimaryData = [
        ...this.raceAndEthnicityPrimaryData,
        ...this.otherEthnicityList,
      ];
    }

    if (this.raceAndEthnicityPrimaryData.length == 1) {
      this.appInfoForm.controls['RaceAndEthnicityPrimary']?.setValue(
        this.raceAndEthnicityPrimaryData[0]
      );
      this.appInfoForm.controls['RaceAndEthnicityPrimary'].disable();
      this.updateAdjustAttribute(
        'RaceAndEthnicityPrimaryAdjust',
        StatusFlag.No
      );
    } else {
      this.appInfoForm.controls['RaceAndEthnicityPrimary']?.setValue(null);
      this.appInfoForm.controls['RaceAndEthnicityPrimary'].enable();
      this.updateAdjustAttribute(
        'RaceAndEthnicityPrimaryAdjust',
        StatusFlag.Yes
      );
    }
  }

  ngAfterViewChecked() {
    let firstName = this.appInfoForm.controls['firstName'].value ?? '';
    let lastName = this.appInfoForm.controls['lastName'].value ?? '';
    this.ApplicantNameChange.emit(firstName + '  ' + lastName);
    const initialAjustment: CompletionChecklist[] = [];
    const adjustControls =
      this.elementRef.nativeElement.querySelectorAll('.adjust-attr');
    adjustControls.forEach((control: any) => {
      const data: CompletionChecklist = {
        dataPointName: control.name,
        status: control.checked ? StatusFlag.Yes : StatusFlag.No,
      };
      initialAjustment.push(data);
    });

    if (initialAjustment.length > 0) {
      this.AdjustAttrChanged.emit(initialAjustment);
    }
  }

  /** Private methods **/

  private buildForm() {
    this.appInfoForm = this.formBuilder.group({
      firstName: [''],
      middleName: [''],
      chkmiddleName: [''],
      lastName: [''],
      prmInsFirstName: [''],
      prmInsMiddleName:[''],
      chkPrmInsMiddleName: [''],
      prmInsLastName: ['', { disabled: false }],
      prmInsNotApplicable: [''],
      officialIdFirstName: ['', { disabled: false }],
      officialIdMiddleName:[''],
      chkOfficialIdMiddleName:[''],
      officialIdLastName: ['', { disabled: false }],
      officialIdsNotApplicable: [''],
      dateOfBirth: [''],
      ssn: ['', { disabled: false }],
      ssnNotApplicable: [''],
      registerToVote: [''],
      pronoun: [''],
      pronouns: [''],
      materialInAlternateFormatCode: [''],
      materialInAlternateFormatDesc: [''],
      materialInAlternateFormatOther: [''],
      interpreterCode: [''],
      interpreterType: [''],
      deafOrHearingCode: [''],
      startAgeDeafOrHearing: [''],
      blindSeeingCode: [''],
      startAgeBlindSeeing: [''],
      limitingConditionCode: [''],
      walkingClimbingDifficultyCode: [''],
      startAgeWalkingClimbingDifficulty: [''],
      dressingBathingDifficultyCode: [''],
      startAgeDressingBathingDifficulty: [''],
      concentratingDifficultyCode: [''],
      startAgeConcentratingDifficulty: [''],
      errandsDifficultyCode: [''],
      startAgeErrandsDifficulty: [''],
      spokenLanguage: [''],
      writtenLanguage: [''],
      englishProficiency: [''],
      RaceAndEthnicity: [[]],
      cerReceivedDate: [''],
      cerSentDate: [''],
    });
  }
  private loadLovs() {
    this.lovFacade.getMaterialYesLovs();
    this.lovFacade.getApplicantInfoLovs();
  }
  private loadApplicantInfoSubscription() {
    this.applicantInfoSubscription = this.applicantInfo$.subscribe(
      (applicantInfo) => {
        this.textboxDisable = true;
        this.yesMaterialDisable = true;
        this.interpreterTypeInputDisable = true;
        this.startAgeDeafOrHearingInputDisable = true;
        this.startAgeBlindSeeingInputDisable = true;
        this.startAgeWalkingClimbingDifficultyInputDisable = true;
        this.startAgeDressingBathingDifficultyInputDisable = true;
        this.startAgeConcentratingDifficultyInputDisable = true;
        this.startAgeErrandsDifficultyInputDisable = true;

        if (applicantInfo.client != undefined) {
          this.isVisible = false;
          if (this.appInfoForm !== undefined) {
            this.appInfoForm.reset();
            this.appInfoForm.controls['middleName'].enable();
            this.appInfoForm.controls['officialIdLastName'].enable();
            this.appInfoForm.controls['officialIdFirstName'].enable();
            this.appInfoForm.controls['prmInsFirstName'].enable();
            this.appInfoForm.controls['prmInsLastName'].enable();
            this.appInfoForm.controls['ssn'].enable();
          }

          this.applicantInfo = applicantInfo;
          if (this.applicantInfo.clientCaseId !== null) {
            this.assignModelToForm(applicantInfo);
          } else {
            this.adjustAttributeInit();
          }
        }
      }
    );
  }

  private assignModelToForm(applicantInfo: ApplicantInfo) {
    this.updateApplicantBaseDetails(applicantInfo);
    this.updateGenderContorlvalues(applicantInfo);
    this.assignRaceAndEthnicityToForm();

    this.appInfoForm.controls['materialInAlternateFormatCode'].setValue(
      this.applicantInfo.client.materialInAlternateFormatCode
    );
    this.appInfoForm.controls['materialInAlternateFormatDesc'].setValue(
      this.applicantInfo.client.materialInAlternateFormatDesc
    );
    if (this.applicantInfo.client?.materialInAlternateFormatCode === 'YES') {
      this.yesMaterialDisable = false;
      this.appInfoForm.controls['materialInAlternateFormatOther'].setValue(
        this.applicantInfo.client.materialInAlternateFormatOther
      );
    }
    this.appInfoForm.controls['interpreterCode'].setValue(
      this.applicantInfo.client.interpreterCode
    );
    this.appInfoForm.controls['interpreterType'].setValue(
      this.applicantInfo.client.interpreterType
    );
    this.interpreterTypeInputDisable =
      this.applicantInfo.client?.interpreterCode === 'YES' ? false : true;
    this.appInfoForm.controls['deafOrHearingCode'].setValue(
      this.applicantInfo.client.deafOrHearingCode
    );
    this.appInfoForm.controls['startAgeDeafOrHearing'].setValue(
      this.applicantInfo.client.startAgeDeafOrHearing
    );
    this.startAgeDeafOrHearingInputDisable =
      this.applicantInfo.client.deafOrHearingCode === 'YES' ? false : true;

    this.appInfoForm.controls['blindSeeingCode'].setValue(
      this.applicantInfo.client.blindSeeingCode
    );
    this.appInfoForm.controls['startAgeBlindSeeing'].setValue(
      this.applicantInfo.client.startAgeBlindSeeing
    );
    this.startAgeBlindSeeingInputDisable =
      this.applicantInfo.client?.blindSeeingCode === 'YES' ? false : true;

    this.appInfoForm.controls['limitingConditionCode'].setValue(
      this.applicantInfo.client.limitingConditionCode
    );

    this.appInfoForm.controls['walkingClimbingDifficultyCode'].setValue(
      this.applicantInfo.client.walkingClimbingDifficultyCode
    );
    this.appInfoForm.controls['startAgeWalkingClimbingDifficulty'].setValue(
      this.applicantInfo.client.startAgeWalkingClimbingDifficulty
    );
    this.startAgeWalkingClimbingDifficultyInputDisable =
      this.applicantInfo.client?.walkingClimbingDifficultyCode === 'YES'
        ? false
        : true;

    this.appInfoForm.controls['dressingBathingDifficultyCode'].setValue(
      this.applicantInfo.client.dressingBathingDifficultyCode
    );
    this.appInfoForm.controls['startAgeDressingBathingDifficulty'].setValue(
      this.applicantInfo.client.startAgeDressingBathingDifficulty
    );
    this.startAgeDressingBathingDifficultyInputDisable =
      this.applicantInfo.client?.dressingBathingDifficultyCode === 'YES'
        ? false
        : true;

    this.appInfoForm.controls['concentratingDifficultyCode'].setValue(
      this.applicantInfo.client.concentratingDifficultyCode
    );
    this.appInfoForm.controls['startAgeConcentratingDifficulty'].setValue(
      this.applicantInfo.client.startAgeConcentratingDifficulty
    );
    this.startAgeConcentratingDifficultyInputDisable =
      this.applicantInfo.client?.concentratingDifficultyCode === 'YES'
        ? false
        : true;

    this.appInfoForm.controls['errandsDifficultyCode'].setValue(
      this.applicantInfo.client.errandsDifficultyCode
    );
    this.appInfoForm.controls['startAgeErrandsDifficulty'].setValue(
      this.applicantInfo.client.startAgeErrandsDifficulty
    );
    this.startAgeErrandsDifficultyInputDisable =
      this.applicantInfo.client?.errandsDifficultyCode === 'YES' ? false : true;

    this.appInfoForm.controls['spokenLanguage'].setValue(
      this.applicantInfo.client.spokenLanguageCode
    );
    this.appInfoForm.controls['writtenLanguage'].setValue(
      this.applicantInfo.client.writtenLanguageCode
    );
    this.appInfoForm.controls['englishProficiency'].setValue(
      this.applicantInfo.client.englishProficiencyCode
    );

    this.adjustAttributeInit();
  }

  private updateApplicantBaseDetails(applicantInfo: ApplicantInfo) {
    if (this.isCerForm) {
      this.appInfoForm.controls['cerReceivedDate'].setValue(
        new Date(
          applicantInfo?.clientCaseEligibilityAndFlag?.clientCaseEligibility?.cerReceivedDate
        )
      );
      this.appInfoForm.controls['cerSentDate'].setValue(
        new Date(
          applicantInfo?.clientCaseEligibilityAndFlag?.clientCaseEligibility?.cerSentDate
        )
      );
      this.cerSentDateValue = new Date(
        applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility?.cerSentDate
      );
    }

    this.appInfoForm.controls['firstName'].setValue(
      applicantInfo.client?.firstName
    );
    if (applicantInfo.client?.noMiddleInitialFlag == 'Y') {
      this.appInfoForm.controls['chkmiddleName'].setValue(true);
      this.appInfoForm.controls['middleName'].setValue(null);
      this.appInfoForm.controls['middleName'].disable();
    } else {
      this.appInfoForm.controls['chkmiddleName'].setValue(false);
      this.appInfoForm.controls['middleName'].setValue(
        applicantInfo.client?.middleName
      );
      this.appInfoForm.controls['middleName'].enable();
    }
    this.appInfoForm.controls['lastName'].setValue(
      applicantInfo.client?.lastName
    );
    if (
      applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag
        ?.officialIdNameNotApplicableFlag === StatusFlag.Yes
    ) {
      this.appInfoForm.controls['officialIdsNotApplicable'].setValue(true);
      this.appInfoForm.controls['officialIdFirstName'].setValue(null);
      this.appInfoForm.controls['officialIdMiddleName'].setValue(null);
      this.appInfoForm.controls['officialIdLastName'].setValue(null);
      this.appInfoForm.controls['officialIdLastName'].disable();
      this.appInfoForm.controls['officialIdMiddleName'].disable();
      this.appInfoForm.controls['officialIdFirstName'].disable();
      this.appInfoForm.controls['chkOfficialIdMiddleName'].disable();
    } else {
      this.appInfoForm.controls['officialIdsNotApplicable'].setValue(false);
      this.appInfoForm.controls['officialIdFirstName'].setValue(
        applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility
          ?.officialIdFirstName
      );

      if (applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.officialIdMiddleNameNotApplicableFlag == 'Y') {
        this.appInfoForm.controls['chkOfficialIdMiddleName'].setValue(true);
        this.appInfoForm.controls['officialIdMiddleName'].setValue(null);
        this.appInfoForm.controls['officialIdMiddleName'].disable();
      } else {
        this.appInfoForm.controls['chkOfficialIdMiddleName'].setValue(false);
        this.appInfoForm.controls['officialIdMiddleName'].setValue(
          applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility
            ?.officialIdMiddleName ?? ''
        );
        this.appInfoForm.controls['officialIdMiddleName'].enable();
      }

      this.appInfoForm.controls['officialIdLastName'].setValue(
        applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility
          ?.officialIdLastName
      );
      this.appInfoForm.controls['officialIdLastName'].enable();
      this.appInfoForm.controls['officialIdFirstName'].enable();
    }
    if (
      applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag
        ?.insuranceNameNotApplicableFlag == StatusFlag.Yes
    ) {
      this.appInfoForm.controls['prmInsNotApplicable'].setValue(true);
      this.appInfoForm.controls['prmInsFirstName'].setValue(null);
      this.appInfoForm.controls['prmInsMiddleName'].setValue(null);
      this.appInfoForm.controls['prmInsLastName'].setValue(null);
      this.appInfoForm.controls['prmInsFirstName'].disable();
      this.appInfoForm.controls['prmInsMiddleName'].disable();
      this.appInfoForm.controls['prmInsLastName'].disable();
      this.appInfoForm.controls['chkPrmInsMiddleName'].disable();
    } else {
      this.appInfoForm.controls['prmInsNotApplicable'].setValue(false);
      this.appInfoForm.controls['prmInsFirstName'].setValue(
        applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility
          ?.insuranceFirstName
      );

      if (applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.insuranceMiddleNameNotApplicableFlag == 'Y') {
        this.appInfoForm.controls['chkPrmInsMiddleName'].setValue(true);
        this.appInfoForm.controls['prmInsMiddleName'].setValue(null);
        this.appInfoForm.controls['prmInsMiddleName'].disable();
      } else {
        this.appInfoForm.controls['chkPrmInsMiddleName'].setValue(false);
        this.appInfoForm.controls['prmInsMiddleName'].setValue(
        applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility
          ?.insuranceMiddleName ?? ''
         );
        this.appInfoForm.controls['prmInsMiddleName'].enable();
      }
      this.appInfoForm.controls['prmInsLastName'].setValue(
        applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility
          ?.insuranceLastName
      );
      this.appInfoForm.controls['prmInsFirstName'].enable();
      this.appInfoForm.controls['prmInsLastName'].enable();
    }
    this.appInfoForm.controls['dateOfBirth'].setValue(
      new Date(applicantInfo.client?.dob)
    );
    if (applicantInfo.client?.ssnNotApplicableFlag === StatusFlag.Yes) {
      this.appInfoForm.controls['ssnNotApplicable'].setValue(true);
      this.appInfoForm.controls['ssn'].setValue(null);
      this.appInfoForm.controls['ssn'].disable();
    } else {
      this.appInfoForm.controls['ssnNotApplicable'].setValue(false);
      this.appInfoForm.controls['ssn'].setValue(applicantInfo.client?.ssn);
      this.appInfoForm.controls['ssn'].enable();
    }
    if (
      applicantInfo.clientCaseEligibilityAndFlag?.clientCaseEligibilityFlag?.registerToVoteFlag?.toUpperCase() ==
      StatusFlag.Yes
    ) {
      this.isVisible = true;
      this.appInfoForm.controls['registerToVote'].setValue(StatusFlag.Yes);
    } else {
      this.isVisible = false;
      this.appInfoForm.controls['registerToVote'].setValue(StatusFlag.No);
    }
  }

  private updateGenderContorlvalues(applicantInfo: ApplicantInfo) {
    const Transgender = applicantInfo.client?.clientTransgenderCode?.trim();
    const TransgenderList = [
      TransGenderCode.YES_F_TO_M.toString(),
      TransGenderCode.YES_M_TO_F.toString(),
    ];
    if (TransgenderList.includes(Transgender)) {
      this.appInfoForm.controls['Transgender'].setValue(TransGenderCode.YES);
      this.appInfoForm.controls['yesTransgender']?.setValue(Transgender);
    } else {
      this.appInfoForm.controls['Transgender']?.setValue(Transgender);
    }

    if (Transgender === TransGenderCode.notListed) {
      this.appInfoForm.controls['TransgenderDescription']?.setValue(
        applicantInfo.client.clientTransgenderDesc
      );
    }

    const BirthGender = applicantInfo.client.genderAtBirthCode.trim();
    this.appInfoForm.controls['BirthGender']?.setValue(BirthGender);
    if (BirthGender === TransGenderCode.notListed) {
      this.appInfoForm.controls['BirthGenderDescription']?.setValue(
        applicantInfo.client.genderAtBirthDesc
      );
    }
  }

  private assignRaceAndEthnicityToForm() {
    if (
      this.applicantInfo?.clientRaceList?.length >= 0 &&
      this.raceAndEthnicity?.length >= 0
    ) {
      let RaceAndEthnicity: any = [];
      let Ethnicity: any = null;
      let RaceAndEthnicityPrimary = null;
      this.applicantInfo.clientRaceList.forEach((el: any) => {
        const foundRace = this.raceAndEthnicity.find(
          (m: any) => m.lovCode === el.clientRaceCategoryCode
        );
        if (!!foundRace) {
          RaceAndEthnicity.push(foundRace);
        }
        const foundEthnicity = this.raceAndEthnicity.find(
          (m: any) => m.lovCode === el.clientEthnicIdentityCode
        );
        if (foundEthnicity !== undefined) {
          Ethnicity = foundEthnicity;
        }
      });
      let primaryRace = this.applicantInfo.clientRaceList.filter(
        (race: any) => race.isPrimaryFlag == StatusFlag.Yes
      );
      if (primaryRace.length > 0) {
        RaceAndEthnicityPrimary = this.getEthnicityValue(primaryRace);
      }
      this.appInfoForm.controls['RaceAndEthnicity']?.setValue(RaceAndEthnicity);
      this.appInfoForm.controls['Ethnicity']?.setValue(Ethnicity);
      this.raceAndEthnicityChange(true);
      this.appInfoForm.controls['RaceAndEthnicityPrimary']?.setValue(
        RaceAndEthnicityPrimary
      );
      if (this.raceAndEthnicityPrimaryNotListed) {
        const raceAndEthnicityNotListed =
          this.applicantInfo.clientRaceList.find(
            (m: any) => m.clientRaceCategoryCode === 'NOT_LISTED'
          );
        this.appInfoForm.controls['RaceAndEthnicityNotListed']?.setValue(
          raceAndEthnicityNotListed?.raceDesc
        );
      }
    }
  }

  private getEthnicityValue(primaryRace: any) {
    let RaceAndEthnicityPrimary = null;
    let checkPrimaryInRaceList = this.raceAndEthnicity.find(
      (lov: any) => lov.lovCode === primaryRace[0].clientRaceCategoryCode
    );
    if (!!checkPrimaryInRaceList) {
      RaceAndEthnicityPrimary = checkPrimaryInRaceList;
    } else {
      let checkPrimaryInOtherEthnicityList = this.otherEthnicityList.find(
        (lov: any) => lov.lovCode === primaryRace[0].clientRaceCategoryCode
      );
      if (!!checkPrimaryInOtherEthnicityList) {
        RaceAndEthnicityPrimary = checkPrimaryInOtherEthnicityList;
      }
    }
    return RaceAndEthnicityPrimary;
  }

  updateWorkflowCount(data: any) {
    const workFlowData: CompletionChecklist[] = [
      {
        dataPointName: data?.completedDataPoints,
        status: data?.isCompleted ? StatusFlag.Yes : StatusFlag.No,
      },
    ];

    this.AppInfoChanged.emit({
      completedDataPoints: workFlowData,
      updateWorkflowCount: true,
    });
  }

  private adjustAttributeChanged(event: Event) {
    this.updateAdjustAttribute(
      (event.target as HTMLInputElement).name,
      (event.target as HTMLInputElement).checked
        ? StatusFlag.Yes
        : StatusFlag.No
    );
  }

  private updateAdjustAttribute(dataPointName: string, status: StatusFlag) {
    const data: CompletionChecklist = {
      dataPointName: dataPointName,
      status: status,
    };

    this.AdjustAttrChanged.emit([data]);
  }

  private addAppInfoFormChangeSubscription() {
    this.appInfoForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(null),
        pairwise()
      )
      .subscribe(([prev, curr]: [any, any]) => {
        if (this.allowWorkflowCountUpdate === true) {
          this.updateFormCompleteCount(prev, curr);
        }
      });
  }
  private updateFormCompleteCount(prev: any, curr: any) {
    let completedDataPoints: CompletionChecklist[] = [];
    Object.keys(this.appInfoForm.controls).forEach((key) => {
      if (prev && curr) {
        if (prev[key] !== curr[key]) {
          let item: CompletionChecklist = {
            dataPointName: key,
            status: curr[key] ? StatusFlag.Yes : StatusFlag.No,
          };
          completedDataPoints.push(item);
        }
      }
    });

    if (completedDataPoints.length > 0) {
      this.AppInfoChanged.emit({
        completedDataPoints: completedDataPoints,
        updateWorkflowCount: true,
      });
    }
  }

  private adjustAttributeInit() {
    const initialAdjustment: CompletionChecklist[] = [];
    const adjustControls =
      this.elementRef.nativeElement.querySelectorAll('.adjust-attr');
    adjustControls.forEach((control: any) => {
      const data: CompletionChecklist = {
        dataPointName: control.name,
        status: control.checked ? StatusFlag.Yes : StatusFlag.No,
      };

      initialAdjustment.push(data);
    });

    initialAdjustment.push({
      dataPointName: '',
      status:
        this.raceAndEthnicityPrimaryData.length == 1
          ? StatusFlag.No
          : StatusFlag.Yes,
    });
    if (initialAdjustment.length > 0) {
      this.AdjustAttrChanged.emit(initialAdjustment);
    }

    this.updateInitialWorkflowCheckList();
  }

  private updateInitialWorkflowCheckList(): void {
    let completedDataPoints: CompletionChecklist[] = [];
    Object.keys(this.appInfoForm.controls).forEach((key) => {
      if (this.appInfoForm?.get(key)?.value) {
        let item: CompletionChecklist = {
          dataPointName: key,
          status: StatusFlag.Yes,
        };

        completedDataPoints.push(item);
      }
    });

    let trans = this.appInfoForm.controls['Transgender']?.value;
    completedDataPoints = this.updateCompleteData(
      trans,
      'TransgenderDescription',
      'transgenderCode',
      completedDataPoints
    );

    let gender = this.appInfoForm.controls['BirthGender']?.value;
    completedDataPoints = this.updateCompleteData(
      gender,
      'BirthGenderDescription',
      'birthGenderCode',
      completedDataPoints
    );

    let material =
      this.appInfoForm.controls['materialInAlternateFormatCode']?.value;
    if (
      material &&
      (material !== StatusFlag.Yes ||
        (material === StatusFlag.Yes &&
          (this.appInfoForm.controls['materialInAlternateFormatDesc']?.value !==
            'OTHER' ||
            (this.appInfoForm.controls['materialInAlternateFormatDesc']
              ?.value === 'OTHER' &&
              this.appInfoForm.controls['materialInAlternateFormatOther']
                ?.value))))
    ) {
      completedDataPoints.push({
        dataPointName: 'materialInAlternateFormat',
        status: StatusFlag.Yes,
      });
    }

    let interpreter = this.appInfoForm.controls['interpreterCode']?.value;
    completedDataPoints = this.pushCompletedData(
      interpreter,
      'interpreterType',
      'interpreter',
      completedDataPoints
    );

    let deafOrHearing = this.appInfoForm.controls['deafOrHearingCode']?.value;
    completedDataPoints = this.pushCompletedData(
      deafOrHearing,
      'startAgeDeafOrHearing',
      'deafOrHearing',
      completedDataPoints
    );

    let blindSeeing = this.appInfoForm.controls['blindSeeingCode']?.value;
    completedDataPoints = this.pushCompletedData(
      blindSeeing,
      'startAgeBlindSeeing',
      'blindSeeing',
      completedDataPoints
    );

    let walkingClimbing =
      this.appInfoForm.controls['walkingClimbingDifficultyCode']?.value;
    completedDataPoints = this.pushCompletedData(
      walkingClimbing,
      'startAgeWalkingClimbingDifficulty',
      'walkingClimbingDifficulty',
      completedDataPoints
    );

    let dressingBathing =
      this.appInfoForm.controls['dressingBathingDifficultyCode']?.value;
    completedDataPoints = this.pushCompletedData(
      dressingBathing,
      'startAgeDressingBathingDifficulty',
      'dressingBathingDifficulty',
      completedDataPoints
    );

    let concentrating =
      this.appInfoForm.controls['concentratingDifficultyCode']?.value;
    completedDataPoints = this.pushCompletedData(
      concentrating,
      'startAgeConcentratingDifficulty',
      'concentratingDifficulty',
      completedDataPoints
    );

    let errandsDifficulty =
      this.appInfoForm.controls['errandsDifficultyCode']?.value;
    completedDataPoints = this.pushCompletedData(
      errandsDifficulty,
      'startAgeErrandsDifficulty',
      'errandsDifficulty',
      completedDataPoints
    );

    if (completedDataPoints.length > 0) {
      this.AppInfoChanged.emit({
        completedDataPoints: completedDataPoints,
        updateWorkflowCount: true,
      });
    }
    this.allowWorkflowCountUpdate = true;
  }

  private updateCompleteData(
    value: any,
    descCode: string,
    dataPointName: string,
    completedDataPoints: any
  ) {
    if (
      value &&
      (value !== 'NOT_LISTED' ||
        (value === 'NOT_LISTED' && this.appInfoForm.controls[descCode]?.value))
    ) {
      completedDataPoints.push({
        dataPointName: dataPointName,
        status: StatusFlag.Yes,
      });
    }
    return completedDataPoints;
  }

  private pushCompletedData(
    value: any,
    descCode: string,
    dataPointName: string,
    completedDataPoints: any
  ) {
    if (
      value &&
      (value !== StatusFlag.Yes ||
        (value === StatusFlag.Yes &&
          this.appInfoForm.controls[descCode]?.value))
    ) {
      completedDataPoints.push({
        dataPointName: dataPointName,
        status: StatusFlag.Yes,
      });
    }
    return completedDataPoints;
  }

  private loadTareaRaceAndEthinicity() {
    this.tareaRaceAndEthinicityCharachtersCount = this.tareaRaceAndEthinicity
      ? this.tareaRaceAndEthinicity.length
      : 0;
    this.tareaRaceAndEthinicityCounter = `${this.tareaRaceAndEthinicityCharachtersCount}/${this.tareaRaceAndEthinicityMaxLength}`;
  }

  private loadRdoTransGender() {
    this.clientfacade.loadRdoTransGenders();
  }

  private loadRdoSexAssigned() {
    this.clientfacade.loadRdoSexAssigned();
  }

  private loadRdoInterpreter() {
    this.clientfacade.loadRdoInterpreter();
  }

  private loadRdoDeaf() {
    this.clientfacade.loadRdoDeaf();
  }

  private loadRdoBlind() {
    this.clientfacade.loadRdoBlind();
  }

  private loadRdoWalking() {
    this.clientfacade.loadRdoWalking();
  }

  private loadRdoDressingorBathing() {
    this.clientfacade.loadRdoDressingorBathing();
  }

  private loadRdoConcentration() {
    this.clientfacade.loadRdoConcentration();
  }

  private loadRdoErrands() {
    this.clientfacade.loadRdoErrands();
  }

  private loadDdlRacialIdentities() {
    this.clientfacade.loadDdlRacialIdentities();
    this.ddlRacialIdentities$.subscribe({
      next: (racialIdentities) => {
        this.racialIdentityOptions = this.kendoDataQuery.groupBy(
          racialIdentities,
          [{ field: 'racialGroup' }]
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private loadDdlPrimaryIdentities() {
    this.clientfacade.loadDdlPrimaryIdentities();
  }

  private loadDdlSpokenLanguages() {
    this.clientfacade.loadDdlSpokenLanguages();
  }

  private loadDdlWrittenLanguages() {
    this.clientfacade.loadDdlWrittenLanguages();
  }

  private loadDdlEnglishProficiencies() {
    this.clientfacade.loadDdlEnglishProficiencies();
  }

  /** Internal event methods **/
  onMiddleNameChecked(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.appInfoForm.controls['middleName'].disable();
      this.appInfoForm.controls['middleName'].removeValidators(
        Validators.required
      );
      this.appInfoForm.controls['middleName'].updateValueAndValidity();
    } else {
      this.appInfoForm.controls['middleName'].enable();
      this.appInfoForm.controls['middleName'].updateValueAndValidity();
    }
  }
  onPrmInsMiddleNameChecked(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.appInfoForm.controls['prmInsMiddleName'].disable();
      this.appInfoForm.controls['prmInsMiddleName'].removeValidators(
        Validators.required
      );
      this.appInfoForm.controls['prmInsMiddleName'].updateValueAndValidity();
    } else {
      this.appInfoForm.controls['prmInsMiddleName'].enable();
      this.appInfoForm.controls['prmInsMiddleName'].updateValueAndValidity();
    }
  }
  onOfficialIdMiddleNameChecked(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.appInfoForm.controls['officialIdMiddleName'].disable();
      this.appInfoForm.controls['officialIdMiddleName'].removeValidators(
        Validators.required
      );
      this.appInfoForm.controls['officialIdMiddleName'].updateValueAndValidity();
    } else {
      this.appInfoForm.controls['officialIdMiddleName'].enable();
      this.appInfoForm.controls['officialIdMiddleName'].updateValueAndValidity();
    }
  }
  onInsuranceCardChecked(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
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

      this.appInfoForm.controls['prmInsFirstName'].disable();
      this.appInfoForm.controls['prmInsMiddleName'].disable();
      this.appInfoForm.controls['prmInsLastName'].disable();
      this.appInfoForm.controls['chkPrmInsMiddleName'].setValue(false)
      this.appInfoForm.controls['chkPrmInsMiddleName'].disable();
    } else {
      this.appInfoForm.controls['prmInsFirstName'].updateValueAndValidity();
      this.appInfoForm.controls['prmInsLastName'].updateValueAndValidity();
      if(!this.appInfoForm.controls['chkPrmInsMiddleName'].value){
        this.appInfoForm.controls['prmInsMiddleName'].updateValueAndValidity();
        this.appInfoForm.controls['prmInsMiddleName'].enable();
      }
      this.appInfoForm.controls['prmInsFirstName'].enable();
      this.appInfoForm.controls['prmInsLastName'].enable();
      this.appInfoForm.controls['chkPrmInsMiddleName'].enable();
    }
  }

  onOfficialIdChecked(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
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
      this.appInfoForm.controls['officialIdFirstName'].disable();
      this.appInfoForm.controls['officialIdMiddleName'].disable();
      this.appInfoForm.controls['officialIdLastName'].disable();
      this.appInfoForm.controls['chkOfficialIdMiddleName'].setValue(false)
      this.appInfoForm.controls['chkOfficialIdMiddleName'].disable();
    } else {
      this.appInfoForm.controls['officialIdFirstName'].updateValueAndValidity();
      this.appInfoForm.controls['officialIdLastName'].updateValueAndValidity();
      this.appInfoForm.controls['officialIdFirstName'].enable();
      if(!this.appInfoForm.controls['chkOfficialIdMiddleName'].value){
        this.appInfoForm.controls['officialIdMiddleName'].updateValueAndValidity();
        this.appInfoForm.controls['officialIdMiddleName'].enable();
      }
      this.appInfoForm.controls['officialIdLastName'].enable();
      this.appInfoForm.controls['chkOfficialIdMiddleName'].enable();
    }
  }

  onSsnNotApplicableChecked(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.isSSNChecked = true;
      this.appInfoForm.controls['ssn'].disable();
      this.appInfoForm.controls['ssn'].removeValidators(Validators.required);
      this.appInfoForm.controls['ssn'].updateValueAndValidity();
    } else {
      this.isSSNChecked = false;
      this.appInfoForm.controls['ssn'].enable();
      this.appInfoForm.controls['ssn'].updateValueAndValidity();
    }
    this.searchDuplicateClient('ssn');
  }

  registerToVoteSelected(event: Event) {
    if (
      (event.target as HTMLInputElement).value.toUpperCase() == StatusFlag.Yes
    ) {
      this.isVisible = true;
    } else {
      this.isVisible = false;
    }
  }

  onTransgenderRdoClicked(event: any) {
    this.transgenderSelectedValue = event.target.id;
    if (this.transgenderSelectedValue == 3) {
      this.isTransTextBoxDisabled = false;
    } else {
      this.isTransTextBoxDisabled = true;
    }
  }

  onSexAssignedRdoClicked(event: any) {
    this.sexAssignedSelectedValue = event.target.id;
    if (this.sexAssignedSelectedValue == 4) {
      this.isSexAssignedTextBoxDisabled = false;
    } else {
      this.isSexAssignedTextBoxDisabled = true;
    }
  }

  onInterpreterRdoClicked(event: any) {
    this.interpreterSelectedValue = event.target.id;
    if (this.interpreterSelectedValue == 1) {
      this.isInterpreterTextBoxDisabled = false;
    } else {
      this.isInterpreterTextBoxDisabled = true;
    }
  }

  onDeafRdoClicked(event: any) {
    this.deafSelectedValue = event.target.id;
    if (this.deafSelectedValue == 1) {
      this.isDeafTextBoxDisabled = false;
    } else {
      this.isDeafTextBoxDisabled = true;
    }
  }

  onBlindRdoClicked(event: any) {
    this.blindSelectedValue = event.target.id;
    if (this.blindSelectedValue == 1) {
      this.isBlindTextBoxDisabled = false;
    } else {
      this.isBlindTextBoxDisabled = true;
    }
  }

  onWalkingRdoClicked(event: any) {
    this.walkingSelectedValue = event.target.id;
    if (this.walkingSelectedValue == 1) {
      this.isWalkingTextBoxDisabled = false;
    } else {
      this.isWalkingTextBoxDisabled = true;
    }
  }

  onDressingorBathingRdoClicked(event: any) {
    this.dressingOrBathingSelectedValue = event.target.id;
    if (this.dressingOrBathingSelectedValue == 1) {
      this.isDressingorBathingTextBoxDisabled = false;
    } else {
      this.isDressingorBathingTextBoxDisabled = true;
    }
  }

  onConcentrationRdoClicked(event: any) {
    this.concentrationSelectedValue = event.target.id;
    if (this.concentrationSelectedValue == 1) {
      this.isConcentrationTextBoxDisabled = false;
    } else {
      this.isConcentrationTextBoxDisabled = true;
    }
  }

  onErrandsRdoClicked(event: any) {
    this.errandsSelectedValue = event.target.id;
    if (this.errandsSelectedValue == 1) {
      this.isErrandsTextBoxDisabled = false;
    } else {
      this.isErrandsTextBoxDisabled = true;
    }
  }

  onTareaRaceAndEthinicityChanged(event: any): void {
    this.tareaRaceAndEthinicityCharachtersCount = event.length;
    this.tareaRaceAndEthinicityCounter = `${this.tareaRaceAndEthinicityCharachtersCount}/${this.tareaRaceAndEthinicityMaxLength}`;
  }

  searchDuplicateClient(fieldname: any) {
    this.ssnDuplicateFound = false;
    let firstName = !!this.appInfoForm.controls['firstName'].value
      ? this.appInfoForm.controls['firstName'].value
      : '';
    let lastName = !!this.appInfoForm.controls['lastName'].value
      ? this.appInfoForm.controls['lastName'].value
      : '';
    let dateOfBirth = this.appInfoForm.controls['dateOfBirth'].value;
    let clientSsn = !!this.appInfoForm.controls['ssn'].value
      ? this.appInfoForm.controls['ssn'].value
      : '';
    let ssnNotApplicable = this.appInfoForm.controls['ssnNotApplicable'].value;
    if (ssnNotApplicable) {
      clientSsn = '';
    }
    let data = {
      firstName: firstName,
      lastName: lastName,
      dob: this.intl.formatDate(dateOfBirth, this.dateFormat),
      ssn: clientSsn,
    };
    if (
      !!clientSsn &&
      this.appInfoForm.controls['ssn'].hasError('patternError')
    ) {
      return;
    }
    if ((!!data.firstName && !!data.lastName && !!dateOfBirth) || !!data.ssn) {
      this.showSsnDuplicateLoader = !!data.ssn ? true : false;
      if (!!data.firstName && !!data.lastName && !!dateOfBirth) {
        this.showNameDuplicateLoader = true;
        this.showNameDuplicateLoaderField = fieldname;
      } else {
        this.showNameDuplicateLoader = false;
      }
      this.getDuplicateClient(data,dateOfBirth);
    }
  }

  private getDuplicateClient(data: any,dob:Date) {
    this.clientfacade.searchDuplicateClient(data).subscribe({
      next: (response: any) => {
        if (!!response) {
          this.currentClient = data;
          this.currentClient.dob = dob;
          this.currentClient['clientCaseId'] = this.applicantInfo.clientCaseId;
          this.matchingClient = response;
          if (!!this.applicantInfo?.client) {
            if (response.clientId != this.applicantInfo.client.clientId) {
              this.showDuplicatePopup = true;
              if (response.ssn == data.ssn) {
                this.ssnDuplicateFound = true;
                this.appInfoForm.controls['ssn'].setErrors({ incorrect: true });
              }
            }
          } else {
            this.showDuplicatePopup = true;
          }
        }
        this.showNameDuplicateLoader = false;
        this.showNameDuplicateLoaderField = '';
        this.showSsnDuplicateLoader = false;
        this.ref.detectChanges();
      },
      error: (err: any) => {
        this.showNameDuplicateLoader = false;
        this.showSsnDuplicateLoader = false;
        this.showNameDuplicateLoaderField = '';
        this.loggingService.logException(err);
        this.clientfacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  dateValidate(event: Event) {
    this.dateValidator = false;
    this.appInfoForm.controls['dateOfBirth'].setErrors(null);
    const signedDate = this.appInfoForm.controls['dateOfBirth'].value;
    const todayDate = new Date();
    if (signedDate > todayDate) {
      this.dateValidator = true;
      this.appInfoForm.controls['dateOfBirth'].setErrors({ incorrect: true });
    }
  }

  cerDateValidate(event: Event) {
    this.cerDateValidator = false;
    if (
      this.appInfoForm.controls['cerReceivedDate'].value &&
      this.appInfoForm.controls['cerSentDate'].value
    ) {
      const cerReceivedDate = this.intl.formatDate(
        this.appInfoForm.controls['cerReceivedDate'].value,
        this.dateFormat
      );
      const cerSentDate = this.intl.formatDate(
        this.appInfoForm.controls['cerSentDate'].value,
        this.dateFormat
      );
      if (cerReceivedDate < cerSentDate) {
        this.cerDateValidator = true;
      }
    }
  }

  onDuplicatPopupCloseClick() {
    this.showDuplicatePopup = false;
  }

  ssnValueChange() {
    const value = this.appInfoForm.controls['ssn'].value.replace(/\s/g, '');
    if (value != '' && value.length < 9) {
      this.appInfoForm.controls['ssn'].setErrors({ patternError: true });
    }
  }

  loadDdlOtherIdentities() {
    this.lovFacade.otherEthnicitylov$.subscribe((response: any) => {
      this.otherEthnicityList = response;
    });
  }
}
