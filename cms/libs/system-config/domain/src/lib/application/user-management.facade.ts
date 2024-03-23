
/** Angular **/
import { Injectable } from '@angular/core';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType, NotificationSource } from '@cms/shared/util-core';
import { Subject, first } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LoginUser } from '../entities/login-user';
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
  private usersByRoleSubject = new BehaviorSubject<LoginUser[]>([]);
  private userImageSubject = new Subject<any>();
  private userByIdSubject = new Subject<any>(); 
  private profilePhotosSubject = new BehaviorSubject<any>([]);
 
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
  usersByRole$ = this.usersByRoleSubject.asObservable();
  userImage$ = this.userImageSubject.asObservable();
  usersById$ = this.userByIdSubject.asObservable();
  profilePhotos$ = this.profilePhotosSubject.asObservable(); 
  
  /** Constructor **/
  constructor(private readonly userDataService: UserDataService,
    private loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly loaderService: LoaderService
    ) {}


    showHideSnackBar(type : SnackBarNotificationType , subtitle : any, title : string = '')
    {
        if(type == SnackBarNotificationType.ERROR)
        {
          const err= subtitle;
          this.loggingService.logException(err)
        }
          this.notificationSnackbarService.manageSnackBar(type, subtitle, NotificationSource.API, title)
          this.hideLoader();
    }

    showLoader()
    {
      this.loaderService.show();
    }

    hideLoader()
    {
      this.loaderService.hide();
    }

  /** Public methods **/
  hasRole(roleCode : string) : any
  {
    let roleCheck;
    this.userDataService.getProfile$
      .pipe(first(profile => profile?.length > 0))
      .subscribe((profile:any)=>{
        const roleProfile = profile?.find((x : any)=> x.roleCode === roleCode);
        roleCheck = roleProfile ? true : false;
      })
      return roleCheck;
  }

  hasPermission(ifPermission : string[]) : any
  {
    let hasPerm =false;
    this.userDataService.getProfile$
      .pipe(first(profile => profile?.length > 0))
      .subscribe((profile:any)=>{
        let permission : any;
        for(const profileItem of profile){
          if(permission == undefined || permission?.length == 0){
            permission = profileItem?.permissions
          }
          else{
            profileItem?.permissions.forEach((newPerm : any) => {
              const permissionExists = permission.some((existPerm : any) => existPerm.permissionId === newPerm.permissionId);
              if(!permissionExists){
                permission.push(newPerm);
              }
            });
          }
        }
        if (permission?.length == 0) {
          hasPerm = false;
        }

        const searchPermission  = ifPermission;
        let hasPermissions = false;
        for (const perm of searchPermission)
        {
            hasPermissions = permission?.some((x : any)=> x.permissionsCode   === perm)
        }

        if (!hasPermissions) {
          hasPerm = false;
        } else {
          hasPerm = true;
        }
      })
      return  hasPerm;
  }

  getUserPermissionMetaData(permissionCode : string, roleCode : any)
  {
    let permissionMetaData;
    if(!roleCode)
    {
      return;
    }
    this.userDataService.getProfile$
    .pipe(first(profile => profile?.length > 0))
    .subscribe((profile:any)=>{
      const roleProfile = profile?.find((x : any)=> x.roleCode === roleCode);
      const permission = roleProfile?.permissions;
      if (permission?.length == 0) {
       return;
      }
      const permissiondata = permission?.find((x : any)=> x.permissionsCode === permissionCode);
      if(permissiondata?.metadata)
      {
        permissionMetaData = JSON.parse(permissiondata.metadata);
      }
    })
    return permissionMetaData;
  }

  getUserMaxApprovalAmount(permissionCode : string)
  {
    let maxApprovalAmount = 0;
    if(!permissionCode)
    {
      return maxApprovalAmount;
    }
    this.userDataService.getProfile$
      .pipe(first(profile => profile?.length > 0))
      .subscribe((profile:any)=>{
        for(const profileItem of profile){
          if(profileItem.permissions == undefined || profileItem.permissions?.length == 0){
            maxApprovalAmount = 0;
          }
          else{
              const permissiondata = profileItem?.permissions?.find((x : any)=> x.permissionsCode === permissionCode);
              if(permissiondata && permissiondata.maxApprovalAmount > 0){
                maxApprovalAmount = permissiondata.maxApprovalAmount
              }
          }
        }
      })
      return maxApprovalAmount;
  }

  ///for case manager hover popup //NOSONAR
  getUserById(userId : string): void {
    this.userDataService.getUserById(userId).subscribe({
      next: (userDataResponse) => {
        this.userByIdSubject.next(userDataResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }


  getUserImage(userId : string): void {
    this.userDataService.getUserImage(userId).subscribe({
      next: (userImageResponse : any) => {
        this.userImageSubject.next(userImageResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }


  getUsersByRole(rolecode : string): void {
    this.userDataService.getUsersByRole(rolecode).subscribe({
      next: (usersByRoleResponse) => {
        this.usersByRoleSubject.next(usersByRoleResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }



  loadUsersData(): void {
    this.userDataService.loadUsersData().subscribe({
      next: (usersDataResponse) => {
        this.usersDataSubject.next(usersDataResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadUserFilterColumn(): void {
    this.userDataService.loadUserFilterColumn().subscribe({
      next: (usersFilterColumnResponse) => {
        this.usersFilterColumnSubject.next(usersFilterColumnResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadDdlUserRole(): void {
    this.userDataService.loadDdlUserRole().subscribe({
      next: (ddlUserRoleResponse) => {
        this.ddlUserRoleSubject.next(ddlUserRoleResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
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
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
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
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadDdlColumnFilters() {
    this.userDataService.loadDdlColumnFilter().subscribe({
      next: (ddlColumnFilters) => {
        this.ddlColumnFiltersSubject.next(ddlColumnFilters);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadClientProfileLanguages() {
    this.userDataService.loadClientProfileLanguage().subscribe({
      next: (clientProfileLanguages) => {
        this.clientProfileLanguagesSubject.next(clientProfileLanguages);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadClientProfileSlots() {
    this.userDataService.loadClientProfileSlots().subscribe({
      next: (clientProfileSlots) => {
        this.clientProfileSlotsSubject.next(clientProfileSlots);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
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
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadClientProfilePeriods() {
    this.userDataService.loadClientProfilePeriods().subscribe({
      next: (clientProfilePeriods) => {
        this.clientProfilePeriodsSubject.next(clientProfilePeriods);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadSexualOrientationList(){
    this.userDataService.loadSexualOrientationList().subscribe({
      next: (clientProfileSexualOrientation) => {
        this.clientProfileSexualOrientationSubject.next(clientProfileSexualOrientation);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }
  loadRacialOrEthnicIdentityList(){
    this.userDataService.loadRacialOrEthnicIdentityList().subscribe({
      next: (clientProfileRacialOrEthnicIdentity) => {
        this.clientProfileRacialOrEthnicIdentitySubject.next(clientProfileRacialOrEthnicIdentity);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }
  loadPronounsList(){
    this.userDataService.loadPronounsList().subscribe({
      next: (clientProfilePronouns) => {
        this.clientProfilePronounsSubject.next(clientProfilePronouns);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });

  }
  loadGenderList(){
    this.userDataService.loadGenderList().subscribe({
      next: (clientProfileGender) => {
        this.clientProfileGenderSubject.next(clientProfileGender);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadHousingAcuityLevelList(){
    this.userDataService.loadHousingAcuityLevelList().subscribe({
      next: (clientProfileHousingAcuityLevel) => {
        this.clientProfileHousingAcuityLevelSubject.next(clientProfileHousingAcuityLevel);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }
  loadIncomeInclusionsExlusionsList(){
    this.userDataService.loadIncomeInclusionsExlusionsList().subscribe({
      next: (clientProfilIncomeInclusionsExlusions) => {
        this.clientProfileIncomeInclusionsExlusionsSubject.next(clientProfilIncomeInclusionsExlusions);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadRegionAssignmentList(){
    this.userDataService.loadRegionAssignmentList().subscribe({
      next: (clientProfilRegionAssignment) => {
        this.clientProfileRegionAssignmentSubject.next(clientProfilRegionAssignment);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }
  loadPSMFRZIPList(){
    this.userDataService.loadPSMFRZIPList().subscribe({
      next: (clientProfilPSMFRZIP) => {
        this.clientProfilePSMFRZIPSubject.next(clientProfilPSMFRZIP);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadServiceProviderList(){
    this.userDataService.loadServiceProviderList().subscribe({
      next: (clientProfilServiceProvider) => {
        this.clientProfileServiceProviderSubject.next(clientProfilServiceProvider);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  reassignCase(caseReassignData : any){
    return this.userDataService.reassignCase(caseReassignData);
  }

  getUserProfilePhotosByIds(userIds : string, gridItems: any) {    
    return this.userDataService.getUserProfilePhotos(userIds)
    .subscribe({
      next: (data: any[]) => {
        if (data.length > 0) {
          gridItems.forEach((item: any) => {
            const matchingItem = data.find((profileItem: any) => profileItem.creatorId === item.creatorId);
            if (matchingItem) {
              item.userProfilePhoto = matchingItem.profilePhoto;
            }
          });
          this.profilePhotosSubject.next(data);
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err);   
      },
    });
  }


  getProfilePhotosByUserIds(userIds : string) {    
    return this.userDataService.getUserProfilePhotos(userIds);
  }
 
}
