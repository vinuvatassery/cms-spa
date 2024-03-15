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
  selector: 'system-config-healthcare-provider-list',
  templateUrl: './healthcare-provider-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthcareProviderListComponent implements OnInit, OnChanges{
 
  isHealthcareProvidersDetailPopup = false; 
  isHealthcareProvidersDeletePopupShow = false;
  isHealthcareProvidersDeactivatePopupShow = false; 
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
        this.onHealthcareProvidersDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete", 
      click: (data: any): void => {
        this.onHealthcareProvidersDeleteClicked();
      },
    }, 
 
  ];
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() healthcareProviderDataLists$: any;
  @Input() healthcareProviderFilterColumn$: any;
  @Output() loadHealthcareProviderListsEvent = new EventEmitter<any>();
  @Output() healthcareProviderFilterColumnEvent = new EventEmitter<any>();
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
  isHealthcareProviderListGridLoaderShow = false;
  gridHealthcareProviderDataSubject = new Subject<any>();
  gridHealthcareProviderData$ =
    this.gridHealthcareProviderDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  /** Internal event methods **/
  
  
  ngOnInit(): void {
    this.loadHealthcareProviderList(); 
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadHealthcareProviderList();
  }
  
  private loadHealthcareProviderList(): void {
    this.loadHealthcareProviderLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadHealthcareProviderLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isHealthcareProviderListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadHealthcareProviderListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadHealthcareProviderFilterColumn(){
    this.healthcareProviderFilterColumnEvent.emit();
  
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
    this.loadHealthcareProviderList();
  }
  
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadHealthcareProviderList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  gridDataHandle() {
    this.healthcareProviderDataLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridHealthcareProviderDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isHealthcareProviderListGridLoaderShow = false;
        }
      }
    );
    this.isHealthcareProviderListGridLoaderShow = false;
  }



  /** Internal event methods **/
  onCloseHealthcareProvidersDetailClicked() {
    this.isHealthcareProvidersDetailPopup = false;
  }
  onHealthcareProvidersDetailClicked() {
    this.isHealthcareProvidersDetailPopup = true;
  }

  onCloseHealthcareProvidersDeleteClicked() {
    this.isHealthcareProvidersDeletePopupShow = false;
  }
  onHealthcareProvidersDeleteClicked() {
    this.isHealthcareProvidersDeletePopupShow = true;
  }
  onCloseHealthcareProvidersDeactivateClicked() {
    this.isHealthcareProvidersDeactivatePopupShow = false;
  }
  onHealthcareProvidersDeactivateClicked() {
    this.isHealthcareProvidersDeactivatePopupShow = true;
  }
}
