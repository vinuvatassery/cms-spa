import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import {
  State,
  CompositeFilterDescriptor,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject, first } from 'rxjs';
@Component({
  selector: 'system-interface-notification-category',
  templateUrl: './notification-category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCategoryComponent implements OnInit, OnChanges {
  isNotificationCategoryDetailPopup = false;
  isNotificationCategoryReactivatePopupShow = false;
  isNotificationCategoryDeactivatePopupShow = false;
  isNotificationCategoryDeletePopupShow = false;
  isNotificationCategoryDeleteConfirmationPopupShow = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isNotificationCategoryGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() notificationCategoryGridLists$: any;
  @Input() selectedGroup: any;
  @Input() eventLov$: any;
  @Input() subEventLov$: any;
  @Input() notificationCategoryListDataLoader$: any;
  @Input() addnotificationCategory$: any;
  @Input() notificationCategoryReactivate$: any;
  @Input() notificationCategoryRemove$: any;
  @Input() editnotificationCategory$: any;
  @Output() loadNotificationCategoryListEvent = new EventEmitter<any>();
  @Output() addNotificationCategoryEvent = new EventEmitter<any>();
  @Output() deactivateConfimEvent = new EventEmitter<string>();
  @Output() reactivateConfimEvent = new EventEmitter<string>();
  @Output() deleteConfimedEvent = new EventEmitter<string>();
  @Output() editNotificationCategoryEvent = new EventEmitter<string>();
  @Output() loadSubEventByParentIdEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'vendorName';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  selectedInterface = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  deactivateButtonEmitted = false;
  reactivateButtonEmitted = false;
  deleteButtonEmitted = false;
  eventNotificationGroupId!: any;
  eventId!: any;
  deactivebuttonEmitted = false;
  reletebuttonEmitted = false;
  editButtonEmitted = false;
  isEditNotificationCategory = false;
  selectedNotificationCategory!: any;
  statusFilter: any;
  gridNotificationCategoryDataSubject = new Subject<any>();
  gridNotificationCategoryData$ = this.gridNotificationCategoryDataSubject.asObservable();

  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public gridMoreActionsNotification = [
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
      click: (data: any): void => {
        if (!this.deactivateButtonEmitted && data.eventNotificationGroupId) {
          this.deactivateButtonEmitted = true;
          this.onOpenNotificationCategoryDeactivateClicked(data.eventNotificationGroupId);
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Re-activate',
      icon: 'done',
      click: (data: any): void => {
        if (!this.reactivateButtonEmitted && data.eventNotificationGroupId) {
          this.reactivateButtonEmitted = true;
          this.onOpenNotificationCategoryReactivateClicked(data.eventNotificationGroupId);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.deleteButtonEmitted && data.eventNotificationGroupId) {
          this.deleteButtonEmitted = true;
          this.onOpenNotificationCategoryDeleteClicked(data.eventNotificationGroupId);
        }

      },
    },
  ];

  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.loadNotificationCategoryListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadNotificationCategoryListGrid();
  }

  private loadNotificationCategoryListGrid(): void {
    if (!this.selectedGroup)
      return;

    this.selectedInterface = this.selectedGroup.groupName
    this.loadNotificationCategory(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadNotificationCategory(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isNotificationCategoryGridLoaderShow = true;
    const gridDataRefinerValue = {
      SkipCount: skipCountValue,
      MaxResultCount: maxResultCountValue,
      Sorting: 'EventGroupCode',
      SortType: sortTypeValue,
      notificationGroupId: this.selectedGroup.notificationGroupId,
    };
    this.loadNotificationCategoryListEvent.emit(gridDataRefinerValue);
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
    this.loadNotificationCategoryListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadNotificationCategoryListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.notificationCategoryGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridNotificationCategoryDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isNotificationCategoryGridLoaderShow = false;
      }
    });
    this.isNotificationCategoryGridLoaderShow = false;
  }

  onNotificationCategoryDetailsClicked() {
    if (!this.selectedGroup || !this.gridDataResult)
      return;
    this.isEditNotificationCategory = false;
    this.isNotificationCategoryDetailPopup = true;
  }
  onCloseNotificationCategoryDetailPopupClicked() {
    this.editButtonEmitted = false;
    this.isEditNotificationCategory = false;
    this.isNotificationCategoryDetailPopup = false;
  }

  onEditGroupDetailsClicked(eventNotificationGroup: any) {
    if (!this.selectedGroup || !this.gridDataResult)
      return;
    this.selectedNotificationCategory = eventNotificationGroup;
    this.isEditNotificationCategory = true;
    this.eventNotificationGroupId = eventNotificationGroup.eventNotificationGroupId;
    this.isNotificationCategoryDetailPopup = true;
  }

  onOpenNotificationCategoryDeleteClicked(eventNotificationGroupId: any) {
    this.eventNotificationGroupId = eventNotificationGroupId;
    this.isNotificationCategoryDeletePopupShow = true;
  }
  onCloseNotificationCategoryDeleteClicked() {
    this.deleteButtonEmitted = false;
    this.isNotificationCategoryDeletePopupShow = false;
  }
  onOpenNotificationCategoryDeactivateClicked(eventNotificationGroupId: any) {
    this.eventNotificationGroupId = eventNotificationGroupId;
    this.isNotificationCategoryDeactivatePopupShow = true;
  }
  onCloseNotificationCategoryDeactivateClicked() {
    this.deactivateButtonEmitted = false;
    this.isNotificationCategoryDeactivatePopupShow = false;
  }
  onOpenNotificationCategoryReactivateClicked(eventNotificationGroupId: any) {
    this.eventNotificationGroupId = eventNotificationGroupId;
    this.isNotificationCategoryReactivatePopupShow = true;
  }
  onCloseNotificationCategoryReactivateClicked() {
    this.reactivateButtonEmitted = false;
    this.isNotificationCategoryReactivatePopupShow = false;
  }
  onOpenNotificationCategoryDeleteConfirmationClicked() {
    this.isNotificationCategoryDeleteConfirmationPopupShow = true;

  }
  onCloseNotificationCategoryDeleteConfirmationClicked() {
    this.isNotificationCategoryDeleteConfirmationPopupShow = false;
  }

  addNotificationCategory(data: any): void {
    this.addNotificationCategoryEvent.emit(data);
    this.addnotificationCategory$.pipe(first((response: any) => response != null))
      .subscribe((response: any) => {
        if (response ?? false) {
          this.loadNotificationCategoryListGrid();
          this.onCloseNotificationCategoryDetailPopupClicked();
        }

      })
  }

  editNotificationCategory(data: any): void {
    data["eventNotificationGroupId"] = this.eventNotificationGroupId;
    this.editNotificationCategoryEvent.emit(data);
    this.editnotificationCategory$.pipe(first((response: any) => response != null))
      .subscribe((response: any) => {
        if (response ?? false) {
          this.loadNotificationCategoryListGrid()
          this.onCloseNotificationCategoryDetailPopupClicked();
          this.cdr.detectChanges();
        }

      })
  }

  handleNotificationCategoryDeactive(isDeactivate: any) {
    if (isDeactivate) {
      this.deactivateButtonEmitted = false;
      this.deactivateConfimEvent.emit(this.eventNotificationGroupId);

      this.notificationCategoryReactivate$.pipe(first((response: any) => response != null))
        .subscribe((response: any) => {
          if (response ?? false) {
            this.loadNotificationCategoryListGrid()
          }

        })
    }
    this.onCloseNotificationCategoryDeactivateClicked()
  }

  handleNotificationCategoryReactive(isReactivate: any) {
    if (isReactivate) {
      this.reactivateButtonEmitted = false;
      this.reactivateConfimEvent.emit(this.eventNotificationGroupId);

      this.notificationCategoryReactivate$.pipe(first((response: any) => response != null))
        .subscribe((response: any) => {
          if (response ?? false) {
            this.loadNotificationCategoryListGrid()
          }
        })
    }
    this.onCloseNotificationCategoryReactivateClicked()
  }

  handleNotificationCategoryDelete(isHardDelete: any) {
    if (isHardDelete) {
      this.deleteButtonEmitted = false;
      this.deleteConfimedEvent.emit(this.eventNotificationGroupId);

      this.notificationCategoryRemove$.pipe(first((response: any) => response != null))
        .subscribe((response: any) => {
          if (response ?? false) {
            this.loadNotificationCategoryListGrid()
          }

        })
    }
    this.onCloseNotificationCategoryDeleteClicked()
  }

  getSubEventByParentId(event: any) {
    this.loadSubEventByParentIdEvent.emit(event);
  }
  
}
