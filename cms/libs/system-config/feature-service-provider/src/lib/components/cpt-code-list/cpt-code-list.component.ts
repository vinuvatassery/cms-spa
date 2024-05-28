import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import { Subject, first } from 'rxjs';
import { DocumentFacade } from '@cms/shared/util-core';



@Component({
  selector: 'system-config-cpt-code-list',
  templateUrl: './cpt-code-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CptCodeListComponent implements OnInit, OnChanges {


  constructor(
    private readonly documentFacade: DocumentFacade,
    private readonly cdr: ChangeDetectorRef,
  ) {

  }

  /** Public properties **/
  isCptCodeDetailPopup = false;
  isCptCodeDeletePopupShow = false;
  isCptCodeDeactivatePopupShow = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() cptCodeDataLists$: any;
  @Input() cptCodeFilterColumn$: any;
  @Input() addCptCode$: any;
  @Input() editCptCode$: any;
  @Input() cptCodeProfilePhoto$: any;
  @Input() cptCodeListDataLoader$: any;
  @Input() cptCodeChangeStatus$: any;
  @Input() checkHasPendingClaimsStatus$: any;
  @Input() exportButtonShow$: any;
  @Output() loadCptCodeListsEvent = new EventEmitter<any>();
  @Output() cptCodeFilterColumnEvent = new EventEmitter<any>();
  @Output() addCptCodeEvent = new EventEmitter<string>();
  @Output() editCptCodeEvent = new EventEmitter<string>();
  @Output() deactivateConfimEvent = new EventEmitter<string>();
  @Output() reactivateConfimEvent = new EventEmitter<string>();
  @Output() exportGridEvent$ = new EventEmitter<any>();
  @Output() checkHasPendingClaimsStatusEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'CPT Code';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  isEditCptCode = false;
  filter!: any;
  gridDataResult!: GridDataResult;
  isCptCodeListGridLoaderShow = false;
  gridCptCodeDataSubject = new Subject<any>();
  gridCptCodeData$ = this.gridCptCodeDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  statusFilter: any;
  cptCodeId!: any;
  editButtonEmitted = false;
  selectedCptCode!: any;
  changeStatusButtonEmitted = false;
  columnName: any = "";
  selectedActiveFlag = "";
  showExportLoader = false;
  selectedSearchColumn = 'ALL';
  columns: any = {
    ALL: 'All Columns',
    cptCode1: "CPT Code",
    serviceDesc: "Service Description",
    lastModificationTime: "Last Modified",
    medicaidRate: "Medicaid Rate",
    activeFlag: "Status",
  };
  dropDowncolumns: any = [
    { columnCode: 'ALL', columnDesc: 'All Columns' },
    { columnCode: 'cptCode1', columnDesc: 'CPT Code' }
  ];

  public moreActions = (dataItem: any) => [
    {
      buttonType: "btn-h-primary",
      text: "Edit",
      icon: "edit",
      click: (data: any): void => {
        if (!this.editButtonEmitted) {
          this.editButtonEmitted = true;
          this.onEditCptCodeDetailsClicked(data);
        }
      },
    },
    {
      buttonType: "btn-h-primary",
      text: dataItem.activeFlag === 'Active' ? 'Deactivate' : 'Reactivate',
      icon: dataItem.activeFlag === 'Active' ? "block" : 'done',
      click: (data: any): void => {
        if (!this.changeStatusButtonEmitted && data.cptCodeId) {
          this.changeStatusButtonEmitted = true;
          if (dataItem.activeFlag === 'Active') {
            this.onCptCodeDeactivateClicked(data.cptCodeId);
          } else {
            this.onCptCodeReactiveClicked(data.cptCodeId);
          }
        }
      },
    }
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
      maxResultCount: maxResultCountValue,
      sorting: sortValue,
      sortType: sortTypeValue,
      filter: this.filter !== null && this.filter !== '' ? JSON.stringify(this.filter) : null
    };
    this.loadCptCodeListsEvent.emit(gridDataRefinerValue);
  }
  loadCptCodeFilterColumn() {
    this.cptCodeFilterColumnEvent.emit();

  }
  onChange(data: any) {
    this.defaultGridState();
    let operator = 'contains';
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'cptCode1',
              operator: operator,
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

  searchColumnChangeHandler(value: string) {
    this.selectedSearchColumn = value;
    this.filter = [];
    if (this.searchValue) {
      this.onSearch(this.searchValue);
    }
  }
  onSearch(searchValue: any) {
    this.onChange(searchValue);
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    this.statusFilter = value;
    filterService.filter({
      filters: [
        {
          field: field,
          operator: 'eq',
          value: value,
        },
      ],
      logic: 'or',
    });

    // if(field == "activeFlag"){
    //   this.selectedActiveFlag = value;
    // }
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
    this.sortColumn = this.columns[this.sortValue];
    this.filter = stateData?.filter?.filters;

    if (stateData.filter?.filters.length > 0) {
      const filterList = [];
      this.isFiltered = true;
      for (const filter of stateData.filter.filters) {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.filteredBy = filterList.toString();
    } else {
      //this.filter = "";
      this.isFiltered = false;
    }

    this.loadCptCodeList();
  }

  setToDefault() {
    this.defaultGridState();
    this.sortColumn = 'CPT Code';
    this.sortType = 'asc';
    this.sortDir = this.sortType === 'asc' ? 'Ascending' : "";
    this.filter = '';
    this.selectedSearchColumn = 'ALL';
    this.isFiltered = false;
    this.sortValue = 'cptCode1';
    this.sort = this.sortValue;
    this.searchValue = '';
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

  onClickedExport() {
    this.showExportLoader = true;
    const params = {
      SortType: this.sortType,
      Sorting: this.sortValue,
      Filter: JSON.stringify(this.state?.filter?.filters ?? []),
    };
    this.exportGridEvent$.emit(params);
    this.exportButtonShow$.subscribe((response: any) => {
      if (response) {
        this.showExportLoader = false
        this.cdr.detectChanges()
      }
    });
  }


  onEditCptCodeDetailsClicked(cptCode: any) {
    this.selectedCptCode = cptCode;
    this.isEditCptCode = true;
    this.cptCodeId = cptCode.cptCodeId;
    this.isCptCodeDetailPopup = true;
  }
  /** Internal event methods **/
  onCloseCptCodeDetailClicked() {
    this.isCptCodeDetailPopup = false;
    this.editButtonEmitted = false;
    this.isEditCptCode = false;
  }
  onCptCodeDetailClicked() {
    this.isEditCptCode = false;
    this.isCptCodeDetailPopup = true;
  }

  onCloseCptCodeDeleteClicked() {
    this.isCptCodeDeletePopupShow = false;
  }
  onCptCodeDeleteClicked() {
    this.isCptCodeDeletePopupShow = true;
  }
  onCloseCptCodeDeactivateClicked() {
    this.changeStatusButtonEmitted = false;
    this.isCptCodeDeactivatePopupShow = false;
  }
  onCptCodeDeactivateClicked(cptCodeId: any) {
    this.cptCodeId = cptCodeId;
    this.handleCheckHasPendingClaimsStatus();
  }

  onDeactivateClicked() {
    this.isCptCodeDeactivatePopupShow = true;
    this.cdr.detectChanges(); // Add this line to manually trigger change detection
  }

  addCptCode(data: any): void {
    this.addCptCodeEvent.emit(data);
    this.addCptCode$.pipe(first((response: any) => response != null))
      .subscribe((response: any) => {
        if (response ?? false) {
          this.loadCptCodeList()
        }
        this.onCloseCptCodeDetailClicked();
      })
  }
  onCptCodeReactiveClicked(cptCodeId: string) {
    this.cptCodeId = cptCodeId;
    this.handleCptCodeReactive(true);
  }
  editCptCode(data: any): void {
    data["cptCodeId"] = this.cptCodeId;
    this.editCptCodeEvent.emit(data);
    this.editCptCode$.pipe(first((response: any) => response != null))
      .subscribe((response: any) => {
        if (response ?? false) {
          this.loadCptCodeList()
        }
        this.onCloseCptCodeDetailClicked();
      })
  }

  handleCptCodeDeactive(isDeactivate: any) {
    if (isDeactivate) {
      this.changeStatusButtonEmitted = false;
      this.deactivateConfimEvent.emit(this.cptCodeId);

      this.cptCodeChangeStatus$.pipe(first((response: any) => response != null))
        .subscribe((response: any) => {
          if (response ?? false) {
            this.loadCptCodeList()
          }
          this.onCloseCptCodeDeactivateClicked();
        })
    }
  }

  handleCptCodeReactive(isReactivate: any) {
    if (isReactivate) {
      this.changeStatusButtonEmitted = false;
      this.reactivateConfimEvent.emit(this.cptCodeId);

      this.cptCodeChangeStatus$.pipe(first((response: any) => response != null))
        .subscribe((response: any) => {
          if (response ?? false) {
            this.loadCptCodeList()
          }
        })
    }
  }

  handleCheckHasPendingClaimsStatus() {
    this.changeStatusButtonEmitted = false;
    this.checkHasPendingClaimsStatusEvent.emit(this.cptCodeId);
    
    this.checkHasPendingClaimsStatus$.pipe(first((response: any) => response != null))
      .subscribe((response: any) => {
        if (response ?? false) {
          this.onDeactivateClicked();
        }
      })
  }


}
