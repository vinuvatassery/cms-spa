/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { empty } from 'rxjs';
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
        value: 'Don’t know',
        id: 3,
      },

      {
        value: 'Don’t want to answer',
        id: 4,
      },
    ]);
  }

  loadRdoInterpreter() {
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
        value: 'Don’t know',
        id: 3,
      },

      {
        value: 'Don’t want to answer',
        id: 4,
      },
    ]);
  }

  loadRdoDeaf() {
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
        value: 'Don’t know',
        id: 3,
      },

      {
        value: 'Don’t want to answer',
        id: 4,
      },
    ]);
  }

  loadRdoBlind() {
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
        value: 'Don’t know',
        id: 3,
      },

      {
        value: 'Don’t want to answer',
        id: 4,
      },
    ]);
  }

  loadRdoWalking() {
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
        value: 'Don’t know',
        id: 3,
      },

      {
        value: 'Don’t want to answer',
        id: 4,
      },
    ]);
  }

  loadRdoDressingOrBathing() {
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
        value: 'Don’t know',
        id: 3,
      },

      {
        value: 'Don’t want to answer',
        id: 4,
      },
    ]);
  }

  loadRdoConcentration() {
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
        value: 'Don’t know',
        id: 3,
      },

      {
        value: 'Don’t want to answer',
        id: 4,
      },
    ]);
  }

  loadRdoErrands() {
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
setPronounList(){
  return of({
    first: [   
      {value: 'She/Her/Hers'  ,selected: false,code:"SHE_HER_HERS"},
      {value: 'He/Him/His',selected: false,code:"HE_HIM_HIS"},
      {value: 'They/Them/Theirs',selected: false,code:"THEY_THEM_THEIRS"},
      {value: 'Ella',selected: false,code:"ELLA"},
      {value: 'Él',selected: false,code:"EL"},
      {value: 'Elles',selected: false,code:"ELLES"},
      {value: 'No pronouns, use their name',selected: false,code:"NO_PRONOUN"},
      {value: 'Not listed, please specify:',selected: false,code:"NOT_LISTED"}
    ],
    second:[
      {value:'Don’t know what this question is asking',selected:false,code:"DONT_KNOW"},
      {value:'Don’t want to answer',selected:false,code:"DONT WANT"}
    ]
    },);
}
  // saveApplicationInfo():Observable<Client>{
  //     return empty();
  // }
  save(applicantInfo: ApplicantInfo) {  
    debugger;
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/applicant-info`,
      applicantInfo,

    )}
    load(clientCaseId:any,eligibilityId:any){
      return this.http.get<ApplicantInfo>(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/applicant-info/${clientCaseId}/${eligibilityId}`,);
       }
    
}
