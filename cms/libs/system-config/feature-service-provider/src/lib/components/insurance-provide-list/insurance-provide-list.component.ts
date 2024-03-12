 
import {
  Component,  OnInit, ChangeDetectionStrategy,  EventEmitter, Input, Output, OnChanges,} from '@angular/core'; 
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Subject } from 'rxjs';

 

@Component({
  selector: 'system-config-insurance-provide-list',
  templateUrl: './insurance-provide-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceProvideListComponent implements OnInit, OnChanges{
 
  /** Public properties **/
  isInsuranceProvidersDetailPopup = false; 
  isInsuranceProvidersDeletePopupShow = false;
  isInsuranceProvidersDeactivatePopupShow = false; 
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
        this.onInsuranceProvidersDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete", 
      click: (data: any): void => {
        this.onInsuranceProvidersDeleteClicked();
      },
    }, 
 
  ];
   
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() insuranceProviderDataLists$: any;
  @Input() insuranceProviderFilterColumn$: any;
  @Output() loadInsuranceProviderListsEvent = new EventEmitter<any>();
  @Output() insuranceProviderFilterColumnEvent = new EventEmitter<any>();
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
  isInsuranceProviderListGridLoaderShow = false;
  gridInsuranceProviderDataSubject = new Subject<any>();
  gridInsuranceProviderData$ =
    this.gridInsuranceProviderDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  /** Internal event methods **/
  
  
  ngOnInit(): void {
    this.loadInsuranceProviderList(); 
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadInsuranceProviderList();
  }
  
  private loadInsuranceProviderList(): void {
    this.loadInsuranceProviderLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadInsuranceProviderLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isInsuranceProviderListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadInsuranceProviderListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadInsuranceProviderFilterColumn(){
    this.insuranceProviderFilterColumnEvent.emit();
  
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
    this.loadInsuranceProviderList();
  }
  
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadInsuranceProviderList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  gridDataHandle() {
    this.insuranceProviderDataLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridInsuranceProviderDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isInsuranceProviderListGridLoaderShow = false;
        }
      }
    );
    this.isInsuranceProviderListGridLoaderShow = false;
  }


  /** Internal event methods **/
  onCloseInsuranceProvidersDetailClicked() {
    this.isInsuranceProvidersDetailPopup = false;
  }
  onInsuranceProvidersDetailClicked() {
    this.isInsuranceProvidersDetailPopup = true;
  }

  onCloseInsuranceProvidersDeleteClicked() {
    this.isInsuranceProvidersDeletePopupShow = false;
  }
  onInsuranceProvidersDeleteClicked() {
    this.isInsuranceProvidersDeletePopupShow = true;
  }
  onCloseInsuranceProvidersDeactivateClicked() {
    this.isInsuranceProvidersDeactivatePopupShow = false;
  }
  onInsuranceProvidersDeactivateClicked() {
    this.isInsuranceProvidersDeactivatePopupShow = true;
  }
}
