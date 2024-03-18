/** Angular **/
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  OnChanges,
} from '@angular/core';
/** Facades **/
import { UserManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Subject } from 'rxjs';
@Component({
  selector: 'system-config-language-list',
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageListComponent implements OnInit, OnChanges {
 /** Public properties **/
 isLanguageDeactivatePopup = false;
 isLanguageDetailPopup = false;

 popupClassAction = 'TableActionPopup app-dropdown-action-list';
 public formUiStyle : UIFormStyle = new UIFormStyle();
 
 @Input() pageSizes: any;
 @Input() sortValue: any;
 @Input() sortType: any;
 @Input() sort: any;
 @Input() languagesDataLists$: any;
 @Input() languagesFilterColumn$: any;
 @Output() loadLanguagesListsEvent = new EventEmitter<any>();
 @Output() languagesFilterColumnEvent = new EventEmitter<any>();
 
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
 isLanguagesListGridLoaderShow = false;
 gridLanguagesDataSubject = new Subject<any>();
 gridLanguagesData$ =
   this.gridLanguagesDataSubject.asObservable();
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
      this.onLanguageDeactivateClicked()
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
  this.loadLanguagesList(); 
}
ngOnChanges(): void {
  this.state = {
    skip: 0,
    take: this.pageSizes[0]?.value,
    sort: this.sort,
  };

  this.loadLanguagesList();
}

private loadLanguagesList(): void {
  this.loadLanguagesLitData(
    this.state?.skip ?? 0,
    this.state?.take ?? 0,
    this.sortValue,
    this.sortType
  );
}
loadLanguagesLitData(
  skipCountValue: number,
  maxResultCountValue: number,
  sortValue: string,
  sortTypeValue: string
) {
  this.isLanguagesListGridLoaderShow = true;
  const gridDataRefinerValue = {
    skipCount: skipCountValue,
    pagesize: maxResultCountValue,
    sortColumn: sortValue,
    sortType: sortTypeValue,
  };
  this.loadLanguagesListsEvent.emit(gridDataRefinerValue);
  this.gridDataHandle();
}
loadLanguagesFilterColumn(){
  this.languagesFilterColumnEvent.emit();

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
  this.loadLanguagesList();
}

// updating the pagination infor based on dropdown selection
pageSelectionChange(data: any) {
  this.state.take = data.value;
  this.state.skip = 0;
  this.loadLanguagesList();
}

public filterChange(filter: CompositeFilterDescriptor): void {
  this.filterData = filter;
}

gridDataHandle() {
  this.languagesDataLists$.subscribe(
    (data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridLanguagesDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isLanguagesListGridLoaderShow = false;
      }
    }
  );
  this.isLanguagesListGridLoaderShow = false;
}

 /** Internal event methods **/
 onCloseLanguageDeactivateClicked() {
   this.isLanguageDeactivatePopup = false;
 }
 onLanguageDeactivateClicked() {
   this.isLanguageDeactivatePopup = true;
 }
 onCloseLanguageDetailClicked() {
   this.isLanguageDetailPopup = false;
 }
 onLanguageDetailClicked() {
   this.isLanguageDetailPopup = true;
 }

}
