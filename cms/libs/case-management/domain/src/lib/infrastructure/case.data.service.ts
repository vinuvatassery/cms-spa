/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Entities **/
import { Case } from '../entities/case';

@Injectable({ providedIn: 'root' })
export class CaseDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient) {}

  /** Public methods **/
  loadCases(): Observable<Case[]> {
    return of([
      {
        ClientName: 'John Sakariya',
        Pronouns: 'She/Her/Hers',
        ID: 100,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'David Miller',
        Pronouns: 'She/Her/Hers',
        ID: 101,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'Clara Stephen',
        Pronouns: 'She/Her/Hers',
        ID: 102,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'David Miller',
        Pronouns: 'She/Her/Hers',
        ID: 103,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'Johny Slot',
        Pronouns: 'She/Her/Hers',
        ID: 104,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'Chris Fedex',
        Pronouns: 'She/Her/Hers',
        ID: 105,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'Amaze Judge',
        Pronouns: 'She/Her/Hers',
        ID: 106,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'Dude Vills',
        Pronouns: 'She/Her/Hers',
        ID: 107,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
    ]);
  }

  loadCaseBySearchText() {
    return of([
      {
        name: 'Donna Summer',
        id: 'XXXX',
        dob: '01-23-1997',
        ssn: '294-95-7054',
      },
      {
        name: 'David Miller',
        id: 'XXXX',
        dob: '02-24-1996',
        ssn: '234-45-7654',
      },
      {
        name: 'Philip David',
        id: 'XXXX',
        dob: '03-25-1995',
        ssn: '304-09-7094',
      },
      { name: 'Mike Flex', id: 'XXXX', dob: '04-22-1994', ssn: '934-05-7494' },
      { name: 'Mike Flex', id: 'XXXX', dob: '05-21-1993', ssn: '275-40-7609' },
      { name: 'Mike Flex', id: 'XXXX', dob: '06-20-1992', ssn: '134-12-2554' },
      { name: 'Mike Flex', id: 'XXXX', dob: '07-19-1991', ssn: '964-24-7854' },
      { name: 'Mike Flex', id: 'XXXX', dob: '08-18-1998', ssn: '504-35-8454' },
    ]);
  }

  loadCasesForAuthuser(): Observable<Case[]> {
    return of([
      {
        ClientName: 'John Sakariya',
        Pronouns: 'She/Her/Hers',
        ID: 100,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'David Miller',
        Pronouns: 'She/Her/Hers',
        ID: 101,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'Clara Stephen',
        Pronouns: 'She/Her/Hers',
        ID: 102,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'David Miller',
        Pronouns: 'She/Her/Hers',
        ID: 103,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'Johny Slot',
        Pronouns: 'She/Her/Hers',
        ID: 104,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'Chris Fedex',
        Pronouns: 'She/Her/Hers',
        ID: 105,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'Amaze Judge',
        Pronouns: 'She/Her/Hers',
        ID: 106,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'Dude Vills',
        Pronouns: 'She/Her/Hers',
        ID: 107,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
    ]);
  }

  loadRecentCases(): Observable<Case[]> {
    return of([
      {
        ClientName: 'John Sakariya',
        Pronouns: 'She/Her/Hers',
        ID: 100,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'David Miller',
        Pronouns: 'She/Her/Hers',
        ID: 101,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'Clara Stephen',
        Pronouns: 'She/Her/Hers',
        ID: 102,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'David Miller',
        Pronouns: 'She/Her/Hers',
        ID: 103,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'Johny Slot',
        Pronouns: 'She/Her/Hers',
        ID: 104,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'Chris Fedex',
        Pronouns: 'She/Her/Hers',
        ID: 105,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'Amaze Judge',
        Pronouns: 'She/Her/Hers',
        ID: 106,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'Dude Vills',
        Pronouns: 'She/Her/Hers',
        ID: 107,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
    ]);
  }

  loadLastVisitedCases() {
    return of([
      {
        name: 'Donna 1',
        id: '1',
        programId: '2',
        isApplicationComplete: false,
      },
      {
        name: 'David 2',
        id: '2',
        programId: '1',
        isApplicationComplete: true,
      },
      {
        name: 'Philip 3',
        id: '3',
        programId: '2',
        isApplicationComplete: true,
      },
      { name: 'Mike Flex1', id: '4', programId: '1', isApplicationComplete: true },
      { name: 'Mike Flex2', id: '5', programId: '2', isApplicationComplete: true },
      { name: 'Mike Flex3', id: '6', programId: '1', isApplicationComplete: true },
      { name: 'Mike Flex4', id: '7', programId: '2', isApplicationComplete: true },
      { name: 'Mike Flex5', id: '8', programId: '1', isApplicationComplete: true },
    ]);
  }

  loadDdlGridColumns() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadDdlCommonActions() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadDdlSendLetters() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadCaseOwners() {
    return of([
      'Albania Bose',
      'Doll Stpephy',
      'John Scena',
      'Anony Hooks',
      'David Miller',
      'Bellary John',
    ]);
  }

  loadDdlPrograms() {
    return of([
      { key: 1, value: 'CAREAssist', default: true },
      { key: 2, value: 'OHOP', default: false },
    ]);
  }

  loadDdlCaseOrigins() {
    return of(['Client Portal', 'Email', 'Paper', 'Phone']);
  }

  loadDdlFamilyAndDependentEP() {
    return of([
      '01-01-2022 - 02-02-2022',
      '01-01-2022 - 02-02-2022',
      '01-01-2022 - 02-02-2022',
      '01-01-2022 - 02-02-2022',
    ]);
  }

  loadDdlEPEmployments() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  getClientInfo(){
   return of([{
      "client": {
        "clientId": 0,
        "firstName": "Post Man 10",
        "middleName": "C",
        "lastName": "API",   
        "dob": "1990-10-08T00:56:56.239Z",
        "ssn": "345-45-6756",   
        "ssnNotApplicableFlag": "N",
        "genderAtBirthCode": "MALE",
        "genderAtBirthDesc": "",
        "urn": "OH 12345 (CN)",
        "encryptedUrn": "string",
        "genderType": "string",
        "clientTransgenderCode": "N",
        "clientTransgenderDesc": "NA",
        "materialInAlternateFormatCode": "NA",
        "materialInAlternateFormatDesc": "NA",
        "spokenLanguageCode": "E",
        "writtenLanguageCode": "C",
        "englishProficiencyCode": "VERY_WELL",
        "interpreterCode": "Y",
        "interpreterType": "interpreter example type",
        "deafOrHearingCode": "Y",
        "startAgeDeafOrHearing": 10,
        "blindSeeingCode": "Y",
        "startAgeBlindSeeing": 20,
        "limitingConditionCode": "Y",
        "startAgeLimitingCondition": 30,
        "walkingClimbingDifficultyCode": "Y",
        "startAgeWalkingClimbingDifficulty": 26,
        "dressingBathingDifficultyCode": "Y",
        "startAgeDressingBathingDifficulty": 70,
        "concentratingDifficultyCode": "Y",
        "startAgeConcentratingDifficulty": 58,
        "errandsDifficultyCode": "N",
        "startAgeErrandsDifficulty": 0,
        "preferredContactCode": "s",
        "contactName": "string",
        "contactRelationshipCode": "string"
      },
      "clientCase": {
        "clientCaseId": "00000000-0000-0000-0000-000000000000",
        "clientId": 0,
        "programId": "7b52cda2-aadd-4d4d-a42a-fc765165b506",
        "caseOriginCode": "Email",
        "caseStartDate": "2022-10-11",  
        "caseStatusCode": "s"
        
      },
     "clientCaseEligibility": {
        "clientCaseEligibilityId": "00000000-0000-0000-0000-000000000000",
        "clientCaseId": "00000000-0000-0000-0000-000000000000",
        "insuranceFirstName": "string",
        "insuranceLastName": "string",
        "officialIdFirstName": "string",
        "officialIdLastName": "string",
        "groupCode": "string",
        "registerToVoteFlag": "Y",
        "assignedCwUserId":"6367D893-679D-488B-BA8D-6B2E04B16711"
      },
      "clientPronoun": [
        {
          "clientPronounId": "00000000-0000-0000-0000-000000000000",
          "clientId": 0,
          "clientPronounCode": "NOT_LISTED",
          "otherDesc": "my own"
        }
      ],
    
      "clientSexualIdentity": [
        {
          "clientSexualIdentityId": "00000000-0000-0000-0000-000000000000",
          "clientId": 0,
          "clientSexualIdentityCode": "Straight",
          "otherDesc": ""
        }
      ],
      "clientRace": [
        {
          "clientRaceId": "00000000-0000-0000-0000-000000000000",
          "clientId": 0,
          "clientRaceCategoryCode": "ASIAN",
          "clientEthnicIdentityCode": "ASIAN",
          "isPrimaryFlag": "Y",
          "raceDesc": "string"
        }
      ]
      ,
       "clientGender": [
        {
          "clientGenderId": "00000000-0000-0000-0000-000000000000",
          "clientId": 0,
          "clientGenderCode": "string",
          "otherDesc": "string"
        }
      ]
    }]);
  }

}
