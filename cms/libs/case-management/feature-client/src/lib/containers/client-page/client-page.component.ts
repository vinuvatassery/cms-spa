/** Angular **/
import { Input, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
/** External libraries **/
import { first, forkJoin, mergeMap, of, Subscription } from 'rxjs';
/** Facade **/
import { WorkflowFacade, ClientFacade, ApplicantInfo, Client, ClientCaseEligibility, StatusFlag, ClientPronoun, ClientGender, ClientRace, ClientSexualIdentity, clientCaseEligibilityFlag, ClientCaseEligibilityAndFlag, CaseFacade } from '@cms/case-management/domain';
/** Entities **/
import { CompletionChecklist } from '@cms/case-management/domain';
/** Enums **/
import { NavigationType } from '@cms/case-management/domain';
import { FormGroup, Validators } from '@angular/forms';
import { ClientEditViewComponent } from '../../components/client-edit-view/client-edit-view.component';
import { timeStamp } from 'console';
import { ActivatedRoute } from '@angular/router';
import { THRESHOLD_DIFF } from '@progress/kendo-angular-popup/services/scrollable.service';



@Component({
  selector: 'case-management-client-page',
  templateUrl: './client-page.component.html',
  styleUrls: ['./client-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientPageComponent implements OnInit, OnDestroy {

  /** Public properties **/

  /** Private properties **/
  private saveClickSubscription !: Subscription;
  private pronounSubscription!:Subscription;
  //private valiateSubscriptiion !: Subscription;
  isValid:boolean=true;
  //applicatInfo!:ApplicantInfo
  applicatInfo = {} as ApplicantInfo;
  appInfoForm!:FormGroup;  
  caseOwnerName :string = 'Antony Hopkins';
  //appInfoForm$ = this.clientFacade.appInfoForm$;
  //validate$ = this.applicationInfoFacade.validate$;
  pronounList$ = this.clientFacade.pronounList$;
  pronounList !:any;
  showErrorMessage:boolean=false;
  clientCaseId! : string;
  sessionId! : string;
 
  constructor(private workFlowFacade: WorkflowFacade,
              private clientFacade: ClientFacade, 
              private route: ActivatedRoute,
              private readonly caseFacade: CaseFacade,
              ) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadCase();
    this.addSaveSubscription();
    //this.populateClientPronoun()
    
  }
  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.pronounSubscription.unsubscribe();

    //this.valiateSubscriptiion.unsubscribe();
  }

  /** Private methods **/
  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workFlowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.workFlowFacade.navigate(navigationType);
      }
    });
    
  }
  private loadCase()
  {     
   this.sessionId = this.route.snapshot.queryParams['sid'];    
   this.workFlowFacade.loadWorkFlowSessionData(this.sessionId)
    this.workFlowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
    .subscribe((session: any) => {      
     this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId     
     this.caseFacade.loadCasesById(this.clientCaseId);
      
     this.loadApplicantInfo();     
    });        
  } 

  private loadApplicantInfo(){

   //--------------------------------Need to remove------------------------
        if(this.workFlowFacade.currentSession == null || undefined)
        {
           if(  this.applicatInfo.client == undefined){
                this.applicatInfo.client = new Client;
              }
          // if(  this.applicatInfo.clientCase == undefined){
          //   this.applicatInfo.clientCase = new ClientCase;
          // }
          if(  this.applicatInfo.clientCaseEligibilityAndFlag == undefined){
            this.applicatInfo.clientCaseEligibilityAndFlag = new ClientCaseEligibilityAndFlag;
            this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility = new ClientCaseEligibility;
          }
        
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.clientCaseId ='a6d2e412-b0c8-4466-84df-bf0d9628a880';
          this.applicatInfo.client.clientId=2256        
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.clientCaseId ='A6D2E412-B0C8-4466-84DF-BF0D9628A880';
        }
       //else{
   //-----------------------------------------------------------------------------
        this.clientFacade.load( 'A6D2E412-B0C8-4466-84DF-BF0D9628A880',"D2237F9D-068E-4DCD-AA6F-2FF396B4F851").subscribe({         
          next: response => {
      
            if(response !=null){
              //this.applicatInfo = response
              this.applicatInfo.client= response.client;
              //this.applicatInfo.clientCase = response.clientCase;
              // clientCaseEligibilityAndFlag
              this.applicatInfo.clientCaseEligibilityAndFlag = response.clientCaseEligibilityAndFlag;
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
                clientGender.extraProperties= x.extraProperties;
                clientGender.isDeleted = x.isDeleted;
                clientGender.lastModificationTime = x.lastModificationTime;
                if(this.applicatInfo.clientGenderList == undefined || null ){
                  this.applicatInfo.clientGenderList = []
                }
                this.applicatInfo.clientGenderList.push(clientGender);
              })
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
                pronoun.extraProperties = x.extraProperties;
                pronoun.isDeleted = x.isDeleted;
                pronoun.lastModificationTime = x.lastModificationTime;
                pronoun.lastModifierId = x.lastModifierId;
                pronoun.otherDesc = x.otherDesc
                if(this.applicatInfo.clientPronounList == undefined || null ){
                  this.applicatInfo.clientPronounList = []
                }
                this.applicatInfo.clientPronounList.push(pronoun);
              })
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
                clientRace.extraProperties= x.extraProperties;
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
                clientSexualIdentity.extraProperties = x.extraProperties;
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
            //this.assignModelToForm(response);
          } ,
        error: error => {         
          console.error(error);
        }
      });
   //}

  }

  private save() {

    this.validateForm();
        if(this.appInfoForm.valid){
          this.populateApplicantInfoModel();
            //return this.clientFacade.save(this.applicatInfo);    
            this.clientFacade.save(this.applicatInfo).subscribe({         
              next: response => {
              return true;
              } ,
            error: error => {    
              return false;           
              console.error(error);
            }
          });
        
    }
    return of(false)
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

    if(this.applicatInfo.client == undefined){
      this.applicatInfo.client = new Client;
    }
      this.applicatInfo.client.firstName = this.appInfoForm.controls["firstName"].value;
      if(this.appInfoForm.controls["chkmiddleName"].value){
        this.applicatInfo.client.middleName =null;
        //client.noMiddleNameFlag = StatusFlag.Yes;
      }
      else{
        this.applicatInfo.client.middleName = this.appInfoForm.controls["middleName"].value;
        //client.noMiddleNameFlag = StatusFlag.No;
      }   
      this.applicatInfo.client.lastName = this.appInfoForm.controls["lastName"].value;   
      this.applicatInfo.client.dob = this.appInfoForm.controls["dateOfBirth"].value
      if(this.appInfoForm.controls["ssnNotApplicable"].value){
        this.applicatInfo.client.ssn = null;
      }
      else{
        this.applicatInfo.client.ssn = this.appInfoForm.controls["ssn"].value;
      }
      this.applicatInfo.client.ssnNotApplicableFlag =
      this.applicatInfo.client.activeFlag = 'Y';  
  }
 
  private populateClientCaseEligibility(){
        if(this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility == undefined){
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility = new ClientCaseEligibility;
        }
        if(this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag == undefined){
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag = new clientCaseEligibilityFlag;
        }
        //this.applicatInfo.clientCaseEligibility.clientCaseId = "34d7e1c3-7721-4821-9450-01c8f58a72cc";
        if(this.appInfoForm.controls["prmInsNotApplicable"].value){
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceFirstName = '';
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceLastName = '';
        }
        else{
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceFirstName = this.appInfoForm.controls["prmInsFirstName"].value
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.insuranceLastName = this.appInfoForm.controls["prmInsLastName"].value
        }
        if(this.appInfoForm.controls["officialIdsNotApplicable"].value){
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdFirstName = '';
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdLastName = '';
        }
        else{
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdFirstName = this.appInfoForm.controls["officialIdFirstName"].value
          this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibility.officialIdLastName = this.appInfoForm.controls["officialIdLastName"].value
        }

      /*Mocking the other required fields need to change as per the UI story progress */
      /*-------------------------------------------------------------------------------- */
      if(this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag == null){
        this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag = new clientCaseEligibilityFlag;
      }
      if(this.appInfoForm.controls["registerToVote"].value.toUpperCase() =="YES"){
        this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.registerToVoteFlag = StatusFlag.Yes;
      }
      else{
        this.applicatInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag.registerToVoteFlag = StatusFlag.No;
      }
      
  }
  private populateClientPronoun(){
    this.pronounList.forEach((pronoun: { selected: boolean; code: string; }) => {
         var clientPronoun = new ClientPronoun();
         if(pronoun.selected == true){   
          if(pronoun.code=='NOT_LISTED') {
            clientPronoun.otherDesc = this.appInfoForm.controls["notListedPronoun"].value;
          }                
         clientPronoun.clientPronounCode = pronoun.code;
         clientPronoun.activeFlag="Y";
         if(this.applicatInfo.clientPronounList == undefined){
         this.applicatInfo.clientPronounList = [];
          }
          var item = this.applicatInfo.clientPronounList.find(x =>x.clientPronounCode == pronoun.code)              
          if(item == null)  {    
            this.applicatInfo.clientPronounList.push(clientPronoun)
          }
        }});
          // this.pronounList.second.forEach((first: { selected: boolean;code:any }) => {
          //   var clientPronoun = new ClientPronoun();
          //   if(first.selected == true){                    
          //   clientPronoun.clientPronounCode = first.code;
          //   clientPronoun.activeFlag="Y";
           
          //   if(this.applicatInfo.clientPronounList == undefined){
          //   this.applicatInfo.clientPronounList = [];
          //    }
          //    var item = this.applicatInfo.clientPronounList.find(x =>x.clientPronounCode == first.code)              
          //    if(item == null)  {    
          //      this.applicatInfo.clientPronounList.push(clientPronoun)
          //    }
          //   }});
        

  }
  // private populateClientPronoun(){

  //       /*Mocking the other required fields need to change as per the UI story progress */
  //       /*-------------------------------------------------------------------------------- */
  //       this.pronounSubscription = this.pronounList$.subscribe({
  //         next: response => {

  //           if(this.applicatInfo.clientPronounList == undefined){
  //             this.applicatInfo.clientPronounList = [];
  //           }
  //           if(response !=null){
  //               if(response !=null){
  //                 response.first.forEach((first: { selected: boolean;code:any }) => {
  //                   var clientPronoun = new ClientPronoun();
  //                  if(first.selected == true){                    
  //                   clientPronoun.clientPronounCode = first.code;
  //                   clientPronoun.activeFlag="Y";
  //                   if(this.applicatInfo.clientPronounList == undefined){
  //                     this.applicatInfo.clientPronounList = [];
  //                   }
  //                   var item = this.applicatInfo.clientPronounList.find(x =>x.clientPronounCode == first.code)              
  //                   if(item == null)  {    
  //                   this.applicatInfo.clientPronounList.push(clientPronoun)
  //                   }
  //                  }                  
                    
  //               });
  //               response.second.forEach((second: { selected: boolean;code:any }) => {
  //                 var clientPronoun = new ClientPronoun();
  //                if(second.selected == true){                  
  //                 clientPronoun.clientPronounCode = second.code;
  //                 clientPronoun.activeFlag="Y";
  //                 if(this.applicatInfo.clientPronounList == undefined){
  //                   this.applicatInfo.clientPronounList = [];
  //                 }
  //                 this.applicatInfo.clientPronounList.push(clientPronoun)
  //                }               
                 
  //             });
                
  //             }
  //           }
            
  //         } ,
  //       error: error => {         
  //         console.error(error);
  //       }

  //       })
        
  //       /*-------------------------------------------------------------------------------- */
  // }
  
  private populateClientGender(){
        /*Mocking the other required fields need to change as per the UI story progress/Get */
        /*-------------------------------------------------------------------------------- */
        var clientGender = new ClientGender();
        clientGender.clientGenderCode = 'Woman or Girl';
        clientGender.activeFlag ="Y";
        if(this.applicatInfo.clientGenderList == undefined){
          this.applicatInfo.clientGenderList = [];
        }
        this.applicatInfo.clientGenderList.push(clientGender)
        
        /*-------------------------------------------------------------------------------- */
  }
  private populateClientRace(){
        /*Mocking the other required fields need to change as per the UI story progress/Get */
        /*-------------------------------------------------------------------------------- */
        var clientRace = new ClientRace();
        clientRace.clientEthnicIdentityCode = 'American Indian or Alaska Native';
        clientRace.clientRaceCategoryCode = 'American Indian or Alaska Native';
        clientRace.activeFlag = "Y";
        if(this.applicatInfo.clientRaceList == undefined){
          this.applicatInfo.clientRaceList =[];
        }
        this.applicatInfo.clientRaceList.push(clientRace)
        
        /*-------------------------------------------------------------------------------- */
  }
  private populateClientSexualIdentity(){
        /*Mocking the other required fields need to change as per the UI story progress/Get */
        /*-------------------------------------------------------------------------------- */
        var clientSexualIdentity = new ClientSexualIdentity();
        clientSexualIdentity.clientSexualIdentityCode = 'Straight';
        clientSexualIdentity.activeFlag ="Y";
        if(this.applicatInfo.clientSexualIdentityList == undefined){
          this.applicatInfo.clientSexualIdentityList =[];
        }
        this.applicatInfo.clientSexualIdentityList.push(clientSexualIdentity)
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
            this.appInfoForm.controls["firstName"].setValidators([Validators.required]);
            this.appInfoForm.controls["firstName"].updateValueAndValidity();
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
        if(this.appInfoForm.controls["registerToVote"].value == null){
              this.appInfoForm.controls["registerToVote"].setValidators(Validators.required);
              this.appInfoForm.controls["registerToVote"].updateValueAndValidity();    
        }
        else{
              this.appInfoForm.controls["registerToVote"].removeValidators(Validators.required);;
              this.appInfoForm.controls["registerToVote"].updateValueAndValidity();   
        }
        //var pronounsFirst =this.appInfoForm.controls['pronounsFirst'].value.filter((x:boolean)=>x===true)// this.appInfoForm.controls['pronounsFirst'].value.filter((x: boolean)=>x == true);
        var pronounValid =this.pronounList.filter((x:any)=>x.selected ===true)
        if(pronounValid.length >0 )
        {                    
            this.appInfoForm.controls['pronounsFirst'].setErrors(null);
         }
        else{
      
             this.appInfoForm.controls['pronounsFirst'].setErrors({'incorrect': true});
                 
          }
          var notLitedPronounIsExist =this.pronounList.filter((x:any)=>x.code == 'NOT_LISTED' && x.selected == true)
          if(notLitedPronounIsExist.length >0){
            this.appInfoForm.controls["notListedPronoun"].setValidators(Validators.required);
            this.appInfoForm.controls["notListedPronoun"].updateValueAndValidity();    
          }
          else{
            this.appInfoForm.controls["notListedPronoun"].removeValidators(Validators.required);;
            this.appInfoForm.controls["notListedPronoun"].updateValueAndValidity();   
          }
  
  }
  setAppInfoForm(appInfoForm:FormGroup)
  {
    this.appInfoForm = appInfoForm;
  }
  setChangedPronoun(pronoun:any){
    this.pronounList = pronoun;
  }
}
