import {
  Component,
  OnInit, 
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
  selector: 'system-config-assister-groups-list',
  templateUrl: './assister-groups-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssisterGroupsListComponent implements OnInit, OnChanges {
 
  /** Public properties **/
  isAssisterGroupsDetailPopup = false;
  isAssisterGroupsDeletePopupShow = false;
  isAssisterGroupsDeactivatePopupShow = false;
  isAssisterGroupsReactivatePopupShow = false; 
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() assisterGroupDataLists$: any;
  @Input() assisterGroupFilterColumn$: any;
  @Output() loadAssisterGroupListsEvent = new EventEmitter<any>();
  @Output() assisterGroupFilterColumnEvent = new EventEmitter<any>();
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
  isAssisterGroupListGridLoaderShow = false;
  gridAssisterGroupDataSubject = new Subject<any>();
  gridAssisterGroupData$ =
    this.gridAssisterGroupDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public moreActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
    },

    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate',
      icon: 'block',
      click: (data: any): void => {
        this.onAssisterGroupsDeactivateClicked();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (data: any): void => {
        this.onAssisterGroupsDeleteClicked();
      },
    },
  ];
 


  
  ngOnInit(): void {
    this.loadAssisterGroupList(); 
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadAssisterGroupList();
  }
  
  private loadAssisterGroupList(): void {
    this.loadAssisterGroupLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadAssisterGroupLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isAssisterGroupListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadAssisterGroupListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadAssisterGroupFilterColumn(){
    this.assisterGroupFilterColumnEvent.emit();
  
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
    this.loadAssisterGroupList();
  }
  
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadAssisterGroupList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  gridDataHandle() {
    this.assisterGroupDataLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridAssisterGroupDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isAssisterGroupListGridLoaderShow = false;
        }
      }
    );
    this.isAssisterGroupListGridLoaderShow = false;
  }


  /** Internal event methods **/
  onCloseAssisterGroupsDetailClicked() {
    this.isAssisterGroupsDetailPopup = false;
  }
  onAssisterGroupsDetailClicked() {
    this.isAssisterGroupsDetailPopup = true;
  }

  onCloseAssisterGroupsDeleteClicked() {
    this.isAssisterGroupsDeletePopupShow = false;
  }
  onAssisterGroupsDeleteClicked() {
    this.isAssisterGroupsDeletePopupShow = true;
  }
  onCloseAssisterGroupsDeactivateClicked() {
    this.isAssisterGroupsDeactivatePopupShow = false;
  }
  onAssisterGroupsDeactivateClicked() {
    this.isAssisterGroupsDeactivatePopupShow = true;
  }

  onCloseAssisterGroupsReactivateClicked() {
    this.isAssisterGroupsReactivatePopupShow = false;
  }
}
