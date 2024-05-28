import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { UserDefaultRoles, UserManagementFacade } from '@cms/system-config/domain';
import { FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'system-config-user-assigned-role',
  templateUrl: './user-assigned-role.component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAssignedRoleComponentComponent implements OnChanges {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isUserRoleDeletePopup = false;
  @Input() userId!: string;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() userStatus: any;
  @Input() assignedRoleCount: any;
  sort: any = "roleDesc";
  sortColumn = 'roleDesc';
  sortDir = 'Ascending';
  isUserAssignedRolesGridLoaderShow = false;
  gridUserAssignedRolesSubject = new Subject<any>();
  gridUserAssignedRoles$ = this.gridUserAssignedRolesSubject.asObservable();
  userAssignedRolesGridLists$ = new Subject<any>();
  rolesUserListProfilePhoto$ = this.userManagementFacade.rolesUserListProfilePhotoSubject;

  public state!: any;
  sortType = "asc"
  gridDataResult!: GridDataResult;
  loader$ = new BehaviorSubject<boolean>(false);
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  active = "Active";
  inActive = "Inactive";

  columns: any = {
    roleDesc: "Role Assigned",
    lastModificationTime: "Last Modified",
    lastModifierId: "Modified By",
  };


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
    private cdr: ChangeDetectorRef,
    private readonly loaderService: LoaderService,
    private readonly notificationSnackbarService: NotificationSnackbarService,) { }

  /* LifeCycle Events */


  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadUserAssignedRolesGrid();
  }

  loadUserAssignedRoles(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string) {
      const gridDataRefinerValue = {        
        skipCount: skipCountValue,
        pagesize: maxResultCountValue,
        sortColumn: sortValue,
        sortType: sortTypeValue,
        filter: JSON.stringify(this.state?.['filter']?.['filters'] ?? []),
      };   
    this.loadUserRoles(gridDataRefinerValue);
    this.gridDataHandle();
  }
  gridDataHandle() {
    this.userAssignedRolesGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridUserAssignedRolesSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isUserAssignedRolesGridLoaderShow = false;
      }
    });
  }

  loadUserAssignedRolesGrid():void {
    this.loadUserAssignedRoles(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadUserAssignedRolesGrid();
  }

  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'desc';
    this.state = stateData;
    this.sortDir = this.sortType === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumn = this.columns[this.sortValue];
    this.filter = stateData?.filter?.filters;
    this.clearIndividualSelectionOnClear(stateData);
    this.cdr.detectChanges();
    this.loadUserAssignedRolesGrid();
  }

  onChange(data: any) {
    this.defaultGridState();
    const stateData = this.state;
    stateData.filter = this.filterData;
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

  public rowClass = (args:any) => ({
    "table-row-disabled": (args.dataItem.activeFlag != this.active),
  });

  getRolesClassByRoleCode(dataItem:any)
  {
    let roleClass = this.rolesClassList.find((x: any)=>x.roleCode==dataItem.roleCode);
    return roleClass == null || roleClass ==undefined ? '' : roleClass.roleClass;
  }

  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  dropdownFilterChange(field: string, value: any, filterService: FilterService): void {
    filterService.filter({
      filters: [{
        field: field,
        operator: "eq",
        value: value
      }],
      logic: "or"
    });
    if (field == "activeFlag") {
      this.selectedActiveFlag = value;
    }
  }

  columnName: any = "";
  filteredBy = '';
  isFiltered = false;
  filter!: any;
  selectedActiveFlag = "";
  clearIndividualSelectionOnClear(stateData: any) {
    if (stateData.filter?.filters.length > 0) {
      let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.columnName = stateFilter.field;

      this.filter = stateFilter.value;

      this.isFiltered = true;
      const filterList = []
      for (const filter of stateData.filter.filters) {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.isFiltered = true;
      this.filteredBy = filterList.toString();
    }
    else {
      this.filter = "";
      this.isFiltered = false;
      this.selectedActiveFlag = '';
    }
    this.state = stateData;
    if (!this.filteredBy.includes(this.columns.activeFlag)) this.selectedActiveFlag = '';
  }

  loadUserRoles(data:any)
  {
    this.loader$.next(true);
    this.userManagementFacade.loadUserAssignedRolesByUserId(this.userId, data).subscribe({
      next: (dataResponse: any) => {
        const gridView = {
          data: dataResponse['items'],
          total: dataResponse['totalCount'],
        };
        this.userAssignedRolesGridLists$.next(gridView);
        this.userManagementFacade.loadRolesUserListDistinctUserIdsAndProfilePhoto(gridView.data);
        this.loader$.next(false);
      },
      error: (err: any) => {
        this.loader$.next(false);
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }
}
