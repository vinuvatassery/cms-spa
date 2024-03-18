import {
  Component,
  OnInit, 
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  OnChanges,
} from '@angular/core'; 
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
@Component({
  selector: 'system-config-drugs-list',
  templateUrl: './drugs-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugsListComponent  implements OnInit, OnChanges{
  
 
  /** Public properties **/
  isDrugsDetailPopup = false; 
  isDrugsReassignPopupShow = false;
  isDrugsDeactivatePopupShow = false; 
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public moreactions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Drugs",
      icon: "edit",
     
    }, 
  
    {
      buttonType:"btn-h-primary",
      text: "Deactivate Drugs",
      icon: "block",
      click: (data: any): void => {
        this.onDrugsDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-primary",
      text: "Re-assign Drugs",
      icon: "compare_arrows", 
      click: (data: any): void => {
        this.onDrugsReassignClicked();
      },
    }, 
 
  ];
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() drugsDataLists$: any;
  @Input() drugsFilterColumn$: any;
  @Output() loadDrugsListsEvent = new EventEmitter<any>();
  @Output() drugsFilterColumnEvent = new EventEmitter<any>();
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
  isDrugsListGridLoaderShow = false;
  gridDrugsDataSubject = new Subject<any>();
  gridDrugsData$ =
    this.gridDrugsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  /** Internal event methods **/
  
  
  ngOnInit(): void {
    this.loadDrugsList(); 
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadDrugsList();
  }
  
  private loadDrugsList(): void {
    this.loadDrugsLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadDrugsLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isDrugsListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadDrugsListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadDrugsFilterColumn(){
    this.drugsFilterColumnEvent.emit();
  
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
    this.loadDrugsList();
  }
  
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadDrugsList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  gridDataHandle() {
    this.drugsDataLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridDrugsDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isDrugsListGridLoaderShow = false;
        }
      }
    );
    this.isDrugsListGridLoaderShow = false;
  }


  onCloseDrugsDetailClicked() {
    this.isDrugsDetailPopup = false;
  }
  onDrugsDetailClicked() {
    this.isDrugsDetailPopup = true;
  }

  onCloseDrugsReassignClicked() {
    this.isDrugsReassignPopupShow = false;
  }
  onDrugsReassignClicked() {
    this.isDrugsReassignPopupShow = true;
  }
  onCloseDrugsDeactivateClicked() {
    this.isDrugsDeactivatePopupShow = false;
  }
  onDrugsDeactivateClicked() {
    this.isDrugsDeactivatePopupShow = true;
  }
}
