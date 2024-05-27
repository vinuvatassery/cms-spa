/** Angular **/
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnChanges, EventEmitter, Output, Input } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
@Component({
  selector: 'system-config-pronouns-list',
  templateUrl: './pronouns-list.component.html',
  styleUrls: ['./pronouns-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PronounsListComponent implements OnInit, OnChanges {

  /** Public properties **/
  isPronounsDeactivatePopup = false;
  isPronounsDetailPopup = false; 
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() pronounsDataLists$: any;
  @Input() pronounsFilterColumn$: any;
  @Output() loadPronounsListsEvent = new EventEmitter<any>();
  @Output() pronounsFilterColumnEvent = new EventEmitter<any>();
  
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
  isPronounsListGridLoaderShow = false;
  gridPronounsDataSubject = new Subject<any>();
  gridPronounsData$ =
    this.gridPronounsDataSubject.asObservable();
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
       this.onPronounsDeactivateClicked()
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


 

  /** Lifecycle hooks **/
  
  ngOnInit(): void {
    this.loadPronounsList(); 
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadPronounsList();
  }
  
  private loadPronounsList(): void {
    this.loadpronounsLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadpronounsLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isPronounsListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadPronounsListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadPronounsFilterColumn(){
    this.pronounsFilterColumnEvent.emit();
  
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
    this.loadPronounsList();
  }
  
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadPronounsList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  gridDataHandle() {
    this.pronounsDataLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridPronounsDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isPronounsListGridLoaderShow = false;
        }
      }
    );
    this.isPronounsListGridLoaderShow = false;
  }

  /** Internal event methods **/
  onClosePronounsDeactivateClicked() {
    this.isPronounsDeactivatePopup = false;
  }
  onPronounsDeactivateClicked() {
    this.isPronounsDeactivatePopup = true;
  }
  onClosePronounsDetailClicked() {
    this.isPronounsDetailPopup = false;
  }
  onPronounsDetailClicked() {
    this.isPronounsDetailPopup = true;
  }
}
