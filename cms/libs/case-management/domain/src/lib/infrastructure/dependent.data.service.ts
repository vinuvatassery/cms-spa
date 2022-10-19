/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';

@Injectable({ providedIn: 'root' })
export class DependentDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient) {}

  /** Public methods **/
  loadDependentSearch() {
    return of([
      {
        name: 'Donna Summer',
        id: 'XXXX',
        dob: '08-11-1995',
        ssn: '956-08-9876',
        memberType: 'CA/OHOP Family/Household Members',
      },
      {
        name: 'David Miller',
        id: 'XXXX',
        dob: '06-18-1992',
        ssn: '406-90-3456',
        memberType: 'CA/OHOP Family/Household Members',
      },
      {
        name: 'Philip David',
        id: 'XXXX',
        dob: '08-21-1991',
        ssn: '136-63-8736',
        memberType: 'CA/OHOP Family/Household Members',
      },
      {
        name: 'Mike Flex',
        id: 'XXXX',
        dob: '02-24-1990',
        ssn: '890-75-9876',
        memberType: 'CA/OHOP Family/Household Members',
      },
      {
        name: 'Donna Summer',
        id: 'XXXX',
        dob: '08-11-1995',
        ssn: '956-08-9876',
        memberType: 'Clients',
      },
      {
        name: 'David Miller',
        id: 'XXXX',
        dob: '06-18-1992',
        ssn: '406-90-3456',
        memberType: 'Clients',
      },
      {
        name: 'Philip David',
        id: 'XXXX',
        dob: '08-21-1991',
        ssn: '136-63-8736',
        memberType: 'Clients',
      },
      {
        name: 'Mike Flex',
        id: 'XXXX',
        dob: '02-24-1990',
        ssn: '890-75-9876',
        memberType: 'Clients',
      },
    ]);
  }

  loadDependents() {
    return of([
      {
        FullLegalName: 'Drill John',
        RelationshipToClient: 'Spouse',
        CAREAssistClient: 'Yes',
        DateOfBirth: '10-10-1988 (Age 32)',
        InsurancePlan: 'Yes',
      },
      {
        FullLegalName: 'John Mill',
        RelationshipToClient: 'Son',
        CAREAssistClient: 'Yes',
        DateOfBirth: '10-10-1994 (Age xx)',
        InsurancePlan: 'Yes',
      },
      {
        FullLegalName: 'John David',
        RelationshipToClient: 'Son',
        CAREAssistClient: 'Yes',
        DateOfBirth: '10-10-1995 (Age xx)',
        InsurancePlan: 'Yes',
      },
    ]);
  }

  loadDdlRelationships() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadFamilyDependents() {
    return of([
      {
        name: 'Donna Summer',
        id: 'XXXX',
        dob: '10-10-1995',
        ssn: '001-01-0001',
      },
      {
        name: 'David Miller',
        id: 'XXXX',
        dob: '10-10-1995',
        ssn: '002-02-0002',
      },
      {
        name: 'Philip David',
        id: 'XXXX',
        dob: '10-10-1995',
        ssn: '003-03-0003',
      },
      { name: 'Mike Flex', id: 'XXXX', dob: '10-10-1995', ssn: '004-04-0004' },
    ]);
  }
}
