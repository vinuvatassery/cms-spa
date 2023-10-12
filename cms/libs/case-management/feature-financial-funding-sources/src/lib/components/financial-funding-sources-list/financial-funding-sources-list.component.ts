/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import {
  GridDataResult,
  FilterService
} from '@progress/kendo-angular-grid';

import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Observable, Subject } from 'rxjs';
@Component({
  selector: 'cms-financial-funding-sources-list',
  templateUrl: './financial-funding-sources-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialFundingSourcesListComponent implements OnChanges {
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
  @Output() removeFundingSourceClick = new EventEmitter<string>();
  @Input() removeFundingSource$: any
  isRemoveFundingSourceClicked$ = new Subject();
  public gridFilter: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public state!: any;
  sortColumn = 'vendorName';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  columnName: string = '';
  columns: any = {
    fundingSourceCode: "Funding Source",
    fundingDesc: "Funding Name",
  };
  columnDroplist: any = {
    ALL: "ALL",
    FundingSourceCode: "fundingSourceCode",
    FundingDesc: "fundingDesc"
  }
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
  public processGridActions = [
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
        if (!this.removeFundingOpened) {
          this.removeFundingOpened = true;
          this.onRemoveFundingSourceOpenClicked(
            this.removeFundingSourceDialogTemplate
          );
        }
      },
    },
  ];
  selectedFundingSourceCode: any;

  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) { }
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
      this.sortType,
      this.filter
    );
  }
  loadFundingSourceFacade(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string,
    filter: any
  ) {
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      filter: this.filter ? this.filter : null,
    };
    this.loadFinancialFundingSourcesListEvent.emit(gridDataRefinerValue);
  }

  onChange(event: any) {
    this.defaultGridState();
    this.columnName = this.state.columnName = this.columnDroplist[this.selectedColumn];
    this.sortColumn = this.columns[this.selectedColumn];
    this.filter = {
      logic: 'and', filters: [{
        "filters": [
          {
            "field": this.columnDroplist[this.selectedColumn] ?? "clientFullName",
            "operator": "startswith",
            "value": event
          }
        ],
        "logic": "and"
      }]
    }
    let stateData = this.state
    stateData.filter = this.filter
    this.dataStateChange(stateData);
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
  public setGridState(stateData: any): void {
    this.state = stateData;

    const filters = stateData.filter?.filters ?? [];

    const filterList = this.state?.filter?.filters ?? [];
    this.filter = JSON.stringify(filterList);

    if (filters.length > 0) {
      const filterListData = filters.map((filter: any) => this.columns[filter?.filters[0]?.field]);
      this.isFiltered = true;
      this.filteredBy = filterListData.toString();
      this.cdr.detectChanges();
    }
    else {
      this.filter = "";
      this.columnName = "";
      this.isFiltered = false;
    }

    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? "";
    this.sortType = stateData.sort[0]?.dir ?? "";
    this.state = stateData;
    this.sortColumn = this.columns[stateData.sort[0]?.field];
    this.sortDir = "";
    if (this.sort[0]?.dir === 'asc') {
      this.sortDir = 'Ascending';
    }
    if (this.sort[0]?.dir === 'desc') {
      this.sortDir = 'Descending';
    }
    this.loadFinancialFundingSourceFacadeListGrid();
  }
  filterChange(filter: CompositeFilterDescriptor): void {
    this.gridFilter = filter;
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
    if (stateData.filter?.filters.length > 0) {
      let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.columnName = stateFilter.field;

      this.filter = stateFilter.value;

      this.isFiltered = true;
      const filterList = [];
      for (const filter of stateData.filter.filters) {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.isFiltered = true;
      this.filteredBy = filterList.toString();
    } else {
      this.filter = '';
      this.columnName = '';
      this.isFiltered = false;
    }
    this.state = stateData;
    this.setGridState(stateData);
    this.loadFinancialFundingSourceFacadeListGrid();
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
      this.loadFinancialFundingSourceFacadeListGrid();
    }
  }

  addFundingSource(event: any) {
    this.onAddFundingSourceEvent.emit(event)
    this.loadFinancialFundingSourceFacadeListGrid();
  }

  updateFundingSource(event: any) {
    this.onUpdateFundingSourceEvent.emit(event);
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
