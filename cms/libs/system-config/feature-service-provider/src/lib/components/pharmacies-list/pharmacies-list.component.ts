 
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
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Subject } from 'rxjs';

@Component({
  selector: 'system-config-pharmacies-list',
  templateUrl: './pharmacies-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmaciesListComponent implements OnInit, OnChanges{
 
  /** Public properties **/
  isPharmaciesDetailPopup = false; 
  isPharmaciesDeletePopupShow = false;
  isPharmaciesDeactivatePopupShow = false; 
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
        this.onPharmaciesDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete", 
      click: (data: any): void => {
        this.onPharmaciesDeleteClicked();
      },
    }, 
 
  ];
    
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() pharmaciesDataLists$: any;
  @Input() pharmaciesFilterColumn$: any;
  @Output() loadPharmaciesListsEvent = new EventEmitter<any>();
  @Output() pharmaciesFilterColumnEvent = new EventEmitter<any>();
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
  isPharmaciesListGridLoaderShow = false;
  gridPharmaciesDataSubject = new Subject<any>();
  gridPharmaciesData$ =
    this.gridPharmaciesDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  /** Internal event methods **/
  
  
  ngOnInit(): void {
    this.loadPharmaciesList(); 
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadPharmaciesList();
  }
  
  private loadPharmaciesList(): void {
    this.loadPharmaciesLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadPharmaciesLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isPharmaciesListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadPharmaciesListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadPharmaciesFilterColumn(){
    this.pharmaciesFilterColumnEvent.emit();
  
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
    this.loadPharmaciesList();
  }
  
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadPharmaciesList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  gridDataHandle() {
    this.pharmaciesDataLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridPharmaciesDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isPharmaciesListGridLoaderShow = false;
        }
      }
    );
    this.isPharmaciesListGridLoaderShow = false;
  }


  /** Internal event methods **/
  onClosePharmaciesDetailClicked() {
    this.isPharmaciesDetailPopup = false;
  }
  onPharmaciesDetailClicked() {
    this.isPharmaciesDetailPopup = true;
  }

  onClosePharmaciesDeleteClicked() {
    this.isPharmaciesDeletePopupShow = false;
  }
  onPharmaciesDeleteClicked() {
    this.isPharmaciesDeletePopupShow = true;
  }
  onClosePharmaciesDeactivateClicked() {
    this.isPharmaciesDeactivatePopupShow = false;
  }
  onPharmaciesDeactivateClicked() {
    this.isPharmaciesDeactivatePopupShow = true;
  }
}
