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
import { GridFilterParam } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService, } from '@progress/kendo-angular-dialog';
import {
  GridDataResult,
  FilterService,
  ColumnVisibilityChangeEvent
} from '@progress/kendo-angular-grid';

import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Observable, Subject, debounceTime } from 'rxjs';
@Component({
  selector: 'cms-financial-funding-sources-list',
  templateUrl: './financial-funding-sources-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialFundingSourcesListComponent implements OnChanges, OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @ViewChild('addEditFundingSourceDialogTemplate', { read: TemplateRef })
  addEditFundingSourceDialogTemplate!: TemplateRef<any>;
  @ViewChild('removeFundingSourceDialogTemplate', { read: TemplateRef })
  removeFundingSourceDialogTemplate!: TemplateRef<any>;
  isFinancialFundingSourceFacadeGridLoaderShow = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  @Output() onAddFundingSourceEvent = new EventEmitter<any>();
  @Output() onUpdateFundingSourceEvent = new EventEmitter<any>();
  @Input() addFundingSource$: any;
  @Input() updateFundingSource$: any
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() financialFundingSourceGridLists$: any;
  @Input() fundingSourceList$!: Observable<any>;
  @Output() loadFinancialFundingSourcesListEvent = new EventEmitter<any>();
  @Output() removeFundingSourceClick = new EventEmitter<string>();
  @Input() removeFundingSource$: any
  isRemoveFundingSourceClicked$ = new Subject();
  public gridFilter: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public state!: any;
  sortColumn = 'fundingSourceCode';
  sortDir = 'Ascending';
  sortColumnDesc = 'Funding Source';
  columnsReordered = false;
  filteredBy = '';
  isFiltered = false;
  filter!: any;
  selectedSearchColumn = 'ALL';
  gridDataResult!: GridDataResult;
  columnName: string = '';
  filteredByColumnDesc = '';
  columnChangeDesc = 'Default Columns'

  gridColumns: { [key: string]: string } = {
    ALL: 'All Columns',
    fundingSourceCode: "Funding Source",
    fundingDesc: "Funding Name",

  };

  searchColumnList: { columnName: string, columnDesc: string }[] = [
    {
      columnName: 'ALL',
      columnDesc: 'All Columns'
    },
    {
      columnName: "fundingSourceCode",
      columnDesc: "Funding Source"
    },
  ]
  gridFinancialFundingSourcesDataSubject = new Subject<any>();

  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  editFundingOpened = false;
  removeFundingOpened = false;
  isEditFundingSource = false;
  addEditFundingDialog: any;
  removeFundingDialog: any;
  selectFundingSourceId!: string;
  public processGridActions(dataItem: any) {
    const buttons = [
      {
        buttonType: 'btn-h-primary',
        text: 'Edit',
        icon: 'edit',
        click: (data: any): void => {
          if (!this.editFundingOpened) {
            this.editFundingOpened = true;
            this.onAddEditFundingSourceOpenClicked(
              this.addEditFundingSourceDialogTemplate,
              data
            );
          }
        },
      },
      {
        buttonType: 'btn-h-danger',
        text: 'Remove',
        icon: 'delete',
        click: (data: any): void => {
          if (!this.removeFundingOpened && !dataItem.isFundingSourceAssignedToPca) {
            this.removeFundingOpened = true;
            this.onRemoveFundingSourceOpenClicked(
              this.removeFundingSourceDialogTemplate
            );
          }
        },
      },
    ];

    // Filter out the Remove button if the condition is met
    if (dataItem.isFundingSourceAssignedToPca) {
      return buttons.filter(button => button.text !== 'Remove');
    }

    return buttons;
  }

  selectedFundingSourceCode: any;
  searchText = '';
  private searchSubject = new Subject<string>();

  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.initializeFundingSourceGrid();
    this.initializeFundingSourcePage()
    this.addSearchSubjectSubscription()
  }

  initializeFundingSourcePage() {
    this.loadFinancialFundingSourceFacadeListGrid();
    this.addSearchSubjectSubscription();
  }

  private initializeFundingSourceGrid() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: [{ field: 'fundingSourceCode', dir: 'asc' }]
    };
  }

  restFundingGrid() {
    this.sortValue = 'fundingSourceCode';
    this.sortType = 'asc';
    this.initializeFundingSourceGrid();
    this.sortColumn = 'fundingSourceCode';
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : "";
    this.sortDir = this.sort[0]?.dir === 'desc' ? 'Descending' : "";
    this.filter = [];
    this.searchText = '';
    this.selectedSearchColumn = 'ALL';
    this.filteredByColumnDesc = '';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.columnChangeDesc = 'Default Columns';
    this.loadFinancialFundingSourceFacadeListGrid();
  }

  ngOnChanges(): void {
    this.initializeFundingSourceGrid()
    this.loadFinancialFundingSourceFacadeListGrid();
  }

  private loadFinancialFundingSourceFacadeListGrid(): void {
    const param = new GridFilterParam(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      JSON.stringify(this.filter));
    this.loadFinancialFundingSourcesListEvent.emit(param);
  }

  private addSearchSubjectSubscription() {
    this.searchSubject.pipe(debounceTime(300))
      .subscribe((searchValue) => {
        this.performFundSearch(searchValue);
      });
  }

  searchColumnChangeHandler(value: string) {
    this.filter = [];
    if (this.searchText) {
      this.onFundSearch(this.searchText);
    }
  }


  onFundSearch(searchValue: any) {
    const isDateSearch = searchValue.includes('/');
    if (isDateSearch && !searchValue) return;
    this.setFilterBy(false, searchValue, []);
    this.searchSubject.next(searchValue);
  }

  performFundSearch(data: any) {
    this.defaultGridState();
    const operator = 'contains';

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'fundingSourceCode',
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
    this.loadFinancialFundingSourceFacadeListGrid();
  }

  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filters: { logic: 'and', filters: [] },
      selectedColumn: 'ALL',
      columnName: '',
      searchValue: '',
    };
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    this.gridFilter = filter;
  }

  columnChange(event: ColumnVisibilityChangeEvent) {
    const columnsRemoved = event?.columns.filter(x => x.hidden).length
    this.columnChangeDesc = columnsRemoved > 0 ? 'Columns Removed' : 'Columns Added';

  }
  groupFilterChange(value: any, filterService: FilterService): void {
    filterService.filter({
      filters: [
        {
          field: 'group',
          operator: 'eq',
          value: value.lovDesc,
        },
      ],
      logic: 'or',
    });
  }
  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    filterService.filter({
      filters: [
        {
          field: field,
          operator: 'eq',
          value: value.lovDesc,
        },
      ],
      logic: 'or',
    });
  }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.filter = stateData?.filter?.filters;
    this.setFilterBy(true, '', this.filter);
    this.loadFinancialFundingSourceFacadeListGrid();
  }

  private setFilterBy(isFromGrid: boolean, searchValue: any = '', filter: any = []) {
    this.filteredByColumnDesc = '';
    if (isFromGrid) {
      if (filter.length > 0) {
        const filteredColumns = this.filter?.map((f: any) => {
          const filteredColumns = f.filters?.filter((fld: any) => fld.value)?.map((fld: any) =>
            this.gridColumns[fld.field])
          return ([...new Set(filteredColumns)]);
        });

        this.filteredByColumnDesc = ([...new Set(filteredColumns)])?.sort()?.join(', ') ?? '';
      }
      return;
    }

    if (searchValue !== '') {
      this.filteredByColumnDesc = this.searchColumnList?.find(i => i.columnName === this.selectedSearchColumn)?.columnDesc ?? '';
    }
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadFinancialFundingSourceFacadeListGrid();
  }

  public rowClass = (args: any) => ({
    'table-row-disabled': args.dataItem.isActive,
  });

  public onAddEditFundingSourceOpenClicked(
    template: TemplateRef<unknown>,
    dataItem: any
  ): void {
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
    this.addFundingSource$.subscribe((_: any) => {
      this.loadFinancialFundingSourceFacadeListGrid();
    })
  }

  updateFundingSource(event: any) {
    this.onUpdateFundingSourceEvent.emit(event);
    this.updateFundingSource$.subscribe((_: any) => {
      this.loadFinancialFundingSourceFacadeListGrid();
    })
  }

  public onRemoveFundingSourceOpenClicked(
    template: TemplateRef<unknown>
  ): void {
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
  removeFundingSourceEvent(fundingSoruceId: any) {
    this.removeFundingSourceClick.emit(fundingSoruceId);
    this.removeFundingOpened = false;

  }
  removeFundingSource(dataItem: any) {
    if (dataItem?.isDelete === true) {
      this.removeFundingSourceEvent(this.selectFundingSourceId);
      this.onModalCloseRemoveFundingSourceClicked(true)
      this.removeFundingSource$.subscribe((_: any) => {
        this.loadFinancialFundingSourceFacadeListGrid();
      })
    }
    else {
      this.onModalCloseRemoveFundingSourceClicked(true)
    }
    this.loadFinancialFundingSourceFacadeListGrid();
  }
  removedClick(fundingId: any, fundingSourceCode: any) {
    this.selectedFundingSourceCode = fundingSourceCode
    this.selectFundingSourceId = fundingId
  }

}
