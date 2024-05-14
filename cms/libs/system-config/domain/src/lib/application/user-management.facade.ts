
/** Angular **/
import { Injectable } from '@angular/core';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType, NotificationSource, DocumentFacade, ApiType } from '@cms/shared/util-core';
import { Subject, first } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LoginUser } from '../entities/login-user';
/** Entities **/
import { User } from '../entities/user';
/** Data services **/
import { UserDataService } from '../infrastructure/user.data.service';
import { SortDescriptor } from '@progress/kendo-data-query';

@Injectable({ providedIn: 'root' })
export class UserManagementFacade {
  /** Private properties **/


  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueUserListGrid = 'userName'; 
  public sortUserListGrid: SortDescriptor[] = [{
    field: this.sortValueUserListGrid,
  }];

  public sortValueRolesPermissionListGrid = 'creationTime'; 
  public sortRolesPermissionListGrid: SortDescriptor[] = [{
    field: this.sortValueRolesPermissionListGrid,
  }];


  public sortValueDirectMessageListGrid = 'creationTime'; 
  public sortDirectMessageListGrid: SortDescriptor[] = [{
    field: this.sortValueDirectMessageListGrid,
  }];

  public sortValueGenderListGrid = 'creationTime'; 
  public sortGenderListGrid: SortDescriptor[] = [{
    field: this.sortValueGenderListGrid,
  }];
  public sortValueLanguageListGrid = 'creationTime'; 
  public sortLanguageListGrid: SortDescriptor[] = [{
    field: this.sortValueLanguageListGrid,
  }];

  public sortValuePronounsListGrid = 'creationTime'; 
  public sortPronounsListGrid: SortDescriptor[] = [{
    field: this.sortValuePronounsListGrid,
  }];
  
  public sortValueRacialEthnicListGrid = 'creationTime'; 
  public sortRacialEthnicListGrid: SortDescriptor[] = [{
    field: this.sortValueRacialEthnicListGrid,
  }];

  public sortValueSexualOrientationListGrid = 'creationTime'; 
  public sortSexualOrientationListGrid: SortDescriptor[] = [{
    field: this.sortValueSexualOrientationListGrid,
  }];

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
  private directMessageLogEventSubject = new BehaviorSubject<any>([]);
  private clientProfileHousingAcuityLevelSubject = new BehaviorSubject<any>([]);
  private clientProfileIncomeInclusionsExclusionsSubject = new BehaviorSubject<any>([]);
  private clientProfileRegionAssignmentSubject = new BehaviorSubject<any>([]);
  private clientProfilePSMFRZIPSubject = new BehaviorSubject<any>([]);
  private clientProfileServiceProviderSubject = new BehaviorSubject<any>([]);
  private usersByRoleSubject = new BehaviorSubject<LoginUser[]>([]);
  private userImageSubject = new Subject<any>();
  private userByIdSubject = new Subject<any>(); 
  private profilePhotosSubject = new BehaviorSubject<any>([]);
  private userListDataLoaderSubject = new Subject<any>();
  userListDataLoader$ = this.userListDataLoaderSubject.asObservable();
  userListProfilePhotoSubject = new Subject();
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
  directMessageLogEvent$ = this.directMessageLogEventSubject.asObservable();
  clientProfileHousingAcuityLevel$ = this.clientProfileHousingAcuityLevelSubject.asObservable();
  clientProfileIncomeInclusionsExclusions$ = this.clientProfileIncomeInclusionsExclusionsSubject.asObservable();
  clientProfileRegionAssignment$ = this.clientProfileRegionAssignmentSubject.asObservable();
  clientProfilePSMFRZIP$ = this.clientProfilePSMFRZIPSubject.asObservable();
  clientProfileServiceProvider$ = this.clientProfileServiceProviderSubject.asObservable();
  usersByRole$ = this.usersByRoleSubject.asObservable();
  userImage$ = this.userImageSubject.asObservable();
  usersById$ = this.userByIdSubject.asObservable();
  profilePhotos$ = this.profilePhotosSubject.asObservable(); 
  /** Constructor **/
  constructor(private readonly userDataService: UserDataService,
    private loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private readonly configurationProvider: ConfigurationProvider,
    private readonly documentFacade: DocumentFacade,
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



  loadUsersData(params: any): void {
    this.showLoader();
    this.userDataService.loadUsersData(params).subscribe({
      next: (response:any) => {
        const gridView = {
          data: response['items'],
          total: response['totalCount'],
        };
        this.usersDataSubject.next(gridView);
        this.loadUserListDistinctUserIdsAndProfilePhoto(response['items']);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
      },
    });
  }

  loadUserAssignedRolesByUserId(data: any){
    return this.userDataService.loadUserAssignedRolesByUserId(data);
   }

  loadUserFilterColumn(): void {
    this.userDataService.loadUserFilterColumn().subscribe({
      next: (response) => {
        this.usersFilterColumnSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadDdlUserRole(roleType: any, activeFlag: any): void {
    this.userDataService.loadDdlUserRole(roleType, activeFlag).subscribe({
      next: (response) => {
        this.ddlUserRoleSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadUsersRoleAndPermissions(): void {
    this.userDataService.loadUsersRoleAndPermissions().subscribe({
      next: (response) => {
        this.usersRoleAndPermissionsSubject.next(
          response
        );
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadDdlRolesAndPermissionsFilter(): void {
    this.userDataService.loadDdlRolesAndPermissionsFilter().subscribe({
      next: (response) => {
        this.ddlRolesAndPermissionsFilterSubject.next(
          response
        );
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadDdlColumnFilters() {
    this.userDataService.loadDdlColumnFilter().subscribe({
      next: (response) => {
        this.ddlColumnFiltersSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadClientProfileLanguages() {
    this.userDataService.loadClientProfileLanguage().subscribe({
      next: (response) => {
        this.clientProfileLanguagesSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

 
 

  loadSexualOrientationList(){
    this.userDataService.loadSexualOrientationList().subscribe({
      next: (response) => {
        this.clientProfileSexualOrientationSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }
  loadRacialOrEthnicIdentityList(){
    this.userDataService.loadRacialOrEthnicIdentityList().subscribe({
      next: (response) => {
        this.clientProfileRacialOrEthnicIdentitySubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }
  loadPronounsList(){
    this.userDataService.loadPronounsList().subscribe({
      next: (response) => {
        this.clientProfilePronounsSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });

  }
  loadGenderList(){
    this.userDataService.loadGenderList().subscribe({
      next: (response) => {
        this.clientProfileGenderSubject.next(response);
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
  loadDirectMessageLogEvent() {
    this.userDataService.loadDirectMessageLogEventService().subscribe({
      next: (response) => {
        this.directMessageLogEventSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadUserListDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.lastModifierId))).join(',');
    if(distinctUserIds){
      this.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (photoData: any[]) => {
          if (photoData.length > 0) {
            this.userListProfilePhotoSubject.next(photoData);
          }
        },
      });
    }
  }  

  onExportAllUser(params: any){
    const fileName = 'Users List'
    this.documentFacade.getExportFile(params,`users`, fileName,ApiType.SystemConfig);
  }
}
