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
  selector: 'system-config-email-template-list',
  templateUrl: './email-template-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailTemplateListComponent implements OnInit, OnChanges {
 
  /** Public properties **/ 
  isEmailTemplateDeletePopupShow = false;
  isEmailTemplateDeactivatePopupShow = false;
  isEmailTemplateReactivatePopupShow = false;
  isEmailTemplateDuplicatePopupShow = false;
   
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
        this.onEmailTemplateDuplicateClicked();
      },
    }, 
    {
      buttonType:"btn-h-primary",
      text: "Deactivate",
      icon: "block",
      click: (data: any): void => {
        this.onEmailTemplateDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
      click: (data: any): void => {
        this.onEmailTemplateDeleteClicked();
      },
    },
  ];
  
  
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() emailTemplatesDataLists$: any;
  @Input() emailTemplatesFilterColumn$: any;
  @Output() loadEmailTemplatesListsEvent = new EventEmitter<any>();
  @Output() emailTemplatesFilterColumnEvent = new EventEmitter<any>();
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
  isEmailTemplatesListGridLoaderShow = false;
  gridEmailTemplatesDataSubject = new Subject<any>();
  gridEmailTemplatesData$ =
    this.gridEmailTemplatesDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  /** Internal event methods **/
  
  
  ngOnInit(): void {
    this.loadEmailTemplatesList(); 
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadEmailTemplatesList();
  }
  
  private loadEmailTemplatesList(): void {
    this.loadEmailTemplatesLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadEmailTemplatesLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isEmailTemplatesListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadEmailTemplatesListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadEmailTemplatesFilterColumn(){
    this.emailTemplatesFilterColumnEvent.emit();
  
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
    this.loadEmailTemplatesList();
  }
  
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadEmailTemplatesList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  gridDataHandle() {
    this.emailTemplatesDataLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridEmailTemplatesDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isEmailTemplatesListGridLoaderShow = false;
        }
      }
    );
    this.isEmailTemplatesListGridLoaderShow = false;
  }

  
 
  onEmailTemplateDeleteClicked() {
    this.isEmailTemplateDeletePopupShow = true;
  }
  onCloseEmailTemplateDeleteClicked() {
    this.isEmailTemplateDeletePopupShow = false;
  }

  onEmailTemplateDeactivateClicked() {
    this.isEmailTemplateDeactivatePopupShow = true;
  }
  onCloseEmailTemplateDeactivateClicked() {
    this.isEmailTemplateDeactivatePopupShow = false;
  }

  onEmailTemplateReactivateClicked() {
    this.isEmailTemplateReactivatePopupShow = true;
  }
  onCloseEmailTemplateReactivateClicked() {
    this.isEmailTemplateReactivatePopupShow = false;
  }

  onEmailTemplateDuplicateClicked() {
    this.isEmailTemplateDuplicatePopupShow = true;
  }
  onCloseEmailTemplateDuplicateClicked() {
    this.isEmailTemplateDuplicatePopupShow = false;
  }


}
