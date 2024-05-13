import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Subject } from 'rxjs';
@Component({
  selector: 'system-config-sexual-orientation-list',
  templateUrl: './sexual-orientation-list.component.html',
  styleUrls: ['./sexual-orientation-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SexualOrientationListComponent implements OnInit, OnChanges {
  /** Public properties **/
  isSexualOrientationDeactivatePopup = false;
  isSexualOrientationDetailPopup = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();
  @Input() pageSizes: any;
 @Input() sortValue: any;
 @Input() sortType: any;
 @Input() sort: any;
 @Input() sexualOrientationDataLists$: any;
 @Input() sexualOrientationFilterColumn$: any;
 @Output() loadRacialEthnicListsEvent = new EventEmitter<any>();
 @Output() sexualOrientationFilterColumnEvent = new EventEmitter<any>();
 
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
 isSexualOrientationListGridLoaderShow = false;
 gridSexualOrientationDataSubject = new Subject<any>();
 gridSexualOrientationData$ =
   this.gridSexualOrientationDataSubject.asObservable();
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
       this.onSexualOrientationDeactivateClicked()
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
    this.loadSexualOrientationList(); 
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadSexualOrientationList();
  }
  
  private loadSexualOrientationList(): void {
    this.loadSexualOrientationLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadSexualOrientationLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isSexualOrientationListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadRacialEthnicListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadSexualOrientationFilterColumn(){
    this.sexualOrientationFilterColumnEvent.emit();
  
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
    this.loadSexualOrientationList();
  }
  
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadSexualOrientationList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  gridDataHandle() {
    this.sexualOrientationDataLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridSexualOrientationDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isSexualOrientationListGridLoaderShow = false;
        }
      }
    );
    this.isSexualOrientationListGridLoaderShow = false;
  }
  
  /** Internal event methods **/
  onCloseSexualOrientationDeactivateClicked() {
    this.isSexualOrientationDeactivatePopup = false;
  }
  onSexualOrientationDeactivateClicked() {
    this.isSexualOrientationDeactivatePopup = true;
  }
  onCloseSexualOrientationDetailClicked() {
    this.isSexualOrientationDetailPopup = false;
  }
  onSexualOrientationDetailClicked() {
    this.isSexualOrientationDetailPopup = true;
  }
}

 