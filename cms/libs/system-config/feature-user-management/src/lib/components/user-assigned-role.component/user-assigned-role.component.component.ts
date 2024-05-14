import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import { LoaderService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { UserDefaultRoles, UserManagementFacade } from '@cms/system-config/domain';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'system-config-user-assigned-role',
  templateUrl: './user-assigned-role.component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAssignedRoleComponentComponent implements OnChanges {
  isUserDeactivatePopup = false;
  isUserReactivatePopup = false;
  @Input() userId!: string;
  @Input() pageSizes: any;
  @Input() userStatus: any;
  @Input() assignedRoleCount: any;
  sort: any = "roleDesc";
  isUserAssignedRolesGridLoaderShow = false;
  gridUserAssignedRolesSubject = new Subject<any>();
  gridUserAssignedRoles$ = this.gridUserAssignedRolesSubject.asObservable();
  userAssignedRolesGridLists$ = new Subject<any>();
  public state!: any;
  sortType = "asc"
  gridDataResult!: GridDataResult;
  loader$ = new BehaviorSubject<boolean>(false);
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  active="Active";
  inActive="Inactive";
  public moreactions = [
    {
      buttonType: 'btn-h-danger',
      text: 'Deactivate',
      icon: 'block',
      type: 'Deactivate',
      click: (data: any): void => {
        this.onUserDeactivateClicked(data);
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Reactivate',
      icon: 'done',
      type: 'Reactivate',
      click: (data: any): void => {
        this.onUserReactivateClicked(data);
      }
    },
  ];

  public rolesClassList:any = [
    {roleCode : UserDefaultRoles.CACaseWorker, roleClass : 'role-identifier role-case-worker'},
    {roleCode : UserDefaultRoles.Admin, roleClass : 'role-identifier role-admin'},
    {roleCode : UserDefaultRoles.Client, roleClass : 'role-identifier role-client'},
    {roleCode : UserDefaultRoles.SuperAdmin, roleClass : 'role-identifier role-super-admins'},
    {roleCode : UserDefaultRoles.FiscalSpecialist, roleClass : 'role-identifier role-fiscal-specialist'},
    {roleCode : UserDefaultRoles.CACaseManager, roleClass : 'role-identifier role-case-manager'},
    {roleCode : UserDefaultRoles.QaAnalyst, roleClass : 'role-identifier role-qa-analyst'},
    {roleCode : UserDefaultRoles.OfficeSpecialist ,roleClass : 'role-identifier role-office-specialist'},
    {roleCode : UserDefaultRoles.IntakeCoordinator,roleClass : 'role-identifier role-intake-coordinator'},
  ];
  /* Constructor */
  constructor(private readonly userManagementFacade: UserManagementFacade,
    private cd: ChangeDetectorRef,
    private readonly loaderService: LoaderService,
    private readonly notificationSnackbarService: NotificationSnackbarService,) { }

  /* LifeCycle Events */
  ngOnInit(): void {
    this.loadUserAssignedRolesGrid();
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadUserAssignedRolesGrid();
  }

  loadUserAssignedRoles(data: any) {
    this.loader$.next(true);
    this.userManagementFacade.loadUserAssignedRolesByUserId(data).subscribe({
      next: (dataResponse: any) => {
        const gridView = {
          data: dataResponse['items'],
          total: dataResponse['totalCount'],
        };
        this.userAssignedRolesGridLists$.next(gridView);
        this.loader$.next(false);
      },
      error: (err: any) => {
        this.loader$.next(false);
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
    this.gridDataHandle();
  }
  claimsRecentClaimsProfilePhotoSubject = new Subject();
  
  gridDataHandle() {
    this.userAssignedRolesGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridUserAssignedRolesSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isUserAssignedRolesGridLoaderShow = false;
      }
    });
  }

  loadUserAssignedRolesGrid() {
    this.loadUserAssignedRoles({
      userId: this.userId,
      skipCount: this.state?.skip ?? 0,
      maxResultCount: this.state?.take ?? 0,
      sortColumn: this.sort,
      sortType: this.sortType
    });
  }

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadUserAssignedRolesGrid();
  }

  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.loadUserAssignedRolesGrid();
  }

  onChange(data: any) {
    this.defaultGridState();
    const stateData = this.state;
    this.dataStateChange(stateData);
  }

  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter: { logic: 'and', filters: [] },
    };
  }

  onUserDeactivateClosed() {
    this.isUserDeactivatePopup = false;
  }
  onUserDeactivateClicked(data: any) {
    this.isUserDeactivatePopup = true;
  }

  onUserReactivateClicked(data: any) {
    this.isUserReactivatePopup = true;
    this.isUserDeactivatePopup = true;
  }

  onUserReactivateClosed() {
    this.isUserReactivatePopup = false;
    this.isUserDeactivatePopup = false;
  }

  public rowClass = (args:any) => ({
    "table-row-disabled": (args.dataItem.activeFlag != this.active),
  });

  getRolesClassByRoleCode(dataItem:any)
  {
    let roleClass = this.rolesClassList.find((x: any)=>x.roleCode==dataItem.roleCode);
    return roleClass == null || roleClass ==undefined ? '' : roleClass.roleClass;
  }
}
