/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Data services **/
import { User } from '../entities/user';
import { LoginUser } from '../entities/login-user';

/** Providers **/
import { ConfigurationProvider, LoaderService } from '@cms/shared/util-core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class UserDataService {
  private getUserProfileData = new BehaviorSubject<any>([]);
  getProfile$ = this.getUserProfileData.asObservable();
  /** Constructor **/
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) {}

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }
  /** Public methods **/
  getUserProfileDetails() {
    this.showLoader();
    this.getUserProfile().subscribe({
      next: (response: any) => {
        if (response) {
          this.getUserProfileData.next(response);
          this.hideLoader();
        }
        this.hideLoader();
      },
      error: (err: any) => {
        this.hideLoader();
        this.router.navigate(['/forbidden']);
      },
    });
  }
  getUserProfile() {
    return this.http.get(
      `${this.configurationProvider.appSettings.sysConfigApiUrl}/system-config/users/user-profile`
    );
  }

  getUserById(userId: string) {
    return this.http.get<LoginUser[]>(
      `${this.configurationProvider.appSettings.sysConfigApiUrl}` +
        `/system-config/users/${userId}`
    );
  }

  getUsersByRole(roleCode: string) {
    return this.http.get<LoginUser[]>(
      `${this.configurationProvider.appSettings.sysConfigApiUrl}` +
        `/system-config/users/roleCode=${roleCode}`
    );
  }

  //text should be either name or P#
  searchUsersByRole(roleCode: string, text: string) {
    return this.http.get<LoginUser[]>(
      `${this.configurationProvider.appSettings.sysConfigApiUrl}` +
        `/system-config/users/roleCode=${roleCode}/text=${text}`
    );
  }

  getUserImage(userId: string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.sysConfigApiUrl}` +
        `/system-config/users/${userId}/profile-photo`,
      { responseType: 'text' }
    );
  }

  reassignCase(caseReassignData: any) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-case/reassign`,
      caseReassignData
    );
  }

  getUserProfilePhotos(userIds : string) { 
    return this.http.get<any[]>(
      `${this.configurationProvider.appSettings.sysConfigApiUrl}`+
      `/system-config/users/${userIds}/profile-photos`);  
  }

  getUserProfilePhotos(userIds : string) { 
    return this.http.get<any[]>(
      `${this.configurationProvider.appSettings.sysConfigApiUrl}`+
      `/system-config/users/${userIds}/profile-photos`);  
  }
  
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

  loadSexualOrientationList() {
    return of([
      {
        order: '1',
        sexualOrientation: 'Type one 1',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        order: '2',
        sexualOrientation: 'Lorem ipsum 2',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        order: '3',
        sexualOrientation: 'Lorem ipsum 3',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        order: '4',
        sexualOrientation: 'Lorem ipsum 4',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
    ]);
  }

  loadRacialOrEthnicIdentityList() {
    return of([
      {
        category: 'category 1',
        identity: 'Lorem data 1',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        category: 'Lorem category 2',
        identity: 'Lorem data 2',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        category: 'Lorem category 3',
        identity: 'Lorem data 3',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        category: 'Lorem category 4',
        identity: 'Lorem data 4',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
    ]);
  }

  loadPronounsList() {
    return of([
      {
        order: '1',
        pronouns: 'She/Her',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        order: '2',
        pronouns: 'He/Him/His',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        order: '3',
        pronouns: 'They/Them/Theirs',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        order: '4',
        pronouns: 'Ella',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
    ]);
  }

  loadGenderList() {
    return of([
      {
        order: '1',
        gender: 'Male',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        order: '2',
        gender: 'Lorem ipsum 2',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        order: '3',
        gender: 'Lorem ipsum 3',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        order: '4',
        gender: 'Lorem ipsum 4',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        order: '5',
        gender: 'Lorem ipsum 5',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
    ]);
  }

  loadHousingAcuityLevelList() {
    return of([
      {
        acuitylevel: '2',
        order: '1',
        suitation: 'Formerly Individual family',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        acuitylevel: '2',
        order: '1',
        suitation: 'Formerly Individual family',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        acuitylevel: '2',
        order: '1',
        suitation: 'Formerly Individual family',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        acuitylevel: '2',
        order: '1',
        suitation: 'Formerly Individual family',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        acuitylevel: '2',
        order: '1',
        suitation: 'Formerly Individual family',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
    ]);
  }
  loadIncomeInclusionsExlusionsList() {
    return of([
      {
        inclusions: 'Formerly Individual family',
        lastModified: 'XX/XX/XXXX',
      },
      {
        inclusions: 'Formerly Individual family',
        lastModified: 'XX/XX/XXXX',
      },
      {
        inclusions: 'Formerly Individual family',
        lastModified: 'XX/XX/XXXX',
      },
      {
        inclusions: 'Formerly Individual family',
        lastModified: 'XX/XX/XXXX',
      },
      {
        inclusions: 'Formerly Individual family',
        lastModified: 'XX/XX/XXXX',
      },
    ]);
  }
  loadRegionAssignmentList() {
    return of([
      {
        region: 'Region1',
        assignto: 'Ethan Endrson',
        countries: 'Baker, Grant , Union,Umatilla',
        lastmodified: 'XX/XX/XXXX',
      },

      {
        region: 'Region2',
        assignto: 'Sophia Brown',
        countries: 'Harney, Lake , Malehur,Polk',
        lastmodified: 'XX/XX/XXXX',
      },
      {
        region: 'Region3',
        assignto: 'Noah Davis',
        countries: 'Coos , Curry , Douglas,Jackson',
        lastmodified: 'XX/XX/XXXX',
      },
      {
        region: 'Region4',
        assignto: 'Ava Johnson',
        countries: 'Crook, Deschutes , Lane,Wheeler',
        lastmodified: 'XX/XX/XXXX',
      },
      {
        region: 'Region5',
        assignto: 'Sophia Jhons',
        countries: 'Benton, Morrow , Sherman,clatsop',
        lastmodified: 'XX/XX/XXXX',
      },
    ]);
  }
  loadPSMFRZIPList() {
    return of([
      {
        year: '2020',
        county: 'Benton',
        housingtype: '0-Studio',
        psmfrzip: 'FMR',
        amount: '869.00',
        lastModified: 'XX/XX/XXXX',
        status: 'status',
      },
      {
        year: '2020',
        county: 'Benton',
        housingtype: '0-Studio',
        psmfrzip: 'Payment Standard',
        amount: '785.00',
        lastModified: 'XX/XX/XXXX',
        status: 'status',
      },
      {
        year: '2020',
        county: 'Benton',
        housingtype: '0-Studio',
        psmfrzip: 'ZIP Code',
        amount: '785.00',
        lastModified: 'XX/XX/XXXX',
        status: 'status',
      },
      {
        year: '2020',
        county: 'Benton',
        housingtype: '0-Studio',
        psmfrzip: 'ZIP Code',
        amount: '785.00',
        lastModified: 'XX/XX/XXXX',
        status: 'status',
      },
    ]);
  }
  loadServiceProviderList() {
    return of([
      {
        serviceprovidername: '2020',
        type: 'Benton',
        vendorid: '0-Studio',
        mailcode: 'FMR',
        accountno: '869.00',
        phoneno: 'Benton',
        address: '0-Studio',
        emailid: 'FMR',
        contactperson: '869.00',
        combinedpayments: '0-Studio',
        nameoncheck: 'FMR',
        comments: '869.00',
        lastModified: 'XX/XX/XXXX',
      },
    ]);
  }

  loadDirectMessageLogEventService() {
    return of([
      {
        id: 1,
        scenario: 'Automatic event logging of direct messages',
        frequency: 'Every 90 days',
        lastModified: '01/01/2021',
        modifiedBy: 'LM',
      },
      {
        id: 1,
        scenario: 'Automatic archival of direct messages',
        frequency: 'Every 180 days',
        lastModified: '01/01/2021',
        modifiedBy: 'LM',
      },
      {
        id: 1,
        scenario: 'Automatic event logging of direct messages',
        frequency: 'Every 180 days',
        lastModified: '01/01/2021',
        modifiedBy: 'LM',
      },
    ]);
  }
}
