/** Angular **/
import { OnInit, Component, ChangeDetectionStrategy,ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseFacade, ClientProfile,ClientFacade } from '@cms/case-management/domain';
import { first, Subject } from 'rxjs';
import { LoaderService } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-profile-client-page',
  templateUrl: './profile-client-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileClientPageComponent implements OnInit {

  profileClientId!: number;
  clientCaseEligibilityId!: any;
  clientCaseId!: any;
  specialHandlings$ = this.clientFacade.specialHandlings$;
  tabId! : any
  clientNotes:any[] =[];
  answersKeys:any[] =[];
  questions:any[] =[];
  private clientSubject = new Subject<any>();
  clientProfile$ = this.caseFacade.clientProfile$;
  loadedClient$ = this.clientSubject.asObservable();
  constructor(
    private readonly caseFacade: CaseFacade,
    private route: ActivatedRoute,
    private clientFacade: ClientFacade,
    private loaderService: LoaderService,
    private cdRef: ChangeDetectorRef,
  
  ) { }
  
  ngOnInit(): void {
    this. loadQueryParams() ;
  }


  /** Private properties **/
  loadQueryParams()
  {
    this.profileClientId = this.route.snapshot.queryParams['id'];
    this.clientCaseEligibilityId = this.route.snapshot.queryParams['e_id'];   
    this.tabId = this.route.snapshot.queryParams['tid'];
    this.clientCaseId =this.route.snapshot.queryParams['cid'];
    this.loadReadOnlyClientInfoEventHandler()
  }

  loadReadOnlyClientInfoEventHandler() {
    this.caseFacade.loadClientProfile(this.clientCaseEligibilityId);  
    this.specialHandlings$.subscribe(question =>{
      this.questions = question;
    })
    this.loadApplicantInfo(); 

    this.onClientProfileLoad()
  }

  onClientProfileLoad() {
    this.clientProfile$?.pipe(first((clientData: any) => clientData?.clientId > 0))
      .subscribe((clientData: ClientProfile) => {
        if (clientData?.clientId > 0) {

          const client = {

            clientId: clientData?.clientId,
            firstName: clientData?.firstName,
            middleName: clientData?.middleName,
            lastName: clientData?.lastName,
            caseManagerId: clientData?.caseManagerId,
            caseManagerName: clientData?.caseManagerName,
            caseManagerPNumber: clientData?.caseManagerPNumber,
            caseManagerDomainCode: clientData?.caseManagerDomainCode,
            caseManagerAssisterGroup: clientData?.caseManagerAssisterGroup,
            caseManagerPhone: clientData?.caseManagerPhone,
            caseManagerEmail: clientData?.caseManagerEmail,
            caseManagerFax: clientData?.caseManagerFax,
            caseManagerAddress1: clientData?.caseManagerAddress1,
            caseManagerAddress2: clientData?.caseManagerAddress2,
            caseManagerCity: clientData?.caseManagerCity,
            caseManagerState: clientData?.caseManagerState,
            caseManagerZip: clientData?.caseManagerZip,
            insuranceFirstName: clientData?.insuranceFirstName,
            insuranceLastName: clientData?.insuranceLastName,
            officialIdFirstName: clientData?.officialIdFirstName,
            officialIdLastName: clientData?.officialIdLastName,
            dob: clientData?.dob,
            pronouns: clientData?.pronouns,
            genderDescription: clientData?.genderDescription,
            gender: clientData?.gender,
            ssn: clientData?.ssn,
            clientTransgenderCode: clientData?.clientTransgenderCode,
            clientTransgenderDesc: clientData?.clientTransgenderDesc,
            clientSexualIdentities: clientData?.clientSexualIdentities,
            otherSexualDesc: clientData?.otherSexualDesc,
            spokenLanguage: clientData?.spokenLanguage,
            writtenLanguage: clientData?.writtenLanguage,
            englishProficiency: clientData?.englishProficiency,
            ethnicIdentity: clientData?.ethnicIdentity,
            racialIdentities: clientData?.racialIdentities,
            primaryRacialIdentity: clientData?.primaryRacialIdentity,
            lastModificationTime: clientData?.lastModificationTime,
            lastModifierName: clientData?.lastModifierName,
            lastModifierId: clientData?.lastModifierId
          }

          this.clientSubject.next(client);

        }
      });

  }
   loadApplicantInfo() {
   
    this.loaderService.show();
    this.clientFacade
      .load(
        this.profileClientId,
        this.clientCaseId,
        this.clientCaseEligibilityId)
      .subscribe({
        next: (response: any) => {
          if (response) {
            this.loaderService.hide();
            /**Populating Client */
            //this.applicantInfo.client = response.client;
            if(response.clientNotes?.length > 0){
              this.clientNotes = response.clientNotes;
            }else {
              this.clientNotes = [];
            }
            
            this.answersKeys = Object.entries(response?.client).map(([key, value]) => ({key, value}));
            
            if(this.answersKeys && this.answersKeys.length > 0){
               this.questions.forEach(question =>{
                question.answer = this.answersKeys.find(answer =>answer.key == question.key)?.value;
                if(question.answer == "Yes" && question.otherKey != 'interpreterType' && question.otherFormatKey != 'materialInAlternateFormatOther' && question.descKey != 'materialInAlternateFormatCodeOtherDesccription' && question.key != 'limitingConditionDescription'){
                  question.answer = question.answer+' ' +', Since age'+ ' ' +this.answersKeys.find(answer =>answer.key == question.otherKey)?.value; 
                } else if(question.id == 1  ){
                  question.answer =this.clientNotes.length > 0 ? this.clientNotes.map(function (e) { return e?.note;}).join(', ') : 'No Notes'
                } else if(question.answer == "Yes" && question.otherKey == 'interpreterType'){
                  question.answer ='Yes' + ' ,' + this.answersKeys.find(answer =>answer.key == question.otherKey)?.value;
                }
                else if(question.answer == "Yes"  &&  question.descKey == 'materialInAlternateFormatCodeOtherDesccription' && !this.answersKeys.find(answer =>answer.key == question.otherFormatKey)?.value){
                  question.answer = 'Yes' + ' ,' + this.answersKeys.find(answer =>answer.key == question.descKey)?.value;
                }
                else if(question.answer == "Yes"  &&  question.otherFormatKey == 'materialInAlternateFormatOther' ){
                  question.answer ='Yes' + ' ,' + this.answersKeys.find(answer =>answer.key == question.descKey)?.value +' ,'+ this.answersKeys.find(answer =>answer.key == question.otherFormatKey)?.value;
                }
              });
              this.cdRef.detectChanges();
            }
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
        },
      });}
}
