 

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
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
@Component({
  selector: 'system-config-case-assignment',
  templateUrl: './case-assignment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseAssignmentComponent implements OnInit, OnChanges {
 
  /** Public properties **/
  isCaseAssignmentDetailPopup = false;
  isCaseAssignmentDeletePopupShow = false;
  isCaseAssignmentDeactivatePopupShow = false;
  isCaseAssignmentReactivatePopupShow = false; 
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() caseAssignmentDataLists$: any;
  @Input() caseAssignmentFilterColumn$: any;
  @Output() loadCaseAssignmentListsEvent = new EventEmitter<any>();
  @Output() caseAssignmentFilterColumnEvent = new EventEmitter<any>();
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
  isCaseAssignmentListGridLoaderShow = false;
  gridCaseAssignmentDataSubject = new Subject<any>();
  gridCaseAssignmentData$ =
    this.gridCaseAssignmentDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public moreActions = [
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
        this.onCaseAssignmentDeactivateClicked();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (data: any): void => {
        this.onCaseAssignmentDeleteClicked();
      },
    },
  ];
 


  
  ngOnInit(): void {
    this.loadCaseAssignmentList(); 
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadCaseAssignmentList();
  }
  
  private loadCaseAssignmentList(): void {
    this.loadCaseAssignmentLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadCaseAssignmentLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isCaseAssignmentListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadCaseAssignmentListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadCaseAssignmentFilterColumn(){
    this.caseAssignmentFilterColumnEvent.emit();
  
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
    this.loadCaseAssignmentList();
  }
  
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadCaseAssignmentList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  gridDataHandle() {
    this.caseAssignmentDataLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridCaseAssignmentDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isCaseAssignmentListGridLoaderShow = false;
        }
      }
    );
    this.isCaseAssignmentListGridLoaderShow = false;
  }


  /** Internal event methods **/
  onCloseCaseAssignmentDetailClicked() {
    this.isCaseAssignmentDetailPopup = false;
  }
  onCaseAssignmentDetailClicked() {
    this.isCaseAssignmentDetailPopup = true;
  }

  onCloseCaseAssignmentDeleteClicked() {
    this.isCaseAssignmentDeletePopupShow = false;
  }
  onCaseAssignmentDeleteClicked() {
    this.isCaseAssignmentDeletePopupShow = true;
  }
  onCloseCaseAssignmentDeactivateClicked() {
    this.isCaseAssignmentDeactivatePopupShow = false;
  }
  onCaseAssignmentDeactivateClicked() {
    this.isCaseAssignmentDeactivatePopupShow = true;
  }

  onCloseCaseAssignmentReactivateClicked() {
    this.isCaseAssignmentReactivatePopupShow = false;
  }
}

 