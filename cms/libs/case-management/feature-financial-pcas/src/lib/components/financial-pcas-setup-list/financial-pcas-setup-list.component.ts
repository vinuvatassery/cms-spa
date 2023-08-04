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
  selector: 'cms-financial-pcas-setup-list',
  templateUrl: './financial-pcas-setup-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPcasSetupListComponent implements OnInit, OnChanges {
  @ViewChild('addEditPcaSetupDialogTemplate', { read: TemplateRef })
  addEditPcaSetupDialogTemplate!: TemplateRef<any>;
  @ViewChild('removePcaSetupDialogTemplate', { read: TemplateRef })
  removePcaSetupDialogTemplate!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  pcaSetupRemoveDialogService  : any;
  pcaSetupAddEditDialogService : any;
  popupClassAction = 'TableActionPopup app-dropdown-action-list'; 
  isFinancialPcaSetupGridLoaderShow = false;
  isEditSetupClosed = false;
  isConfirmationClosed = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() financialPcaSetupGridLists$: any;
  @Output() loadFinancialPcaSetupListEvent = new EventEmitter<any>();
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

  gridFinancialPcaSetupDataSubject = new Subject<any>();
  gridFinancialPcaSetupData$ =
    this.gridFinancialPcaSetupDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public gridMoreActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
      click: (data: any): void => {
        if (!this.isEditSetupClosed) {
          this.isEditSetupClosed = true; 
          this.onOpenAddPcaSetupClicked(this.addEditPcaSetupDialogTemplate);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isConfirmationClosed) {
          this.isConfirmationClosed = true; 
          this.onRemovePcaSetupClicked(this.removePcaSetupDialogTemplate);
        }
      },
    },
  ];

 aaaaaa = [
  {
    id:1,
    pca: '123123`',
    ay:'AY21', 
    description:'Some Description Some Description', 
    amount:'43324342.33',  
    remaining:'345435.33', 
    closeDate:'MM/DD/YYYY', 
    grantName:'Name', 
    grantNumber:'34535345', 
    assigned: true,  
  },
  {
    id:2,
    pca: '123123`',
    ay:'AY21', 
    description:'Some Description Some Description', 
    amount:'43324342.33',  
    remaining:'345435.33', 
    closeDate:'MM/DD/YYYY', 
    grantName:'Name', 
    grantNumber:'34535345', 
    assigned: false,  
  },
 ]
  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadFinancialPcaSetupListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadFinancialPcaSetupListGrid();
  }

  private loadFinancialPcaSetupListGrid(): void {
    this.loadPcaSetup(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadPcaSetup(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isFinancialPcaSetupGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadFinancialPcaSetupListEvent.emit(gridDataRefinerValue);
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
    this.loadFinancialPcaSetupListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadFinancialPcaSetupListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.financialPcaSetupGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridFinancialPcaSetupDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isFinancialPcaSetupGridLoaderShow = false;
      }
    });
    this.isFinancialPcaSetupGridLoaderShow = false;
  }
 
  public rowClass = (args:any) => ({
    "table-row-disabled": (!args.dataItem.assigned),
  });
  onOpenAddPcaSetupClicked(template: TemplateRef<unknown>): void {
    this.pcaSetupAddEditDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onCloseAddEditPcaSetupClicked(result: any) {
    if (result) { 
      this.isEditSetupClosed = false;
      this.pcaSetupAddEditDialogService.close();
    }
  }

  onRemovePcaSetupClicked(template: TemplateRef<unknown>): void {
    this.pcaSetupRemoveDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onCloseRemovePcaSetupClicked(result: any) {
    if (result) { 
      this.isConfirmationClosed = false;
      this.pcaSetupRemoveDialogService.close();
    }
  }


}
 
 