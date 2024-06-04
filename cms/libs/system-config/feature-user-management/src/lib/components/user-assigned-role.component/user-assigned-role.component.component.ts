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
  @Input() sortType: any;
  @Input() sort: any;
  @Input() userStatus: any;
  @Input() assignedRoleCount: any;  
  sortColumn = 'roleDesc';
  sortDir = 'Ascending';
  isUserAssignedRolesGridLoaderShow = false;
  gridUserAssignedRolesSubject = new Subject<any>();
  gridUserAssignedRoles$ = this.gridUserAssignedRolesSubject.asObservable();
  userAssignedRolesGridLists$ = new Subject<any>();
  rolesUserListProfilePhoto$ = this.userManagementFacade.rolesUserListProfilePhotoSubject;

  public state!: any;
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

  defaultSort:any;
  ngOnInit(): void {
    this.defaultSort = this.sort;
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter : this.filter === undefined?null:this.filter
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
        maxResultCount: maxResultCountValue,
        sortColumn: sortValue,
        sortType: sortTypeValue,
        filter: this.state?.['filter']?.['filters'] ?? [],
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
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    if (this.sort[0]?.dir === undefined) {
      this.sortDir = '';
      this.sortType = 'asc';
    }
    if (this.sort[0]?.dir !== undefined) {
      this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    }
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
      sort: this.defaultSort,
      filter: { logic: 'and', filters: [] },
    };
  }

  public rowClass = (args:any) => ({
    "table-row-disabled": (args.dataItem.activeFlag != this.active),
  });

  getAndSetBackgroundColorByRoleCode(dataItem:any)
  {   
    if(dataItem.colorCode != null)
    {
       return 'background: '+ dataItem.colorCode;
    }
    return  'background: #0058e9;';
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
