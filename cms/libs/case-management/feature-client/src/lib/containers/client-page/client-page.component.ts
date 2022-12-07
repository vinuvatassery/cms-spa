/** Angular **/
import { OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
/** External libraries **/
import { first, forkJoin, last, mergeMap, of, Subscription } from 'rxjs';
/** Facade **/
import { WorkflowFacade, ClientFacade, ApplicantInfo, Client, ClientCaseEligibility, StatusFlag, ClientPronoun, ClientGender, ClientRace, ClientSexualIdentity, clientCaseEligibilityFlag, ClientCaseEligibilityAndFlag, CaseFacade } from '@cms/case-management/domain';
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
  applicatInfo = {} as ApplicantInfo;
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
      if (isSaved) {
        this.workFlowFacade.navigate(navigationType);
      }
    });
    
  }
  private loadSessionData()
  {  
   this.applicatInfo.clientPronounList= [];
   this.sessionId = this.route.snapshot.queryParams['sid'];    
   this.workFlowFacade.loadWorkFlowSessionData(this.sessionId)
   this.loadSessionSubscription = this.workFlowFacade.sessionDataSubject$ .pipe(first(sessionData => sessionData.sessionData != null))
    .subscribe((session: any) => {
      this.applicatInfo = new ApplicantInfo();
      this.clientFacade.applicationInfoSubject.next(this.applicatInfo);
      if(session !== null && session !== undefined && session.sessionData !==undefined){
     this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId 
     this.clientId = JSON.parse(session.sessionData).clientId; 
     this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId   
      if(this.clientCaseId  !==null || this.clientCaseId !== undefined){
        this.applicatInfo.clientCaseId = this.clientCaseId
        this.applicatInfo.workFlowSessionId = this.sessionId;      
        if(this.clientCaseEligibilityId != null || this.clientCaseEligibilityId !=undefined){
          if(  this.applicatInfo.client == undefined){
            this.applicatInfo.client = new Client;
          }
          if(  this.applicatInfo.clientCaseEligibilityAndFlag === undefined){
            this.applicatInfo.clientCaseEligibilityAndFlag = new ClientCaseEligibilityAndFlag;
            this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility = new ClientCaseEligibility;
          }
          if( this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility === undefined){
            this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility = new ClientCaseEligibility;
          }
          this.applicatInfo.client.clientId =this.clientId;
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.clientCaseEligibilityId = this.clientCaseEligibilityId;
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.clientCaseId = this.clientCaseId;
          this.loadApplicantInfo();
        }
      
      }
    }
     
    });   
    
  } 

  private loadApplicantInfo(){   
    if(  this.applicatInfo.client == undefined){
      this.applicatInfo.client = new Client;
    }

    if(  this.applicatInfo.clientCaseEligibilityAndFlag === undefined){
      this.applicatInfo.clientCaseEligibilityAndFlag = new ClientCaseEligibilityAndFlag;        
    }  
        this.clientFacade.load( this.clientCaseId,this.clientCaseEligibilityId).subscribe({       
          next: response => {           
            if(response !=null){  
                /**Populating Client */   
                this.applicatInfo.client = response.client; 

                /* Populate Client Case Eligibility */
                if(this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility ===undefined ){
                  this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility = new ClientCaseEligibility;   
                }
                this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility = response.clientCaseEligibilityAndFlag.clientCaseEligibility;
              
              /* Populate Client Case Eligibility Flag */
                if( this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag === undefined){
                  this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag = new clientCaseEligibilityFlag;
                }
                this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag = response.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag;

              /*Populate Client Gender */
              response.clientGenderList.forEach(x=>{
                var clientGender = new ClientGender()
                clientGender.activeFlag = x.activeFlag;
                clientGender.clientGenderCode = x.clientGenderCode;
                clientGender.clientGenderId = x.clientGenderId;
                clientGender.clientId = x.clientId;
                clientGender.concurrencyStamp = x.concurrencyStamp;
                clientGender.creationTime = x.creationTime;
                clientGender.creatorId = x.creatorId;
                clientGender.deleterId = x.deleterId;
                clientGender.deletionTime = x.deletionTime;
                clientGender.isDeleted = x.isDeleted;
                clientGender.lastModificationTime = x.lastModificationTime;
                if(this.applicatInfo.clientGenderList == undefined || null ){
                  this.applicatInfo.clientGenderList = []
                }
                this.applicatInfo.clientGenderList.push(clientGender);
              })

              /*Populate Client Pronoun */
              response.clientPronounList.forEach(x=>{
                var pronoun = new ClientPronoun()
                pronoun.activeFlag =x.activeFlag;
                pronoun.clientId = x.clientId;
                pronoun.clientPronounCode = x.clientPronounCode;
                pronoun.clientPronounId = x.clientPronounId;
                pronoun.concurrencyStamp = x.concurrencyStamp;
                pronoun.creationTime = x.creationTime;
                pronoun.creatorId = x.creatorId;
                pronoun.deleterId = x.deleterId;
                pronoun.deletionTime = x.deletionTime;
                pronoun.isDeleted = x.isDeleted;
                pronoun.lastModificationTime = x.lastModificationTime;
                pronoun.lastModifierId = x.lastModifierId;
                pronoun.otherDesc = x.otherDesc
                if(this.applicatInfo.clientPronounList == undefined || null ){
                  this.applicatInfo.clientPronounList = []
                }
                this.applicatInfo.clientPronounList.push(pronoun);
              })

              /*Populate Client Race */
              response.clientRaceList.forEach(x=>{
                var clientRace = new ClientRace();
                clientRace.activeFlag = x.activeFlag;
                clientRace.clientEthnicIdentityCode = x.clientEthnicIdentityCode;
                clientRace.clientId = x.clientId;
                clientRace.clientRaceCategoryCode = x.clientRaceCategoryCode;
                clientRace.clientRaceId = x.clientRaceId;
                clientRace.concurrencyStamp = x.concurrencyStamp;
                clientRace.creationTime = x.creationTime;
                clientRace.creatorId = x.creatorId;
                clientRace.deleterId= x.deleterId;
                clientRace.deletionTime = x.deletionTime;
                clientRace.isDeleted = x.isDeleted;
                clientRace.isPrimaryFlag = x.isPrimaryFlag;
                clientRace.lastModificationTime = x.lastModificationTime;
                clientRace.lastModifierId = x.lastModifierId;
                clientRace.raceDesc = x.raceDesc
                if(this.applicatInfo.clientRaceList == undefined || null ){
                  this.applicatInfo.clientRaceList = []
                }
                this.applicatInfo.clientRaceList.push(clientRace);
              })

              /*Populate Clien Sexual Identity */
              response.clientSexualIdentityList.forEach(x=>{
                var clientSexualIdentity = new ClientSexualIdentity();
                clientSexualIdentity.activeFlag = x.activeFlag;
                clientSexualIdentity.clientId= x.clientId;
                clientSexualIdentity.clientSexualIdentityCode = x.clientSexualIdentityCode;
                clientSexualIdentity.clientSexualyIdentityId = x.clientSexualyIdentityId;
                clientSexualIdentity.concurrencyStamp = x.concurrencyStamp;
                clientSexualIdentity.creationTime = x.creationTime;
                clientSexualIdentity.creatorId = x.creatorId;
                clientSexualIdentity.deleterId = x.deleterId;
                clientSexualIdentity.deletionTime = x.deletionTime;
                clientSexualIdentity.isDeleted = x.isDeleted;
                clientSexualIdentity.lastModificationTime = x.lastModificationTime;
                clientSexualIdentity.lastModifierId = x.lastModifierId;
                clientSexualIdentity.otherDesc = x.otherDesc;
                if(this.applicatInfo.clientSexualIdentityList == undefined || null ){
                  this.applicatInfo.clientSexualIdentityList = []
                }
                this.applicatInfo.clientSexualIdentityList.push(clientSexualIdentity);
              })
              this.clientFacade.applicationInfoSubject.next(this.applicatInfo);
             
              
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
            return this.clientFacade.update(this.applicatInfo)            
          }
          else{
            return this.clientFacade.save(this.applicatInfo)        
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

    /*Modify when the get is ready */
    /*-------------------------------------------------------------------------------- */
     //this.populateClientCase();
    this.populateClientGender();
     this.populateClientRace();
     this.populateClientSexualIdentity();
    /*-------------------------------------------------------------------------------- */

  }

  private populateClient(){
    debugger;
    if(this.applicatInfo.client == undefined){
      this.applicatInfo.client = new Client;
    }
      this.applicatInfo.client.firstName = this.appInfoForm.controls["firstName"].value;
      if(this.appInfoForm.controls["chkmiddleName"].value == true){
        this.applicatInfo.client.middleName =null;
        this.applicatInfo.client.noMiddleInitialFlag = StatusFlag.Yes;
      }
      else{
        this.applicatInfo.client.middleName = this.appInfoForm.controls["middleName"].value;
        this.applicatInfo.client.noMiddleInitialFlag = StatusFlag.No;
      }   
      this.applicatInfo.client.lastName = this.appInfoForm.controls["lastName"].value;   
      this.applicatInfo.client.dob = this.appInfoForm.controls["dateOfBirth"].value
   
      if(this.appInfoForm.controls["ssnNotApplicable"].value){
        this.applicatInfo.client.ssn = null;
        this.applicatInfo.client.ssnNotApplicableFlag =StatusFlag.Yes;
      }
      else{
        this.applicatInfo.client.ssn = this.appInfoForm.controls["ssn"].value;
        this.applicatInfo.client.ssnNotApplicableFlag =StatusFlag.No;
      }     
      this.applicatInfo.client.activeFlag = 'Y';  
  }
 
  private populateClientCaseEligibility(){
        if(this.applicatInfo.clientCaseEligibilityAndFlag === undefined){
          this.applicatInfo.clientCaseEligibilityAndFlag = new ClientCaseEligibilityAndFlag
        }
        if(this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility == undefined){
            this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility = new ClientCaseEligibility;
            this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.activeFlag = StatusFlag.Yes;
            this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.isDeleted = false;
            this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.clientCaseId = this.clientCaseId;            
        }          
       /*Mocking the other required fields need to change as per the UI story progress */        
        
           this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.clientTransgenderCode="NO";          

      //------------------------------------

        
        if(this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag == undefined){
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag = new clientCaseEligibilityFlag;
        }
        this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.activeFlag = StatusFlag.Yes;
        if(this.appInfoForm.controls["prmInsNotApplicable"].value){
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceFirstName = '';
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceLastName = '';
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.insuranceNameNotApplicableFlag = StatusFlag.Yes;
        }
        else{
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceFirstName = this.appInfoForm.controls["prmInsFirstName"].value
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceLastName = this.appInfoForm.controls["prmInsLastName"].value
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.insuranceNameNotApplicableFlag = StatusFlag.No;
        }
        if(this.appInfoForm.controls["officialIdsNotApplicable"].value){
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdFirstName = '';
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdLastName = '';
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.officialIdNameNotApplicableFlag = StatusFlag.Yes;
        }
        else{
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdFirstName = this.appInfoForm.controls["officialIdFirstName"].value
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdLastName = this.appInfoForm.controls["officialIdLastName"].value
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.officialIdNameNotApplicableFlag = StatusFlag.No;
        }    
    
      if(this.appInfoForm.controls["registerToVote"].value.toUpperCase() === StatusFlag.Yes){
        this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.registerToVoteFlag = StatusFlag.Yes;
      }
      else{
        this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.registerToVoteFlag = StatusFlag.No;
      }
      
  }
  private populateClientPronoun(){
    if(this.applicatInfo.clientPronounList == undefined){
      this.applicatInfo.clientPronounList = [];
    }
    this.pronounList.forEach((pronoun:any) => {      
      if( this.appInfoForm.controls[pronoun.lovCode].value ===""
         ||this.appInfoForm.controls[pronoun.lovCode].value === null
         ||this.appInfoForm.controls[pronoun.lovCode].value ===false){
          var existingPronoun = this.applicatInfo.clientPronounList.find(x=>x.clientPronounCode ===pronoun.lovCode)
        if(existingPronoun != null){
           const index = this.applicatInfo.clientPronounList.indexOf(existingPronoun, 0);
          if (index > -1) {
            this.applicatInfo.clientPronounList.splice(index, 1);
          }
        }

      }
     else{
      var existingPronoun = this.applicatInfo.clientPronounList.find(x=>x.clientPronounCode ===pronoun.lovCode)     
      if(existingPronoun === null || existingPronoun === undefined){
          var clientPronoun = new ClientPronoun();
          if(pronoun.lovCode=='NOT_LISTED') {
                    clientPronoun.otherDesc = this.appInfoForm.controls["NOT_LISTED"].value;
                    clientPronoun.clientPronounCode =pronoun.lovCode;
                    clientPronoun.activeFlag = StatusFlag.Yes;
                    clientPronoun.clientId = this.clientId;
                    clientPronoun.isDeleted = false;
            }
            else{
              clientPronoun.clientPronounCode =pronoun.lovCode;
              clientPronoun.activeFlag = StatusFlag.Yes;
              clientPronoun.clientId = this.clientId;
              clientPronoun.isDeleted = false;
            } 
            this.applicatInfo.clientPronounList.push(clientPronoun);
        }
        else{
          if(pronoun.lovCode=='NOT_LISTED') {
            const index = this.applicatInfo.clientPronounList.indexOf(existingPronoun, 0);          
            this.applicatInfo.clientPronounList[index].clientPronounCode = pronoun.lovCode;
           }
        }


     }   
      
  });      
  
  }
  
  private populateClientGender(){
        /*Mocking the other required fields need to change as per the UI story progress/Get */
        /*---------------------------------remove if----------------------------------------------- */
        //this.applicatInfo.clientGenderList =[];
        if(this.applicatInfo.clientGenderList.length ===0 ){
          var clientGender = new ClientGender();
          clientGender.clientGenderCode = 'Woman or Girl';
          clientGender.activeFlag ="Y";
          if(this.applicatInfo.clientGenderList == undefined){
            this.applicatInfo.clientGenderList = [];
          }
          clientGender.clientId = this.clientId;
          this.applicatInfo.clientGenderList.push(clientGender)
      }
        
        /*-------------------------------------------------------------------------------- */
  }
  private populateClientRace(){
        /*Mocking the other required fields need to change as per the UI story progress/Get */
        /*--------------------------remove if------------------------------------------------------ */
        if(this.applicatInfo.clientRaceList.length ===0) {
            var clientRace = new ClientRace();
            clientRace.clientEthnicIdentityCode = 'American Indian or Alaska Native';
            clientRace.clientRaceCategoryCode = 'American Indian or Alaska Native';
            clientRace.activeFlag = "Y";
            if(this.applicatInfo.clientRaceList == undefined){
              this.applicatInfo.clientRaceList =[];
            }
            clientRace.clientId = this.clientId;
            this.applicatInfo.clientRaceList.push(clientRace)
      }
        
        /*-------------------------------------------------------------------------------- */
  }
  private populateClientSexualIdentity(){
        /*Mocking the other required fields need to change as per the UI story progress/Get */
        /*--------------------------remove if------------------------------------------------------ */
        if(this.applicatInfo.clientSexualIdentityList.length ===0 ){
            var clientSexualIdentity = new ClientSexualIdentity();
            clientSexualIdentity.clientSexualIdentityCode = 'Straight';
            clientSexualIdentity.activeFlag ="Y";
            if(this.applicatInfo.clientSexualIdentityList == undefined){
              this.applicatInfo.clientSexualIdentityList =[];
            }
            clientSexualIdentity.clientId = this.clientId;
            this.applicatInfo.clientSexualIdentityList.push(clientSexualIdentity)
      }
        /*-------------------------------------------------------------------------------- */
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
