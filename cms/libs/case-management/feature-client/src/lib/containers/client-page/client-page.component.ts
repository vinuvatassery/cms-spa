/** Angular **/
import { OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
/** External libraries **/
import { catchError, first, forkJoin, last, mergeMap, of, Subscription } from 'rxjs';
/** Facade **/
import { WorkflowFacade, ClientFacade, ApplicantInfo, Client, ClientCaseEligibility, StatusFlag, ClientPronoun, ClientGender, ClientRace, 
  ClientSexualIdentity, clientCaseEligibilityFlag, ClientCaseEligibilityAndFlag, CaseFacade, YesNoFlag,ControlPrefix, MaterialFormat } from '@cms/case-management/domain';
/** Entities **/
import { CompletionChecklist } from '@cms/case-management/domain';
/** Enums **/
import { NavigationType,PronounCode } from '@cms/case-management/domain';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService,LoggingService,SnackBarNotificationType,NotificationSnackbarService } from '@cms/shared/util-core';



@Component({
  selector: 'case-management-client-page',
  templateUrl: './client-page.component.html',
  styleUrls: ['./client-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientPageComponent implements OnInit, OnDestroy {

  /** Private properties **/
  private saveClickSubscription !: Subscription;
  private loadSessionSubscription!:Subscription;
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;

   /** Public properties **/
  isValid:boolean=true;
  applicantInfo = {} as ApplicantInfo;
  appInfoForm!:FormGroup;  
  applicantName :string = '';
  case$ = this.caseFacade.getCase$;
  pronounList !:any;
  showErrorMessage:boolean=false;
  clientCaseId! : string;
  clientId!:number;
  clientCaseEligibilityId!:string;
  sessionId! : string;
  message!:string;
 
    /** Constructor **/
  constructor(private workFlowFacade: WorkflowFacade,
              private clientFacade: ClientFacade, 
              private route: ActivatedRoute,
              private caseFacade: CaseFacade,
              private loaderService: LoaderService,
              private loggingService:LoggingService,
              private notificationSnackbarService : NotificationSnackbarService,
              private router:Router
              ) { }


  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadSessionData();
    this.addSaveSubscription();
    this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();
  }
  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.loadSessionSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
  }

  /** Private methods **/
  private addSaveSubscription(): void {   
    this.saveClickSubscription = this.workFlowFacade.saveAndContinueClicked$.pipe(      
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.saveAndUpdate()])
      ),
    ).subscribe({     
        next:([navigationType, isSaved]) =>{
          if (isSaved) {
              this.loaderService.hide();                 
              this.clientFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS ,this.message) 
              this.workFlowFacade.navigate(navigationType);          
        }    
      },
      error: (error: any) => {
        this.loaderService.hide();      
        this.clientFacade.showHideSnackBar(SnackBarNotificationType.ERROR , error);
        this.loggingService.logException({name:SnackBarNotificationType.ERROR,message:error});
      },

    });
    
  } 

  private loadSessionData()
  {  
   this.applicantInfo = new ApplicantInfo();
   this.applicantInfo.clientPronounList= [];
   this.sessionId = this.route.snapshot.queryParams['sid'];    
   this.workFlowFacade.loadWorkFlowSessionData(this.sessionId)
   this.loadSessionSubscription = this.workFlowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
    .subscribe((session: any) => {              
      this.clientFacade.applicationInfoSubject.next(this.applicantInfo);
      if(session !== null && session !== undefined && session.sessionData !==undefined){
      this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId 
      let clientParsedId=JSON.parse(session.sessionData).clientId
      if(clientParsedId!=null){
        this.clientId=clientParsedId;
      }
      this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId   
      if(this.clientCaseId !== undefined && this.clientCaseId  !==null){
        this.applicantInfo.clientCaseId = this.clientCaseId   
        this.applicantInfo.workFlowSessionId = this.sessionId;      
        if(this.clientCaseEligibilityId !=undefined && this.clientCaseEligibilityId != null){        
          if(  this.applicantInfo.client === undefined){
            this.applicantInfo.client = new Client;
          }
          if(  this.applicantInfo.clientCaseEligibilityAndFlag === undefined){
            this.applicantInfo.clientCaseEligibilityAndFlag = new ClientCaseEligibilityAndFlag;
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility = new ClientCaseEligibility;
          }
          if( this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility === undefined){
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility = new ClientCaseEligibility;
          }
          this.applicantInfo.client.clientId =this.clientId;
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.clientCaseEligibilityId = this.clientCaseEligibilityId;
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.clientCaseId = this.clientCaseId;
          this.loadApplicantInfo();
        }
        else{
        }
       
      
      }
    }
  
    });   
    
  } 

  private loadApplicantInfo(){   
    if(  this.applicantInfo.client == undefined){
      this.applicantInfo.client = new Client;
    }

    if(  this.applicantInfo.clientCaseEligibilityAndFlag === undefined){
      this.applicantInfo.clientCaseEligibilityAndFlag = new ClientCaseEligibilityAndFlag;        
    }  
        this.clientFacade.load( this.clientCaseId,this.clientCaseEligibilityId).subscribe({       
          next: response => {           
            if(response !=null){  
                /**Populating Client */   
                this.applicantInfo.client = response.client; 

                /* Populate Client Case Eligibility */
                if(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility ===undefined ){
                  this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility = new ClientCaseEligibility;   
                }
                this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility = response.clientCaseEligibilityAndFlag.clientCaseEligibility;
              
              /* Populate Client Case Eligibility Flag */
                if( this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag === undefined){
                  this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag = new clientCaseEligibilityFlag;
                }
                this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag = response.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag;

              /*Populate Client Gender */
              response.clientGenderList.forEach(x=>{
                var clientGender = new ClientGender()
                clientGender.clientGenderCode = x.clientGenderCode;
                clientGender.clientGenderId = x.clientGenderId;
                clientGender.clientId = x.clientId;
                clientGender.otherDesc = x.otherDesc;
                if(this.applicantInfo.clientGenderList == undefined || null ){
                  this.applicantInfo.clientGenderList = []
                }
                this.applicantInfo.clientGenderList.push(clientGender);
              })

              /*Populate Client Pronoun */
              response.clientPronounList.forEach(x=>{
                var pronoun = new ClientPronoun()
                pronoun.clientId = x.clientId;
                pronoun.clientPronounCode = x.clientPronounCode;
                pronoun.clientPronounId = x.clientPronounId;
                pronoun.otherDesc = x.otherDesc
                if(this.applicantInfo.clientPronounList == undefined || null ){
                  this.applicantInfo.clientPronounList = []
                }
                this.applicantInfo.clientPronounList.push(pronoun);
              })

              /*Populate Client Race */
              response.clientRaceList.forEach(x=>{
                var clientRace = new ClientRace();
                clientRace.clientEthnicIdentityCode = x.clientEthnicIdentityCode;
                clientRace.clientId = x.clientId;
                clientRace.clientRaceCategoryCode = x.clientRaceCategoryCode;
                clientRace.clientRaceId = x.clientRaceId;
                clientRace.raceDesc = x.raceDesc;
                clientRace.isPrimaryFlag = x.isPrimaryFlag;
                if(this.applicantInfo.clientRaceList == undefined || null ){
                  this.applicantInfo.clientRaceList = []
                }
                this.applicantInfo.clientRaceList.push(clientRace);
              })

              /*Populate Clien Sexual Identity */
              response.clientSexualIdentityList.forEach(x=>{
                var clientSexualIdentity = new ClientSexualIdentity();
                clientSexualIdentity.clientId= x.clientId;
                clientSexualIdentity.clientSexualIdentityCode = x.clientSexualIdentityCode;
                clientSexualIdentity.clientSexualyIdentityId = x.clientSexualyIdentityId;
                clientSexualIdentity.otherDesc = x.otherDesc;
                if(this.applicantInfo.clientSexualIdentityList == undefined || null ){
                  this.applicantInfo.clientSexualIdentityList = []
                }
                this.applicantInfo.clientSexualIdentityList.push(clientSexualIdentity);
              })
              this.clientFacade.applicationInfoSubject.next(this.applicantInfo);
             
            }
          } ,
        error: error => {  
          this.clientFacade.showHideSnackBar(SnackBarNotificationType.ERROR ,error)  
          this.loggingService.logException({name:SnackBarNotificationType.ERROR,message:error})
        }
      });

  }

  private saveAndUpdate(){
    this.loaderService.show();
    this.validateForm();
        if(this.appInfoForm.valid){
          this.populateApplicantInfoModel();
          if(this.clientCaseEligibilityId !== null && this.clientCaseEligibilityId !== undefined)  {
            this.message ='Applicant info updated successfully';
            return this.clientFacade.update(this.applicantInfo).pipe(
              catchError((error:any)=>{
                if(error){
                  this.loaderService.hide();      
                  this.clientFacade.showHideSnackBar(SnackBarNotificationType.ERROR , error);
                  this.loggingService.logException({name:SnackBarNotificationType.ERROR,message:error});
                  return of(false);
                }
                return of(false);
              })
              
            );            
          }
          else{
            this.message ='Applicant info saved successfully';
            return this.clientFacade.save(this.applicantInfo).pipe(
              catchError((error:any)=>{
                if(error){
                  this.loaderService.hide();      
                  this.clientFacade.showHideSnackBar(SnackBarNotificationType.ERROR , error);
                  this.loggingService.logException({name:SnackBarNotificationType.ERROR,message:error});
                  return of(false);
                }
                return of(false);
              })
              
            );          
          }          
        }
        else{
          this.loaderService.hide();    
          return of(false);
        } 
 
  }
 
  private  populateApplicantInfoModel(){ 
   
    this.populateClient();
    this.populateClientCaseEligibility();
    this.populateClientPronoun();
    this.populateClientGender();
    this.populateClientSexualIdentity();

    /*Modify when the get is ready */
    /*-------------------------------------------------------------------------------- */
     //this.populateClientCase();
    
     this.populateClientRace();
     
    /*-------------------------------------------------------------------------------- */

  }

  private populateClient(){
    if(this.applicantInfo.client == undefined){
      this.applicantInfo.client = new Client;
    }
      this.applicantInfo.client.firstName = this.appInfoForm.controls["firstName"].value.trim()===''?null:this.appInfoForm.controls["firstName"].value;
      if(this.appInfoForm.controls["chkmiddleName"].value == true){
        this.applicantInfo.client.middleName =null;
        this.applicantInfo.client.noMiddleInitialFlag = StatusFlag.Yes;
      }
      else{
        this.applicantInfo.client.middleName = this.appInfoForm.controls["middleName"].value.trim() === ''?null:this.appInfoForm.controls["middleName"].value.trim();
        this.applicantInfo.client.noMiddleInitialFlag = StatusFlag.No;
      }   
      this.applicantInfo.client.lastName = this.appInfoForm.controls["lastName"].value.trim()===''?null:this.appInfoForm.controls["lastName"].value; 
      var dob =  this.appInfoForm.controls["dateOfBirth"].value;
      if(this.clientCaseEligibilityId != null){
        this.applicantInfo.client.dob = new Date(dob.getUTCFullYear(), dob.getUTCMonth(),dob.getUTCDate() + 1, 
        dob.getUTCHours(), dob.getUTCMinutes(), dob.getUTCSeconds()
        );
      }  
      else{
        this.applicantInfo.client.dob = this.appInfoForm.controls["dateOfBirth"].value;
      }
      this.applicantInfo.client.genderAtBirthCode = this.appInfoForm.controls["BirthGender"].value;
      if (this.applicantInfo.client.genderAtBirthCode===PronounCode.notListed) {
        this.applicantInfo.client.genderAtBirthDesc = this.appInfoForm.controls["BirthGenderDescription"].value;
      }

   
      if(this.appInfoForm.controls["ssnNotApplicable"].value){
        this.applicantInfo.client.ssn = null;
        this.applicantInfo.client.ssnNotApplicableFlag =StatusFlag.Yes;
      }
      else{
        this.applicantInfo.client.ssn = this.appInfoForm.controls["ssn"].value.trim()===''?null:this.appInfoForm.controls["ssn"].value;
        this.applicantInfo.client.ssnNotApplicableFlag =StatusFlag.No;
      } 
  }
 
  private populateClientCaseEligibility(){
        if(this.applicantInfo.clientCaseEligibilityAndFlag === undefined){
          this.applicantInfo.clientCaseEligibilityAndFlag = new ClientCaseEligibilityAndFlag
        }
        if(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility == undefined){
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility = new ClientCaseEligibility;
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.clientCaseId = this.clientCaseId;            
        }    
        
           this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.clientTransgenderCode=this.appInfoForm.controls["Transgender"].value;
           if (this.appInfoForm.controls["Transgender"].value===PronounCode.notListed) {
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.clientTransgenderDesc=this.appInfoForm.controls["TransgenderDescription"].value;
           }
        if(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag == undefined){
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag = new clientCaseEligibilityFlag;
        }
        
        if(this.appInfoForm.controls["prmInsNotApplicable"].value){
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceFirstName = null;
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceLastName = null;
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.insuranceNameNotApplicableFlag = StatusFlag.Yes;
        }
        else{
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceFirstName = this.appInfoForm.controls["prmInsFirstName"].value.trim()===''?null:this.appInfoForm.controls["prmInsFirstName"].value;
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceLastName = this.appInfoForm.controls["prmInsLastName"].value.trim()===''?null:this.appInfoForm.controls["prmInsLastName"].value;
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.insuranceNameNotApplicableFlag = StatusFlag.No;
        }
        if(this.appInfoForm.controls["officialIdsNotApplicable"].value){
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdFirstName = null;
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdLastName = null;;
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.officialIdNameNotApplicableFlag = StatusFlag.Yes;
        }
        else{
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdFirstName = this.appInfoForm.controls["officialIdFirstName"].value.trim()===''?null:this.appInfoForm.controls["officialIdFirstName"].value;
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdLastName = this.appInfoForm.controls["officialIdLastName"].value.trim()===''?null:this.appInfoForm.controls["officialIdLastName"].value;
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.officialIdNameNotApplicableFlag = StatusFlag.No;
        }    
    
        if(this.appInfoForm.controls["registerToVote"].value.toUpperCase() === StatusFlag.Yes){
        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.registerToVoteFlag = StatusFlag.Yes;
        }
        else{
        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.registerToVoteFlag = StatusFlag.No;
        }

        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.materialInAlternateFormatCode = this.appInfoForm.controls["materialInAlternateFormatCode"].value
        if(this.appInfoForm.controls["materialInAlternateFormatCode"].value !== null && 
        this.appInfoForm.controls["materialInAlternateFormatCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()){
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.materialInAlternateFormatDesc = this.appInfoForm.controls["materialInAlternateFormatDesc"].value
            if(this.applicantInfo.clientCaseEligibilityAndFlag?.clientCaseEligibility?.materialInAlternateFormatDesc?.toUpperCase()===MaterialFormat.other.toUpperCase()){
              this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.materialInAlternateFormatOther = this.appInfoForm.controls["materialInAlternateFormatOther"].value;
            }  
            else{
              this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.materialInAlternateFormatOther = null;
            }         
        }
        else{
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.materialInAlternateFormatDesc = null;
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.materialInAlternateFormatOther = null;
        }

        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.interpreterCode = this.appInfoForm.controls["interpreterCode"].value
        if(this.appInfoForm.controls["interpreterCode"].value !== null && 
        this.appInfoForm.controls["interpreterCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()){
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.interpreterType = this.appInfoForm.controls["interpreterType"].value
        }
        else{
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.interpreterType = '';
        }

        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.deafOrHearingCode = this.appInfoForm.controls["deafOrHearingCode"].value
        if(this.appInfoForm.controls["deafOrHearingCode"].value !== null && 
        this.appInfoForm.controls["deafOrHearingCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()){
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeDeafOrHearing = this.appInfoForm.controls["startAgeDeafOrHearing"].value
        }
        else{
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeDeafOrHearing = null;
        }
        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.blindSeeingCode = this.appInfoForm.controls["blindSeeingCode"].value
        if(this.appInfoForm.controls["blindSeeingCode"].value !== null && 
        this.appInfoForm.controls["blindSeeingCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()){
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeBlindSeeing = this.appInfoForm.controls["startAgeBlindSeeing"].value
        }
        else{
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeBlindSeeing = null;
        }

        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.limitingConditionCode = this.appInfoForm.controls["limitingConditionCode"].value
      

        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.walkingClimbingDifficultyCode = this.appInfoForm.controls["walkingClimbingDifficultyCode"].value
        if(this.appInfoForm.controls["walkingClimbingDifficultyCode"].value !== null && 
        this.appInfoForm.controls["walkingClimbingDifficultyCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()){
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeWalkingClimbingDifficulty = this.appInfoForm.controls["startAgeWalkingClimbingDifficulty"].value
        }
        else{
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeWalkingClimbingDifficulty = null;
        }

        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.dressingBathingDifficultyCode = this.appInfoForm.controls["dressingBathingDifficultyCode"].value
        if(this.appInfoForm.controls["dressingBathingDifficultyCode"].value !== null && 
        this.appInfoForm.controls["dressingBathingDifficultyCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()){
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeDressingBathingDifficulty = this.appInfoForm.controls["startAgeDressingBathingDifficulty"].value
        }
        else{
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeDressingBathingDifficulty = null;
        }

        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.concentratingDifficultyCode = this.appInfoForm.controls["concentratingDifficultyCode"].value
        if(this.appInfoForm.controls["concentratingDifficultyCode"].value !== null && 
        this.appInfoForm.controls["concentratingDifficultyCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()){
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeConcentratingDifficulty = this.appInfoForm.controls["startAgeConcentratingDifficulty"].value
        }
        else{
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeConcentratingDifficulty = null;
        }

        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.errandsDifficultyCode = this.appInfoForm.controls["errandsDifficultyCode"].value
        if(this.appInfoForm.controls["errandsDifficultyCode"].value !== null && 
        this.appInfoForm.controls["errandsDifficultyCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()){
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeErrandsDifficulty = this.appInfoForm.controls["startAgeErrandsDifficulty"].value
        }
        else{
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeErrandsDifficulty = null;
        }
        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.spokenLanguageCode =  this.appInfoForm.controls["spokenLanguage"].value;
        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.writtenLanguageCode =  this.appInfoForm.controls["writtenLanguage"].value;
        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.englishProficiencyCode = this.appInfoForm.controls["englishProficiency"].value;


      
  }
  private populateClientPronoun(){
    if(this.applicantInfo.clientPronounList == undefined){
      this.applicantInfo.clientPronounList = [];
    }
    Object.keys( this.appInfoForm.controls).filter(m=>m.includes('pronoun')).forEach(pronoun => { 
      if( this.appInfoForm.controls[pronoun].value ===""
         ||this.appInfoForm.controls[pronoun].value === null
         ||this.appInfoForm.controls[pronoun].value ===false){
          var pronounCode= pronoun.replace(ControlPrefix.pronoun,'');
          var existingPronoun = this.applicantInfo.clientPronounList.find(x=>x.clientPronounCode ===pronounCode)
        if(existingPronoun != null){
           const index = this.applicantInfo.clientPronounList.indexOf(existingPronoun, 0);
          if (index > -1) {
            this.applicantInfo.clientPronounList.splice(index, 1);
          }
        }

      }
     else{
      var pronounCode= pronoun.replace(ControlPrefix.pronoun,'');
      var existingPronoun = this.applicantInfo.clientPronounList.find(x=>x.clientPronounCode ===pronounCode)     
      if(existingPronoun === null || existingPronoun === undefined){
          var clientPronoun = new ClientPronoun();
          if(pronounCode === PronounCode.notListed) {
                    var pronounCode= pronoun.replace(ControlPrefix.pronoun,'');
                    clientPronoun.otherDesc = this.appInfoForm.controls["pronoun"].value;
                    clientPronoun.clientPronounCode =pronounCode;
                    clientPronoun.clientId = this.clientId;
            }
            else{
              var pronounCode= pronoun.replace(ControlPrefix.pronoun,'');
              clientPronoun.clientPronounCode =pronounCode;
              clientPronoun.clientId = this.clientId;
            } 
            this.applicantInfo.clientPronounList.push(clientPronoun);
        }
        else{
          var pronounCode= pronoun.replace(ControlPrefix.pronoun,'');
          if(pronounCode===PronounCode.notListed) {
            const index = this.applicantInfo.clientPronounList.indexOf(existingPronoun, 0);          
            this.applicantInfo.clientPronounList[index].clientPronounCode = pronounCode;
            this.applicantInfo.clientPronounList[index].otherDesc = this.appInfoForm.controls["pronoun"].value;
           }
        }


     }   
      
  });      
  
  }
  
  private populateClientGender(){
    const clientGenderListSaved = this.applicantInfo.clientGenderList;// this is in case of update record
    this.applicantInfo.clientGenderList=[];
     Object.keys( this.appInfoForm.controls).filter(m=>m.includes('Gender')).forEach(control => {
       if (this.appInfoForm.controls[control].value===true) {
         control= control.replace('Gender','');
         let clientGender = new ClientGender();
         clientGender.clientGenderCode =control;
         clientGender.clientId = this.clientId;
         if(clientGender.clientGenderCode===PronounCode.notListed){
           clientGender.otherDesc=this.appInfoForm.controls['GenderDescription'].value;
         }
         const Existing=clientGenderListSaved.find(m=>m.clientGenderCode===clientGender.clientGenderCode);
         if (Existing!==undefined) {
           clientGender=Existing;
         }
         this.applicantInfo.clientGenderList.push(clientGender);
       }
     });
}
  private populateClientRace() {
    this.applicantInfo.clientRaceList = [];
    //const clientRaceListSaved = this.applicantInfo.clientRaceList;// this is in case of update record
    const RaceAndEthnicity = this.appInfoForm.controls['RaceAndEthnicity'].value;
    const Ethnicity = [];
    let ethnicityValue=this.appInfoForm.controls['Ethnicity'].value;
    Ethnicity.push(ethnicityValue);
    const RaceAndEthnicityPrimary = this.appInfoForm.controls['RaceAndEthnicityPrimary'].value;
    var checkPrimaryInRaceList=RaceAndEthnicity.filter((lov:any)=>lov.lovCode==RaceAndEthnicityPrimary.lovCode);
    if(checkPrimaryInRaceList.length==0){
      RaceAndEthnicity.push(RaceAndEthnicityPrimary);
    }
    RaceAndEthnicity.forEach((el: any) => {
      const clientRace = new ClientRace();
      clientRace.clientRaceCategoryCode =el.lovCode;
      clientRace.clientEthnicIdentityCode = "";
      if (RaceAndEthnicityPrimary.lovCode===el.lovCode)
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
      // const Existing=clientRaceListSaved.find(m=>m.clientEthnicIdentityCode===el.clientGenderCode);
      //    if (Existing!==undefined) {
      //     clientRace=Existing;
      //    }
      this.applicantInfo.clientRaceList.push(clientRace)
    });
  }
  private populateClientSexualIdentity() {
    this.applicantInfo.clientSexualIdentityList = [];
    Object.keys(this.appInfoForm.controls).filter(m => m.includes('SexulaIdentity')).forEach(control => {
      if (this.appInfoForm.controls[control].value === true) {
        control = control.replace('SexulaIdentity', '');
        const clientSexualIdentity = new ClientSexualIdentity();
        clientSexualIdentity.clientSexualIdentityCode = control;
        clientSexualIdentity.clientId = this.clientId;
        if (clientSexualIdentity.clientSexualIdentityCode === PronounCode.notListed) {
          clientSexualIdentity.otherDesc = this.appInfoForm.controls['SexulaIdentityDescription'].value;
        }

        this.applicantInfo.clientSexualIdentityList.push(clientSexualIdentity);
      }
    });
  }




  /** Public  methods **/
  updatePageCount(data: { completedDataPoints: CompletionChecklist[], updateWorkflowCount: boolean}) {
    if (data?.completedDataPoints?.length > 0) {
      this.workFlowFacade.updateChecklist(data?.completedDataPoints, data?.updateWorkflowCount);
    }
  }

  updateAdjustmentAttrCount(ajustData: CompletionChecklist[]) {
   if(ajustData){
    this.workFlowFacade.updateBasedOnDtAttrChecklist(ajustData);
   }
  }

  private validateForm(){
    this.appInfoForm.markAllAsTouched();
    this.appInfoForm.updateValueAndValidity();
            this.appInfoForm.controls["firstName"].setValidators([Validators.required]);
            this.appInfoForm.controls["firstName"].updateValueAndValidity();
            this.appInfoForm.controls["dateOfBirth"].setValidators([Validators.required]);
            this.appInfoForm.controls["dateOfBirth"].updateValueAndValidity();
        if(this.appInfoForm.controls["chkmiddleName"].value  ){
              this.appInfoForm.controls["middleName"].removeValidators(Validators.required);;
              this.appInfoForm.controls["middleName"].updateValueAndValidity();
        }
        else{
              this.appInfoForm.controls["middleName"].setValidators([Validators.required]);
              this.appInfoForm.controls["middleName"].updateValueAndValidity();
        }
            this.appInfoForm.controls["lastName"].setValidators([Validators.required]);
            this.appInfoForm.controls["lastName"].updateValueAndValidity();
        if(this.appInfoForm.controls["prmInsNotApplicable"].value){
              this.appInfoForm.controls["prmInsFirstName"].removeValidators(Validators.required);;
              this.appInfoForm.controls["prmInsFirstName"].updateValueAndValidity();    
              this.appInfoForm.controls["prmInsLastName"].removeValidators(Validators.required);;
              this.appInfoForm.controls["prmInsLastName"].updateValueAndValidity();    
        }
        else{
              this.appInfoForm.controls["prmInsFirstName"].setValidators(Validators.required);;
              this.appInfoForm.controls["prmInsFirstName"].updateValueAndValidity();  
              this.appInfoForm.controls["prmInsLastName"].setValidators(Validators.required);;
              this.appInfoForm.controls["prmInsLastName"].updateValueAndValidity();    
        }
        if(this.appInfoForm.controls["officialIdsNotApplicable"].value){
              this.appInfoForm.controls["officialIdFirstName"].removeValidators(Validators.required);;
              this.appInfoForm.controls["officialIdFirstName"].updateValueAndValidity();    
              this.appInfoForm.controls["officialIdLastName"].removeValidators(Validators.required);;
              this.appInfoForm.controls["officialIdLastName"].updateValueAndValidity();    
        }
        else{
              this.appInfoForm.controls["officialIdFirstName"].setValidators(Validators.required);;
              this.appInfoForm.controls["officialIdFirstName"].updateValueAndValidity();  
              this.appInfoForm.controls["officialIdLastName"].setValidators(Validators.required);;
              this.appInfoForm.controls["officialIdLastName"].updateValueAndValidity();    
        }
        if(this.appInfoForm.controls["ssnNotApplicable"].value){
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
        if(this.appInfoForm.controls["registerToVote"].value == null ||
               this.appInfoForm.controls["registerToVote"].value ==''){
              this.appInfoForm.controls["registerToVote"].setValidators(Validators.required);
              this.appInfoForm.controls["registerToVote"].updateValueAndValidity();    
        }
        else{
              this.appInfoForm.controls["registerToVote"].removeValidators(Validators.required);;
              this.appInfoForm.controls["registerToVote"].updateValueAndValidity();   
          }  
          this.appInfoForm.controls["pronouns"].setValidators(Validators.required);
          this.appInfoForm.controls["pronouns"].updateValueAndValidity(); 
          Object.keys( this.appInfoForm.controls).filter(m=>m.includes(ControlPrefix.pronoun)).forEach(pronoun => { 
            if(this.appInfoForm.controls[pronoun].value ===true){
              this.appInfoForm.controls['pronouns'].setErrors(null);
            }
          });
          if(this.appInfoForm.controls['pronouns'].valid){   
              Object.keys( this.appInfoForm.controls).filter(m=>m.includes(ControlPrefix.pronoun)).forEach(pronoun => {          
                this.appInfoForm.controls[pronoun].removeValidators(Validators.requiredTrue);
                this.appInfoForm.controls[pronoun].updateValueAndValidity();
                var pronounCode =   pronoun.replace('ControlPrefix.pronoun','');
                if(pronounCode === PronounCode.notListed && this.appInfoForm.controls[pronoun].value){
                  this.appInfoForm.controls['pronoun'].setValidators(Validators.required);
                  this.appInfoForm.controls['pronoun'].updateValueAndValidity();
                }               
            });
          }
          if(!this.appInfoForm.controls['pronouns'].valid){
            Object.keys( this.appInfoForm.controls).filter(m=>m.includes(ControlPrefix.pronoun)).forEach(pronoun => { 
                this.appInfoForm.controls[pronoun].setValidators(Validators.requiredTrue);
                this.appInfoForm.controls[pronoun].updateValueAndValidity();
            });
          }
          this.appInfoForm.controls['materialInAlternateFormatCode'].setValidators(Validators.required);
          this.appInfoForm.controls['materialInAlternateFormatCode'].updateValueAndValidity();
            if( this.appInfoForm.controls['materialInAlternateFormatCode'].value  !=='' &&
                this.appInfoForm.controls['materialInAlternateFormatCode'].value !== null){
                this.appInfoForm.controls['materialInAlternateFormatCode'].setErrors(null);
                this.appInfoForm.controls['materialInAlternateFormatCode'].updateValueAndValidity();
                if( this.appInfoForm.controls['materialInAlternateFormatCode'].value.toUpperCase() ==YesNoFlag.Yes.toUpperCase()){
                  this.appInfoForm.controls['materialInAlternateFormatDesc'].setValidators(Validators.required);
                  this.appInfoForm.controls['materialInAlternateFormatDesc'].updateValueAndValidity();
                  if(
                    (this.appInfoForm.controls['materialInAlternateFormatDesc'].value !== null
                    && this.appInfoForm.controls['materialInAlternateFormatDesc'].value.toUpperCase() === MaterialFormat.other.toUpperCase())
                  && this.appInfoForm.controls['materialInAlternateFormatOther'].value ===null 
                  || this.appInfoForm.controls['materialInAlternateFormatOther'].value ===undefined
                  || this.appInfoForm.controls['materialInAlternateFormatOther'].value ===''){
                    this.appInfoForm.controls['materialInAlternateFormatOther'].setValidators(Validators.required);
                    this.appInfoForm.controls['materialInAlternateFormatOther'].updateValueAndValidity();
                  }
                }
                
              }    
          this.appInfoForm.controls['interpreterCode'].setValidators(Validators.required);
          this.appInfoForm.controls['interpreterCode'].updateValueAndValidity();
           if( this.appInfoForm.controls['interpreterCode'].value  !=='' &&
                this.appInfoForm.controls['interpreterCode'].value !== null){
                this.appInfoForm.controls['interpreterCode'].setErrors(null);
                this.appInfoForm.controls['interpreterCode'].updateValueAndValidity();
                if( this.appInfoForm.controls['interpreterCode'].value.toUpperCase() ==YesNoFlag.Yes.toUpperCase()){
                  this.appInfoForm.controls['interpreterType'].setValidators(Validators.required);
                  this.appInfoForm.controls['interpreterType'].updateValueAndValidity();
                }
                
           } 
           this.appInfoForm.controls['deafOrHearingCode'].setValidators(Validators.required);
           this.appInfoForm.controls['deafOrHearingCode'].updateValueAndValidity();
           if( this.appInfoForm.controls['deafOrHearingCode'].value  !=='' &&
                this.appInfoForm.controls['deafOrHearingCode'].value !== null){
                this.appInfoForm.controls['deafOrHearingCode'].setErrors(null);
                this.appInfoForm.controls['deafOrHearingCode'].updateValueAndValidity();
                if( this.appInfoForm.controls['deafOrHearingCode'].value.toUpperCase() ==YesNoFlag.Yes.toUpperCase()){
                  this.appInfoForm.controls['startAgeDeafOrHearing'].setValidators(Validators.required);
                  this.appInfoForm.controls['startAgeDeafOrHearing'].updateValueAndValidity();
                }
                
            } 
           this.appInfoForm.controls['blindSeeingCode'].setValidators(Validators.required);
           this.appInfoForm.controls['blindSeeingCode'].updateValueAndValidity();
            if( this.appInfoForm.controls['blindSeeingCode'].value  !=='' &&
                this.appInfoForm.controls['blindSeeingCode'].value !== null){
                this.appInfoForm.controls['blindSeeingCode'].setErrors(null);
                this.appInfoForm.controls['blindSeeingCode'].updateValueAndValidity();
                if( this.appInfoForm.controls['blindSeeingCode'].value.toUpperCase() ==YesNoFlag.Yes.toUpperCase()){
                  this.appInfoForm.controls['startAgeBlindSeeing'].setValidators(Validators.required);
                  this.appInfoForm.controls['startAgeBlindSeeing'].updateValueAndValidity();
                }
                
            } 
            this.appInfoForm.controls['limitingConditionCode'].setValidators(Validators.required);
            this.appInfoForm.controls['limitingConditionCode'].updateValueAndValidity();
            if( this.appInfoForm.controls['limitingConditionCode'].value  !=='' &&
                this.appInfoForm.controls['limitingConditionCode'].value !== null){
                this.appInfoForm.controls['limitingConditionCode'].setErrors(null);
                this.appInfoForm.controls['limitingConditionCode'].updateValueAndValidity();
              } 
             this.appInfoForm.controls['walkingClimbingDifficultyCode'].setValidators(Validators.required);
             this.appInfoForm.controls['walkingClimbingDifficultyCode'].updateValueAndValidity();
              if( this.appInfoForm.controls['walkingClimbingDifficultyCode'].value  !=='' &&
                  this.appInfoForm.controls['walkingClimbingDifficultyCode'].value !== null){
                  this.appInfoForm.controls['walkingClimbingDifficultyCode'].setErrors(null);
                  this.appInfoForm.controls['walkingClimbingDifficultyCode'].updateValueAndValidity();
                  if( this.appInfoForm.controls['walkingClimbingDifficultyCode'].value.toUpperCase() ==YesNoFlag.Yes.toUpperCase()){
                    this.appInfoForm.controls['startAgeWalkingClimbingDifficulty'].setValidators(Validators.required);
                    this.appInfoForm.controls['startAgeWalkingClimbingDifficulty'].updateValueAndValidity();
                  }
                  
              } 
              this.appInfoForm.controls['dressingBathingDifficultyCode'].setValidators(Validators.required);
              this.appInfoForm.controls['dressingBathingDifficultyCode'].updateValueAndValidity();
              if( this.appInfoForm.controls['dressingBathingDifficultyCode'].value  !=='' &&
                  this.appInfoForm.controls['dressingBathingDifficultyCode'].value !== null){
                  this.appInfoForm.controls['dressingBathingDifficultyCode'].setErrors(null);
                  this.appInfoForm.controls['dressingBathingDifficultyCode'].updateValueAndValidity();
                  if( this.appInfoForm.controls['dressingBathingDifficultyCode'].value.toUpperCase() ==YesNoFlag.Yes.toUpperCase()){
                    this.appInfoForm.controls['startAgeDressingBathingDifficulty'].setValidators(Validators.required);
                    this.appInfoForm.controls['startAgeDressingBathingDifficulty'].updateValueAndValidity();
                  }
                  
              } 
              this.appInfoForm.controls['concentratingDifficultyCode'].setValidators(Validators.required);
              this.appInfoForm.controls['concentratingDifficultyCode'].updateValueAndValidity();
              if( this.appInfoForm.controls['concentratingDifficultyCode'].value  !=='' &&
                  this.appInfoForm.controls['concentratingDifficultyCode'].value !== null){
                  this.appInfoForm.controls['concentratingDifficultyCode'].setErrors(null);
                  this.appInfoForm.controls['concentratingDifficultyCode'].updateValueAndValidity();
                  if( this.appInfoForm.controls['concentratingDifficultyCode'].value.toUpperCase() ==YesNoFlag.Yes.toUpperCase()){
                    this.appInfoForm.controls['startAgeConcentratingDifficulty'].setValidators(Validators.required);
                    this.appInfoForm.controls['startAgeConcentratingDifficulty'].updateValueAndValidity();
                  }
                  
              } 
              this.appInfoForm.controls['errandsDifficultyCode'].setValidators(Validators.required);
              this.appInfoForm.controls['errandsDifficultyCode'].updateValueAndValidity();
              if( this.appInfoForm.controls['errandsDifficultyCode'].value  !=='' &&
                  this.appInfoForm.controls['errandsDifficultyCode'].value !== null){
                  this.appInfoForm.controls['errandsDifficultyCode'].setErrors(null);
                  this.appInfoForm.controls['errandsDifficultyCode'].updateValueAndValidity();
                  if( this.appInfoForm.controls['errandsDifficultyCode'].value.toUpperCase() ==YesNoFlag.Yes.toUpperCase()){
                    this.appInfoForm.controls['startAgeErrandsDifficulty'].setValidators(Validators.required);
                    this.appInfoForm.controls['startAgeErrandsDifficulty'].updateValueAndValidity();
                  }
                  
              } 

              this.appInfoForm.controls['spokenLanguage'].setValidators(Validators.required);              
              if( this.appInfoForm.controls['spokenLanguage'].value  !=='' ||
                  this.appInfoForm.controls['spokenLanguage'].value !== null){
                  this.appInfoForm.controls['spokenLanguage'].setErrors(null);
              }               
              this.appInfoForm.controls['spokenLanguage'].updateValueAndValidity();

              this.appInfoForm.controls['writtenLanguage'].setValidators(Validators.required);              
              if( this.appInfoForm.controls['writtenLanguage'].value  !=='' ||
                  this.appInfoForm.controls['writtenLanguage'].value !== null){
                  this.appInfoForm.controls['writtenLanguage'].setErrors(null);
              }               
              this.appInfoForm.controls['writtenLanguage'].updateValueAndValidity();

              this.appInfoForm.controls['englishProficiency'].setValidators(Validators.required);              
              if( this.appInfoForm.controls['englishProficiency'].value  !=='' ||
                  this.appInfoForm.controls['englishProficiency'].value !== null){
                  this.appInfoForm.controls['englishProficiency'].setErrors(null);
              }               
              this.appInfoForm.controls['englishProficiency'].updateValueAndValidity();

              this.appInfoForm.controls['RaceAndEthnicity'].setValidators(Validators.required);
              this.appInfoForm.controls['RaceAndEthnicity'].updateValueAndValidity(); 
              const raceAndEthnicity=this.appInfoForm.controls['RaceAndEthnicity'].value;
              if(Array.isArray(raceAndEthnicity)){
                const raceAndEthnicityNotListed=raceAndEthnicity.some((m:any)=>m.lovCode==='NOT_LISTED');
                if(raceAndEthnicityNotListed){
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

              this.appInfoForm.controls['Transgender'].setValidators(Validators.required); 
              this.appInfoForm.controls['Transgender'].updateValueAndValidity(); 

              this.appInfoForm.controls['SexulaIdentityGroup'].setValidators(Validators.required); 
              this.appInfoForm.controls['SexulaIdentityGroup'].updateValueAndValidity(); 

              this.appInfoForm.controls['BirthGender'].setValidators(Validators.required); 
              this.appInfoForm.controls['BirthGender'].updateValueAndValidity();

    
          this.appInfoForm.updateValueAndValidity();
  }
  setAppInfoForm(appInfoForm:FormGroup)
  {
    this.appInfoForm = appInfoForm;
  }
 
  setApplicantName(name:any){
    this.applicantName =name;
  }

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workFlowFacade.saveForLaterClicked$.pipe(
      mergeMap((statusResponse: boolean) =>
        forkJoin([of(statusResponse), this.saveAndUpdate()])
      ),
    ).subscribe(([statusResponse, isSaved]) => {
      if (isSaved) {
        this.loaderService.hide();
        this.router.navigate([`/case-management/cases/case360/${this.clientCaseId}`])
      }
    });
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription = this.workFlowFacade.saveForLaterValidationClicked$.subscribe((val) => {
      if (val) {
        if(this.checkValidations()){
          this.workFlowFacade.showSaveForLaterConfirmationPopup(true);
        }
      }
    });
  }

  checkValidations(){
    this.validateForm();
    return this.appInfoForm.valid;
  }

}
