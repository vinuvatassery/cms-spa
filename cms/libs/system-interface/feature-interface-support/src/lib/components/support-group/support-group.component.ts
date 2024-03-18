import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FilterService, GridDataResult, RowArgs, SelectableMode, SelectableSettings } from '@progress/kendo-angular-grid';
import { State, CompositeFilterDescriptor} from '@progress/kendo-data-query';
import { LovFacade } from '@cms/system-config/domain';
import { Subject, first } from 'rxjs';
import { SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
  selector: 'system-interface-support-group',
  templateUrl: './support-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportGroupComponent implements OnInit, OnChanges {
  selectedGroup: any;
  public selectedRowChange(selectionEvent: any) {
    this.selectedGroup = selectionEvent.selectedRows[0].dataItem;
    this.selectedRowEvent.emit(this.selectedGroup);
    this.mySelection = [this.selectedGroup.notificationGroupId];
  }

  isGroupDetailPopup = false;
  isSupportGroupReactivatePopupShow = false;
  isSupportGroupDeactivatePopupShow = false;
  isSupportGroupDeletePopupShow = false;
  isSupportGroupDeleteConfirmationPopupShow = false;
  isSupportGroupGridLoaderShow = false;

  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';

  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() addSupportGroup$: any;
  @Input() editSupportGroup$: any;
  @Input() SupportGroupGridLists$: any;
  @Input() supportGroupReactivate$: any;
  @Input() supportGroupRemove$: any;
  @Input() supportGroupProfilePhoto$: any;
  @Input() supportGroupListsLoader$: any;
    @Output() loadSupportGroupListEvent = new EventEmitter<any>();
  @Output() deactivateConfimEvent = new EventEmitter<string>();
  @Output() reactivateConfimEvent = new EventEmitter<string>();
  @Output() deleteConfimedEvent = new EventEmitter<string>();
  @Output() addSupportGroupEvent = new EventEmitter<string>();
  @Output() editSupportGroupEvent = new EventEmitter<string>();
  @Output() selectedRowEvent = new EventEmitter<any>();

  public state!: State;
  sortColumn = 'groupName';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  searchText = '';
  isFiltered = false;
  filter!: any;
  selectedColumn: any = 'ALL'
  gridDataResult!: GridDataResult;
  deactivateButtonEmitted = false;
  reactivateButtonEmitted = false;
  deleteButtonEmitted = false;
  notificationGroupId!: any;
  userPerGroupCount!: any;
  deactivebuttonEmitted = false;
  reletebuttonEmitted = false;
  isEditSupportGroup = false;
  editButtonEmitted = false;
  selectedSupportGroup!: any;
  selectedSearchColumn = 'ALL';

  gridSupportGroupDataSubject = new Subject<any>();
  public selectableSettings: SelectableSettings;
  gridSupportGroupData$ = this.gridSupportGroupDataSubject.asObservable();
  statusFilter: any;
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  columns: any = {
    ALL: 'All Columns',
    groupCode: 'Interface',
    groupName: 'Group Name'
  };
  searchColumnList = [
    { columnName: 'ALL', columnDesc: 'All Columns' },
    { columnName: 'groupCode', columnDesc: 'Interface' },
    { columnName: 'groupName', columnDesc: 'Group Name' }
  ];

  public gridMoreActionsSupport = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
      click: (data: any): void => {
        if (!this.editButtonEmitted) {
          this.editButtonEmitted = true;
          this.onEditGroupDetailsClicked(data);
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate',
      icon: 'block',
      buttonName: 'deactivate',
      click: (data: any): void => {
        if (!this.deactivateButtonEmitted) {
          this.deactivateButtonEmitted = true;
          this.onOpenSupportGroupDeactivateClicked(data.notificationGroupId);
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Re-activate',
      icon: 'done',
      buttonName: 'reactivate',
      click: (data: any): void => {
        if (!this.reactivateButtonEmitted) {
          this.reactivateButtonEmitted = true;
          this.onOpenSupportGroupReactivateClicked(data.notificationGroupId);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      buttonName: 'delete',
      click: (data: any): void => {
        if (!this.deleteButtonEmitted) {
          if (data.userPerGroup > 0) {
            // Show warning if userPerGroupCount > 0
            this.deleteButtonEmitted = false;
            this.lovFacade.showHideSnackBar(SnackBarNotificationType.WARNING, "Group has dependencies and cannot be deleted.");
          } else {
            // If userPerGroupCount <= 0, proceed with opening delete modal
            this.deleteButtonEmitted = true;
            this.onOpenSupportGroupDeleteClicked(data.notificationGroupId, data.userPerGroup);
          }
        }

      },
    },
  ];

  public mode: SelectableMode = 'single';
  interfaceSupportGroupLov = this.lovFacade.interfaceSupportGroupLov$;
  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private readonly lovFacade: LovFacade,
  ) {

    this.selectableSettings = {
      checkboxOnly: false,
      drag: false,
    };

  }

  ngOnInit(): void {
    this.loadSupportGroupListGrid();
    this.lovFacade.getInterfaceSupportGroupLovs();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    
    this.loadSupportGroupListGrid();
  }

  private loadSupportGroupListGrid(): void {
    this.loadSupportGroup(this.state?.skip ?? 0, this.state?.take ?? 0, this.sortValue, this.sortType);
  }
  loadSupportGroup(skipCountValue: number, maxResultCountValue: number, sortValue: string, sortTypeValue: string) {
    this.isSupportGroupGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      maxResultCount: maxResultCountValue,
      sorting: sortValue,
      sortType: sortTypeValue,
      filter: JSON.stringify(this.filter)
    };
    this.loadSupportGroupListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    this.statusFilter = value;
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



  onChange(data: any) {
    this.defaultGridState();
    let operator = 'contains';
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'groupName',
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

  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter: { logic: 'and', filters: [] }
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
    this.sortColumn = this.columns[stateData.sort[0]?.field];
    this.filter = stateData?.filter?.filters;
    const filterList = [];
    if (stateData.filter?.filters.length > 0) {
      for (const filter of stateData.filter.filters) {
        filterList.push(this.columns[filter.filters[0].field]);
      }
    }
    this.filteredBy = filterList.toString();
    this.loadSupportGroupListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadSupportGroupListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  searchColumnChangeHandler(value: string) {
    this.filter = [];
    if (this.searchText) {
      this.onSearch(this.searchText);
    }
  }
  onSearch(searchValue: any) {
    this.onChange(searchValue);
  }

  gridDataHandle() {
    this.SupportGroupGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      // this.gridDataResult.data = filterBy(
      //   this.gridDataResult.data,
      //   this.filterData
      // );
      if (this.mySelection.length < 1)
        this.selectedRowEvent.emit(this.gridDataResult.data[0]);
      else
        this.gridDataResult.data.find(row => row.notificationGroupId === this.mySelection[0]);

      if (this.mySelection.length < 1)
        this.mySelection = [this.gridDataResult?.data[0]?.notificationGroupId];
      else
        this.mySelection = [this.selectedGroup?.notificationGroupId];
      this.gridSupportGroupDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isSupportGroupGridLoaderShow = false;
      }
    });
    //this.gridSupportGroupData$.subscribe((data) => { console.log(data) });
    this.isSupportGroupGridLoaderShow = false;

  }
  onEditGroupDetailsClicked(notificationGroup: any) {
    this.selectedSupportGroup = notificationGroup;
    this.isEditSupportGroup = true;
    this.notificationGroupId = notificationGroup.notificationGroupId;
    this.isGroupDetailPopup = true;
  }

  onGroupDetailsClicked() {
    this.isEditSupportGroup = false;
    this.isGroupDetailPopup = true;
  }
  onCloseGroupDetailPopupClicked() {
    this.editButtonEmitted = false;
    this.isGroupDetailPopup = false;
    this.isEditSupportGroup = false;
  }
  onOpenSupportGroupDeleteClicked(notificationGroupId: any, userPerGroup: number) {
    this.notificationGroupId = notificationGroupId;
    if (userPerGroup == 0) {
      this.isSupportGroupDeletePopupShow = true;
    } else {
      this.deleteButtonEmitted = false;
    }
  }
  onCloseSupportGroupDeleteClicked() {
    this.deleteButtonEmitted = false;
    this.isSupportGroupDeletePopupShow = false;

  }
  onOpenSupportGroupDeactivateClicked(notificationGroupId: any) {
    this.isSupportGroupDeactivatePopupShow = true;
    this.notificationGroupId = notificationGroupId;
  }
  onCloseSupportGroupDeactivateClicked() {

    this.deactivateButtonEmitted = false;
    this.isSupportGroupDeactivatePopupShow = false;

  }
  onOpenSupportGroupReactivateClicked(notificationGroupId: any) {
    this.isSupportGroupReactivatePopupShow = true;
    this.notificationGroupId = notificationGroupId;
  }
  onCloseSupportGroupReactivateClicked() {
    this.reactivateButtonEmitted = false;
    this.isSupportGroupReactivatePopupShow = false;
  }
  onOpenSupportGroupDeleteConfirmationClicked() {
    this.isSupportGroupDeleteConfirmationPopupShow = true;

  }
  onCloseSupportGroupDeleteConfirmationClicked() {
    this.isSupportGroupDeleteConfirmationPopupShow = false;

  }

  addSupportGroup(data: any): void {
    this.addSupportGroupEvent.emit(data);
    this.addSupportGroup$.pipe(first((response: any) => response != null))
      .subscribe((response: any) => {
        if (response ?? false) {
          this.loadSupportGroupListGrid()
        }

      })

    this.onCloseGroupDetailPopupClicked();
  }

  editSupportGroup(data: any): void {
    data["notificationGroupId"] = this.notificationGroupId;
    this.editSupportGroupEvent.emit(data);
    this.editSupportGroup$.pipe(first((response: any) => response != null))
      .subscribe((response: any) => {
        if (response ?? false) {
          this.loadSupportGroupListGrid()
          this.cdr.detectChanges();
        }

      })

    this.onCloseGroupDetailPopupClicked();
  }

  handleSupportGroupDeactive(isDeactivate: any) {
    if (isDeactivate) {
      this.deactivateButtonEmitted = false;
      this.deactivateConfimEvent.emit(this.notificationGroupId);

      this.supportGroupReactivate$.pipe(first((response: any) => response != null))
        .subscribe((response: any) => {
          if (response ?? false) {
            this.loadSupportGroupListGrid()
          }

        })
    }
    this.onCloseSupportGroupDeactivateClicked()
  }

  handleSupportGroupReactive(isReactivate: any) {
    if (isReactivate) {
      this.reactivateButtonEmitted = false;
      this.reactivateConfimEvent.emit(this.notificationGroupId);

      this.supportGroupReactivate$.pipe(first((response: any) => response != null))
        .subscribe((response: any) => {
          if (response ?? false) {
            this.loadSupportGroupListGrid()
          }

        })
    }
    this.onCloseSupportGroupReactivateClicked()
  }

  handleSupportGroupDelete(isHardDelete: any) {
    if (isHardDelete) {
      this.deleteButtonEmitted = false;
      this.deleteConfimedEvent.emit(this.notificationGroupId);

      this.supportGroupRemove$.pipe(first((response: any) => response != null))
        .subscribe((response: any) => {
          if (response ?? false) {
            this.loadSupportGroupListGrid()
          }

        })
    }
    this.onCloseSupportGroupDeleteClicked()
  }

  public mySelection: any[] = [];
  public isRowSelected = (e: RowArgs) => this.mySelection.indexOf(e.dataItem.notificationGroupId) >= 0;
}
