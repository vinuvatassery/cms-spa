import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from '@angular/core'; 
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Subject } from 'rxjs';

@Component({
  selector: 'system-config-insurance-plan-list',
  templateUrl: './insurance-plan-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsurancePlanListComponent implements OnInit, OnChanges {
 
  /** Public properties **/
  isInsurancePlansDetailPopup = false;
  isInsurancePlansDeletePopupShow = false;
  isInsurancePlansDeactivatePopupShow = false;
  isInsurancePlansBulkMigrationPopupShow = false; 
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public bulkMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'BULK MIGRATION',
      click: (data: any): void => {
        this.onInsurancePlansBulkMigrationClicked();
      },
    },
  ];
  public moreactions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
    },

    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate',
      icon: 'block',
      click: (data: any): void => {
        this.onInsurancePlansDeactivateClicked();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (data: any): void => {
        this.onInsurancePlansDeleteClicked();
      },
    },
  ];

  
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() insurancePlanDataLists$: any;
  @Input() insurancePlanFilterColumn$: any;
  @Output() loadInsurancePlanListsEvent = new EventEmitter<any>();
  @Output() insurancePlanFilterColumnEvent = new EventEmitter<any>();
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
  isInsurancePlanListGridLoaderShow = false;
  gridInsurancePlanDataSubject = new Subject<any>();
  gridInsurancePlanData$ =
    this.gridInsurancePlanDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  /** Internal event methods **/
  
  
  ngOnInit(): void {
    this.loadInsurancePlanList(); 
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadInsurancePlanList();
  }
  
  private loadInsurancePlanList(): void {
    this.loadInsurancePlanLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadInsurancePlanLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isInsurancePlanListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadInsurancePlanListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadInsurancePlanFilterColumn(){
    this.insurancePlanFilterColumnEvent.emit();
  
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
    this.loadInsurancePlanList();
  }
  
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadInsurancePlanList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  gridDataHandle() {
    this.insurancePlanDataLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridInsurancePlanDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isInsurancePlanListGridLoaderShow = false;
        }
      }
    );
    this.isInsurancePlanListGridLoaderShow = false;
  }


  onCloseInsurancePlansDetailClicked() {
    this.isInsurancePlansDetailPopup = false;
  }
  onInsurancePlansDetailClicked() {
    this.isInsurancePlansDetailPopup = true;
  }

  onCloseInsurancePlansDeleteClicked() {
    this.isInsurancePlansDeletePopupShow = false;
  }
  onInsurancePlansDeleteClicked() {
    this.isInsurancePlansDeletePopupShow = true;
  }
  onCloseInsurancePlansDeactivateClicked() {
    this.isInsurancePlansDeactivatePopupShow = false;
  }
  onInsurancePlansDeactivateClicked() {
    this.isInsurancePlansDeactivatePopupShow = true;
  }

  onCloseInsurancePlansBulkMigrationClicked() {
    this.isInsurancePlansBulkMigrationPopupShow = false;
  }
  onInsurancePlansBulkMigrationClicked() {
    this.isInsurancePlansBulkMigrationPopupShow = true;
  }
}
