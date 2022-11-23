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
  //private valiateSubscriptiion !: Subscription;
  isValid:boolean=true;
  //applicatInfo!:ApplicantInfo
  applicatInfo = {} as ApplicantInfo;
  appInfoForm!:FormGroup;  
  caseOwnerName :string = 'Antony Hopkins';
  //appInfoForm$ = this.clientFacade.appInfoForm$;
  //validate$ = this.applicationInfoFacade.validate$;
  showErrorMessage:boolean=false;
  constructor(private workflowFacade: WorkflowFacade,
    private clientFacade: ClientFacade) {

  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.addSaveSubscription();
  }
  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
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

  private save() {
    this.validateForm();
      if(this.appInfoForm.valid){
        this.populateApplicantInfoModel();
      debugger;
          return this.clientFacade.save(this.applicatInfo);            }
        return of(false)
  }
  private  populateApplicantInfoModel(){   

    this.applicatInfo.client = this.populateClient();
    // this.applicatInfo.clientCaseEligibility = this.populateClientCaseEligibility();
    // this.applicatInfo.clientPronounList = this.populateClientPronoun();

    /*Modify when the ge is ready */
    /*-------------------------------------------------------------------------------- */
    // this.applicatInfo.clientCase = new ClientCase();
    // this.applicatInfo.clientGenderList = this.populateClientGender();
    // this.applicatInfo.clientRaceList = this.populateClientRace();
    // this.applicatInfo.clientSexualIdentityList = this.populateClientSexualIdentity();
    /*-------------------------------------------------------------------------------- */

  }

  private populateClient():Client{
    var client = new Client()
    client.firstName = this.appInfoForm.controls["firstName"].value;
    if(this.appInfoForm.controls["chkmiddleName"].value){
      client.middleName ='';
      //client.noMiddleNameFlag = StatusFlag.Yes;
    }
    else{
      client.middleName = this.appInfoForm.controls["middleName"].value;
      //client.noMiddleNameFlag = StatusFlag.No;
    }   
    client.lastName = this.appInfoForm.controls["lastName"].value;   
    client.dob = this.appInfoForm.controls["dateOfBirth"].value
    client.ssn = this.appInfoForm.controls["ssn"].value;
    client.activeFlag = 'Active';
   

    return client;
  }
  private populateClientCaseEligibility():ClientCaseEligibility{
    var clientCaseEligibility = new ClientCaseEligibility();
    if(this.appInfoForm.controls["prmInsNotApplicable"].value){
      clientCaseEligibility.insuranceFirstName = '';
      clientCaseEligibility.insuranceLastName = '';
    }
    else{
      clientCaseEligibility.insuranceFirstName = this.appInfoForm.controls["prmInsFirstName"].value
      clientCaseEligibility.insuranceLastName = this.appInfoForm.controls["prmInsLastName"].value
    }
    if(this.appInfoForm.controls["officialIdsNotApplicable"].value){
      clientCaseEligibility.insuranceLastName = '';
      clientCaseEligibility.insuranceLastName = '';
    }
    else{
      clientCaseEligibility.insuranceLastName = this.appInfoForm.controls["officialIdFirstName"].value
      clientCaseEligibility.insuranceLastName = this.appInfoForm.controls["officialIdLastName"].value
    }

    /*Mocking the other required fields need to change as per the UI story progress */
    /*-------------------------------------------------------------------------------- */
     clientCaseEligibility.registerToVoteFlag = StatusFlag.Yes;
     /*-------------------------------------------------------------------------------- */
    return clientCaseEligibility;
  }

  private populateClientPronoun():ClientPronoun[]{
    /*Mocking the other required fields need to change as per the UI story progress */
    /*-------------------------------------------------------------------------------- */
    var clientPronoun = new ClientPronoun();
    clientPronoun.clientPronounCode = 'He/Him/His';
    var clientPronounList =  [];
    clientPronounList.push(clientPronoun)
    return clientPronounList
    /*-------------------------------------------------------------------------------- */
  }
  
  private populateClientGender():ClientGender[]{
    /*Mocking the other required fields need to change as per the UI story progress/Get */
    /*-------------------------------------------------------------------------------- */
    var clientGender = new ClientGender();
    clientGender.clientGenderCode = 'Woman or Girl';
    var clientGenderList =  [];
    clientGenderList.push(clientGender)
    return clientGenderList
    /*-------------------------------------------------------------------------------- */
  }
  private populateClientRace():ClientRace[]{
    /*Mocking the other required fields need to change as per the UI story progress/Get */
    /*-------------------------------------------------------------------------------- */
    var clientRace = new ClientRace();
    clientRace.clientEthnicIdentityCode = 'American Indian or Alaska Native';
    clientRace.clientRaceCategoryCode = 'American Indian or Alaska Native';
    var clientRaceList =  [];
    clientRaceList.push(clientRace)
    return clientRaceList
    /*-------------------------------------------------------------------------------- */
  }
  private populateClientSexualIdentity():ClientSexualIdentity[]{
    /*Mocking the other required fields need to change as per the UI story progress/Get */
    /*-------------------------------------------------------------------------------- */
    var clientSexualIdentity = new ClientSexualIdentity();
    clientSexualIdentity.clientSexualIdentityCode = 'Straight';
    var clientSexualIdentityList =  [];
    clientSexualIdentityList.push(clientSexualIdentity)
    return clientSexualIdentityList = clientSexualIdentityList;
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
    //this.ValidateFields.emit(this.appInfoForm.valid);
  
  }
  setAppInfoForm(appInfoForm:FormGroup)
  {
    this.appInfoForm = appInfoForm;
  }
}
