import {
  Component,
  OnInit, 
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core'; 
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Subject } from 'rxjs';

 

@Component({
  selector: 'system-config-cpt-code-list',
  templateUrl: './cpt-code-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CptCodeListComponent implements OnInit, OnChanges{

  /** Public properties **/
  isCptCodeDetailPopup = false; 
  isCptCodeDeletePopupShow = false;
  isCptCodeDeactivatePopupShow = false; 
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() cptCodeDataLists$: any;
  @Input() cptCodeFilterColumn$: any;
  @Output() loadCptCodeListsEvent = new EventEmitter<any>();
  @Output() cptCodeFilterColumnEvent = new EventEmitter<any>();
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
  isCptCodeListGridLoaderShow = false;
  gridCptCodeDataSubject = new Subject<any>();
  gridCptCodeData$ =
    this.gridCptCodeDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  public moreActions = [
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
        this.onCptCodeDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete", 
      click: (data: any): void => {
        this.onCptCodeDeleteClicked();
      },
    }, 
 
  ];
   

  
  
  ngOnInit(): void {
    this.loadCptCodeList(); 
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadCptCodeList();
  }
  
  private loadCptCodeList(): void {
    this.loadCptCodeLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadCptCodeLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isCptCodeListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadCptCodeListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadCptCodeFilterColumn(){
    this.cptCodeFilterColumnEvent.emit();
  
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
    this.loadCptCodeList();
  }
  
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadCptCodeList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  gridDataHandle() {
    this.cptCodeDataLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridCptCodeDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isCptCodeListGridLoaderShow = false;
        }
      }
    );
    this.isCptCodeListGridLoaderShow = false;
  }

  /** Internal event methods **/
  onCloseCptCodeDetailClicked() {
    this.isCptCodeDetailPopup = false;
  }
  onCptCodeDetailClicked() {
    this.isCptCodeDetailPopup = true;
  }

  onCloseCptCodeDeleteClicked() {
    this.isCptCodeDeletePopupShow = false;
  }
  onCptCodeDeleteClicked() {
    this.isCptCodeDeletePopupShow = true;
  }
  onCloseCptCodeDeactivateClicked() {
    this.isCptCodeDeactivatePopupShow = false;
  }
  onCptCodeDeactivateClicked() {
    this.isCptCodeDeactivatePopupShow = true;
  }
}
