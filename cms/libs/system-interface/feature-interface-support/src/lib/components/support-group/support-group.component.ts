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
  selector: 'system-interface-support-group',
  templateUrl: './support-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportGroupComponent implements OnInit, OnChanges {
  isGroupDetailPopup = false;
  isSupportGroupReactivatePopupShow = false;
  isSupportGroupDeactivatePopupShow = false;
  isSupportGroupDeletePopupShow = false;
  isSupportGroupDeleteConfirmationPopupShow = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isSupportGroupGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() SupportGroupGridLists$: any;
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

  gridSupportGroupDataSubject = new Subject<any>();
  gridSupportGroupData$ = this.gridSupportGroupDataSubject.asObservable();

  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public gridMoreActionsSupport = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
      click: (data: any): void => {
        console.log("edit")
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate',
      icon: 'block',
      click: (data: any): void => {
        this.onOpenSupportGroupDeactivateClicked();
     

      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Re-activate',
      icon: 'done',
      click: (data: any): void => {
     this.onOpenSupportGroupReactivateClicked();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (data: any): void => {
        this.onOpenSupportGroupDeleteClicked();

      },
    },
  ];

  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadSupportGroupListGrid();
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
    this.loadSupportGroup(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadSupportGroup(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isSupportGroupGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadSupportGroupListEvent.emit(gridDataRefinerValue);
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

  gridDataHandle() {
    this.SupportGroupGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridSupportGroupDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isSupportGroupGridLoaderShow = false;
      }
    });
    this.isSupportGroupGridLoaderShow = false;
  }

  onGroupDetailsClicked() {
    this.isGroupDetailPopup = true;
  }
  onCloseGroupDetailPopupClicked() {
    this.isGroupDetailPopup = false;
  }
  onOpenSupportGroupDeleteClicked(){
    this.isSupportGroupDeletePopupShow = true;
  }
  onCloseSupportGroupDeleteClicked(){
    this.isSupportGroupDeletePopupShow = false;
  }
  onOpenSupportGroupDeactivateClicked(){
    this.isSupportGroupDeactivatePopupShow = true;
  }
  onCloseSupportGroupDeactivateClicked(){
    this.isSupportGroupDeactivatePopupShow = false;
  }
  onOpenSupportGroupReactivateClicked(){
    this.isSupportGroupReactivatePopupShow = true;
  }
  onCloseSupportGroupReactivateClicked(){
    this.isSupportGroupReactivatePopupShow = false;
  }
  onOpenSupportGroupDeleteConfirmationClicked(){
    this.isSupportGroupDeleteConfirmationPopupShow = true;

  }
  onCloseSupportGroupDeleteConfirmationClicked(){
    this.isSupportGroupDeleteConfirmationPopupShow = false;

  }
}
