/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
@Component({
  selector: 'cms-financial-pcas-assignment-list',
  templateUrl: './financial-pcas-assignment-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPcasAssignmentListComponent implements OnInit, OnChanges {
  @ViewChild('addEditPcaAssignmentDialogTemplate', { read: TemplateRef })
  addEditPcaAssignmentDialogTemplate!: TemplateRef<any>;
  @ViewChild('removePcaAssignmentDialogTemplate', { read: TemplateRef })
  removePcaAssignmentDialogTemplate!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  pcaAssignmentRemoveDialogService  : any;
  pcaAssignmentAddEditDialogService : any;
  popupClassAction = 'TableActionPopup app-dropdown-action-list'; 
  isFinancialPcaAssignmentGridLoaderShow = false;
  isEditAssignmentClosed = false;
  isRemoveAssignmentClosed = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() financialPcaAssignmentGridLists$: any;
  @Output() loadFinancialPcaAssignmentListEvent = new EventEmitter<any>();
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

  gridFinancialPcaAssignmentDataSubject = new Subject<any>();
  gridFinancialPcaAssignmentData$ =
    this.gridFinancialPcaAssignmentDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public gridMoreActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
      click: (data: any): void => {
        if (!this.isEditAssignmentClosed) {
          this.isEditAssignmentClosed = true; 
          this.onOpenAddPcaAssignmentClicked(this.addEditPcaAssignmentDialogTemplate);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isRemoveAssignmentClosed) {
          this.isRemoveAssignmentClosed = true; 
          this.onRemovePcaAssignmentClicked(this.removePcaAssignmentDialogTemplate);
        }
      },
    },
  ];
 aaaaaa = [
  {
    id:1,
    priority: 1,
    pca: '123123`',
    object:'Third Party', 
    objectCode:'234234', 
    amount:'43324342.33',  
    openDate:'MM/DD/YYYY', 
    closeDate:'MM/DD/YYYY', 
    totalAmount:'43324342.33', 
    amountUsed:'43324342.33', 
    amountLeft:'43324342.33',
    isActive: true,  
  },
  {
    id:2,
    priority: 2,
    pca: '123123`',
    object:'Third Party', 
    objectCode:'234234', 
    amount:'43324342.33',  
    openDate:'MM/DD/YYYY', 
    closeDate:'MM/DD/YYYY', 
    totalAmount:'43324342.33', 
    amountUsed:'43324342.33', 
    amountLeft:'43324342.33',
    isActive: false,  
  },
 ]
  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadFinancialPcaAssignmentListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadFinancialPcaAssignmentListGrid();
  }

  private loadFinancialPcaAssignmentListGrid(): void {
    this.loadPcaAssignment(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadPcaAssignment(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isFinancialPcaAssignmentGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadFinancialPcaAssignmentListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
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
    this.loadFinancialPcaAssignmentListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadFinancialPcaAssignmentListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.financialPcaAssignmentGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridFinancialPcaAssignmentDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isFinancialPcaAssignmentGridLoaderShow = false;
      }
    });
    this.isFinancialPcaAssignmentGridLoaderShow = false;
  }
  public rowClass = (args:any) => ({
    "table-row-disabled": (!args.dataItem.isActive),
  });
 
  onOpenAddPcaAssignmentClicked(template: TemplateRef<unknown>): void {
    this.pcaAssignmentAddEditDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onCloseAddEditPcaAssignmentClicked(result: any) {
    if (result) { 
      this.isEditAssignmentClosed = false;
      this.pcaAssignmentAddEditDialogService.close();
    }
  }

  onRemovePcaAssignmentClicked(template: TemplateRef<unknown>): void {
    this.pcaAssignmentRemoveDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onCloseRemovePcaAssignmentClicked(result: any) {
    if (result) { 
      this.isRemoveAssignmentClosed = false;
      this.pcaAssignmentRemoveDialogService.close();
    }
  }


}
 
 
 