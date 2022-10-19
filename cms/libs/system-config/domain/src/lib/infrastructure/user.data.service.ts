/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Data services **/
import { User } from '../entities/user';

@Injectable({ providedIn: 'root' })
export class UserDataService {
  /** Constructor **/
  constructor(private readonly http: HttpClient) {}

  /** Public methods **/
  loadUsers(): Observable<User[]> {
    return of([
      { id: 1, name: 'Lorem ipsum', description: 'Lorem ipsum dolor sit amet' },
      {
        id: 2,
        name: 'At vero eos',
        description: 'At vero eos et accusam et justo duo dolores',
      },
      {
        id: 3,
        name: 'Duis autem',
        description: 'Duis autem vel eum iriure dolor in hendrerit',
      },
    ]);
  }
 

  loadUsersData() {
    return of([
      {
        id: 1,
        name: 'John Samuel',
        email: 'example@email.com',
        roleAssigned: 'Housing Supervisor',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'John',
        status: 'Active',
      },
      {
        id: 2,
        name: 'Lisa Mock',
        email: 'example@email.com',
        roleAssigned: 'Housing Supervisor',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'John',
        status: 'Active',
      },
      {
        id: 3,
        name: 'Miller Phil',
        email: 'example@email.com',
        roleAssigned: 'Housing Supervisor',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'John',
        status: 'Active',
      },
      {
        id: 4,
        name: 'John Mike',
        email: 'example@email.com',
        roleAssigned: 'Housing Supervisor',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'John',
        status: 'Active',
      },
    ]);
  }

  loadUserFilterColumn() {
    return of(['Column 1', 'Column 2', 'Column 3', 'Column 4']);
  }

  loadDdlUserRole() {
    return of(['Column 1', 'Column 2', 'Column 3', 'Column 4']);
  }

  loadUsersRoleAndPermissions() {
    return of([
      {
        id: 1,
        roleName: 'All Program - Super Admin',
        programAccess: 'CAREAssist, OHOP',
        usersPerRole: '1',
        status: 'Active',
        lastModified: 'MM/DD/YYYY',
      },
      {
        id: 2,
        roleName: 'OHOP - Admin',
        programAccess: ' OHOP',
        usersPerRole: '1',
        status: 'Active',
        lastModified: 'MM/DD/YYYY',
      },
    ]);
  }

  loadDdlRolesAndPermissionsFilter() {
    return of(['Column 1', 'Column 2', 'Column 3', 'Column 4']);
  }

  loadDdlColumnFilter() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadClientProfileLanguage() {
    return of([
      {
        order: '1',
        language: 'Lorem ipsum 1',
        lastModified: 'MM/DD/YYYY',
        status: 'Active',
      },
      {
        order: '2',
        language: 'Lorem ipsum 2',
        lastModified: 'MM/DD/YYYY',
        status: 'Active',
      },
      {
        order: '3',
        language: 'Lorem ipsum 3',
        lastModified: 'MM/DD/YYYY',
        status: 'Active',
      },
      {
        order: '4',
        language: 'Lorem ipsum 4',
        lastModified: 'MM/DD/YYYY',
        status: 'Active',
      },
      {
        order: '5',
        language: 'Lorem ipsum 5',
        lastModified: 'MM/DD/YYYY',
        status: 'Active',
      },
    ]);
  }

  loadClientProfileSlots() {
    return of([
      {
        fund: 'Formula',
        slotPerFund: '35',
        currentlyAssigned: '30',
        availableSlots: '5',
        lastModified: 'MM/DD/YYYY',
      },
      {
        fund: 'Session',
        slotPerFund: '30',
        currentlyAssigned: '30',
        availableSlots: '0',
        lastModified: 'MM/DD/YYYY',
      },
      {
        fund: 'Formula 1',
        slotPerFund: '40',
        currentlyAssigned: '30',
        availableSlots: '10',
        lastModified: 'MM/DD/YYYY',
      },
      {
        fund: 'Formula 2',
        slotPerFund: '55',
        currentlyAssigned: '40',
        availableSlots: '15',
        lastModified: 'MM/DD/YYYY',
      },
    ]);
  }

  loadClientProfileCaseAvailabilities() {
    return of([
      {
        userName: 'David Miller',
        caseAvailability: '15',
        currentCaseLoad: '10',
        lastModified: 'MM/DD/YYYY',
      },
      {
        userName: 'Miller John',
        caseAvailability: '10',
        currentCaseLoad: '10',
        lastModified: 'MM/DD/YYYY',
      },
      {
        userName: 'Clara Drill',
        caseAvailability: '15',
        currentCaseLoad: '10',
        lastModified: 'MM/DD/YYYY',
      },
    ]);
  }

  loadClientProfilePeriods() {
    return of([
      {
        lifetimePeriod: '48 months',
        effectiveDate: 'MM/DD/YYYY',
        comments: 'Lorem data comments in lorem ipsum',
        lastModified: 'MM/DD/YYYY',
      },
      {
        lifetimePeriod: '33 months',
        effectiveDate: 'MM/DD/YYYY',
        comments: 'Lorem data comments in lorem ipsum',
        lastModified: 'MM/DD/YYYY',
      },
      {
        lifetimePeriod: '44 months',
        effectiveDate: 'MM/DD/YYYY',
        comments: 'Lorem data comments in lorem ipsum',
        lastModified: 'MM/DD/YYYY',
      },
    ]);
  }

  loadSexualOrientationList(){
    return of([
      
        {
          order: "1",
          sexualOrientation: "Type one 1",
          lastModified: "XX/XX/XXXX",
          status: "Active",
        },
        {
          order: "2",
          sexualOrientation: "Lorem ipsum 2",
          lastModified: "XX/XX/XXXX",
          status: "Active",
        },
        {
          order: "3",
          sexualOrientation: "Lorem ipsum 3",
          lastModified: "XX/XX/XXXX",
          status: "Active",
        },
        {
          order: "4",
          sexualOrientation: "Lorem ipsum 4",
          lastModified: "XX/XX/XXXX",
          status: "Active",
        },
      
    ])
  }

  loadRacialOrEthnicIdentityList(){
    return of( [
      {
        category: "category 1",
        identity: "Lorem data 1",
        lastModified: "XX/XX/XXXX",
        status: "Active",
      },
      {
        category: "Lorem category 2",
        identity: "Lorem data 2",
        lastModified: "XX/XX/XXXX",
        status: "Active",
      },
      {
        category: "Lorem category 3",
        identity: "Lorem data 3",
        lastModified: "XX/XX/XXXX",
        status: "Active",
      },
      {
        category: "Lorem category 4",
        identity: "Lorem data 4",
        lastModified: "XX/XX/XXXX",
        status: "Active",
      },
    ])
  }

  loadPronounsList(){
    return of([
      {
        order: "1",
        pronouns: "She/Her",
        lastModified: "XX/XX/XXXX",
        status: "Active",
      },
      {
        order: "2",
        pronouns: "He/Him/His",
        lastModified: "XX/XX/XXXX",
        status: "Active",
      },
      {
        order: "3",
        pronouns: "They/Them/Theirs",
        lastModified: "XX/XX/XXXX",
        status: "Active",
      },
      {
        order: "4",
        pronouns: "Ella",
        lastModified: "XX/XX/XXXX",
        status: "Active",
      },
    ])
  }
  
  loadGenderList(){
    return of([
      {
        order: "1",
        gender: "Male",
        lastModified: "XX/XX/XXXX",
        status: "Active",
      },
      {
        order: "2",
        gender: "Lorem ipsum 2",
        lastModified: "XX/XX/XXXX",
        status: "Active",
      },
      {
        order: "3",
        gender: "Lorem ipsum 3",
        lastModified: "XX/XX/XXXX",
        status: "Active",
      },
      {
        order: "4",
        gender: "Lorem ipsum 4",
        lastModified: "XX/XX/XXXX",
        status: "Active",
      },
      {
        order: "5",
        gender: "Lorem ipsum 5",
        lastModified: "XX/XX/XXXX",
        status: "Active",
      },
    ])
  }
 
}
