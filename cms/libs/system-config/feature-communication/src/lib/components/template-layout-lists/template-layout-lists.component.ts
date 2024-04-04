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
  selector: 'system-config-template-layout-lists',
  templateUrl: './template-layout-lists.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateLayoutListsComponent implements OnInit, OnChanges {
 
  /** Public properties **/ 
  isLayoutTemplateDeletePopupShow = false;
  isLayoutTemplateDeactivatePopupShow = false;
  isLayoutTemplateReactivatePopupShow = false;
  isLayoutTemplateDuplicatePopupShow = false;
   
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
        this.onLayoutTemplateDuplicateClicked();
      },
    }, 
    {
      buttonType:"btn-h-primary",
      text: "Deactivate",
      icon: "block",
      click: (data: any): void => {
        this.onLayoutTemplateDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
      click: (data: any): void => {
        this.onLayoutTemplateDeleteClicked();
      },
    },
  ];
  /** Constructor **/
  
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() layoutTemplatesDataLists$: any;
  @Input() layoutTemplatesFilterColumn$: any;
  @Output() loadLayoutTemplatesListsEvent = new EventEmitter<any>();
  @Output() layoutTemplatesFilterColumnEvent = new EventEmitter<any>();
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
  isLayoutTemplatesListGridLoaderShow = false;
  gridLayoutTemplatesDataSubject = new Subject<any>();
  gridLayoutTemplatesData$ =
    this.gridLayoutTemplatesDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  /** Internal event methods **/
  
  
  ngOnInit(): void {
    this.loadLayoutTemplatesList(); 
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadLayoutTemplatesList();
  }
  
  private loadLayoutTemplatesList(): void {
    this.loadLayoutTemplatesLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadLayoutTemplatesLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isLayoutTemplatesListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadLayoutTemplatesListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadLayoutTemplatesFilterColumn(){
    this.layoutTemplatesFilterColumnEvent.emit();
  
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
    this.loadLayoutTemplatesList();
  }
  
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadLayoutTemplatesList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  gridDataHandle() {
    this.layoutTemplatesDataLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridLayoutTemplatesDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isLayoutTemplatesListGridLoaderShow = false;
        }
      }
    );
    this.isLayoutTemplatesListGridLoaderShow = false;
  }

  
 
  onLayoutTemplateDeleteClicked() {
    this.isLayoutTemplateDeletePopupShow = true;
  }
  onCloseLayoutTemplateDeleteClicked() {
    this.isLayoutTemplateDeletePopupShow = false;
  }

  onLayoutTemplateDeactivateClicked() {
    this.isLayoutTemplateDeactivatePopupShow = true;
  }
  onCloseLayoutTemplateDeactivateClicked() {
    this.isLayoutTemplateDeactivatePopupShow = false;
  }

  onLayoutTemplateReactivateClicked() {
    this.isLayoutTemplateReactivatePopupShow = true;
  }
  onCloseLayoutTemplateReactivateClicked() {
    this.isLayoutTemplateReactivatePopupShow = false;
  }

  onLayoutTemplateDuplicateClicked() {
    this.isLayoutTemplateDuplicatePopupShow = true;
  }
  onCloseLayoutTemplateDuplicateClicked() {
    this.isLayoutTemplateDuplicatePopupShow = false;
  }


}

