 

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
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Subject } from 'rxjs';
@Component({
  selector: 'system-config-manufacturers-list',
  templateUrl: './manufacturers-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManufacturersListComponent implements OnInit, OnChanges{
  
 
  /** Public properties **/
  isManufacturerDetailPopup = false; 
  isManufacturerDeletePopupShow = false;
  isManufacturerDeactivatePopupShow = false; 
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public moreactions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
     
    }, 
  
    {
      buttonType:"btn-h-primary",
      text: "Deactivate",
      icon: "block",
      click: (data: any): void => {
        this.onManufacturerDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete", 
      click: (data: any): void => {
        this.onManufacturerDeleteClicked();
      },
    }, 
 
  ];
 
  
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() manufacturerDataLists$: any;
  @Input() manufacturerFilterColumn$: any;
  @Output() loadManufacturerListsEvent = new EventEmitter<any>();
  @Output() manufacturerFilterColumnEvent = new EventEmitter<any>();
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
  isManufacturerListGridLoaderShow = false;
  gridManufacturerDataSubject = new Subject<any>();
  gridManufacturerData$ =
    this.gridManufacturerDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  /** Internal event methods **/
  
  
  ngOnInit(): void {
    this.loadManufacturerList(); 
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadManufacturerList();
  }
  
  private loadManufacturerList(): void {
    this.loadManufacturerLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadManufacturerLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isManufacturerListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadManufacturerListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadManufacturerFilterColumn(){
    this.manufacturerFilterColumnEvent.emit();
  
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
    this.loadManufacturerList();
  }
  
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadManufacturerList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  gridDataHandle() {
    this.manufacturerDataLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridManufacturerDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isManufacturerListGridLoaderShow = false;
        }
      }
    );
    this.isManufacturerListGridLoaderShow = false;
  }


  /** Internal event methods **/
  onCloseManufacturerDetailClicked() {
    this.isManufacturerDetailPopup = false;
  }
  onManufacturerDetailClicked() {
    this.isManufacturerDetailPopup = true;
  }

  onCloseManufacturerDeleteClicked() {
    this.isManufacturerDeletePopupShow = false;
  }
  onManufacturerDeleteClicked() {
    this.isManufacturerDeletePopupShow = true;
  }
  onCloseManufacturerDeactivateClicked() {
    this.isManufacturerDeactivatePopupShow = false;
  }
  onManufacturerDeactivateClicked() {
    this.isManufacturerDeactivatePopupShow = true;
  }
}
