import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core'; 
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Subject } from 'rxjs';
@Component({
  selector: 'system-config-ps-mfr-zip-list',
  templateUrl: './ps-mfr-zip-list.component.html',
  styleUrls: ['./ps-mfr-zip-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PsMfrZipListComponent implements OnInit {

 
  isPSMFRZIPDetailPopup = false; 
    popupClassAction = 'TableActionPopup app-dropdown-action-list';
    public formUiStyle : UIFormStyle = new UIFormStyle();

    public girdMoreActionsList = [
      {
        buttonType:"btn-h-primary",
        text: "Edit",
        icon: "edit",
        click: (): void => {
          this.onPSMFRZIPDetailClicked();
        },
      },
      {
        buttonType:"btn-h-primary",
        text: "Deactivate",
        icon: "block",
        click: (): void => {
       //  this.onPronounsDeactivateClicked()
        },
      },
      {
        buttonType:"btn-h-danger",
        text: "Delete",
        icon: "delete",
        click: (): void => {
        // this.onOpenDeleteTodoClicked()
        },
      },
      
   
    ];
    
    
  
    @Input() pageSizes: any;
    @Input() sortValue: any;
    @Input() sortType: any;
    @Input() sort: any;
    @Input() psMfrZipDataLists$: any;
    @Input() psMfrZipFilterColumn$: any;
    @Output() loadPsMfrZipListsEvent = new EventEmitter<any>();
    @Output() psMfrZipFilterColumnEvent = new EventEmitter<any>();
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
    isPsMfrZipListGridLoaderShow = false;
    gridPsMfrZipDataSubject = new Subject<any>();
    gridPsMfrZipData$ =
      this.gridPsMfrZipDataSubject.asObservable();
    columnDropListSubject = new Subject<any[]>();
    columnDropList$ = this.columnDropListSubject.asObservable();
    filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
    /** Internal event methods **/
    
    
    ngOnInit(): void {
      this.loadPsMfrZipList(); 
    }
    ngOnChanges(): void {
      this.state = {
        skip: 0,
        take: this.pageSizes[0]?.value,
        sort: this.sort,
      };
    
      this.loadPsMfrZipList();
    }
    
    private loadPsMfrZipList(): void {
      this.loadPsMfrZipLitData(
        this.state?.skip ?? 0,
        this.state?.take ?? 0,
        this.sortValue,
        this.sortType
      );
    }
    loadPsMfrZipLitData(
      skipCountValue: number,
      maxResultCountValue: number,
      sortValue: string,
      sortTypeValue: string
    ) {
      this.isPsMfrZipListGridLoaderShow = true;
      const gridDataRefinerValue = {
        skipCount: skipCountValue,
        pagesize: maxResultCountValue,
        sortColumn: sortValue,
        sortType: sortTypeValue,
      };
      this.loadPsMfrZipListsEvent.emit(gridDataRefinerValue);
      this.gridDataHandle();
    }
    loadPsMfrZipFilterColumn(){
      this.psMfrZipFilterColumnEvent.emit();
    
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
      this.loadPsMfrZipList();
    }
    
    // updating the pagination infor based on dropdown selection
    pageSelectionChange(data: any) {
      this.state.take = data.value;
      this.state.skip = 0;
      this.loadPsMfrZipList();
    }
    
    public filterChange(filter: CompositeFilterDescriptor): void {
      this.filterData = filter;
    }
    
    gridDataHandle() {
      this.psMfrZipDataLists$.subscribe(
        (data: GridDataResult) => {
          this.gridDataResult = data;
          this.gridDataResult.data = filterBy(
            this.gridDataResult.data,
            this.filterData
          );
          this.gridPsMfrZipDataSubject.next(this.gridDataResult);
          if (data?.total >= 0 || data?.total === -1) {
            this.isPsMfrZipListGridLoaderShow = false;
          }
        }
      );
      this.isPsMfrZipListGridLoaderShow = false;
    }
  
 /** Internal event methods **/
 onClosePSMFRZIPDetailClicked() {
this.isPSMFRZIPDetailPopup = false;
}
onPSMFRZIPDetailClicked() {
this.isPSMFRZIPDetailPopup = true;
}
}
