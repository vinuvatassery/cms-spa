/** Angular **/
import { Input, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
/** External libraries **/
import { forkJoin, mergeMap, of, Subscription } from 'rxjs';
/** Facade **/
import { WorkflowFacade, ClientFacade, ApplicantInfo, Client, ClientCaseEligibility, StatusFlag, ClientPronoun, ClientGender, ClientRace, ClientSexualIdentity } from '@cms/case-management/domain';
/** Entities **/
import { CompletionChecklist } from '@cms/case-management/domain';
/** Enums **/
import { NavigationType } from '@cms/case-management/domain';
import { FormGroup, Validators } from '@angular/forms';
import { ClientEditViewComponent } from '../../components/client-edit-view/client-edit-view.component';
import { timeStamp } from 'console';
import { ClientCase } from 'libs/case-management/domain/src/lib/entities/clien-case';



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
  showErrorMessage:boolean=false;
  constructor(private workflowFacade: WorkflowFacade,
    private clientFacade: ClientFacade) {

  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadApplicantInfo();
    this.addSaveSubscription();
    
  }
  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.pronounSubscription.unsubscribe();
    //this.valiateSubscriptiion.unsubscribe();
  }

  /** Private methods **/
  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.workflowFacade.navigate(navigationType);
      }
    });
    //   this.workflowFacade.saveAndContinueClicked$.subscribe(() => {
    //      debugger;
    // });
  }

  private loadApplicantInfo(){
   debugger;
   //--------------------------------Need to remove------------------------
        if(this.workflowFacade.currentSession == null || undefined)
        {
           if(  this.applicatInfo.client == undefined){
                this.applicatInfo.client = new Client;
              }
          if(  this.applicatInfo.clientCase == undefined){
            this.applicatInfo.clientCase = new ClientCase;
          }
          if(  this.applicatInfo.clientCaseEligibility == undefined){
            this.applicatInfo.clientCaseEligibility = new ClientCaseEligibility;
          }
          this.applicatInfo.client.clientId=2256
          this.applicatInfo.clientCase.clientId=2256
          this.applicatInfo.clientCase.clientCaseId = 'a6d2e412-b0c8-4466-84df-bf0d9628a880';
          this.applicatInfo.clientCase.concurrencyStamp ="fb3d6a0d044d46d5885baa9caa9ae2b1"
          this.applicatInfo.clientCaseEligibility.clientCaseId ='a6d2e412-b0c8-4466-84df-bf0d9628a880';
        }
       //else{
   //-----------------------------------------------------------------------------
        this.clientFacade.load( this.applicatInfo.clientCase.clientCaseId,"D2237F9D-068E-4DCD-AA6F-2FF396B4F851").subscribe({         
          next: response => {
            debugger;
            if(response !=null){
              this.applicatInfo = response
              this.clientFacade.applicationInfoSubject.next(this.applicatInfo);
              // if(  this.applicatInfo.client == undefined){
              //   this.applicatInfo.client = new Client;
              // }
              // if(this.applicatInfo.clientCase == undefined){
              //   this.applicatInfo.clientCase= new ClientCase;
              // }
              //this.applicatInfo.client.clientId=18
              // this.applicatInfo.clientCase.clientCaseId ='34D7E1C3-7721-4821-9450-01C8F58A72CC';
              // this.applicatInfo.clientCase.concurrencyStamp ="487509dd8c5a44379742a5cbf3b487b9"
              
            }
            //this.assignModelToForm(response);
          } ,
        error: error => {         
          console.error(error);
        }
      });
   //}

  }

  // private assignModelToForm(applicantInfo:ApplicantInfo){
  //   this.appInfoForm.controls["firstName"].setValue(applicantInfo.client?.firstName)
  //   this.appInfoForm.controls["middleName"].setValue(applicantInfo.client?.middleName)
  //   //this.appInfoForm.controls["chkmiddleName"].setValue(applicantInfo.client?.)
  //   this.appInfoForm.controls["lastName"].setValue(applicantInfo.client?.lastName)
  //   this.appInfoForm.controls["prmInsFirstName"].setValue(applicantInfo.clientCaseEligibility?.insuranceFirstName)
  //   this.appInfoForm.controls["prmInsLastName"].setValue(applicantInfo.clientCaseEligibility?.insuranceLastName)
  //   //this.appInfoForm.controls["prmInsNotApplicable"].setValue(applicantInfo.clientCaseEligibility?.)
  //   this.appInfoForm.controls["officialIdFirstName"].setValue(applicantInfo.clientCaseEligibility?.officialIdFirstName)
  //   this.appInfoForm.controls["officialIdLastName"].setValue(applicantInfo.clientCaseEligibility?.officialIdLastName)
  //   //this.appInfoForm.controls["officialIdsNotApplicable"].setValue(applicantInfo.clientCaseEligibility?.offi)
  //   this.appInfoForm.controls["dateOfBirth"].setValue(applicantInfo.client?.dob)
  //   this.appInfoForm.controls["ssn"].setValue(applicantInfo.client?.ssn)
  //   if(applicantInfo.client?.ssnNotApplicableFlag =="Y"){
  //     //this.appInfoForm.get("ssnNotApplicable").setValue(true);
  //     //this.appInfoForm.controls["ssnNotApplicable"].setValue(true);
  //   }
  //   else{
  //     this.appInfoForm.controls["ssnNotApplicable"].setValue(true);
  //   }
  // }
  private save() {
    debugger;
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
     this.populateClientCase();
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
  private populateClientCase(){
        if(this.applicatInfo.clientCase == undefined){
          this.applicatInfo.clientCase = new ClientCase;
        }
        // this.applicatInfo.clientCase.clientCaseId = "34d7e1c3-7721-4821-9450-01c8f58a72cc";
        // this.applicatInfo.clientCase.programId ="3b8dd4fc-86fd-43e7-8493-0037a6f9160b";
        this.applicatInfo.clientCase.caseOriginCode = "COC26";
        this.applicatInfo.clientCase.caseStartDate = new Date("2021-03-01 00:00:00.000")
        this.applicatInfo.clientCase.caseStatusCode="N"
        this.applicatInfo.clientCase.activeFlag="Y"
  }
  private populateClientCaseEligibility(){
        if(this.applicatInfo.clientCaseEligibility == undefined){
          this.applicatInfo.clientCaseEligibility = new ClientCaseEligibility;
        }
        //this.applicatInfo.clientCaseEligibility.clientCaseId = "34d7e1c3-7721-4821-9450-01c8f58a72cc";
        if(this.appInfoForm.controls["prmInsNotApplicable"].value){
          this.applicatInfo.clientCaseEligibility.insuranceFirstName = '';
          this.applicatInfo.clientCaseEligibility.insuranceLastName = '';
        }
        else{
          this.applicatInfo.clientCaseEligibility.insuranceFirstName = this.appInfoForm.controls["prmInsFirstName"].value
          this.applicatInfo.clientCaseEligibility.insuranceLastName = this.appInfoForm.controls["prmInsLastName"].value
        }
        if(this.appInfoForm.controls["officialIdsNotApplicable"].value){
          this.applicatInfo.clientCaseEligibility.officialIdFirstName = '';
          this.applicatInfo.clientCaseEligibility.officialIdLastName = '';
        }
        else{
          this.applicatInfo.clientCaseEligibility.officialIdFirstName = this.appInfoForm.controls["officialIdFirstName"].value
          this.applicatInfo.clientCaseEligibility.officialIdLastName = this.appInfoForm.controls["officialIdLastName"].value
        }

      /*Mocking the other required fields need to change as per the UI story progress */
      /*-------------------------------------------------------------------------------- */
      if(this.appInfoForm.controls["registerToVote"].value.toUpperCase() =="YES"){
        this.applicatInfo.clientCaseEligibility.registerToVoteFlag = StatusFlag.Yes;
      }
      else{
        this.applicatInfo.clientCaseEligibility.registerToVoteFlag = StatusFlag.No;
      }
      this.applicatInfo.clientCaseEligibility.currentInsuranceFlag ="Y";
      this.applicatInfo.clientCaseEligibility.emailNotApplicableFlag ="Y";
      this.applicatInfo.clientCaseEligibility.groupPolicyEligibleFlag="Y";
      this.applicatInfo.clientCaseEligibility.smokingCessationReferralFlag= "N";
      this.applicatInfo.clientCaseEligibility.smokingCessationNoteApplicableFlag = "Y";
      this.applicatInfo.clientCaseEligibility.smokingCessationNote="N";
      this.applicatInfo.clientCaseEligibility.hivPrescriptionFlag = "N";
      this.applicatInfo.clientCaseEligibility.nonPreferredPharmacyFlag= "N";
      this.applicatInfo.clientCaseEligibility.eligibilityStatusCode= "a";
      this.applicatInfo.clientCaseEligibility.waitlistStatusCode= "a";
      this.applicatInfo.clientCaseEligibility.serviceCoordinationRegionCode="A";
      this.applicatInfo.clientCaseEligibility.clientTransgenderCode="A";
      this.applicatInfo.clientCaseEligibility.clientTransgenderDesc="No";
      this.applicatInfo.clientCaseEligibility.materialInAlternateFormatCode="aa";
      this.applicatInfo.clientCaseEligibility.materialInAlternateFormatDesc="aa";
      this.applicatInfo.clientCaseEligibility.spokenLanguageCode="aa";
      this.applicatInfo.clientCaseEligibility.writtenLanguageCode="aa";
      this.applicatInfo.clientCaseEligibility.englishProficiencyCode="aa";
      this.applicatInfo.clientCaseEligibility.interpreterCode="aa";
      this.applicatInfo.clientCaseEligibility.interpreterType="aa";
      this.applicatInfo.clientCaseEligibility.deafOrHearingCode="aa";
      this.applicatInfo.clientCaseEligibility.startAgeDeafOrHearing =1;
      this.applicatInfo.clientCaseEligibility.blindSeeingCode="aa";
      this.applicatInfo.clientCaseEligibility.startAgeBlindSeeing= 1;
      this.applicatInfo.clientCaseEligibility.limitingConditionCode="aa";
      this.applicatInfo.clientCaseEligibility.startAgeLimitingCondition =1;
      this.applicatInfo.clientCaseEligibility.walkingClimbingDifficultyCode="aa";
      this.applicatInfo.clientCaseEligibility.startAgeWalkingClimbingDifficulty= 1;
      this.applicatInfo.clientCaseEligibility.dressingBathingDifficultyCode="";
      this.applicatInfo.clientCaseEligibility.startAgeDressingBathingDifficulty= 1;
      this.applicatInfo.clientCaseEligibility.concentratingDifficultyCode="aa";
      this.applicatInfo.clientCaseEligibility.startAgeConcentratingDifficulty= 1;
      this.applicatInfo.clientCaseEligibility.errandsDifficultyCode="aa";
      this.applicatInfo.clientCaseEligibility.startAgeErrandsDifficulty= 1;
      this.applicatInfo.clientCaseEligibility.preferredContactCode="a";
      this.applicatInfo.clientCaseEligibility.contactName="aa";
      this.applicatInfo.clientCaseEligibility.contactRelationshipCode="a";
      this.applicatInfo.clientCaseEligibility.contactPhoneNbr="aa";
      this.applicatInfo.clientCaseEligibility.homelessFlag="N";
      this.applicatInfo.clientCaseEligibility.homeAddressProofFlag="N";
      this.applicatInfo.clientCaseEligibility.emailNotApplicableFlag="N";
      this.applicatInfo.clientCaseEligibility.noDependentFlag="N";
      this.applicatInfo.clientCaseEligibility.paperlessFlag="N";
      this.applicatInfo.clientCaseEligibility.noIncomeFlag="N";
      this.applicatInfo.clientCaseEligibility.noIncomeNote="aa";
      this.applicatInfo.clientCaseEligibility.unemployedFlag="N";
        
      /*-------------------------------------------------------------------------------- */
  }

  private populateClientPronoun(){
    debugger;
        /*Mocking the other required fields need to change as per the UI story progress */
        /*-------------------------------------------------------------------------------- */
        this.pronounSubscription = this.pronounList$.subscribe({
          next: response => {
            debugger;
            if(response !=null){
                if(response !=null){
                  response.first.forEach((first: { selected: boolean;code:any }) => {
                    var clientPronoun = new ClientPronoun();
                   if(first.selected == true){                    
                    clientPronoun.clientPronounCode = first.code;
                    clientPronoun.activeFlag="Y";
                    if(this.applicatInfo.clientPronounList == undefined){
                      this.applicatInfo.clientPronounList = [];
                    }
                    this.applicatInfo.clientPronounList.push(clientPronoun)
                   }                  
                    
                });
                response.second.forEach((second: { selected: boolean;code:any }) => {
                  var clientPronoun = new ClientPronoun();
                 if(second.selected == true){                  
                  clientPronoun.clientPronounCode = second.code;
                  clientPronoun.activeFlag="Y";
                  if(this.applicatInfo.clientPronounList == undefined){
                    this.applicatInfo.clientPronounList = [];
                  }
                  this.applicatInfo.clientPronounList.push(clientPronoun)
                 }               
                 
              });
                // var clientPronoun = new ClientPronoun();
                // clientPronoun.clientPronounCode = 'He/Him/His';
                // clientPronoun.activeFlag="Y";
            
              }
            }
            
          } ,
        error: error => {         
          console.error(error);
        }

        })
        
        /*-------------------------------------------------------------------------------- */
  }
  
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
      this.workflowFacade.updateChecklist(completedDataPoints);
    }
  }

  updateAdjustmentAttrCount(ajustData: CompletionChecklist[]) {
   if(ajustData){
    this.workflowFacade.updateBasedOnDtAttrChecklist(ajustData);
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
              this.appInfoForm.controls["registerToVote"].setValidators(Validators.required);;
              this.appInfoForm.controls["registerToVote"].updateValueAndValidity();    
        }
        else{
              this.appInfoForm.controls["registerToVote"].removeValidators(Validators.required);;
              this.appInfoForm.controls["registerToVote"].updateValueAndValidity();   
        }
    //this.ValidateFields.emit(this.appInfoForm.valid);
  
  }
  setAppInfoForm(appInfoForm:FormGroup)
  {
    this.appInfoForm = appInfoForm;
  }
}
