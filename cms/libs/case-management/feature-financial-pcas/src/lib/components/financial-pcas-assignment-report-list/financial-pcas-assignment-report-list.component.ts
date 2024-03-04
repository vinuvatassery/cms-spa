/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { GridFilterParam, PcaAssignmentReport, PcaAssignmentsFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import {
  ColumnVisibilityChangeEvent,
  FilterService,
  GridComponent,
} from '@progress/kendo-angular-grid';
import { IntlService } from '@progress/kendo-angular-intl';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { Subject, debounceTime } from 'rxjs';
@Component({
  selector: 'cms-financial-pcas-assignment-report-list',
  templateUrl: './financial-pcas-assignment-report-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPcasAssignmentReportListComponent
  implements OnInit, OnChanges, OnDestroy
{
  @ViewChild(GridComponent) grid!: GridComponent;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isFinancialPcaReportGridLoaderShow = false;
  PreviewSubmitPaymenttDialogService: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() financialPcaReportGridLists$: any;
  @Input() financialPcaSubReportGridLists$: any;
  @Input() financialPcaReportGridLoader$: any;
  @Output() loadFinancialPcaReportListEvent = new EventEmitter<any>();
  @Output() loadFinancialPcaSubReportListEvent = new EventEmitter<any>();
  @Output() editButtonClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() loadGroupCodesEvent = new EventEmitter<any>();
  @Input() groupCodesData$:any
  public state!: State;
  columnsReordered = false;

  objectCodesData = [];
  selectedObjectCode = '';

  gridColumns: any = {
    status: 'Status',
    pcaCode: 'PCA #',
    objectName: 'Object',
    objectCode: 'Object Code',
    ay: 'AY',
    openDate: 'Open Date',
    closeDate: 'Close Date',
    clientId: 'Client ID',
    amountAssigned: 'Amount Assigned',
    amountRemaining: 'Amount Remaining',
    groupsCovered: 'Groups Covered',
  };

  searchColumnList: { columnName: string; columnDesc: string }[] = [
    {
      columnName: 'ALL',
      columnDesc: 'All Columns',
    },
    {
      columnName: 'pcaCode',
      columnDesc: 'PCA',
    },
    {
      columnName: 'objectName',
      columnDesc: 'Object',
    },
    {
      columnName: 'objectCode',
      columnDesc: 'Object Code',
    },
  ];

  //searching
  private searchSubject = new Subject<string>();
  selectedSearchColumn = 'ALL';
  searchText = '';
  searchValue = '';

  //sorting
  sortColumn = 'pcaCode';
  sortColumnDesc = 'PCA #';
  sortDir = 'Ascending';

  //filtering
  filteredBy = '';
  filter: any = [];

  filteredByColumnDesc = '';
  selectedStatus = '';
  selectedGroupCode ='';
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  showDateSearchWarning = false;
  columnChangeDesc = 'Default Columns';

  dateColumns = ['openDate', 'closeDate'];

   //subscriptions
  objectCodesSubscription : any;

  /** Constructor **/
  constructor(
    private dialogService: DialogService,
    private readonly configProvider: ConfigurationProvider,
    private readonly intl: IntlService,
    private readonly: Router,
    private readonly pcaAssignmentsFacade: PcaAssignmentsFacade
  ) {}

  ngOnInit() {
    this.loadObjectCodes();
    this.loadGroupCodesEvent.emit()
    this.initializePcaPage();
  }

  ngOnChanges(): void {
    this.initializePCAGrid();
    this.loadFinancialPcaReportListGrid();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
    this.objectCodesSubscription.unsubscribe();
  }

  private loadObjectCodes() {
    this.pcaAssignmentsFacade.loadObjectCodes();
    this.objectCodesSubscription = this.pcaAssignmentsFacade.objectCodesData$.subscribe({
      next: (data: any) => {

        this.objectCodesData = data.map(
          (el: any) =>
          (el.ledgerName = el.ledgerName
            .substring(0, el.ledgerName.lastIndexOf(' - '))
            .trim())
        );
      },
    });
  }

  /* Public methods */
  searchColumnChangeHandler(value: string) {
    this.filter = [];
    this.showDateSearchWarning = this.dateColumns.includes(value);
    if (this.searchText) {
      this.onSearch(this.searchText);
    }
  }

  onSearch(searchValue: any) {
    const isDateSearch = searchValue.includes('/');
    this.showDateSearchWarning =
      isDateSearch || this.dateColumns.includes(this.selectedSearchColumn);
    searchValue = this.formatSearchValue(searchValue, isDateSearch);
    if (isDateSearch && !searchValue) return;
    this.setFilterBy(false, searchValue, []);
    this.searchSubject.next(searchValue);
  }

  performSearch(data: any) {
    this.defaultGridState();
    const operator = [ ...this.dateColumns].includes(
      this.selectedSearchColumn
    )
      ? 'eq'
      : 'contains';
    if (
      this.dateColumns.includes(this.selectedSearchColumn) &&
      !this.isValidDate(data) &&
      data !== ''
    ) {
      return;
    }
    if(this.selectedSearchColumn ==  PcaAssignmentReport.Ay){
      const matches = data.match(/(\d+)/);
      data = matches[0];
    }
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'pcaCode',
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
  }

  restGrid() {
    this.sortValue = 'pcaCode';
    this.sortType = 'asc';
    this.sortColumn = 'pcaCode';
    this.sortDir = this.sortType === 'asc' ? 'Ascending' : 'Descending';
    this.initializePCAGrid();
    this.filter = [];
    this.searchText = '';
    this.selectedSearchColumn = 'ALL';
    this.filteredByColumnDesc = '';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.columnChangeDesc = 'Default Columns';
    this.showDateSearchWarning = false;
    this.loadFinancialPcaReportListGrid();
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
    this.sortDir = this.sortType === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.filter = stateData?.filter?.filters;
    this.setFilterBy(true, '', this.filter);
    if (!this.filteredByColumnDesc.includes('Status')) this.selectedStatus = '';
    if (!this.filteredByColumnDesc.includes('Object')) this.selectedObjectCode = '';
    if(stateData?.filter?.filters.length > 0)
    {
      const stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      if(stateFilter.field === PcaAssignmentReport.Ay){
        const matches = stateFilter.value.match(/(\d+)/);
        stateFilter.value = matches[0];
      }
    }
    this.loadFinancialPcaReportListGrid();
  }

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadFinancialPcaReportListGrid();
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  columnChange(event: ColumnVisibilityChangeEvent) {
    const columnsRemoved = event?.columns.filter((x) => x.hidden).length;
    this.columnChangeDesc =
      columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
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
          value: value,
        },
      ],
      logic: 'and',
    });
  }

  public onPreviewSubmitPaymentOpenClicked(
    template: TemplateRef<unknown>
  ): void {
    this.PreviewSubmitPaymenttDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    });
  }

  onPreviewSubmitPaymentCloseClicked(result: any) {
    if (result) {
      this.PreviewSubmitPaymenttDialogService.close();
    }
  }

  /* Private methods */
  private initializePCAGrid() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: [{ field: 'pcaCode', dir: 'asc' }],
    };
  }

  private loadFinancialPcaReportListGrid(): void {
    const param = new GridFilterParam(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      JSON.stringify(this.filter)
    );
    this.loadFinancialPcaReportListEvent.emit(param);
  }

  private initializePcaPage() {
    this.addSearchSubjectSubscription();
  }

  private addSearchSubjectSubscription() {
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchValue) => {
      this.performSearch(searchValue);
    });
  }

  private setFilterBy(
    isFromGrid: boolean,
    searchValue: any = '',
    filter: any = []
  ) {
    this.filteredByColumnDesc = '';
    if (isFromGrid) {
      if (filter.length > 0) {
        const filteredColumns = this.filter?.map((f: any) => {
          const filteredColumns = f.filters
            ?.filter((fld: any) => fld.value)
            ?.map((fld: any) => this.gridColumns[fld.field]);
          return [...new Set(filteredColumns)];
        });

        this.filteredByColumnDesc =
          [...new Set(filteredColumns)]?.sort()?.join(', ') ?? '';
      }
      return;
    }

    if (searchValue !== '') {
      this.filteredByColumnDesc =
        this.searchColumnList?.find(
          (i) => i.columnName === this.selectedSearchColumn
        )?.columnDesc ?? '';
    }
  }

  private isValidDate = (searchValue: any) =>
    isNaN(searchValue) && !isNaN(Date.parse(searchValue));

  private formatSearchValue(searchValue: any, isDateSearch: boolean) {
    if (isDateSearch) {
      if (this.isValidDate(searchValue)) {
        return this.intl.formatDate(
          new Date(searchValue),
          this.configProvider?.appSettings?.dateFormat
        );
      } else {
        return '';
      }
    }

    return searchValue;
  }

  loadFinancialPcaSubReportListGrid(data: any) {
    this.loadFinancialPcaSubReportListEvent.emit(data);
  }

  editAssignmentReport(objectId: any, groupsCoveredId: any) {
   const selectedGroupCodeIds : string[] = [];
    selectedGroupCodeIds.push(groupsCoveredId)
    const data = {
      objectId: objectId,
      groupsCoveredIdsList: selectedGroupCodeIds,
    };
    this.editButtonClick.emit(data);
  }
}
