/** Angular **/
import { Component, EventEmitter, Input, OnInit, Output, OnChanges , ChangeDetectorRef, ViewChild, ChangeDetectionStrategy, OnDestroy, TemplateRef } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { ColumnBase, ColumnComponent, ColumnVisibilityChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { FilterService } from '@progress/kendo-angular-treelist/filtering/filter.service';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { ConfigurationProvider, DocumentFacade, NotificationSnackbarService, NotificationSource, LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { LovFacade, UserDataService, UserManagementFacade } from '@cms/system-config/domain';
import { Router } from '@angular/router';
import { NotificationService } from '@progress/kendo-angular-notification';

@Component({
  selector: 'system-config-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit, OnChanges, OnDestroy {
  public formUiStyle: UIFormStyle = new UIFormStyle();

  isUserDetailsPopup = false;
  isUserDeactivatePopup = false;
  isUserReactivatePopup = false;
  isEditUsersData!: boolean;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() usersDataLists$: any;
  @Input() usersFilterColumn$: any;  
  @Input() sortValueUserRoles : any;
  @Input() sortUserRoles : any;
  @Output() loadUserListEvent = new EventEmitter<any>();
  @Output() usersFilterColumnEvent = new EventEmitter<any>();
  @Input() userListProfilePhoto$!: any;
  @Output() exportGridEvent$ = new EventEmitter<any>();
  @Input() exportButtonShow$ = this.documentFacade.exportButtonShow$;
  deactivateUserStatus$ = this.userManagementFacade.deactivateUser$;
  deactivatSubscription!: Subscription;
  userStatus$ = this.userManagementFacade.canUserBeDeactivated$;
  reactivationFlag = false;
  userAssignedActiveClientStatusSubscription!: Subscription;
  public hideAfter = this.configurationProvider.appSettings.snackbarHideAfter;
  public duration =
    this.configurationProvider.appSettings.snackbarAnimationDuration;
  @ViewChild('notificationTemplate', { static: true }) notificationTemplate!: TemplateRef<any>;

  defaultSort:any;
  public state!: any;
  sortColumn = 'User Name';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  selectedSearchColumn = 'ALL';
  gridDataResult!: GridDataResult;
  isUserListGridLoaderShow = false;
  gridUserDataSubject = new Subject<any>();
  gridUserData$ = this.gridUserDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  showExportLoader = false;
  loginUserId= "";
  active = "Active";
  inActive = "Inactive";
  currentUserStatus = "";
  statusList: any = [{ code: this.active, name: this.active }, { code: this.inActive, name: this.inActive }];
  @ViewChild('usersGrid') usersGrid: any;
  defaultColumnState: ColumnBase[] = [];
  addRemoveColumns = "Default Columns"
  defaultColumns = ["userName", "email", "userAccessType", "lastModificationTime", "lastModifierId", "activeFlag"];
  columns: any = {
    ALL: 'All Columns',
    userName: "User Name",
    email: "Email Address",
    userAccessType : "User Access Type",
    lastModificationTime: "Last Modified",
    lastModifierId: "Modified By",
    activeFlag: "Status",
  };
  loggedInUserId!: any;
  dropDowncolumns: any = [
    { columnCode: 'ALL', columnDesc: 'All Columns' },
    {
      columnCode: 'userName',
      columnDesc: 'User Name',
    },
    {
      columnCode: 'email',
      columnDesc: 'Email Address',
    },
  ];
  selectedActiveFlag = "";
  selectedUserAccessType = "";
  userAccessTypeLov$ = this.lovFacade.userAccessTypeLov$;
  userAccessTypeLovs:any=[];
  isShowUserDetailPopup$ = this.userManagementFacade.isShowUserDetailPopup$;
  
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly documentFacade: DocumentFacade,
    private userManagementFacade: UserManagementFacade,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private configurationProvider:ConfigurationProvider,
    private readonly notificationService: NotificationService,
    private router: Router,
    private readonly loaderService: LoaderService,
    private readonly userDataService: UserDataService,
    private lovFacade: LovFacade,
    
  ) {
    this.notifyOnReactivatingUser();
    this.IsUserValidForDeactivation();
  }
  public moreactions = [
    {
      buttonType: "btn-h-primary",
      text: "Edit",
      icon: "edit",
      type: "Edit",
      click: (data: any): void => {
        if(data.activeFlag){
        this.currentUserStatus = data.activeFlag;
        this.loginUserId = data.loginUserId;
      }
        this.onUserDetailsClicked(true);
      },
    },{
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


  ngOnInit(): void {
    this.defaultSort = this.sort;
    this.getLoggedInUserProfile();
    this.addSearchSubjectSubscription();
    this.loadUserFilterColumn(); 
    this.lovFacade.getUserAccessTypeLov();  
    this.loadUserAccessType();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter : this.filter === undefined?null:this.filter
    };

    this.loadUserListGrid();
  }

  loadUserListGrid(): void {
    this.loadUsersLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadUsersLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isUserListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      filter: JSON.stringify(this.state?.['filter']?.['filters'] ?? []),
    };
    this.loadUserListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }

  loadUserFilterColumn() {
    this.usersFilterColumnEvent.emit();

  }
  
  setToDefault() {
    this.defaultGridState();
    this.sortColumn = 'User Name';
    this.sortType = 'asc';
    this.sortDir = this.sortType === 'asc' ? 'Ascending' : "Descending";
    this.filter = [];
    this.selectedSearchColumn = 'ALL';
    this.isFiltered = false;
    this.columnsReordered = false;
    this.sortValue = 'userName';
    this.sort = this.sortValue;
    this.searchValue = '';
    this.defaultColumnState.forEach((item: any) => {
      if (this.defaultColumns.includes(item.field)) {
        item.hidden = false;
      }
    });
    this.cdr.detectChanges();
    this.loadUserListGrid();
  }

  onChange(data: any) {
    this.defaultGridState();
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'userName',
              operator: 'startswith',
              value: data,
            },
          ],
          logic: 'and',
        },
      ],
    };
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

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortColumn = this.columns[stateData.sort[0]?.field];
    if (this.sort[0]?.dir === undefined) {
      this.sortDir = '';
      this.sortType = 'asc';
    }
    if (this.sort[0]?.dir !== undefined) {
      this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    }
    this.sortColumn = this.columns[this.sortValue];
    if (stateData.filter?.filters.length > 0) {
      let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.filter = stateFilter.value;
      this.isFiltered = true;
      const filterList = [];
      for (const filter of stateData.filter.filters) {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.filteredBy = filterList.toString();
    } else {
      this.filter = '';
      this.isFiltered = false;
    }
    this.clearIndividualSelectionOnClear(stateData);
    this.loadUserListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadUserListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.isUserListGridLoaderShow = true;
    this.usersDataLists$.subscribe(
      (data: any) => {
        this.gridDataResult = data;
        this.gridUserDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isUserListGridLoaderShow = false;
        }
        this.cdr.detectChanges();
      }
    );
    this.isUserListGridLoaderShow = false;
  }

  onUserDetailsClosed() {
    this.isUserDetailsPopup = false;
    this.userManagementFacade.showOrHideUserDetailPopup(this.isUserDetailsPopup);
  }
  onUserDetailsClicked(editValue: boolean) {
    this.isUserDetailsPopup = true;
    this.isEditUsersData = editValue;
    this.userManagementFacade.showOrHideUserDetailPopup(this.isUserDetailsPopup);
  }
  onUserDeactivateClosed() {
    this.isUserDeactivatePopup = false;
  }
  onUserDeactivateClicked(data: any) {
    if(data.loginUserId)
    {
      this.loginUserId = data.loginUserId;
      this.userManagementFacade.getUserAssignedActiveClientCount(data.loginUserId);
    }
  }

  onUserReactivateClicked(data: any) {
        
    if(data.loginUserId)
      {
        const userData={
          userId: data.loginUserId,
          activeFlag: this.active
        };
        this.reactivationFlag = true;
        this.userManagementFacade.deactivateUser(userData);        
      }  
  }

  onUserReactivateClosed() {
    this.isUserReactivatePopup = false;
  }

  searchColumnChangeHandler(data: any) {
    this.filter = [];
    if (this.searchValue) {
      this.onSearch(this.searchValue);
    }
  }

  onClickedExport() {
    this.showExportLoader = true;
    const params = {
      SortType: this.sortType,
      Sorting: this.sortValue,
      Filter: JSON.stringify(this.state?.['filter']?.['filters'] ?? []),
    };
    this.exportGridEvent$.emit(params);
    this.exportButtonShow$.subscribe((response: any) => {
      if (response) {
        this.showExportLoader = false
        this.cdr.detectChanges()
      }
    });
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
    if (field == "userAccessType") {
      this.selectedUserAccessType = value;
    }
  }

  columnName: any = "";
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
      this.selectedUserAccessType = '';
    }
    this.state = stateData;

    if (!this.filteredBy.includes(this.columns.activeFlag)) this.selectedActiveFlag = '';
    if (!this.filteredBy.includes(this.columns.userAccessType)) this.selectedUserAccessType = '';
  }

  onSearch(searchValue: any) {
    const isDateSearch = searchValue.includes('/');
    if (isDateSearch && !searchValue) return;
    this.setFilterBy(false, searchValue, []);
    this.searchSubject.next(searchValue);
  }
  filteredByColumnDesc = '';
  private setFilterBy(
    isFromGrid: boolean,
    searchValue: any = '',
    filter: any = []
  ) {
    this.filteredByColumnDesc = '';
    if (isFromGrid) {
      if (filter.length > 0) {
        const filteredColumns = this.filter?.map((f: any) => {
          const filteredColumns = f.filters
            ?.filter((fld: any) => fld.value)
            ?.map((fld: any) => this.columns[fld.field]);
          return [...new Set(filteredColumns)];
        });

        this.filteredByColumnDesc =
          [...new Set(filteredColumns)]?.sort()?.join(', ') ?? '';
      }
      return;
    }

    if (searchValue !== '') {
      this.filteredByColumnDesc =
        this.dropDowncolumns?.find(
          (i: any) => i.columnName === this.selectedSearchColumn
        )?.columnDesc ?? '';
    }
  }
  private searchSubject = new Subject<string>();
  private addSearchSubjectSubscription() {
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchValue) => {
      this.performSearch(searchValue);
    });
  }

  performSearch(data: any) {
    this.defaultGridState();
    let operator = 'contains';
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'ALL',
              operator: operator,
              value: data,
            },
          ],
          logic: 'and',
        },
      ],
    };
    const stateData = this.state;
    stateData.filter = this.filterData;
    this.dataStateChange(stateData);
  }

  public rowClass = (args: any) => ({
    "table-row-disabled": (args.dataItem.activeFlag != this.active || args.dataItem.noOfActiveRoles == 0),
  });
  
  public columnChange(e: any) {
    let event = e as ColumnVisibilityChangeEvent;
    const columnsRemoved = event?.columns.filter(x => x.hidden).length
    const columnsAdded = event?.columns.filter(x => x.hidden === false).length

    if (columnsAdded > 0) {
      this.addRemoveColumns = 'Columns Added';
    }
    else {
      this.addRemoveColumns = columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
    }

    event.columns.forEach(column => {
      if (column.hidden) {
        const field = (column as ColumnComponent)?.field;
        const mainFilters = this.state.filter.filters;

        mainFilters.forEach((filter: any) => {
          const filterList = filter.filters;

          const foundFilter = filterList.find((x: any) => x.field === field);

          if (foundFilter) {
            filter.filters = filterList.filter((x: any) => x.field !== field);
            this.loadUserListGrid();
          }
        });
      }
      if (!column.hidden) {
        let columnData = column as ColumnComponent;
        this.columns[columnData.field] = columnData.title;
      }

    });

    this.defaultGridState();
  }

  ngAfterViewInit() {
    this.defaultColumnState = this.usersGrid.columns.toArray();
  }  filterActionButtonOptions(options: any[], actionType: any): any[] {
    let filteredOptions: any[] = [];
    if (actionType.status !== "Active") {
      filteredOptions = options.filter((option) => option.type != 'Deactivate');
    } else {
      filteredOptions = options.filter((option) => option.type != 'Reactivate');
    }
    return filteredOptions;
  }

  notifyOnReactivatingUser(){
    this.deactivatSubscription = this.deactivateUserStatus$.subscribe((response: any) => {
      if(response.status > 0 && this.reactivationFlag){
      this.loadUserListGrid();
      this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response.message);
      this.reactivationFlag = false;
    }
    });
  }

  showHideSnackBar(type : SnackBarNotificationType , subtitle : any, title : string = '')
  {
        this.notificationSnackbarService.manageSnackBar(type, subtitle, NotificationSource.API, title)
  }

  ngOnDestroy(): void {     
      this.deactivatSubscription?.unsubscribe();
      this.userAssignedActiveClientStatusSubscription?.unsubscribe();
}

  navigateToDetails() {
    this.router.navigate(['/system-config/cases/case-assignment']);
  }

  IsUserValidForDeactivation(){
    this.userAssignedActiveClientStatusSubscription = this.userStatus$.subscribe((response: any) => {
      if(response.status > 0){
        this.isUserDeactivatePopup = true;
        this.cdr.detectChanges();
        this.loaderService.hide();
      }
      else
      {
          this.notificationService.show({
          content: this.notificationTemplate,        
          position: { horizontal: 'center', vertical: 'top' },
          animation: { type: 'fade', duration: this.duration },
          closable: true,
          type: { style: "error", icon: true },        
          cssClass: 'reminder-notification-bar',
          hideAfter:this.hideAfter
        });
        this.loaderService.hide();
      }
    });
  }
  getLoggedInUserProfile() {
    this.userDataService.getProfile$.subscribe((profile: any) => {
      if (profile?.length > 0) {
        this.loggedInUserId = profile[0]?.loginUserId;
      }
    });
  }

  loggedInUserValidation(data:any)
  {
    return (this.loggedInUserId == data.loginUserId);
  }

  private loadUserAccessType() {
    this.userAccessTypeLov$
    .subscribe({
      next: (data: any) => {
        this.userAccessTypeLovs=data;
      }
    });
  }
}
