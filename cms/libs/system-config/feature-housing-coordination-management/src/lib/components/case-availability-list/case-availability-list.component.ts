/** Angular **/
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
} from '@angular/core'; 
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Subject } from 'rxjs';
@Component({
  selector: 'system-config-case-availability-list',
  templateUrl: './case-availability-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaseAvailabilityListComponent implements OnInit {

 
  /** Public properties **/
  isCaseAvailabilityDetailPopup = false;
 
    public formUiStyle : UIFormStyle = new UIFormStyle();

    popupClassAction = 'TableActionPopup app-dropdown-action-list';

    public moreactions = [
      {
        buttonType:"btn-h-primary",
        text: "Edit",
        icon: "edit",
        click: (): void => {
          this.onCaseAvailabilityDetailClicked();
        },
      }, 
   
    ];

 
  
    @Input() pageSizes: any;
    @Input() sortValue: any;
    @Input() sortType: any;
    @Input() sort: any;
    @Input() caseAvailabilityDataLists$: any;
    @Input() caseAvailabilityFilterColumn$: any;
    @Output() loadCaseAvailabilityListsEvent = new EventEmitter<any>();
    @Output() caseAvailabilityFilterColumnEvent = new EventEmitter<any>();
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
    isCaseAvailabilityListGridLoaderShow = false;
    gridCaseAvailabilityDataSubject = new Subject<any>();
    gridCaseAvailabilityData$ =
      this.gridCaseAvailabilityDataSubject.asObservable();
    columnDropListSubject = new Subject<any[]>();
    columnDropList$ = this.columnDropListSubject.asObservable();
    filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
    /** Internal event methods **/
    
    
    ngOnInit(): void {
      this.loadCaseAvailabilityList(); 
    }
    ngOnChanges(): void {
      this.state = {
        skip: 0,
        take: this.pageSizes[0]?.value,
        sort: this.sort,
      };
    
      this.loadCaseAvailabilityList();
    }
    
    private loadCaseAvailabilityList(): void {
      this.loadCaseAvailabilityLitData(
        this.state?.skip ?? 0,
        this.state?.take ?? 0,
        this.sortValue,
        this.sortType
      );
    }
    loadCaseAvailabilityLitData(
      skipCountValue: number,
      maxResultCountValue: number,
      sortValue: string,
      sortTypeValue: string
    ) {
      this.isCaseAvailabilityListGridLoaderShow = true;
      const gridDataRefinerValue = {
        skipCount: skipCountValue,
        pagesize: maxResultCountValue,
        sortColumn: sortValue,
        sortType: sortTypeValue,
      };
      this.loadCaseAvailabilityListsEvent.emit(gridDataRefinerValue);
      this.gridDataHandle();
    }
    loadCaseAvailabilityFilterColumn(){
      this.caseAvailabilityFilterColumnEvent.emit();
    
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
      this.loadCaseAvailabilityList();
    }
    
    // updating the pagination infor based on dropdown selection
    pageSelectionChange(data: any) {
      this.state.take = data.value;
      this.state.skip = 0;
      this.loadCaseAvailabilityList();
    }
    
    public filterChange(filter: CompositeFilterDescriptor): void {
      this.filterData = filter;
    }
    
    gridDataHandle() {
      this.caseAvailabilityDataLists$.subscribe(
        (data: GridDataResult) => {
          this.gridDataResult = data;
          this.gridDataResult.data = filterBy(
            this.gridDataResult.data,
            this.filterData
          );
          this.gridCaseAvailabilityDataSubject.next(this.gridDataResult);
          if (data?.total >= 0 || data?.total === -1) {
            this.isCaseAvailabilityListGridLoaderShow = false;
          }
        }
      );
      this.isCaseAvailabilityListGridLoaderShow = false;
    }
  
    

  /** Internal event methods **/
  onCloseCaseAvailabilityDetailClicked() {
    this.isCaseAvailabilityDetailPopup = false;
  }
  onCaseAvailabilityDetailClicked() {
    this.isCaseAvailabilityDetailPopup = true;
  }

}
