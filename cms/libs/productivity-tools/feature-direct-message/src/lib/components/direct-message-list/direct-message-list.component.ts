/** Angular **/
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
import {  GridDataResult } from '@progress/kendo-angular-grid';
import { Subject } from 'rxjs';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Router } from '@angular/router';
/** Facades **/ 
@Component({
  selector: 'productivity-tools-direct-message-list',
  templateUrl: './direct-message-list.component.html',  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectMessageListComponent implements OnInit, OnChanges{
  /** Public properties **/
  
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isDirectMessageGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() directMessageGridLists$: any;
  @Output() loadDirectMessageListEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'lastmsg';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;

  gridVDirectMessageListDataSubject = new Subject<any>();
  gridDirectMessageListData$ = this.gridVDirectMessageListDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };

 
 /** Constructor **/
 constructor(
  private readonly cdr: ChangeDetectorRef,
  private readonly router: Router
) {}

ngOnInit(): void {
  this.loadDirectMessageListGrid();
}
ngOnChanges(): void {
  this.state = {
    skip: 0,
    take: this.pageSizes[0]?.value,
    sort: this.sort,
  };
}

private loadDirectMessageListGrid(): void {
  this.loadDirectMessageList(
    this.state?.skip ?? 0,
    this.state?.take ?? 0,
    this.sortValue,
    this.sortType
  );
}
loadDirectMessageList(
  skipCountValue: number,
  maxResultCountValue: number,
  sortValue: string,
  sortTypeValue: string
) {
  this.isDirectMessageGridLoaderShow = true;
  const gridDataRefinerValue = {
    skipCount: skipCountValue,
    maxResultCount: maxResultCountValue,
    sorting: sortValue,
    sortType: sortTypeValue,
  };
  this.loadDirectMessageListEvent.emit(gridDataRefinerValue);
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
  this.loadDirectMessageListGrid();
}

// updating the pagination infor based on dropdown selection
pageSelectionChange(data: any) {
  this.state.take = data.value;
  this.state.skip = 0;
  this.loadDirectMessageListGrid();
}

public filterChange(filter: CompositeFilterDescriptor): void {
  this.filterData = filter;
}

gridDataHandle() {
  this.directMessageGridLists$.subscribe((data: GridDataResult) => {
    this.gridDataResult = data;
    this.gridDataResult.data = filterBy(
      this.gridDataResult.data,
      this.filterData
    );
    this.gridVDirectMessageListDataSubject.next(this.gridDataResult);
    if (data?.total >= 0 || data?.total === -1) { 
      this.isDirectMessageGridLoaderShow = false;
    }
  });
  this.isDirectMessageGridLoaderShow = false;

}
  onClientFromClicked(clientId:any){
    this.router.navigate([`/case-management/cases/case360/${clientId}`]);
  } 
 
}


 
