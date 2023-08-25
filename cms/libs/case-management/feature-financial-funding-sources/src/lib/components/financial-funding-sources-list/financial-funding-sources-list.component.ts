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
import { Observable, Subject } from 'rxjs';
@Component({
  selector: 'cms-financial-funding-sources-list',
  templateUrl: './financial-funding-sources-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialFundingSourcesListComponent implements OnInit, OnChanges {

  public formUiStyle: UIFormStyle = new UIFormStyle();
  @ViewChild('addEditFundingSourceDialogTemplate', { read: TemplateRef })
  addEditFundingSourceDialogTemplate!: TemplateRef<any>;
  @ViewChild('removeFundingSourceDialogTemplate', { read: TemplateRef })
  removeFundingSourceDialogTemplate!: TemplateRef<any>;
  isFinancialFundingSourceFacadeGridLoaderShow = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  @Output() onAddFundingSourceEvent = new EventEmitter<any>();
  @Output() onUpdateFundingSourceEvent = new EventEmitter<any>();
  @Input() addFundingSource$: Observable<any> | undefined;
  @Input() updateFundingSource$: Observable<any> | undefined;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() financialFundingSourceGridLists$: any;
  @Input() fundingSourceList$!: Observable<any>;
  @Output() loadFinancialFundingSourcesListEvent = new EventEmitter<any>();
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

  gridFinancialFundingSourcesDataSubject = new Subject<any>();

  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  editFundingOpened = false;
  removeFundingOpened = false;
  isEditFundingSource = false;
  addEditFundingDialog: any;
  removeFundingDialog: any;;

  public processGridActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
      click: (data: any): void => {
        if (!this.editFundingOpened) {
          this.editFundingOpened = true;
          this.onAddEditFundingSourceOpenClicked(this.addEditFundingSourceDialogTemplate, data);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Remove',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.removeFundingOpened) {
          this.removeFundingOpened = true;
          this.onRemoveFundingSourceOpenClicked(this.removeFundingSourceDialogTemplate)
        }
      },
    },
  ];


  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
   
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadFinancialFundingSourceFacadeListGrid();
  }

  private loadFinancialFundingSourceFacadeListGrid(): void {
    this.loadFundingSourceFacade(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadFundingSourceFacade(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isFinancialFundingSourceFacadeGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadFinancialFundingSourcesListEvent.emit(gridDataRefinerValue);
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
    this.loadFinancialFundingSourceFacadeListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadFinancialFundingSourceFacadeListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.financialFundingSourceGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridFinancialFundingSourcesDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isFinancialFundingSourceFacadeGridLoaderShow = false;
      }
    });
    this.isFinancialFundingSourceFacadeGridLoaderShow = false;
  }

  public rowClass = (args: any) => ({
    "table-row-disabled": (args.dataItem.isActive),
  });


  public onAddEditFundingSourceOpenClicked(template: TemplateRef<unknown>, dataItem: any): void {

    this.addEditFundingDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
    this.isEditFundingSource = dataItem;
  }
  onModalCloseAddEditFundingSourceClicked(result: any) {
    if (result) {
      this.editFundingOpened = false;
      this.addEditFundingDialog.close();
    }
  }

  addFundingSource(event: any) {
    this.onAddFundingSourceEvent.emit(event)
  }

  updateFundingSource(event: any) {
    this.onUpdateFundingSourceEvent.emit(event)
  }

  public onRemoveFundingSourceOpenClicked(template: TemplateRef<unknown>): void {
    this.removeFundingDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onModalCloseRemoveFundingSourceClicked(result: any) {
    if (result) {
      this.removeFundingOpened = false;
      this.removeFundingDialog.close();
    }
  }
}


