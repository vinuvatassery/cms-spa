import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { SystemInterfaceSupportFacade } from '@cms/system-interface/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import { State, CompositeFilterDescriptor, filterBy } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
@Component({
  selector: 'system-interface-distribution-lists',
  templateUrl: './distribution-lists.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributionListsComponent implements OnInit, OnChanges {
  selectedMemberData: any;
  isEditMode = false;
  isMemberDetailPopup = false;
  isMemberReactivatePopupShow = false;
  isMemberDeactivatePopupShow = false;
  isMemberDeletePopupShow = false;
  isMemberDeleteConfirmationPopupShow = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isDistributionGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() selectedGroup: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() distributionGridLists$: any;
  @Input() supportGroupGridDataRefinerValue: any;
  @Output() loadDistributionListEvent = new EventEmitter<any>();
  @Output() loadSupportGroupListEvent = new EventEmitter<any>();

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
  memberForm!: FormGroup;

  gridDistributionDataSubject = new Subject<any>();
  gridDistributionData$ = this.gridDistributionDataSubject.asObservable();

  dataListsLoader$ = this.systemInterfaceSupportFacade.distributionListDataLoader$;
  selectedInterface = '';
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  processArray: any;
  searchColumnList: { columnName: string, columnDesc: string }[] = [
    {
      columnName: 'ALL',
      columnDesc: 'All Columns'
    },
    {
      columnName: "email",
      columnDesc: "Email"
    },
    {
      columnName: "firstName",
      columnDesc: "First Name"
    },
    {
      columnName: "lastName",
      columnDesc: "Last Name"
    },
    {
      columnName: "status",
      columnDesc: "Status"
    },
  ]

  public gridMoreActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
      click: (data: any): void => {
        if (data.email) {
          this.selectedMemberData = data;
          this.isEditMode = true;
          this.isMemberDetailPopup = true;
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate',
      icon: 'block',
      click: (data: any): void => {
        this.onOpenMemberDeactivateClicked();
        if (data.email) {
          this.selectedMemberData = data;
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Re-activate',
      icon: 'done',
      click: (data: any): void => {
        this.onOpenMemberReactivateClicked();
        if (data.email) {
          this.selectedMemberData = data;
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (data: any): void => {
        this.onOpenMemberDeleteClicked();
        if (data.email) {
          this.selectedMemberData = data;
        }
      },
    },
  ];

  /** Constructor **/
  constructor(
    private readonly loaderService: LoaderService,
    private readonly lovFacade: LovFacade,
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private readonly systemInterfaceSupportFacade: SystemInterfaceSupportFacade,
  ) {
    this.processArray = systemInterfaceSupportFacade.getStatusArray()
  }

  ngOnInit(): void {
    this.loadDistributionListGrid();
  }

  statusFilter: any;
  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    if (value == 'Active')
      value = 'Y'
    else if (value == 'InActive')
      value = 'N'

    if (field === 'status') {
      this.statusFilter = value;
    }

    filterService.filter({
      filters: [
        {
          field: field,
          operator: 'eq',
          value: value,
        },
      ],
      logic: 'or',
    });
  }

  ngOnChanges(): void {
    this.sortType = 'desc'
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadDistributionListGrid();
  }

  private loadDistributionListGrid(): void {
    if (!this.selectedGroup)
      return;

    const stateData = this.state;
    stateData.filter = this.filterData;

    this.selectedInterface = this.selectedGroup.groupName

    this.loadDistribution(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }

  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter: { logic: 'and', filters: [] },
    };
  }

  @Output() eventEmitter: EventEmitter<any> = new EventEmitter();
  loadDistribution(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    const gridDataRefinerValue = {
      SkipCount: skipCountValue,
      MaxResultCount: maxResultCountValue,
      Sorting: sortValue,
      SortType: sortTypeValue,
      Filter: JSON.stringify(this.state?.['filter']?.['filters'] ?? []),
      notificationGroupId: this.selectedGroup.notificationGroupId,
    };

    this.loadDistributionListEvent.emit(gridDataRefinerValue);
    this.eventEmitter.emit('Event data to pass');
    this.gridDataHandle();
  }

  onChange(data: any) {
    this.defaultGridState();

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'firstName',
              operator: 'contains',
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


  // defaultGridState() {
  //   this.state = {
  //     skip: 0,
  //     take: this.pageSizes[0]?.value,
  //     sort: this.sort,
  //     filter: { logic: 'and', filters: [] },
  //   };
  // }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.filterData = stateData.filter;
    this.loadDistributionListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadDistributionListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.distributionGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridDistributionDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isDistributionGridLoaderShow = false;
      }
    });
    this.isDistributionGridLoaderShow = false;
  }

  onMemberDetailsClicked() {
    if (!this.selectedGroup || !this.gridDataResult)
      return;
    this.isEditMode = false;
    this.selectedMemberData = null;
    this.isMemberDetailPopup = true;
  }

  onCloseMemberDetailPopupClicked() {
    this.isMemberDetailPopup = false;
    this.isEditMode = false;
    this.loadDistributionListGrid();
  }

  onChildDataUpdate() {
    this.isMemberDetailPopup = false;
    this.loadDistributionListGrid();
    const stateData = this.state;
    stateData.filter = this.filterData;

    this.selectedInterface = this.selectedGroup.groupName

    const gridDataRefinerValue = {
      SkipCount: this.state?.skip ?? 0,
      MaxResultCount: this.state?.take ?? 0,
      Filter: JSON.stringify(this.state?.['filter']?.['filters'] ?? []),
      notificationGroupId: this.selectedGroup.notificationGroupId,
    };
    this.loadSupportGroupListEvent.emit(this.supportGroupGridDataRefinerValue);
  }
  
  onOpenMemberDeleteClicked() { this.isMemberDeletePopupShow = true; }
  onCloseMemberDeleteClicked() { this.isMemberDeletePopupShow = false; }
  onOpenMemberDeactivateClicked() { this.isMemberDeactivatePopupShow = true; }
  onCloseMemberDeactivateClicked() { this.isMemberDeactivatePopupShow = false; }
  onOpenMemberReactivateClicked() { this.isMemberReactivatePopupShow = true; }
  onCloseMemberReactivateClicked() { this.isMemberReactivatePopupShow = false; }
  onOpenMemberDeleteConfirmationClicked() { this.isMemberDeleteConfirmationPopupShow = true; }
  onCloseMemberDeleteConfirmationClicked() { this.isMemberDeleteConfirmationPopupShow = false; }

  addNotificationUser(data: any): void {
    this.systemInterfaceSupportFacade.addDistributionListUser(data, this.isEditMode);
    this.loadDistributionListGrid();
  }

  deactivateUser() {
    if (this.selectedMemberData.status === 'InActive') {
      this.lovFacade.showHideSnackBar(SnackBarNotificationType.WARNING, "Already Deactivated.");
      return;
  }
    this.systemInterfaceSupportFacade.changeDistributionListUserStatus(this.selectedMemberData.notificationUserId, false)
    this.isMemberDeactivatePopupShow = false;
    this.systemInterfaceSupportFacade.changeStatusDistributionListUser$.subscribe({
      next: () => {
        this.loadDistributionListGrid();
      }
    });
  }

  reactivateUser() {
    if (this.selectedMemberData.status === 'Active') {
      this.lovFacade.showHideSnackBar(SnackBarNotificationType.WARNING, "Already Activated.");
      return;
  }
    this.systemInterfaceSupportFacade.changeDistributionListUserStatus(this.selectedMemberData.notificationUserId, true)
    this.isMemberReactivatePopupShow = false;
    this.systemInterfaceSupportFacade.changeStatusDistributionListUser$.subscribe({
      next: () => {
        this.loadDistributionListGrid();
      }
    });
  }
  // onOpenMemberDeleteConfirmationClicked() {
  //   this.isMemberDeleteConfirmationPopupShow = true;
  // }
  deleteUser() {
    this.systemInterfaceSupportFacade.deleteDistributionListUser(this.selectedMemberData.notificationUserId)
    this.isMemberDeletePopupShow = false;
    this.systemInterfaceSupportFacade.deleteDistributionListUser$.subscribe({
      next: () => {
        this.loadDistributionListGrid();
        this.onChildDataUpdate();
      }
    });
  }
  // onCloseMemberDeleteConfirmationClicked() {
  //   this.isMemberDeleteConfirmationPopupShow = false;

  // performSearch(searchValue: any) {
  //   this.onChange(searchValue);
  // }

  


}