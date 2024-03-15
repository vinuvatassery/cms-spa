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
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';

@Component({
  selector: 'system-config-pca-codes-list',
  templateUrl: './pca-codes-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
 
 
export class PcaCodesListComponent implements OnInit{
  isPcaCodeDetailPopup = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() pcaCodeDataLists$: any;
  @Input() pcaCodeFilterColumn$: any;
  @Output() loadPcaCodeListsEvent = new EventEmitter<any>();
  @Output() pcaCodeFilterColumnEvent = new EventEmitter<any>();
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
  isPcaCodeListGridLoaderShow = false;
  gridPcaCodeDataSubject = new Subject<any>();
  gridPcaCodeData$ =
    this.gridPcaCodeDataSubject.asObservable();
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
      text: "Assign Slot",
      icon: "arrow_right_alt",
   
    }, 
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
   
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
 
    }, 
 
  ];
  
  
  ngOnInit(): void {
    this.loadPcaCodeList(); 
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadPcaCodeList();
  }
  
  private loadPcaCodeList(): void {
    this.loadPcaCodeLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadPcaCodeLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isPcaCodeListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadPcaCodeListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadPcaCodeFilterColumn(){
    this.pcaCodeFilterColumnEvent.emit();
  
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
    this.loadPcaCodeList();
  }
  
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadPcaCodeList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  gridDataHandle() {
    this.pcaCodeDataLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridPcaCodeDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isPcaCodeListGridLoaderShow = false;
        }
      }
    );
    this.isPcaCodeListGridLoaderShow = false;
  }
 

  onClosePcaCodeDetailClicked() {
    this.isPcaCodeDetailPopup = false;
  }
  onPcaCodeDetailClicked() {
    this.isPcaCodeDetailPopup = true;
  }
}

