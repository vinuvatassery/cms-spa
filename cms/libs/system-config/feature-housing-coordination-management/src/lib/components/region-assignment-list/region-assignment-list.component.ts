import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core'; 
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Subject } from 'rxjs';
@Component({
  selector: 'system-config-region-assignment-list',
  templateUrl: './region-assignment-list.component.html',
  styleUrls: ['./region-assignment-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegionAssignmentListComponent implements OnInit {

  isRegionAssignmentDetailPopup = false;
 
    popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();

 
 
    public girdMoreActionsList = [
      {
        buttonType:"btn-h-primary",
        text: "Edit",
        icon: "edit",
        click: (): void => {
          this.onRegionAssignmentDetailClicked();
        },
      },
      {
        buttonType:"btn-h-primary",
        text: "Deactivate",
        icon: "block",
        click: (): void => {
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


    @Input() pageSizes: any;
    @Input() sortValue: any;
    @Input() sortType: any;
    @Input() sort: any;
    @Input() regionAssignmentDataLists$: any;
    @Input() regionAssignmentFilterColumn$: any;
    @Output() loadRegionAssignmentListsEvent = new EventEmitter<any>();
    @Output() regionAssignmentFilterColumnEvent = new EventEmitter<any>();
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
    isRegionAssignmentListGridLoaderShow = false;
    gridRegionAssignmentDataSubject = new Subject<any>();
    gridRegionAssignmentData$ =
      this.gridRegionAssignmentDataSubject.asObservable();
    columnDropListSubject = new Subject<any[]>();
    columnDropList$ = this.columnDropListSubject.asObservable();
    filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
    /** Internal event methods **/
    
    
    ngOnInit(): void {
      this.loadRegionAssignmentList(); 
    }
    ngOnChanges(): void {
      this.state = {
        skip: 0,
        take: this.pageSizes[0]?.value,
        sort: this.sort,
      };
    
      this.loadRegionAssignmentList();
    }
    
    private loadRegionAssignmentList(): void {
      this.loadRegionAssignmentLitData(
        this.state?.skip ?? 0,
        this.state?.take ?? 0,
        this.sortValue,
        this.sortType
      );
    }
    loadRegionAssignmentLitData(
      skipCountValue: number,
      maxResultCountValue: number,
      sortValue: string,
      sortTypeValue: string
    ) {
      this.isRegionAssignmentListGridLoaderShow = true;
      const gridDataRefinerValue = {
        skipCount: skipCountValue,
        pagesize: maxResultCountValue,
        sortColumn: sortValue,
        sortType: sortTypeValue,
      };
      this.loadRegionAssignmentListsEvent.emit(gridDataRefinerValue);
      this.gridDataHandle();
    }
    loadRegionAssignmentFilterColumn(){
      this.regionAssignmentFilterColumnEvent.emit();
    
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
      this.loadRegionAssignmentList();
    }
    
    // updating the pagination infor based on dropdown selection
    pageSelectionChange(data: any) {
      this.state.take = data.value;
      this.state.skip = 0;
      this.loadRegionAssignmentList();
    }
    
    public filterChange(filter: CompositeFilterDescriptor): void {
      this.filterData = filter;
    }
    
    gridDataHandle() {
      this.regionAssignmentDataLists$.subscribe(
        (data: GridDataResult) => {
          this.gridDataResult = data;
          this.gridDataResult.data = filterBy(
            this.gridDataResult.data,
            this.filterData
          );
          this.gridRegionAssignmentDataSubject.next(this.gridDataResult);
          if (data?.total >= 0 || data?.total === -1) {
            this.isRegionAssignmentListGridLoaderShow = false;
          }
        }
      );
      this.isRegionAssignmentListGridLoaderShow = false;
    }
  
   /** Internal event methods **/
   onCloseRegionAssignmentDetailClicked() {
  this.isRegionAssignmentDetailPopup = false;
}
onRegionAssignmentDetailClicked() {
  this.isRegionAssignmentDetailPopup = true;
}

}
