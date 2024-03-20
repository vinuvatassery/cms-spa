 
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SystemConfigServiceProviderFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Subject } from 'rxjs';

 

@Component({
  selector: 'system-config-medical-providers-list',
  templateUrl: './medical-providers-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalProvidersListComponent implements OnInit{
  
 
  /** Public properties **/
  isMedicalProvidersDetailPopup = false; 
  isMedicalProvidersDeletePopupShow = false;
  isMedicalProvidersDeactivatePopupShow = false; 
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
        this.onMedicalProvidersDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete", 
      click: (data: any): void => {
        this.onMedicalProvidersDeleteClicked();
      },
    }, 
 
  ];
  
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() medicalProviderDataLists$: any;
  @Input() medicalProviderFilterColumn$: any;
  @Output() loadMedicalProviderListsEvent = new EventEmitter<any>();
  @Output() medicalProviderFilterColumnEvent = new EventEmitter<any>();
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
  isMedicalProviderListGridLoaderShow = false;
  gridMedicalProviderDataSubject = new Subject<any>();
  gridMedicalProviderData$ =
    this.gridMedicalProviderDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  /** Internal event methods **/
  
  
  ngOnInit(): void {
    this.loadMedicalProviderList(); 
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadMedicalProviderList();
  }
  
  private loadMedicalProviderList(): void {
    this.loadMedicalProviderLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadMedicalProviderLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isMedicalProviderListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadMedicalProviderListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadMedicalProviderFilterColumn(){
    this.medicalProviderFilterColumnEvent.emit();
  
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
    this.loadMedicalProviderList();
  }
  
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadMedicalProviderList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  gridDataHandle() {
    this.medicalProviderDataLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridMedicalProviderDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isMedicalProviderListGridLoaderShow = false;
        }
      }
    );
    this.isMedicalProviderListGridLoaderShow = false;
  }

  /** Internal event methods **/
  onCloseMedicalProvidersDetailClicked() {
    this.isMedicalProvidersDetailPopup = false;
  }
  onMedicalProvidersDetailClicked() {
    this.isMedicalProvidersDetailPopup = true;
  }

  onCloseMedicalProvidersDeleteClicked() {
    this.isMedicalProvidersDeletePopupShow = false;
  }
  onMedicalProvidersDeleteClicked() {
    this.isMedicalProvidersDeletePopupShow = true;
  }
  onCloseMedicalProvidersDeactivateClicked() {
    this.isMedicalProvidersDeactivatePopupShow = false;
  }
  onMedicalProvidersDeactivateClicked() {
    this.isMedicalProvidersDeactivatePopupShow = true;
  }
}