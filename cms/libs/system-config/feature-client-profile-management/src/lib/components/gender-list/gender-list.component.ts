import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnChanges, Input, EventEmitter, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
@Component({
  selector: 'system-config-gender-list',
  templateUrl: './gender-list.component.html',
  styleUrls: ['./gender-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenderListComponent implements OnInit, OnChanges {

 /** Public properties **/
 isGenderDeactivatePopup = false;
 isGenderDetailPopup = false;
 
 public formUiStyle : UIFormStyle = new UIFormStyle();
 popupClassAction = 'TableActionPopup app-dropdown-action-list';
 @Input() pageSizes: any;
 @Input() sortValue: any;
 @Input() sortType: any;
 @Input() sort: any;
 @Input() genderDataLists$: any;
 @Input() genderFilterColumn$: any;
 @Output() loadGenderListsEvent = new EventEmitter<any>();
 @Output() genderFilterColumnEvent = new EventEmitter<any>();
 directMsgLoader = false;
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
 isGenderListGridLoaderShow = false;
 gridGenderDataSubject = new Subject<any>();
 gridGenderData$ =
   this.gridGenderDataSubject.asObservable();
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
     text: "Reorder",
     icon: "format_list_numbered",
     click: (): void => {
     },
   },
   {
     buttonType:"btn-h-primary",
     text: "Deactivate",
     icon: "block",
     click: (): void => {
      this.onGenderDeactivateClicked()
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
 

 
  
 ngOnInit(): void {
  this.loadGenderList(); 
}
ngOnChanges(): void {
  this.state = {
    skip: 0,
    take: this.pageSizes[0]?.value,
    sort: this.sort,
  };

  this.loadGenderList();
}

private loadGenderList(): void {
  this.loadGenderLitData(
    this.state?.skip ?? 0,
    this.state?.take ?? 0,
    this.sortValue,
    this.sortType
  );
}
loadGenderLitData(
  skipCountValue: number,
  maxResultCountValue: number,
  sortValue: string,
  sortTypeValue: string
) {
  this.isGenderListGridLoaderShow = true;
  const gridDataRefinerValue = {
    skipCount: skipCountValue,
    pagesize: maxResultCountValue,
    sortColumn: sortValue,
    sortType: sortTypeValue,
  };
  this.loadGenderListsEvent.emit(gridDataRefinerValue);
  this.gridDataHandle();
}
loadGenderFilterColumn(){
  this.genderFilterColumnEvent.emit();

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
  this.loadGenderList();
}

// updating the pagination infor based on dropdown selection
pageSelectionChange(data: any) {
  this.state.take = data.value;
  this.state.skip = 0;
  this.loadGenderList();
}

public filterChange(filter: CompositeFilterDescriptor): void {
  this.filterData = filter;
}

gridDataHandle() {
  this.genderDataLists$.subscribe(
    (data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridGenderDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isGenderListGridLoaderShow = false;
      }
    }
  );
  this.isGenderListGridLoaderShow = false;
}
 /** Internal event methods **/
 onCloseGenderDeactivateClicked() {
   this.isGenderDeactivatePopup = false;
 }
 onGenderDeactivateClicked() {
   this.isGenderDeactivatePopup = true;
 }
 onCloseGenderDetailClicked() {
   this.isGenderDetailPopup = false;
 }
 onGenderDetailClicked() {
   this.isGenderDetailPopup = true;
 }
}
