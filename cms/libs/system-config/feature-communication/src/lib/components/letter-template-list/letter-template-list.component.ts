 
import {
  Component,
  OnInit,
  ViewEncapsulation,
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
  selector: 'system-config-letter-template-list',
  templateUrl: './letter-template-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LetterTemplateListComponent implements OnInit, OnChanges {
 
  /** Public properties **/ 
  isLetterTemplateDeletePopupShow = false;
  isLetterTemplateDeactivatePopupShow = false;
  isLetterTemplateReactivatePopupShow = false;
  isLetterTemplateDuplicatePopupShow = false;
   
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public headerFooterList = [
    {
      buttonType: 'btn-h-primary',
      text: 'CAREAssist', 
      click: (data: any): void => { 
        console.log("!")
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'OHOP', 
      click: (data: any): void => { 
        console.log("3")
      },
    },
    
  ];
  public gridMoreActions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
     
    }, 
  
    {
      buttonType:"btn-h-primary",
      text: "Duplicate",
      icon: "content_copy",
      click: (data: any): void => {
        this.onLetterTemplateDuplicateClicked();
      },
    }, 
    {
      buttonType:"btn-h-primary",
      text: "Deactivate",
      icon: "block",
      click: (data: any): void => {
        this.onLetterTemplateDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
      click: (data: any): void => {
        this.onLetterTemplateDeleteClicked();
      },
    },
  ];
  /** Constructor **/
  
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() letterTemplatesDataLists$: any;
  @Input() letterTemplatesFilterColumn$: any;
  @Output() loadLetterTemplatesListsEvent = new EventEmitter<any>();
  @Output() letterTemplatesFilterColumnEvent = new EventEmitter<any>();
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
  isLetterTemplatesListGridLoaderShow = false;
  gridLetterTemplatesDataSubject = new Subject<any>();
  gridLetterTemplatesData$ =
    this.gridLetterTemplatesDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  /** Internal event methods **/
  
  
  ngOnInit(): void {
    this.loadLetterTemplatesList(); 
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadLetterTemplatesList();
  }
  
  private loadLetterTemplatesList(): void {
    this.loadLetterTemplatesLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadLetterTemplatesLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isLetterTemplatesListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadLetterTemplatesListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadLetterTemplatesFilterColumn(){
    this.letterTemplatesFilterColumnEvent.emit();
  
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
    this.loadLetterTemplatesList();
  }
  
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadLetterTemplatesList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  gridDataHandle() {
    this.letterTemplatesDataLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridLetterTemplatesDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isLetterTemplatesListGridLoaderShow = false;
        }
      }
    );
    this.isLetterTemplatesListGridLoaderShow = false;
  }

  
 
  onLetterTemplateDeleteClicked() {
    this.isLetterTemplateDeletePopupShow = true;
  }
  onCloseLetterTemplateDeleteClicked() {
    this.isLetterTemplateDeletePopupShow = false;
  }

  onLetterTemplateDeactivateClicked() {
    this.isLetterTemplateDeactivatePopupShow = true;
  }
  onCloseLetterTemplateDeactivateClicked() {
    this.isLetterTemplateDeactivatePopupShow = false;
  }

  onLetterTemplateReactivateClicked() {
    this.isLetterTemplateReactivatePopupShow = true;
  }
  onCloseLetterTemplateReactivateClicked() {
    this.isLetterTemplateReactivatePopupShow = false;
  }

  onLetterTemplateDuplicateClicked() {
    this.isLetterTemplateDuplicatePopupShow = true;
  }
  onCloseLetterTemplateDuplicateClicked() {
    this.isLetterTemplateDuplicatePopupShow = false;
  }


}
