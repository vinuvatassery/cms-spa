/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation , ViewChild, Output, EventEmitter, ElementRef,Inject, Input, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
/** External libraries **/

import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { catchError, combineLatest, debounceTime, distinctUntilChanged, filter, finalize, forkJoin, isEmpty, map, mergeMap, Observable, of, pairwise, pipe, startWith, Subscription, tap, timer } from 'rxjs';
/** Facades **/
import { ApplicantInfo, ClientFacade, CompletionChecklist, StatusFlag ,WorkflowFacade} from '@cms/case-management/domain';

/** Facades **/
import { UIFormStyle } from '@cms/shared/ui-tpa'

import { Lov, LovFacade, LovType } from '@cms/system-config/domain';

import { IntlDateService,DataQuery} from '@cms/shared/ui-tpa' 
 
@Component({
  selector: 'case-management-client-edit-view',
  templateUrl: './client-edit-view.component.html',
  styleUrls: ['./client-edit-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientEditViewComponent implements OnInit,OnDestroy {
 
     
  /** Output Properties **/
 @Output() AppInfoChanged = new EventEmitter<{completedDataPoints: CompletionChecklist[], updateWorkflowCount:boolean}>();
 @Output() AdjustAttrChanged = new EventEmitter<CompletionChecklist[]>();
 @Output() ValidateFields = new EventEmitter<FormGroup>();
 @Output() PronounChanges = new EventEmitter<any>();
 @Output() ApplicantNameChange = new EventEmitter<any>();

  /** Public properties **/
  public currentDate = new Date(); 
  rdoTransgenders$ = this.clientfacade.rdoTransGenders$;
  rdoSexAssigned$ = this.clientfacade.rdoSexAssigned$;

  rdoMaterials$ = this.lovFacade.materialslov$;  
  materialsyeslov$ = this.lovFacade.materialsyeslov$; 
  spokenWrittenLanguagelov$ = this.lovFacade.spokenWrittenLanguagelov$;
  englishProficiencylov$ = this.lovFacade.englishProficiencylov$;
  
  //this.clientfacade.rdoInterpreters$;

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
  isSSNChecked!: boolean ;
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
  public formUiStyle : UIFormStyle = new UIFormStyle();  
  appInfoForm!: FormGroup;
  checkBoxValid!:boolean;
  ageMinLimit=1;
  ageMaxLimit=9999999999;


  textboxDisable!:boolean;
  optionButtonValid!:boolean;
  yesMaterialDisable!:boolean;
  interpreterTypeInputDisable!: boolean;
  startAgeDeafOrHearingInputDisable!:boolean;
  startAgeBlindSeeingInputDisable!:boolean;
  startAgeWalkingClimbingDifficultyInputDisable!:boolean;
  startAgeDressingBathingDifficultyInputDisable!:boolean;
  startAgeConcentratingDifficultyInputDisable!:boolean;
  startAgeErrandsDifficultyInputDisable!:boolean;
 

  pronounForm!:FormGroup;
  adjustmentAttributeList!: string[];
  lengthRestrictThirty=30;
  lengthRestrictForty=40;
  maxLengthSsn =11;
  applicantInfo$ = this.clientfacade.applicantInfo$;
  public value = "";
  isVisible: any;
  isSelected = true;
  applicantInfo!:any;
  pronounList =[];
  raceAndEthnicity =[];
  raceAndEthnicityPrimaryData: Array<any> = [];
  raceAndEthnicityPrimaryNotListed: boolean = false;
  applicantInfoSubscription !:Subscription;

    /** Private properties **/
  private allowWorkflowCountUpdate = false;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  ssnDuplicateFound: boolean = false;
  showDuplicatePopup:boolean=false;
  currentClient:any={};
  matchingClient:any={};
 
  /** Constructor**/
  constructor(private readonly clientfacade: ClientFacade,
    private readonly elementRef: ElementRef,
    private readonly workflowFacade:WorkflowFacade,
    private readonly formBuilder:FormBuilder,
    private readonly lovFacade : LovFacade,
    public readonly intl: IntlDateService,
    public readonly kendoDataQuery: DataQuery,
    private readonly configurationProvider : ConfigurationProvider,
    private readonly loggingService : LoggingService,
    private readonly loaderService: LoaderService,
    private readonly ref: ChangeDetectorRef,  ) { }

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
    this.LoadLovs(); 
    this.buildForm(); 
     this.addAppInfoFormChangeSubscription();    
     this.loadApplicantInfoSubscription();   
     this.ValidateFields.emit(this.appInfoForm);
  }
 
  ngOnDestroy(): void {
    this.applicantInfoSubscription.unsubscribe();    
  }

  ngAfterViewInit(){
    const adjustControls = this.elementRef.nativeElement.querySelectorAll('.adjust-attr');
    adjustControls.forEach((control: any) => {   
      control.addEventListener('click', this.adjustAttributeChanged.bind(this));
    }); 
  } 

  setChangedPronoun(pronoun:any){
    this.pronounList = pronoun;
    if(this.pronounList  !== undefined && this.pronounList !== null){
        this.PronounChanges.emit(this.pronounList);
        this.assignPronounModelToForm();
    }
  }
  setRaceAndEthnicityData(value:any){
    this.raceAndEthnicity = value;
    if(Array.isArray(value) && value.length>0){
      this.assignRaceAndEthnicityToForm();
    }
  }
  raceAndEthnicityChange(value: any) {
    const Ethnicity = this.appInfoForm.controls["Ethnicity"]?.value;
    const Race = this.appInfoForm.controls["RaceAndEthnicity"]?.value;
    this.raceAndEthnicityPrimaryData = [];
    this.raceAndEthnicityPrimaryNotListed = false;
    if (Array.isArray(Ethnicity)) {
      Ethnicity.forEach((el: any) => {
        this.raceAndEthnicityPrimaryData.push(el);
      });
    }

    if (Array.isArray(Race)) {
      Race.forEach((el: any) => {
        if (el.lovCode !== 'NOT_LISTED')
          this.raceAndEthnicityPrimaryData.push(el);
        else
          this.raceAndEthnicityPrimaryNotListed = true;
      });
    }


    if (this.raceAndEthnicityPrimaryData.length == 1) {
      this.appInfoForm.controls['RaceAndEthnicityPrimary']?.setValue(this.raceAndEthnicityPrimaryData[0]);
    } else {
      this.appInfoForm.controls['RaceAndEthnicityPrimary']?.setValue(null);
    }
  }
  ngAfterViewChecked() {  
    var firstName = '';
    var lastName ='';
    if(this.appInfoForm.controls["firstName"].value === null){
      firstName = ''
    }
    else{
      firstName = this.appInfoForm.controls["firstName"].value
    }
    if(this.appInfoForm.controls["lastName"].value === null){
      lastName = ''
    }
    else{
      lastName = this.appInfoForm.controls["lastName"].value
    }
    this.ApplicantNameChange.emit(firstName+'  '+lastName);
    const initialAjustment: CompletionChecklist[] = [];
    const adjustControls = this.elementRef.nativeElement.querySelectorAll('.adjust-attr');
    adjustControls.forEach((control: any) => {     
      const data: CompletionChecklist = {
        dataPointName: control.name,
        status: control.checked ? StatusFlag.Yes : StatusFlag.No
      };
      initialAjustment.push(data);
    });

    if (initialAjustment.length > 0) {
      this.AdjustAttrChanged.emit(initialAjustment);
    }
  }

  public onClose(event: any) {    
      //event.preventDefault();   
  }
  public clearForm(): void {
    //this.form.reset();
  }
  /** Private methods **/ 

  private buildForm() {
    this.appInfoForm = this.formBuilder.group({
      firstName: [''],
      middleName: [''],
      chkmiddleName:  [''],
      lastName:  [''],
      prmInsFirstName:  [''],
      prmInsLastName:  ['',{disabled:false}],
      prmInsNotApplicable:  [''],
      officialIdFirstName:  ['',{disabled:false}],
      officialIdLastName:  ['',{disabled:false}],
      officialIdsNotApplicable:  [''],
      dateOfBirth:  [this.currentDate],
      ssn:  ['',{disabled:false}],
      ssnNotApplicable:  [''],
      registerToVote: [''],
      pronoun: [''] ,
      pronouns: [''] ,
      materialInAlternateFormatCode:[''],
      materialInAlternateFormatDesc:[''],
      interpreterCode:[''],
      interpreterType:[''],
      deafOrHearingCode:[''],
      startAgeDeafOrHearing:[''],
      blindSeeingCode:[''],
      startAgeBlindSeeing:[''],
      limitingConditionCode:[''],
      walkingClimbingDifficultyCode:[''],
      startAgeWalkingClimbingDifficulty:[''],
      dressingBathingDifficultyCode:[''],
      startAgeDressingBathingDifficulty:[''],
      concentratingDifficultyCode:[''],
      startAgeConcentratingDifficulty:[''],
      errandsDifficultyCode:[''],
      startAgeErrandsDifficulty:[''],
      spokenLanguage:[''],
      writtenLanguage:[''],
      englishProficiency:[''],
      RaceAndEthnicity: [[]] 

    });  

  } 
  private LoadLovs(){
    this.lovFacade.getMaterialLovs();
    this.lovFacade.getMaterialYesLovs();
    this.lovFacade.getSpokenWrittenLanguageLovs();
    this.lovFacade.getEnglishProficiencyLovs();
  }
  private loadApplicantInfoSubscription(){
    
    this.applicantInfoSubscription = this.clientfacade.applicantInfo$.subscribe((applicantInfo)=>{   
      this.textboxDisable  = true; 
      this.yesMaterialDisable = true;
      this.interpreterTypeInputDisable = true;
      this.startAgeDeafOrHearingInputDisable = true;
      this.startAgeBlindSeeingInputDisable = true;
      this.startAgeWalkingClimbingDifficultyInputDisable = true;
      this.startAgeDressingBathingDifficultyInputDisable = true;
      this.startAgeConcentratingDifficultyInputDisable = true;
      this.startAgeErrandsDifficultyInputDisable = true;

    if(applicantInfo.client !=undefined){
      this.isVisible =false;
      if(this.appInfoForm !== undefined){
      this.appInfoForm.reset();    
      this.appInfoForm.controls["dateOfBirth"].setValue(new Date());   
      this.appInfoForm.controls["dateOfBirth"].updateValueAndValidity();
      this.appInfoForm.controls['middleName'].enable();
      this.appInfoForm.controls["officialIdLastName"].enable();
      this.appInfoForm.controls["officialIdFirstName"].enable();
      this.appInfoForm.controls["prmInsFirstName"].enable();
      this.appInfoForm.controls["prmInsLastName"].enable();
      this.appInfoForm.controls["ssn"].enable();
      }      

      this.applicantInfo = applicantInfo;
      if(this.applicantInfo.clientCaseId !== null){
      this.assignModelToForm(applicantInfo);
      }
      else{
        this.adjustAttributeInit();
      }
    }
   
  }); 
}

private assignModelToForm(applicantInfo:ApplicantInfo){
  this.appInfoForm.controls["firstName"].setValue(applicantInfo.client?.firstName);
  if(applicantInfo.client?.noMiddleInitialFlag =="Y"){
    this.appInfoForm.controls["chkmiddleName"].setValue(true);
    this.appInfoForm.controls["middleName"].setValue(null);
    this.appInfoForm.controls['middleName'].disable();

  }
  else{
    this.appInfoForm.controls["chkmiddleName"].setValue(false);
    this.appInfoForm.controls["middleName"].setValue(applicantInfo.client?.middleName);
    this.appInfoForm.controls['middleName'].enable();

  }
  this.appInfoForm.controls["lastName"].setValue(applicantInfo.client?.lastName)
  if(applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag !== undefined && 
    applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.officialIdNameNotApplicableFlag === StatusFlag.Yes){
    this.appInfoForm.controls['officialIdsNotApplicable'].setValue(true);
    this.appInfoForm.controls["officialIdFirstName"].setValue(null);
    this.appInfoForm.controls["officialIdLastName"].setValue(null);
    this.appInfoForm.controls["officialIdLastName"].disable();
    this.appInfoForm.controls["officialIdFirstName"].disable();

  }
 else{
  this.appInfoForm.controls['officialIdsNotApplicable'].setValue(false);
  this.appInfoForm.controls["officialIdFirstName"].setValue(applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility?.officialIdFirstName)
  this.appInfoForm.controls["officialIdLastName"].setValue(applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility?.officialIdLastName)
  this.appInfoForm.controls["officialIdLastName"].enable();
  this.appInfoForm.controls["officialIdFirstName"].enable();

 }
 if(applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag !== undefined &&
  applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.insuranceNameNotApplicableFlag ==StatusFlag.Yes){
  this.appInfoForm.controls['prmInsNotApplicable'].setValue(true);
  this.appInfoForm.controls["prmInsFirstName"].setValue(null);
  this.appInfoForm.controls["prmInsLastName"].setValue(null);
  this.appInfoForm.controls["prmInsFirstName"].disable();
  this.appInfoForm.controls["prmInsLastName"].disable();
 }
 else{
    this.appInfoForm.controls['prmInsNotApplicable'].setValue(false);
    this.appInfoForm.controls["prmInsFirstName"].setValue(applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility?.insuranceFirstName);
    this.appInfoForm.controls["prmInsLastName"].setValue(applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility?.insuranceLastName);
    this.appInfoForm.controls["prmInsFirstName"].enable();
    this.appInfoForm.controls["prmInsLastName"].enable();

 }
  this.appInfoForm.controls["dateOfBirth"].setValue(new Date(applicantInfo.client?.dob));   
  if(applicantInfo.client?.ssnNotApplicableFlag ==StatusFlag.Yes){
    this.appInfoForm.controls["ssnNotApplicable"].setValue(true);
    this.appInfoForm.controls["ssn"].setValue(null);
    this.appInfoForm.controls["ssn"].disable();

  }
  else{
    this.appInfoForm.controls["ssnNotApplicable"].setValue(false);
    this.appInfoForm.controls["ssn"].setValue(applicantInfo.client?.ssn)
    this.appInfoForm.controls["ssn"].enable();

  }
  if(applicantInfo.clientCaseEligibilityAndFlag?.clientCaseEligibilityFlag?.registerToVoteFlag?.toUpperCase() ==StatusFlag.Yes){
    this.isVisible = true;
    this.appInfoForm.controls["registerToVote"].setValue(StatusFlag.Yes);
  }
  else{
    this.isVisible = false
    this.appInfoForm.controls["registerToVote"].setValue(StatusFlag.No);
  }
  
  if (Array.isArray(applicantInfo.clientGenderList) ) {
    applicantInfo.clientGenderList.forEach(gender => { 
      this.appInfoForm.controls['Gender'+gender.clientGenderCode]?.setValue(true);
      if(gender.clientGenderCode==="NOT_LISTED" && gender.otherDesc!==null){
        this.appInfoForm.controls['GenderDescription']?.setValue(gender.otherDesc);
      }
      this.appInfoForm.controls['GenderGroup']?.setValue(gender.clientGenderCode);
      
    })
  }
  if (Array.isArray(applicantInfo.clientSexualIdentityList) ) {
    applicantInfo.clientSexualIdentityList.forEach(identity => { 
      this.appInfoForm.controls['SexulaIdentity'+identity.clientSexualIdentityCode]?.setValue(true);
      if(identity.clientSexualIdentityCode==="NOT_LISTED" && identity.otherDesc!==null){
        this.appInfoForm.controls['SexulaIdentityDescription']?.setValue(identity.otherDesc);
      }
      this.appInfoForm.controls['SexulaIdentityGroup']?.setValue(identity.clientSexualIdentityCode);
      
    })
  }
  const Transgender=applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.clientTransgenderCode.trim();
  this.appInfoForm.controls['Transgender']?.setValue(Transgender);
  if (Transgender==='NOT_LISTED') {
    this.appInfoForm.controls['TransgenderDescription']?.setValue(applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.clientTransgenderDesc);
  }

  const BirthGender=applicantInfo.client.genderAtBirthCode.trim();
  this.appInfoForm.controls['BirthGender']?.setValue(BirthGender);
  if (BirthGender==='NOT_LISTED') {
    this.appInfoForm.controls['BirthGenderDescription']?.setValue(applicantInfo.client.genderAtBirthDesc);
  }

  
this.assignRaceAndEthnicityToForm();
  this.assignPronounModelToForm();

  this.appInfoForm.controls["materialInAlternateFormatCode"].setValue(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.materialInAlternateFormatCode);
  this.appInfoForm.controls["materialInAlternateFormatDesc"].setValue(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.materialInAlternateFormatDesc);
  if(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.materialInAlternateFormatCode !== null && 
    this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.materialInAlternateFormatCode ==='YES'){
      this.yesMaterialDisable = false;
  }
  this.appInfoForm.controls["interpreterCode"].setValue(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.interpreterCode);
  this.appInfoForm.controls["interpreterType"].setValue(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.interpreterType);
  if(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.interpreterCode !== null && 
    this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.interpreterCode ==='YES'){
      this.interpreterTypeInputDisable = false;
  }
  this.appInfoForm.controls["deafOrHearingCode"].setValue(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.deafOrHearingCode);
  this.appInfoForm.controls["startAgeDeafOrHearing"].setValue(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeDeafOrHearing);
  if(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.deafOrHearingCode !== null && 
    this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.deafOrHearingCode ==='YES'){
      this.startAgeDeafOrHearingInputDisable = false;
  }

  this.appInfoForm.controls["blindSeeingCode"].setValue(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.blindSeeingCode);
  this.appInfoForm.controls["startAgeBlindSeeing"].setValue(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeBlindSeeing);
  if(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.blindSeeingCode !== null && 
    this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.blindSeeingCode ==='YES'){
      this.startAgeBlindSeeingInputDisable = false;
  }

  this.appInfoForm.controls["limitingConditionCode"].setValue(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.limitingConditionCode);
  
  this.appInfoForm.controls["walkingClimbingDifficultyCode"].setValue(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.walkingClimbingDifficultyCode);
  this.appInfoForm.controls["startAgeWalkingClimbingDifficulty"].setValue(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeWalkingClimbingDifficulty);
  if(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.walkingClimbingDifficultyCode !== null && 
    this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.walkingClimbingDifficultyCode ==='YES'){
      this.startAgeWalkingClimbingDifficultyInputDisable = false;
  }

  this.appInfoForm.controls["dressingBathingDifficultyCode"].setValue(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.dressingBathingDifficultyCode);
  this.appInfoForm.controls["startAgeDressingBathingDifficulty"].setValue(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeDressingBathingDifficulty);
  if(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.dressingBathingDifficultyCode !== null && 
    this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.dressingBathingDifficultyCode ==='YES'){
      this.startAgeDressingBathingDifficultyInputDisable = false;
  }

  this.appInfoForm.controls["concentratingDifficultyCode"].setValue(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.concentratingDifficultyCode);
  this.appInfoForm.controls["startAgeConcentratingDifficulty"].setValue(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeConcentratingDifficulty);
  if(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.concentratingDifficultyCode !== null && 
    this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.concentratingDifficultyCode ==='YES'){
      this.startAgeConcentratingDifficultyInputDisable = false;
  }

  this.appInfoForm.controls["errandsDifficultyCode"].setValue(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.errandsDifficultyCode);
  this.appInfoForm.controls["startAgeErrandsDifficulty"].setValue(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeErrandsDifficulty);
  if(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.errandsDifficultyCode !== null && 
    this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.errandsDifficultyCode ==='YES'){
      this.startAgeErrandsDifficultyInputDisable = false;
  }
  this.appInfoForm.controls["spokenLanguage"].setValue(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.spokenLanguageCode);
  this.appInfoForm.controls["writtenLanguage"].setValue(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.writtenLanguageCode);
  this.appInfoForm.controls["englishProficiency"].setValue(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.englishProficiencyCode);
  
  this.adjustAttributeInit();
}
  private assignRaceAndEthnicityToForm() {
    if (Array.isArray(this.applicantInfo?.clientRaceList) && Array.isArray(this.raceAndEthnicity)) {
      const RaceAndEthnicity: any = [];
      const Ethnicity: any = [];
      let RaceAndEthnicityPrimary=null;
      this.applicantInfo.clientRaceList.forEach((el: any) => {
        const foundRace = this.raceAndEthnicity.find((m: any) => m.lovCode === el.clientRaceCategoryCode);
        if (foundRace !== undefined) {
          RaceAndEthnicity.push(foundRace);
          if (el.isPrimaryFlag === StatusFlag.Yes)
          RaceAndEthnicityPrimary=foundRace;
            //this.appInfoForm.controls['RaceAndEthnicityPrimary']?.setValue(foundRace);

        }
        const foundEthnicity = this.raceAndEthnicity.find((m: any) => m.lovCode === el.clientEthnicIdentityCode);
        if (foundEthnicity !== undefined){
          Ethnicity.push(foundEthnicity);
          if (el.isPrimaryFlag === StatusFlag.Yes)
          RaceAndEthnicityPrimary=foundEthnicity;
        }
      });
      this.appInfoForm.controls['RaceAndEthnicity']?.setValue(RaceAndEthnicity);
      this.appInfoForm.controls['Ethnicity']?.setValue(Ethnicity);
      this.raceAndEthnicityChange(true);
      this.appInfoForm.controls['RaceAndEthnicityPrimary']?.setValue(RaceAndEthnicityPrimary);
      if(this.raceAndEthnicityPrimaryNotListed){
        const raceAndEthnicityNotListed = this.applicantInfo.clientRaceList.find((m: any) => m.clientRaceCategoryCode === 'NOT_LISTED');
        this.appInfoForm.controls['RaceAndEthnicityNotListed']?.setValue(raceAndEthnicityNotListed.raceDesc);
      }
    }

  }
private assignPronounModelToForm(){
  if(this.applicantInfo !== undefined && this.applicantInfo.clientPronounList !== undefined && this.applicantInfo.clientPronounList != null){   
    this.applicantInfo.clientPronounList.forEach((pronoun:any) => {  
  if(this.appInfoForm.controls[pronoun.clientPronounCode.toUpperCase()] !== undefined){
      this.appInfoForm.controls[pronoun.clientPronounCode.toUpperCase()].setValue(true);
      this.updateWorkflowPronounCount(true);
  if(pronoun.clientPronounCode ==='NOT_LISTED'){
      this.appInfoForm.controls['pronoun'].setValue(pronoun.otherDesc);
      this.textboxDisable = false;
    }   
    }
 })
    this.clientfacade.pronounListSubject.next(this.pronounList);     
}
}

private updateWorkflowPronounCount(isCompleted:boolean){
  const workFlowdata: CompletionChecklist[] = [{
    dataPointName: 'pronoun',
    status: isCompleted ? StatusFlag.Yes : StatusFlag.No
  }];

  this.AppInfoChanged.emit({completedDataPoints: workFlowdata, updateWorkflowCount: true});
}

  private adjustAttributeChanged(event: Event) { 
    const data: CompletionChecklist = {
      dataPointName: (event.target as HTMLInputElement).name,
      status: (event.target as HTMLInputElement).checked ? StatusFlag.Yes : StatusFlag.No
    };
    this.AdjustAttrChanged.emit([data]);
  }

  private addAppInfoFormChangeSubscription() {
    this.appInfoForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(null), pairwise()
      )
      .subscribe(([prev, curr]: [any, any]) => {  
        if(this.allowWorkflowCountUpdate === true) {            
          this.updateFormCompleteCount(prev, curr); 
        }     
      });
       this.appInfoForm.statusChanges.subscribe(a=>{   
       if(this.appInfoForm.controls["pronouns"].valid){
        this.checkBoxValid = true;

       }
       else{
        this.checkBoxValid = false;
       }
    });
  }
  private updateFormCompleteCount(prev: any, curr: any) {
    let completedDataPoints: CompletionChecklist[] = [];
    Object.keys(this.appInfoForm.controls).forEach(key => {
      if (prev && curr) {
        if (prev[key] !== curr[key]) {
          let item: CompletionChecklist = {
            dataPointName: key,
            status: curr[key] ? StatusFlag.Yes : StatusFlag.No
          };
          completedDataPoints.push(item);
        }
      }
    });

    if (completedDataPoints.length > 0) {
      this.AppInfoChanged.emit({completedDataPoints: completedDataPoints, updateWorkflowCount: true});
    }
  }

  private adjustAttributeInit() {
    const initialAdjustment: CompletionChecklist[] = [];
    const adjustControls = this.elementRef.nativeElement.querySelectorAll('.adjust-attr');
    adjustControls.forEach((control: any) => {
      const data: CompletionChecklist = {
        dataPointName: control.name,
        status: control.checked ? StatusFlag.Yes : StatusFlag.No
      };

      initialAdjustment.push(data);
    });

    if (initialAdjustment.length > 0) {
      //this.workflowFacade.updateBasedOnDtAttrChecklist(initialAdjustment);
      this.AdjustAttrChanged.emit(initialAdjustment);
    }

    this.updateInitialWorkflowCheckList();
  }

  private updateInitialWorkflowCheckList(){
    let completedDataPoints: CompletionChecklist[] = [];
    Object.keys(this.appInfoForm.controls).forEach(key => {
      if (this.appInfoForm?.get(key)?.value) {
        let item: CompletionChecklist = {
          dataPointName: key,
          status: StatusFlag.Yes
        };

        completedDataPoints.push(item);
      }  
    });

    if (completedDataPoints.length > 0) {
      this.AppInfoChanged.emit({completedDataPoints: completedDataPoints, updateWorkflowCount: false});
    }
    this.allowWorkflowCountUpdate = true;
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

  // private loadRdoMaterials() {
  //   this.clientfacade.loadRdoMaterials();
  // }

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
        this.racialIdentityOptions = this.kendoDataQuery.groupBy(racialIdentities, [
          { field: 'racialGroup' },
        ]);
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
      this.appInfoForm.controls['middleName'].removeValidators(Validators.required);
      this.appInfoForm.controls['middleName'].updateValueAndValidity();      
    }
    else {
      this.appInfoForm.controls['middleName'].enable();
      this.appInfoForm.controls['middleName'].setValidators(Validators.required);
      this.appInfoForm.controls['middleName'].updateValueAndValidity();    
    }
  }
  onInsuranceCardChecked(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {

      this.appInfoForm.controls['prmInsFirstName'].removeValidators(Validators.required);
      this.appInfoForm.controls['prmInsFirstName'].updateValueAndValidity();
      this.appInfoForm.controls['prmInsLastName'].removeValidators(Validators.required);
      this.appInfoForm.controls['prmInsLastName'].updateValueAndValidity();
      this.appInfoForm.controls['prmInsFirstName'].disable();
      this.appInfoForm.controls['prmInsLastName'].disable();
    }
    else {

      this.appInfoForm.controls['prmInsFirstName'].setValidators(Validators.required);
      this.appInfoForm.controls['prmInsFirstName'].updateValueAndValidity();
      this.appInfoForm.controls['prmInsLastName'].setValidators(Validators.required);
      this.appInfoForm.controls['prmInsLastName'].updateValueAndValidity();
      this.appInfoForm.controls['prmInsFirstName'].enable();
      this.appInfoForm.controls['prmInsLastName'].enable();
    }
  }

  onOfficialIdChecked(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.appInfoForm.controls['officialIdFirstName'].removeValidators(Validators.required);
      this.appInfoForm.controls['officialIdFirstName'].updateValueAndValidity();
      this.appInfoForm.controls['officialIdLastName'].removeValidators(Validators.required);
      this.appInfoForm.controls['officialIdLastName'].updateValueAndValidity();
      this.appInfoForm.controls['officialIdFirstName'].disable();
      this.appInfoForm.controls['officialIdLastName'].disable();
    }
    else {

      this.appInfoForm.controls['officialIdFirstName'].setValidators(Validators.required);
      this.appInfoForm.controls['officialIdFirstName'].updateValueAndValidity();
      this.appInfoForm.controls['officialIdLastName'].setValidators(Validators.required);
      this.appInfoForm.controls['officialIdLastName'].updateValueAndValidity();
      this.appInfoForm.controls['officialIdFirstName'].enable();
      this.appInfoForm.controls['officialIdLastName'].enable();
    }
  }

  onSsnNotApplicableChecked(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.isSSNChecked = true;
      this.appInfoForm.controls['ssn'].removeValidators(Validators.required);
      this.appInfoForm.controls['ssn'].updateValueAndValidity();
      this.appInfoForm.controls['ssn'].disable();
    }
    else {
      this.isSSNChecked = false;
      this.appInfoForm.controls['ssn'].setValidators(Validators.required);
      this.appInfoForm.controls['ssn'].updateValueAndValidity();
      this.appInfoForm.controls['ssn'].enable();
    }
  }

  registerToVoteSelected(event:Event){
   if((event.target as HTMLInputElement).value.toUpperCase()==StatusFlag.Yes){
    this.isVisible = true;
   }
   else{
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

  // onMaterialsRdoClicked(event: any) {
  //   this.materialsSelectedValue = event.target.id;
  //   if (this.materialsSelectedValue == 1) {
  //     this.isMaterialsTextBoxDisabled = false;
  //   } else {
  //     this.isMaterialsTextBoxDisabled = true;
  //   }
  // }

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

  searchDuplicateClient() {
    this.ssnDuplicateFound = false;
    this.appInfoForm.controls['ssn'].setErrors(null);
    this.appInfoForm.controls['ssn'].updateValueAndValidity();
    let firstName = this.appInfoForm.controls['firstName'].value != null ? this.appInfoForm.controls['firstName'].value : '';
    let lastName = this.appInfoForm.controls['lastName'].value != null ? this.appInfoForm.controls['lastName'].value : '';
    let dateOfBirth = this.appInfoForm.controls['dateOfBirth'].value;
    let clientSsn = this.appInfoForm.controls['ssn'].value != null ? this.appInfoForm.controls['ssn'].value : '';;
    let ssnNotApplicable = this.appInfoForm.controls['ssnNotApplicable'].value;
    if (ssnNotApplicable) {
      clientSsn = '';
    }
    let parsedDate = new Date(this.intl.formatDate(dateOfBirth, this.dateFormat))
    let data = {
      firstName: firstName,
      lastName: lastName,
      dob: parsedDate,
      ssn: clientSsn
    };
    this.loaderService.show();
    this.clientfacade.searchDuplicateClient(data).subscribe({
      next: (response: any) => {
        if (response != null) {
          this.currentClient = data;
          this.currentClient["clientCaseId"] = this.applicantInfo.clientCaseId;
          this.matchingClient = response;
          if (this.applicantInfo.client != undefined) {
            if (response.clientId != this.applicantInfo.client.clientId) {
              this.showDuplicatePopup = true
            }
          }
          else {
            this.showDuplicatePopup = true
          }
          if (response.ssn == data.ssn) {
            this.ssnDuplicateFound = true;
            this.appInfoForm.controls['ssn'].setErrors({ 'incorrect': true });
          }
          this.ref.detectChanges();
        }
        this.loaderService.hide();
      },
      error: (err: any) => {
        this.loaderService.hide();
        this.loggingService.logException(err);
        this.clientfacade.showHideSnackBar(SnackBarNotificationType.ERROR,err)
      }
    })
  }

  onDuplicatPopupCloseClick() {
    this.showDuplicatePopup = false;
  }
}
