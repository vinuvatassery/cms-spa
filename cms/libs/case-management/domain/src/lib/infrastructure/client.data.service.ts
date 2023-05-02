/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { ApplicantInfo } from '../entities/applicant-info';
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
        id: 1,
      },

      {
        value: 'NO',
        id: 2,
      },

      {
        value: 'Don’t know',
        id: 3,
      },

      {
        value: 'Don’t want to answer',
        id: 4,
      },
    ]);
  }

  loadSpecialHandlings(): Observable<any> {
    {
      return of([
        {
          id: 1,
          specialHandling: 'Case Worker Note',
          answer: 'Immediately transfer to Wesley Marascas',
        },
        {
          id: 2,
          specialHandling:
            'Blind or serious difficulty seeing, even when wearing glasses?',
          answer: 'Don’t want to answer',
        },
        {
          id: 3,
          specialHandling:
            'Any limiting physical, mental, or emotional conditions?',
          answer: 'Yes, since age 43',
        },
      ]);
    }
  }
  save(applicantInfo: ApplicantInfo) {  
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients`,
      applicantInfo,

    )}
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
}
