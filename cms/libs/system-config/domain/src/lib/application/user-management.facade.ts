/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { User } from '../entities/user';
/** Data services **/
import { UserDataService } from '../infrastructure/user.data.service';

@Injectable({ providedIn: 'root' })
export class UserManagementFacade {
  /** Private properties **/

  private userListSubject = new BehaviorSubject<User[]>([]);
  private usersDataSubject = new BehaviorSubject<any>([]);
  private usersFilterColumnSubject = new BehaviorSubject<any>([]);
  private ddlUserRoleSubject = new BehaviorSubject<any>([]);
  private usersRoleAndPermissionsSubject = new BehaviorSubject<any>([]);
  private ddlRolesAndPermissionsFilterSubject = new BehaviorSubject<any>([]);
  private userSubject = new BehaviorSubject<User[]>([]);
  private ddlColumnFiltersSubject = new BehaviorSubject<any>([]);
  private clientProfileLanguagesSubject = new BehaviorSubject<any>([]);
  private clientProfileSlotsSubject = new BehaviorSubject<any>([]);
  private clientProfileCaseAvailabilitiesSubject = new BehaviorSubject<any>([]);
  private clientProfilePeriodsSubject = new BehaviorSubject<any>([]);
  private clientProfileSexualOrientationSubject = new BehaviorSubject<any>([]);
  private clientProfileRacialOrEthnicIdentitySubject = new BehaviorSubject<any>([]);
  private clientProfilePronounsSubject = new BehaviorSubject<any>([]);
  private clientProfileGenderSubject = new BehaviorSubject<any>([]);
 
  private clientProfileHousingAcuityLevelSubject = new BehaviorSubject<any>([]);
  private clientProfileIncomeInclusionsExlusionsSubject = new BehaviorSubject<any>([]);
  private clientProfileRegionAssignmentSubject = new BehaviorSubject<any>([]);
  private clientProfilePSMFRZIPSubject = new BehaviorSubject<any>([]);
  private clientProfileServiceProviderSubject = new BehaviorSubject<any>([]);
  
 
  /** Public properties **/
  users$ = this.userSubject.asObservable();
  userList$ = this.userListSubject.asObservable();
  usersData$ = this.usersDataSubject.asObservable();
  usersFilterColumn$ = this.usersFilterColumnSubject.asObservable();
  ddlUserRole$ = this.ddlUserRoleSubject.asObservable();
  usersRoleAndPermissions$ = this.usersRoleAndPermissionsSubject.asObservable();
  ddlRolesAndPermissionsFilter$ =
    this.ddlRolesAndPermissionsFilterSubject.asObservable();
  ddlColumnFilters$ = this.ddlColumnFiltersSubject.asObservable();
  clientProfileLanguages$ = this.clientProfileLanguagesSubject.asObservable();
  clientProfileSlots$ = this.clientProfileSlotsSubject.asObservable();
  clientProfileCaseAvailabilities$ =
    this.clientProfileCaseAvailabilitiesSubject.asObservable();
  clientProfilePeriods$ = this.clientProfilePeriodsSubject.asObservable();
  clientProfileSexualOrientation$ = this.clientProfileSexualOrientationSubject.asObservable();
  clientProfileRacialOrEthnicIdentity$ = this.clientProfileRacialOrEthnicIdentitySubject.asObservable();
  clientProfilePronouns$ = this.clientProfilePronounsSubject.asObservable();
  clientProfileGender$ = this.clientProfileGenderSubject.asObservable();
 
  clientProfileHousingAcuityLevel$ = this.clientProfileHousingAcuityLevelSubject.asObservable();
  clientProfilIncomeInclusionsExlusions$ = this.clientProfileIncomeInclusionsExlusionsSubject.asObservable();
  clientProfilRegionAssignment$ = this.clientProfileRegionAssignmentSubject.asObservable();
  clientProfilPSMFRZIP$ = this.clientProfilePSMFRZIPSubject.asObservable();
  clientProfilServiceProvider$ = this.clientProfileServiceProviderSubject.asObservable();
 
  /** Constructor **/
  constructor(private readonly userDataService: UserDataService) {}

  /** Public methods **/
  loadUsers(): void {
    this.userDataService.loadUsers().subscribe({
      next: (userResponse) => {
        this.userSubject.next(userResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
 

  loadUsersData(): void {
    this.userDataService.loadUsersData().subscribe({
      next: (usersDataResponse) => {
        this.usersDataSubject.next(usersDataResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadUserFilterColumn(): void {
    this.userDataService.loadUserFilterColumn().subscribe({
      next: (usersFilterColumnResponse) => {
        this.usersFilterColumnSubject.next(usersFilterColumnResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlUserRole(): void {
    this.userDataService.loadDdlUserRole().subscribe({
      next: (ddlUserRoleResponse) => {
        this.ddlUserRoleSubject.next(ddlUserRoleResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadUsersRoleAndPermissions(): void {
    this.userDataService.loadUsersRoleAndPermissions().subscribe({
      next: (usersRoleAndPermissionsResponse) => {
        this.usersRoleAndPermissionsSubject.next(
          usersRoleAndPermissionsResponse
        );
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlRolesAndPermissionsFilter(): void {
    this.userDataService.loadDdlRolesAndPermissionsFilter().subscribe({
      next: (ddlRolesAndPermissionsFilterResponse) => {
        this.ddlRolesAndPermissionsFilterSubject.next(
          ddlRolesAndPermissionsFilterResponse
        );
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlColumnFilters() {
    this.userDataService.loadDdlColumnFilter().subscribe({
      next: (ddlColumnFilters) => {
        this.ddlColumnFiltersSubject.next(ddlColumnFilters);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadClientProfileLanguages() {
    this.userDataService.loadClientProfileLanguage().subscribe({
      next: (clientProfileLanguages) => {
        this.clientProfileLanguagesSubject.next(clientProfileLanguages);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadClientProfileSlots() {
    this.userDataService.loadClientProfileSlots().subscribe({
      next: (clientProfileSlots) => {
        this.clientProfileSlotsSubject.next(clientProfileSlots);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadClientProfileCaseAvailabilities() {
    this.userDataService.loadClientProfileCaseAvailabilities().subscribe({
      next: (clientProfileCaseAvailabilities) => {
        this.clientProfileCaseAvailabilitiesSubject.next(
          clientProfileCaseAvailabilities
        );
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadClientProfilePeriods() {
    this.userDataService.loadClientProfilePeriods().subscribe({
      next: (clientProfilePeriods) => {
        this.clientProfilePeriodsSubject.next(clientProfilePeriods);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadSexualOrientationList(){
    this.userDataService.loadSexualOrientationList().subscribe({
      next: (clientProfileSexualOrientation) => {
        this.clientProfileSexualOrientationSubject.next(clientProfileSexualOrientation);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
  loadRacialOrEthnicIdentityList(){
    this.userDataService.loadRacialOrEthnicIdentityList().subscribe({
      next: (clientProfileRacialOrEthnicIdentity) => {
        this.clientProfileRacialOrEthnicIdentitySubject.next(clientProfileRacialOrEthnicIdentity);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
  loadPronounsList(){
    this.userDataService.loadPronounsList().subscribe({
      next: (clientProfilePronouns) => {
        this.clientProfilePronounsSubject.next(clientProfilePronouns);
      },
      error: (err) => {
        console.error('err', err);
      },
    });

  }
  loadGenderList(){
    this.userDataService.loadGenderList().subscribe({
      next: (clientProfileGender) => {
        this.clientProfileGenderSubject.next(clientProfileGender);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
 
  loadHousingAcuityLevelList(){
    this.userDataService.loadHousingAcuityLevelList().subscribe({
      next: (clientProfileHousingAcuityLevel) => {
        this.clientProfileHousingAcuityLevelSubject.next(clientProfileHousingAcuityLevel);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
  loadIncomeInclusionsExlusionsList(){
    this.userDataService.loadIncomeInclusionsExlusionsList().subscribe({
      next: (clientProfilIncomeInclusionsExlusions) => {
        this.clientProfileIncomeInclusionsExlusionsSubject.next(clientProfilIncomeInclusionsExlusions);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
 
  loadRegionAssignmentList(){
    this.userDataService.loadRegionAssignmentList().subscribe({
      next: (clientProfilRegionAssignment) => {
        this.clientProfileRegionAssignmentSubject.next(clientProfilRegionAssignment);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
  loadPSMFRZIPList(){
    this.userDataService.loadPSMFRZIPList().subscribe({
      next: (clientProfilPSMFRZIP) => {
        this.clientProfilePSMFRZIPSubject.next(clientProfilPSMFRZIP);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadServiceProviderList(){
    this.userDataService.loadServiceProviderList().subscribe({
      next: (clientProfilServiceProvider) => {
        this.clientProfileServiceProviderSubject.next(clientProfilServiceProvider);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
 
}
