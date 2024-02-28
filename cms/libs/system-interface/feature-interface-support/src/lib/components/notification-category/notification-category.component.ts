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
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  State,
  CompositeFilterDescriptor,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
@Component({
  selector: 'system-interface-notification-category',
  templateUrl: './notification-category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCategoryComponent implements OnInit, OnChanges {
  isNotificationCategoryDetailPopup = false;

  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isNotificationCategoryGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() notificationCategoryGridLists$: any;
  @Output() loadNotificationCategoryListEvent = new EventEmitter<any>();
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

  gridNotificationCategoryDataSubject = new Subject<any>();
  gridNotificationCategoryData$ =
    this.gridNotificationCategoryDataSubject.asObservable();

  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public gridMoreActionsNotification = [
    {
      buttonType: 'btn-h-primary',
      text: 'Add',
      icon: 'add',
      click: (data: any): void => {
     console.log('test');
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
      click: (data: any): void => {
     console.log('test');
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate',
      icon: 'block',
      click: (data: any): void => {
     console.log('test');
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Re-activate',
      icon: 'done',
      click: (data: any): void => {
     console.log('test');
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (data: any): void => {
     console.log('test');
      },
    },
  ];

  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) {}

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
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
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
    this.isNotificationCategoryDetailPopup = true;
  }
  onCloseNotificationCategoryDetailPopupClicked() {
    this.isNotificationCategoryDetailPopup = false;
  }
}
