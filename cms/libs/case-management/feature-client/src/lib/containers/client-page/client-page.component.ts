/** Angular **/
import { OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
/** External libraries **/
import { first, forkJoin, last, mergeMap, of, Subscription } from 'rxjs';
/** Facade **/
import { WorkflowFacade, ClientFacade, ApplicantInfo, Client, ClientCaseEligibility, StatusFlag, ClientPronoun, ClientGender, ClientRace, ClientSexualIdentity, clientCaseEligibilityFlag, ClientCaseEligibilityAndFlag, CaseFacade, YesNoFlag } from '@cms/case-management/domain';
/** Entities **/
import { CompletionChecklist } from '@cms/case-management/domain';
/** Enums **/
import { NavigationType } from '@cms/case-management/domain';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';



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
 
    /** Constructor **/
  constructor(private workFlowFacade: WorkflowFacade,
              private clientFacade: ClientFacade, 
              private route: ActivatedRoute,
              private readonly caseFacade: CaseFacade,
              ) { }


  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadSessionData();
    this.addSaveSubscription();
    
  }
  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.loadSessionSubscription.unsubscribe();
  }

  /** Private methods **/
  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workFlowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.saveAndUpdate()])
      ),
    ).subscribe(([navigationType, isSaved]) => {  
      next:{
        if (isSaved) {
          this.workFlowFacade.navigate(navigationType);
        }
      }    
      error:{
           console.log("error")
      }
     
    });
    
  }
  private loadSessionData()
  {  
   this.applicantInfo.clientPronounList= [];
   this.sessionId = this.route.snapshot.queryParams['sid'];    
   this.workFlowFacade.loadWorkFlowSessionData(this.sessionId)
   this.loadSessionSubscription = this.workFlowFacade.sessionDataSubject$ .pipe(first(sessionData => sessionData.sessionData != null))
    .subscribe((session: any) => {
      this.applicantInfo = new ApplicantInfo();
      this.clientFacade.applicationInfoSubject.next(this.applicantInfo);
      if(session !== null && session !== undefined && session.sessionData !==undefined){
     this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId 
     this.clientId = JSON.parse(session.sessionData).clientId; 
     this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId   
      if(this.clientCaseId  !==null || this.clientCaseId !== undefined){
        this.applicantInfo.clientCaseId = this.clientCaseId
        this.applicantInfo.workFlowSessionId = this.sessionId;      
        if(this.clientCaseEligibilityId != null || this.clientCaseEligibilityId !=undefined){
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
                clientRace.raceDesc = x.raceDesc
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
          console.error(error);
        }
      });

  }

  private saveAndUpdate(){
    this.validateForm();
        if(this.appInfoForm.valid){
          this.populateApplicantInfoModel();
          if(this.clientCaseEligibilityId !== null && this.clientCaseEligibilityId !== undefined)  {
            return this.clientFacade.update(this.applicantInfo)            
          }
          else{
            return this.clientFacade.save(this.applicantInfo)        
          }          
        }
        else{
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
      this.applicantInfo.client.firstName = this.appInfoForm.controls["firstName"].value;
      if(this.appInfoForm.controls["chkmiddleName"].value == true){
        this.applicantInfo.client.middleName =null;
        this.applicantInfo.client.noMiddleInitialFlag = StatusFlag.Yes;
      }
      else{
        this.applicantInfo.client.middleName = this.appInfoForm.controls["middleName"].value;
        this.applicantInfo.client.noMiddleInitialFlag = StatusFlag.No;
      }   
      this.applicantInfo.client.lastName = this.appInfoForm.controls["lastName"].value;   
      this.applicantInfo.client.dob = this.appInfoForm.controls["dateOfBirth"].value;
      this.applicantInfo.client.genderAtBirthCode = this.appInfoForm.controls["BirthGender"].value;
      if (this.applicantInfo.client.genderAtBirthCode==='NOT_LISTED') {
        this.applicantInfo.client.genderAtBirthDesc = this.appInfoForm.controls["BirthGenderDescription"].value;
      }

   
      if(this.appInfoForm.controls["ssnNotApplicable"].value){
        this.applicantInfo.client.ssn = null;
        this.applicantInfo.client.ssnNotApplicableFlag =StatusFlag.Yes;
      }
      else{
        this.applicantInfo.client.ssn = this.appInfoForm.controls["ssn"].value;
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
           if (this.appInfoForm.controls["Transgender"].value==='NOT_LISTED') {
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.clientTransgenderDesc=this.appInfoForm.controls["TransgenderDescription"].value;
           }
        if(this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag == undefined){
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag = new clientCaseEligibilityFlag;
        }
        
        if(this.appInfoForm.controls["prmInsNotApplicable"].value){
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceFirstName = '';
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceLastName = '';
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.insuranceNameNotApplicableFlag = StatusFlag.Yes;
        }
        else{
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceFirstName = this.appInfoForm.controls["prmInsFirstName"].value
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceLastName = this.appInfoForm.controls["prmInsLastName"].value
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.insuranceNameNotApplicableFlag = StatusFlag.No;
        }
        if(this.appInfoForm.controls["officialIdsNotApplicable"].value){
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdFirstName = '';
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdLastName = '';
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.officialIdNameNotApplicableFlag = StatusFlag.Yes;
        }
        else{
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdFirstName = this.appInfoForm.controls["officialIdFirstName"].value
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdLastName = this.appInfoForm.controls["officialIdLastName"].value
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
        }
        else{
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.materialInAlternateFormatDesc = '';
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
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeDeafOrHearing = 0;
        }

        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.blindSeeingCode = this.appInfoForm.controls["blindSeeingCode"].value
        if(this.appInfoForm.controls["blindSeeingCode"].value !== null && 
        this.appInfoForm.controls["blindSeeingCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()){
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeBlindSeeing = this.appInfoForm.controls["startAgeBlindSeeing"].value
        }
        else{
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeBlindSeeing = 0;
        }

        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.limitingConditionCode = this.appInfoForm.controls["limitingConditionCode"].value
      

        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.walkingClimbingDifficultyCode = this.appInfoForm.controls["walkingClimbingDifficultyCode"].value
        if(this.appInfoForm.controls["walkingClimbingDifficultyCode"].value !== null && 
        this.appInfoForm.controls["walkingClimbingDifficultyCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()){
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeWalkingClimbingDifficulty = this.appInfoForm.controls["startAgeWalkingClimbingDifficulty"].value
        }
        else{
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeWalkingClimbingDifficulty = 0;
        }

        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.dressingBathingDifficultyCode = this.appInfoForm.controls["dressingBathingDifficultyCode"].value
        if(this.appInfoForm.controls["dressingBathingDifficultyCode"].value !== null && 
        this.appInfoForm.controls["dressingBathingDifficultyCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()){
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeDressingBathingDifficulty = this.appInfoForm.controls["startAgeDressingBathingDifficulty"].value
        }
        else{
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeDressingBathingDifficulty = 0;
        }

        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.concentratingDifficultyCode = this.appInfoForm.controls["concentratingDifficultyCode"].value
        if(this.appInfoForm.controls["concentratingDifficultyCode"].value !== null && 
        this.appInfoForm.controls["concentratingDifficultyCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()){
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeConcentratingDifficulty = this.appInfoForm.controls["startAgeConcentratingDifficulty"].value
        }
        else{
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeConcentratingDifficulty = 0;
        }

        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.errandsDifficultyCode = this.appInfoForm.controls["errandsDifficultyCode"].value
        if(this.appInfoForm.controls["errandsDifficultyCode"].value !== null && 
        this.appInfoForm.controls["errandsDifficultyCode"].value.toUpperCase() === YesNoFlag.Yes.toUpperCase()){
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeErrandsDifficulty = this.appInfoForm.controls["startAgeErrandsDifficulty"].value
        }
        else{
          this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.startAgeErrandsDifficulty = 0;
        }
        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.spokenLanguageCode =  this.appInfoForm.controls["spokenLanguage"].value;
        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.writtenLanguageCode =  this.appInfoForm.controls["writtenLanguage"].value;
        this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.englishProficiencyCode = this.appInfoForm.controls["englishProficiency"].value;


      
  }
  private populateClientPronoun(){
    if(this.applicantInfo.clientPronounList == undefined){
      this.applicantInfo.clientPronounList = [];
    }
    this.pronounList.forEach((pronoun:any) => {      
      if( this.appInfoForm.controls[pronoun.lovCode].value ===""
         ||this.appInfoForm.controls[pronoun.lovCode].value === null
         ||this.appInfoForm.controls[pronoun.lovCode].value ===false){
          var existingPronoun = this.applicantInfo.clientPronounList.find(x=>x.clientPronounCode ===pronoun.lovCode)
        if(existingPronoun != null){
           const index = this.applicantInfo.clientPronounList.indexOf(existingPronoun, 0);
          if (index > -1) {
            this.applicantInfo.clientPronounList.splice(index, 1);
          }
        }

      }
     else{
      var existingPronoun = this.applicantInfo.clientPronounList.find(x=>x.clientPronounCode ===pronoun.lovCode)     
      if(existingPronoun === null || existingPronoun === undefined){
          var clientPronoun = new ClientPronoun();
          if(pronoun.lovCode=='NOT_LISTED') {
                    clientPronoun.otherDesc = this.appInfoForm.controls["NOT_LISTED"].value;
                    clientPronoun.clientPronounCode =pronoun.lovCode;
                    clientPronoun.clientId = this.clientId;
            }
            else{
              clientPronoun.clientPronounCode =pronoun.lovCode;
              clientPronoun.clientId = this.clientId;
            } 
            this.applicantInfo.clientPronounList.push(clientPronoun);
        }
        else{
          if(pronoun.lovCode=='NOT_LISTED') {
            const index = this.applicantInfo.clientPronounList.indexOf(existingPronoun, 0);          
            this.applicantInfo.clientPronounList[index].clientPronounCode = pronoun.lovCode;
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
         if(clientGender.clientGenderCode==='NOT_LISTED'){
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
  private populateClientRace(){
        /*Mocking the other required fields need to change as per the UI story progress/Get */
        /*--------------------------remove if------------------------------------------------------ */
        if(this.applicantInfo.clientRaceList.length ===0) {
            var clientRace = new ClientRace();
            clientRace.clientEthnicIdentityCode = 'American Indian or Alaska Native';
            clientRace.clientRaceCategoryCode = 'American Indian or Alaska Native';
            //clientRace.activeFlag = "Y";
            if(this.applicantInfo.clientRaceList == undefined){
              this.applicantInfo.clientRaceList =[];
            }
            clientRace.clientId = this.clientId;
            this.applicantInfo.clientRaceList.push(clientRace)
      }
        
        /*-------------------------------------------------------------------------------- */
  }
  private populateClientSexualIdentity() {
    this.applicantInfo.clientSexualIdentityList = [];
    Object.keys(this.appInfoForm.controls).filter(m => m.includes('SexulaIdentity')).forEach(control => {
      if (this.appInfoForm.controls[control].value === true) {
        control = control.replace('SexulaIdentity', '');
        const clientSexualIdentity = new ClientSexualIdentity();
        clientSexualIdentity.clientSexualIdentityCode = control;
        clientSexualIdentity.clientId = this.clientId;
        if (clientSexualIdentity.clientSexualIdentityCode === 'NOT_LISTED') {
          clientSexualIdentity.otherDesc = this.appInfoForm.controls['SexulaIdentityDescription'].value;
        }

        this.applicantInfo.clientSexualIdentityList.push(clientSexualIdentity);
      }
    });
  }




  /** Public  methods **/
  updatePageCount(completedDataPoints: CompletionChecklist[]) {
    if (completedDataPoints?.length > 0) {
      this.workFlowFacade.updateChecklist(completedDataPoints);
    }
  }

  updateAdjustmentAttrCount(ajustData: CompletionChecklist[]) {
   if(ajustData){
    this.workFlowFacade.updateBasedOnDtAttrChecklist(ajustData);
   }
  }

  private validateForm(){
    this.appInfoForm.updateValueAndValidity();
            this.appInfoForm.controls["firstName"].setValidators([Validators.required]);
            this.appInfoForm.controls["firstName"].updateValueAndValidity();
            this.appInfoForm.controls["dateOfBirth"].setErrors(null);
        if(this.appInfoForm.controls["chkmiddleName"].value ){
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
        else{
              this.appInfoForm.controls["ssn"].setValidators(Validators.required);;
              this.appInfoForm.controls["ssn"].updateValueAndValidity();    
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
          this.pronounList.forEach((pronoun:any) => {
            if(this.appInfoForm.controls[pronoun.lovCode].value ===true){
              this.appInfoForm.controls['pronouns'].setErrors(null);
            }
            
          });
          this.appInfoForm.controls['materialInAlternateFormatCode'].setValidators(Validators.required);
          this.appInfoForm.controls['materialInAlternateFormatCode'].updateValueAndValidity();
            if( this.appInfoForm.controls['materialInAlternateFormatCode'].value  !=='' ||
                this.appInfoForm.controls['materialInAlternateFormatCode'].value !== null){
                this.appInfoForm.controls['materialInAlternateFormatCode'].setErrors(null);
                this.appInfoForm.controls['materialInAlternateFormatCode'].updateValueAndValidity();
              }     
          this.appInfoForm.controls['interpreterCode'].setValidators(Validators.required);
          this.appInfoForm.controls['interpreterCode'].updateValueAndValidity();
           if( this.appInfoForm.controls['interpreterCode'].value  !=='' ||
                this.appInfoForm.controls['interpreterCode'].value !== null){
                this.appInfoForm.controls['interpreterCode'].setErrors(null);
                this.appInfoForm.controls['interpreterCode'].updateValueAndValidity();
           } 
           this.appInfoForm.controls['deafOrHearingCode'].setValidators(Validators.required);
           this.appInfoForm.controls['deafOrHearingCode'].updateValueAndValidity();
           if( this.appInfoForm.controls['deafOrHearingCode'].value  !=='' ||
                this.appInfoForm.controls['deafOrHearingCode'].value !== null){
                this.appInfoForm.controls['deafOrHearingCode'].setErrors(null);
                this.appInfoForm.controls['deafOrHearingCode'].updateValueAndValidity();
            } 
           this.appInfoForm.controls['blindSeeingCode'].setValidators(Validators.required);
           this.appInfoForm.controls['blindSeeingCode'].updateValueAndValidity();
            if( this.appInfoForm.controls['blindSeeingCode'].value  !=='' ||
                this.appInfoForm.controls['blindSeeingCode'].value !== null){
                this.appInfoForm.controls['blindSeeingCode'].setErrors(null);
                this.appInfoForm.controls['blindSeeingCode'].updateValueAndValidity();
            } 
            this.appInfoForm.controls['limitingConditionCode'].setValidators(Validators.required);
            this.appInfoForm.controls['limitingConditionCode'].updateValueAndValidity();
            if( this.appInfoForm.controls['limitingConditionCode'].value  !=='' ||
                this.appInfoForm.controls['limitingConditionCode'].value !== null){
                this.appInfoForm.controls['limitingConditionCode'].setErrors(null);
                this.appInfoForm.controls['limitingConditionCode'].updateValueAndValidity();
              } 
             this.appInfoForm.controls['walkingClimbingDifficultyCode'].setValidators(Validators.required);
             this.appInfoForm.controls['walkingClimbingDifficultyCode'].updateValueAndValidity();
              if( this.appInfoForm.controls['walkingClimbingDifficultyCode'].value  !=='' ||
                  this.appInfoForm.controls['walkingClimbingDifficultyCode'].value !== null){
                  this.appInfoForm.controls['walkingClimbingDifficultyCode'].setErrors(null);
                  this.appInfoForm.controls['walkingClimbingDifficultyCode'].updateValueAndValidity();
              } 
              this.appInfoForm.controls['dressingBathingDifficultyCode'].setValidators(Validators.required);
              this.appInfoForm.controls['dressingBathingDifficultyCode'].updateValueAndValidity();
              if( this.appInfoForm.controls['dressingBathingDifficultyCode'].value  !=='' ||
                  this.appInfoForm.controls['dressingBathingDifficultyCode'].value !== null){
                  this.appInfoForm.controls['dressingBathingDifficultyCode'].setErrors(null);
                  this.appInfoForm.controls['dressingBathingDifficultyCode'].updateValueAndValidity();
              } 
              this.appInfoForm.controls['concentratingDifficultyCode'].setValidators(Validators.required);
              this.appInfoForm.controls['concentratingDifficultyCode'].updateValueAndValidity();
              if( this.appInfoForm.controls['concentratingDifficultyCode'].value  !=='' ||
                  this.appInfoForm.controls['concentratingDifficultyCode'].value !== null){
                  this.appInfoForm.controls['concentratingDifficultyCode'].setErrors(null);
                  this.appInfoForm.controls['concentratingDifficultyCode'].updateValueAndValidity();
              } 
              this.appInfoForm.controls['errandsDifficultyCode'].setValidators(Validators.required);
              this.appInfoForm.controls['errandsDifficultyCode'].updateValueAndValidity();
              if( this.appInfoForm.controls['errandsDifficultyCode'].value  !=='' ||
                  this.appInfoForm.controls['errandsDifficultyCode'].value !== null){
                  this.appInfoForm.controls['errandsDifficultyCode'].setErrors(null);
                  this.appInfoForm.controls['errandsDifficultyCode'].updateValueAndValidity();
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
              
           
          this.appInfoForm.updateValueAndValidity();
  }
  setAppInfoForm(appInfoForm:FormGroup)
  {
    this.appInfoForm = appInfoForm;
  }
  setChangedPronoun(pronoun:any){
    this.pronounList = pronoun;
  }
  setApplicantName(name:any){
    this.applicantName =name;
  }
}
