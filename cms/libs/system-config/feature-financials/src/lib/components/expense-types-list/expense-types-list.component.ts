import {
  Component,
  OnInit,
  ViewEncapsulation,
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
  selector: 'system-config-expense-types-list',
  templateUrl: './expense-types-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpenseTypesListComponent implements OnInit, OnChanges{
  

  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() expenseTypeDataLists$: any;
  @Input() expenseTypeFilterColumn$: any;
  @Output() loadExpenseTypeListsEvent = new EventEmitter<any>();
  @Output() expenseTypeFilterColumnEvent = new EventEmitter<any>();
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
  isExpenseTypeListGridLoaderShow = false;
  gridExpenseTypeDataSubject = new Subject<any>();
  gridExpenseTypeData$ =
    this.gridExpenseTypeDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  /** Public properties **/
  isPeriodDetailPopup = false; 
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();

  public moreActions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
    
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Deactivate",
      icon: "block",
 
    }, 
 
  ];
  
  
  
  ngOnInit(): void {
    this.loadExpenseTypeList(); 
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadExpenseTypeList();
  }
  
  private loadExpenseTypeList(): void {
    this.loadExpenseTypeLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadExpenseTypeLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isExpenseTypeListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadExpenseTypeListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadExpenseTypeFilterColumn(){
    this.expenseTypeFilterColumnEvent.emit();
  
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
    this.loadExpenseTypeList();
  }
  
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadExpenseTypeList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  gridDataHandle() {
    this.expenseTypeDataLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridExpenseTypeDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isExpenseTypeListGridLoaderShow = false;
        }
      }
    );
    this.isExpenseTypeListGridLoaderShow = false;
  }
 
}

