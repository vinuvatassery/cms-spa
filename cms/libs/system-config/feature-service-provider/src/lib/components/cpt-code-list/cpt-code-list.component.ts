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
import { FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import { Subject, first } from 'rxjs';



@Component({
  selector: 'system-config-cpt-code-list',
  templateUrl: './cpt-code-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CptCodeListComponent implements OnInit, OnChanges {

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
  @Output() loadCptCodeListsEvent = new EventEmitter<any>();
  @Output() cptCodeFilterColumnEvent = new EventEmitter<any>();
  @Output() addCptCodeEvent = new EventEmitter<string>();
  @Output() editCptCodeEvent = new EventEmitter<string>();
  @Output() deactivateConfimEvent = new EventEmitter<string>();
  @Output() reactivateConfimEvent = new EventEmitter<string>();

  public state!: State;
  sortColumn = 'cptCode1';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  isEditCptCode = false;
  filter!: any;
  selectedColumn: any = 'ALL';
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
      filter: JSON.stringify(this.filter)
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
              field: this.selectedColumn ?? 'cptCode1',
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
    this.filter = stateData?.filter?.filters;
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
    this.isCptCodeDeactivatePopupShow = true;
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

}
