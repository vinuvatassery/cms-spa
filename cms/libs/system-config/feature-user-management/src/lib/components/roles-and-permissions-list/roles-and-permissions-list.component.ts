import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from '@angular/core'; 
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
@Component({
  selector: 'system-config-roles-and-permissions-list',
  templateUrl: './roles-and-permissions-list.component.html',
  styleUrls: ['./roles-and-permissions-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesAndPermissionsListComponent implements OnInit, OnChanges {


  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() usersRoleAndPermissionsLists$: any;
  @Input() rolesPermissionFilterColumn$: any;
  @Output() loadUsersRoleAndPermissions = new EventEmitter<any>();
  @Output() loadDdlRolesAndPermissionsFilterColumnEvent= new EventEmitter<any>();
  
  isRoleDeactivatePopup = false;
  isSelectRolePopup = false;
  isInternalRole !: boolean;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public state!: State;
  sortColumn = 'vendorName';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  isUserListGridLoaderShow = false;
  gridUserDataSubject = new Subject<any>();
  gridUserData$ =
    this.gridUserDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  public moreactions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
      click: (): void => {
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Duplicate",
      icon: "copy_all",
      click: (): void => {
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Block",
      icon: "block",
      click: (): void => {
       this.onRoleDeactivateClicked()
      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
      click: (): void => {
      },
    },
    
 
  ];

  
  constructor() { }

  
  ngOnInit(): void {
    this.loadUsersRoleAndPermissionsListGrid();
    this.loadDdlRolesAndPermissionsFilter();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadUsersRoleAndPermissionsListGrid();
  }

  private loadUsersRoleAndPermissionsListGrid(): void {
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
    };
    this.loadUsersRoleAndPermissions.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadDdlRolesAndPermissionsFilter(){
    this.loadDdlRolesAndPermissionsFilterColumnEvent.emit();

  }
  onChange(data: any) {
    this.defaultGridState();

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'vendorName',
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
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.loadUsersRoleAndPermissionsListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadUsersRoleAndPermissionsListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.usersRoleAndPermissionsLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridUserDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isUserListGridLoaderShow = false;
        }
      }
    );
    this.isUserListGridLoaderShow = false;
  }

 

  onCloseRoleDeactivateClicked() {
    this.isSelectRolePopup = false;
  }
  onRoleDeactivateClicked() {
    this.isSelectRolePopup = true;
  }
  onCloseSelectRoleClicked() {
    this.isSelectRolePopup = false;
  }
  onSelectRoleClicked() {
    this.isSelectRolePopup = true;
  }

  onInternalRoleClicked(){
    this.isInternalRole = true;
  }
}
