/** Angular **/
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { GridDataResult } from '@progress/kendo-angular-grid';
import { FilterService } from '@progress/kendo-angular-treelist/filtering/filter.service';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { UserManagementFacade } from '@cms/system-config/domain';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'system-config-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit, OnChanges {
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
  @Output() loadUserListEvent = new EventEmitter<any>();
  @Output() usersFilterColumnEvent = new EventEmitter<any>();
  @Input() userListProfilePhoto$!: any;
  @Output() exportGridEvent$ = new EventEmitter<any>();
  public state!: State;
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
  active="Active";
  inActive="Inactive";
  statusList:any = [{ code: this.active, name: this.active}, { code: this.inActive, name: this.inActive }];
  columns: any = {
    ALL: 'All Columns',
    userName: "User Name",
    email: "Email Address",
    lastModificationTime: "Last Modified",
    lastModifierId: "Modified By",
    activeFlag: "Status",
  };

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
  selectedActiveFlag="";

  constructor(
    private route: Router,
    private readonly userManagementFacade: UserManagementFacade,
    private readonly cdr: ChangeDetectorRef,
  ) {

  }
  public moreactions = [
    {
      buttonType: "btn-h-primary",
      text: "Edit",
      icon: "edit",
      type: "Edit",
      click: (data:any): void => {
        this.onUserDetailsClicked(true);
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Deactivate',
      icon: 'block',
      type: 'Deactivate',
      click: (data:any): void => {
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
    this.addSearchSubjectSubscription();
    this.loadUserListGrid();
    this.loadUserFilterColumn();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadUserListGrid();
  }

  private loadUserListGrid(): void {
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
    this.sortDir = this.sortType === 'asc' ?  'Ascending' : "";
    this.filter = '';
    this.selectedSearchColumn = 'ALL';
    this.isFiltered = false;
    this.columnsReordered = false;
    this.sortValue = 'userName';
    this.sort = this.sortValue;
    this.searchValue = '';
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
      sort: this.sort,
      filter: { logic: 'and', filters: [] },
    };
  }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
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
  }
  onUserDetailsClicked(editValue: boolean) {
    this.isUserDetailsPopup = true;
    this.isEditUsersData = editValue;
  }
  onUserDeactivateClosed() {
    this.isUserDeactivatePopup = false;
  }
  onUserDeactivateClicked(data:any) {
    this.isUserDeactivatePopup = true;
  }

  onUserReactivateClicked(data:any) {
    this.isUserReactivatePopup = true;
    this.isUserDeactivatePopup = true;
  }

  onUserReactivateClosed() {
    this.isUserReactivatePopup = false;
    this.isUserDeactivatePopup = false;
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
    this.exportGridEvent$.subscribe((response: any) => {
      if (response) {
        this.showExportLoader = false;
        this.cdr.detectChanges();
      }
    });
    this.showExportLoader = false;
  }
  
  dropdownFilterChange(field:string, value: any, filterService: FilterService): void {
    filterService.filter({
      filters: [{
        field: field,
        operator: "eq",
        value:value
    }],
      logic: "or"
  });
    if(field == "activeFlag"){
      this.selectedActiveFlag = value;
    }
  }

  columnName: any = "";
  clearIndividualSelectionOnClear(stateData: any)
  {
    if(stateData.filter?.filters.length > 0)
      {
        let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
        this.columnName = stateFilter.field;

          this.filter = stateFilter.value;

        this.isFiltered = true;
        const filterList = []
        for(const filter of stateData.filter.filters)
        {
          filterList.push(this.columns[filter.filters[0].field]);
        }
        this.isFiltered =true;
        this.filteredBy =  filterList.toString();
      }
      else
      {
        this.filter = "";
        this.isFiltered = false;
        this.selectedActiveFlag = '';
      }
      this.state=stateData;
      if (!this.filteredBy.includes(this.columns.activeFlag)) this.selectedActiveFlag = '';
  }

  onSearch(searchValue: any) {
    const isDateSearch = searchValue.includes('/');
    if (isDateSearch && !searchValue) return;
    this.setFilterBy(false, searchValue, []);
    this.searchSubject.next(searchValue);
  }
  filteredByColumnDesc='';
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
          (i:any) => i.columnName === this.selectedSearchColumn
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

  public rowClass = (args:any) => ({
    "table-row-disabled": (args.dataItem.activeFlag != this.active),
  });

}
