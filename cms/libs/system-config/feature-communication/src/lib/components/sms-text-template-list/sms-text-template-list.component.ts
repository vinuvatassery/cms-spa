 
import {
  Component,
  OnInit, 
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
  OnChanges
} from '@angular/core'; 
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Subject } from 'rxjs';
 
@Component({
  selector: 'system-config-sms-text-template-list',
  templateUrl: './sms-text-template-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmsTextTemplateListComponent implements OnInit, OnChanges {
 
  /** Public properties **/ 
  isSmsTemplateDeletePopupShow = false;
  isSmsTemplateDeactivatePopupShow = false;
  isSmsTemplateReactivatePopupShow = false;
  isSmsTemplateDuplicatePopupShow = false; 
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
        this.onSmsTemplateDuplicateClicked();
      },
    }, 
    {
      buttonType:"btn-h-primary",
      text: "Deactivate",
      icon: "block",
      click: (data: any): void => {
        this.onSmsTemplateDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
      click: (data: any): void => {
        this.onSmsTemplateDeleteClicked();
      },
    },
  ];
  
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() smsTextTemplatesDataLists$: any;
  @Input() smsTextTemplatesFilterColumn$: any;
  @Output() loadSmsTextTemplatesListsEvent = new EventEmitter<any>();
  @Output() smsTextTemplatesFilterColumnEvent = new EventEmitter<any>();
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
  isSmsTextTemplatesListGridLoaderShow = false;
  gridSmsTextTemplatesDataSubject = new Subject<any>();
  gridSmsTextTemplatesData$ =
    this.gridSmsTextTemplatesDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  /** Internal event methods **/
  
  
  ngOnInit(): void {
    this.loadSmsTextTemplatesList(); 
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadSmsTextTemplatesList();
  }
  
  private loadSmsTextTemplatesList(): void {
    this.loadSmsTextTemplatesLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadSmsTextTemplatesLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isSmsTextTemplatesListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadSmsTextTemplatesListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadSmsTextTemplatesFilterColumn(){
    this.smsTextTemplatesFilterColumnEvent.emit();
  
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
    this.loadSmsTextTemplatesList();
  }
  
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadSmsTextTemplatesList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  gridDataHandle() {
    this.smsTextTemplatesDataLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridSmsTextTemplatesDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isSmsTextTemplatesListGridLoaderShow = false;
        }
      }
    );
    this.isSmsTextTemplatesListGridLoaderShow = false;
  }

 
  onSmsTemplateDeleteClicked() {
    this.isSmsTemplateDeletePopupShow = true;
  }
  onCloseSmsTemplateDeleteClicked() {
    this.isSmsTemplateDeletePopupShow = false;
  }

  onSmsTemplateDeactivateClicked() {
    this.isSmsTemplateDeactivatePopupShow = true;
  }
  onCloseSmsTemplateDeactivateClicked() {
    this.isSmsTemplateDeactivatePopupShow = false;
  }

  onSmsTemplateReactivateClicked() {
    this.isSmsTemplateReactivatePopupShow = true;
  }
  onCloseSmsTemplateReactivateClicked() {
    this.isSmsTemplateReactivatePopupShow = false;
  }

  onSmsTemplateDuplicateClicked() {
    this.isSmsTemplateDuplicatePopupShow = true;
  }
  onCloseSmsTemplateDuplicateClicked() {
    this.isSmsTemplateDuplicatePopupShow = false;
  }


}
