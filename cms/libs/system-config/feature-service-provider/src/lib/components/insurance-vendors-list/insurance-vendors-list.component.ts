import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

 

@Component({
  selector: 'system-config-insurance-vendors-list',
  templateUrl: './insurance-vendors-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceVendorsListComponent implements OnInit, OnChanges{
  
  /** Public properties **/
  isInsuranceVendorsDetailPopup = false; 
  isInsuranceVendorsDeletePopupShow = false;
  isInsuranceVendorsDeactivatePopupShow = false; 
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
        this.onInsuranceVendorsDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete", 
      click: (data: any): void => {
        this.onInsuranceVendorsDeleteClicked();
      },
    }, 
 
  ];
  
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() insVendorsDataLists$: any;
  @Input() insVendorsFilterColumn$: any;
  @Input() exportButtonShow$ : any
  @Output() loadInsVendorsListsEvent = new EventEmitter<any>();
  @Output() insVendorsFilterColumnEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'vendorName';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  showExportLoader = false;
  vendorTypeCode = 'INSURANCE_VENDOR';
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  isInsVendorsListGridLoaderShow = false;
  gridInsVendorsDataSubject = new Subject<any>();
  gridInsVendorsData$ =
    this.gridInsVendorsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  vendorNameTitle ="Vendor Name"
  vendorNameTitleDataSubject = new Subject<any>();
vendornameTitleData$ = this.vendorNameTitleDataSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  /** Internal event methods **/
  constructor(private route: Router,
    private readonly  cdr :ChangeDetectorRef,
  ) {
  }
  
  ngOnInit(): void {
    this.loadInsVendorsList(); 
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadInsVendorsList();
  }
  
  private loadInsVendorsList(): void {
    this.loadInsVendorsLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortColumn,
      this.sortType,

    );
  }
  loadInsVendorsLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string,
  ) {
    this.isInsVendorsListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      vendorTypeCode:this.vendorTypeCode,
      filter : this.state?.["filter"]?.["filters"] ?? []
    };
    this.loadInsVendorsListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadInsVendorsFilterColumn(){
    this.insVendorsFilterColumnEvent.emit();
  
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
    this.loadInsVendorsList();
  }
  
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadInsVendorsList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  gridDataHandle() {
    this.insVendorsDataLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridInsVendorsDataSubject.next(this.gridDataResult);
        this.vendorNameTitleDataSubject.next(this.vendorNameTitle)
        if (data?.total >= 0 || data?.total === -1) {
          this.isInsVendorsListGridLoaderShow = false;
        }
      }
    );
    this.isInsVendorsListGridLoaderShow = false;
  }
  onVendorClicked(vendorId: any)
  {
    const query = {
      queryParams: {
        v_id: vendorId ,
        tab_code :  this.vendorTypeCode
      },
    };
    this.route.navigate(['/financial-management/vendors/profile'], query )
  }

  /** Internal event methods **/
  onCloseInsuranceVendorsDetailClicked() {
    this.isInsuranceVendorsDetailPopup = false;
  }
  onInsuranceVendorsDetailClicked() {
    this.isInsuranceVendorsDetailPopup = true;
  }

  onCloseInsuranceVendorsDeleteClicked() {
    this.isInsuranceVendorsDeletePopupShow = false;
  }
  onInsuranceVendorsDeleteClicked() {
    this.isInsuranceVendorsDeletePopupShow = true;
  }
  onCloseInsuranceVendorsDeactivateClicked() {
    this.isInsuranceVendorsDeactivatePopupShow = false;
  }
  onInsuranceVendorsDeactivateClicked() {
    this.isInsuranceVendorsDeactivatePopupShow = true;
  }
  onClickedExport(){
    debugger
    this.showExportLoader = true
    this.exportGridDataEvent.emit()

    this.exportButtonShow$
    .subscribe((response: any) =>
    {
      if(response)
      {
        this.showExportLoader = false
        this.cdr.detectChanges()
      }

    })
  }
}
