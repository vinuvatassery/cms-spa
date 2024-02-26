/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { ApplicantInfo } from '../entities/applicant-info';
import { NewIDCardRequest } from '../entities/new-Id-card-request';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class ClientDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient,private readonly configurationProvider:ConfigurationProvider) {}

  /** Public methods **/
  loadDdlCaseOrigin() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadDdlPrimaryIdentities() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadDdlSpokenLanguages() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadDdlWrittenLanguages() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadDdlEnglishProficiencies() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadDdlRacialIdentities() {
    return of([
      {
        racialName: 'American ipsum dolor set',
        racialGroup: 'American Indian or Alaska Native',
      },
      {
        racialName: 'American dolor set',
        racialGroup: 'American Indian or Alaska Native',
      },
      {
        racialName: 'American ipsum loel set',
        racialGroup: 'American Indian or Alaska Native',
      },
      { racialName: 'Asian ipsum set', racialGroup: 'Asian' },
      { racialName: 'Asian dolor set', racialGroup: 'Asian' },
      { racialName: 'Asian ipsum ', racialGroup: 'Asian' },
      {
        racialName: 'Black loel set',
        racialGroup: 'Black and African American',
      },
      {
        racialName: 'Black dello dolor set',
        racialGroup: 'Black and African American',
      },
      {
        racialName: 'Black dolor set',
        racialGroup: 'Black and African American',
      },
    ]);
  }

  loadRdoTransGenders() {
    return of([
      {
        value: 'Yes',
        id: 1,
      },

      {
        value: 'No',
        id: 2,
      },

      {
        value: 'Not listed, please specify',
        id: 3,
      },

      {
        value: 'Don’t know',
        id: 4,
      },

      {
        value: 'Don’t know what this question asking',
        id: 5,
      },

      {
        value: 'Don’t want to answer',
        id: 6,
      },
    ]);
  }

  loadRdoSexAssigned() {
    return of([
      {
        value: 'Female',
        id: 1,
      },

      {
        value: 'Male',
        id: 2,
      },

      {
        value: 'Intersex',
        id: 3,
      },

      {
        value: 'Not listed, please specify',
        id: 4,
      },
    ]);
  }

  loadRdoMaterials() {
    return this.getPossibleAnswers();
  }

  loadRdoInterpreter() {
    return this.getPossibleAnswers();
  }

  loadRdoDeaf() {
    return this.getPossibleAnswers();
  }

  loadRdoBlind() {
    return this.getPossibleAnswers();
  }

  loadRdoWalking() {
    return this.getPossibleAnswers();
  }

  loadRdoDressingOrBathing() {
    return this.getPossibleAnswers();
  }

  loadRdoConcentration() {
    return this.getPossibleAnswers();
  }

  loadRdoErrands() {
    return this.getPossibleAnswers();
  }

  getPossibleAnswers(){
    return of([
      {
        value: 'YES',
        text:'Yes',
        id: 1,
      },

      {
        value: 'NO',
        text:'No',
        id: 2,
      },

      {
        value: 'DONT_KNOW',
        text:'Do not know',
        id: 3,
      },

      {
        value: 'DONT_WANT',
        text:'Do not want to answer',
        id: 4,
      },
    ]);
  }

  loadSpecialHandlings(): Observable<any> {
    {
      return of([
        {
          id: 1,
          key:'notes',
          specialHandling: 'Case Worker Note',
          answer: '',
        },
        {
          id: 2,
          specialHandling:
            'Needs materials in alternate format (Braille, large print, audio recordings, etc.)?',
            key:'materialInAlternateFormatDescription',
            otherFormatKey:'materialInAlternateFormatOther',
            descKey :"materialInAlternateFormatCodeOtherDesccription",
            answer: '',
        },
        {
          id: 3,
          specialHandling:
            'Needs interpreter?',
            key:'interpreterDescription',
            otherKey:'interpreterType',
            answer: '',
        },
        {
          id: 4,
          specialHandling:
            'Deaf or serious difficulty hearing?',
            key:'deafOrHearingDescription',
            otherKey:'startAgeDeafOrHearing',
            answer: '',
        },
        {
          id: 5,
          specialHandling:
            'Blind or serious difficulty seeing, even when wearing glasses?',
            key:'blindSeeingDescription',
            otherKey:'startAgeBlindSeeing',
            answer: '',
        },
        {
          id: 6,
          specialHandling:
            'Any limiting physical, mental or emotional conditions?',
            key:'limitingConditionDescription',
            otherKey:'',
            answer: '',
        },
        {
          id: 7,
          specialHandling:
            'Serious difficulty walking or climbing stairs?',
            key:'walkingClimbingDifficultyDescription',
            otherKey:'startAgeWalkingClimbingDifficulty',
            answer: '',
        },{
          id: 8,
          specialHandling:
            'Difficulty dressing or bathing?',
            key:'dressingBathingDifficultyDescription',
            otherKey:'startAgeDressingBathingDifficulty',
            answer: '',
        },
        {
          id: 9,
          specialHandling:
            'Serious difficulty concentrating, remembering, or making decisions due to a physical, mental, or emotional conditions?',
          answer: '',
          key:'concentratingDifficultyDescription',
          otherKey:'startAgeConcentratingDifficulty',
        },
        {
          id: 10,
          specialHandling:
            'Serious difficulty doing errands alone due to physical, mental, or emotional conditions?',
          answer: '',
          key:'errandsDifficultyDescription',
          otherKey:'startAgeErrandsDifficulty',
        },
      ]);
    }
  }
  save(applicantInfo: ApplicantInfo) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients`,
      applicantInfo,

    )}
    sendNewIdCard(newIDCardRequest : NewIDCardRequest){
      return this.http.post(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/sendidcard`,
        newIDCardRequest,

      )
    }
    load(clientId:any,caseId:any,eligibilityId:any){
      return this.http.get<ApplicantInfo>(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/cases/${caseId}/eligibility-periods/${eligibilityId}`,);
       }
    update(applicantInfo: ApplicantInfo,clientId:any) {
      return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}`,
        applicantInfo,

    )}
    searchDuplicateClient(clientData: any) {
      return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/duplicate-check`,
      clientData,
    )}
    removeClientNote(clientId: number, clientNoteId: string) {
      return this.http.delete(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/notes/${clientNoteId}`);
    }
    runImportedClaimRules(clientId: number){
      return this.http.get(
        `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/imported-claims/rules?clientId=${clientId}`,);
      }
}
