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
  ViewChild,
} from '@angular/core';
import { GridFilterParam, PcaDetails } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { ColumnVisibilityChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { IntlService } from '@progress/kendo-angular-intl';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import {
  CompositeFilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { Observable, Subject, Subscription, debounceTime } from 'rxjs';
@Component({
  selector: 'cms-financial-pcas-setup-list',
  templateUrl: './financial-pcas-setup-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPcasSetupListComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('addEditPcaSetupDialogTemplate', { read: TemplateRef })
  addEditPcaSetupDialogTemplate!: TemplateRef<any>;
  @ViewChild('removePcaSetupDialogTemplate', { read: TemplateRef })
  removePcaSetupDialogTemplate!: TemplateRef<any>;
  @ViewChild(TooltipDirective)
  public tooltipDir!: TooltipDirective;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  pcaSetupRemoveDialogService: any;
  pcaSetupAddEditDialogService: any;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isEditSetupClosed = false;
  isRemoveConfirmationClosed = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() financialPcaSetupGridLists$: any;
  @Input() financialPcaSetupGridLoader$: any;
  @Input() fundingSourceLookup$: any;
  @Input() pcaActionIsSuccess$ = new Observable<any>();
  @Input() pcaData$ = new Observable<PcaDetails | null>();
  @Output() loadFinancialPcaSetupListEvent = new EventEmitter<GridFilterParam>();
  @Output() loadAddOrEditPcaEvent = new EventEmitter<any>();
  @Output() savePcaEvent = new EventEmitter<{ pcaId?: string | null, pcaDetails: PcaDetails }>();
  @Output() removePcaEvent = new EventEmitter<string>();
  public state!: State;
  sortColumn = 'pcaCode';
  sortDir = 'Ascending';
  sortColumnDesc = 'PCA #';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  selectedPcaId?: string | null = null;
  selectedPcaDesc!: string;
  selectedFundingSource!: string;
  gridFinancialPcaSetupDataSubject = new Subject<any>();
  gridFinancialPcaSetupData$ =
    this.gridFinancialPcaSetupDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  searchText = '';
  private searchSubject = new Subject<string>();
  private saveResponseSubscription !: Subscription;
  gridMoreActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
      click: (data: any): void => {
        if (!this.isEditSetupClosed) {
          this.isEditSetupClosed = true;
          this.onOpenAddPcaSetupClicked(this.addEditPcaSetupDialogTemplate, data?.pcaId);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Remove',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isRemoveConfirmationClosed) {
          this.isRemoveConfirmationClosed = true;
          this.onRemovePcaSetupClicked(this.removePcaSetupDialogTemplate, data?.pcaId, data?.pcaDesc, data?.fundingDesc);
        }
      },
    },
  ];

  gridColumns: { [key: string]: string } = {
    ALL: 'All Columns',
    isPcaAssigned: 'Assigned',
    pcaCode: 'PCA #',
    appropriationYear: 'AY #',
    pcaDesc: 'Description',
    totalAmount: 'Amount',
    remainingAmount: 'Remaining',
    closeDate: 'Close Date',
    fundingDesc: 'Funding Name ',
    fundingSource: 'Funding Source'
  };

  searchColumnList: { columnName: string, columnDesc: string }[] = [
    { columnName: 'ALL', columnDesc: 'All Columns' },
    { columnName: 'pcaCode', columnDesc: 'PCA' },
    { columnName: 'appropriationYear', columnDesc: 'AY' },
    { columnName: 'fundingDesc', columnDesc: 'Funding Name' },
  ];
  selectedSearchColumn = 'ALL';
  filteredByColumnDesc = '';
  columnChangeDesc = 'Default Columns'
  /** Constructor **/
  constructor(
    private dialogService: DialogService,
    private readonly intl: IntlService,
    private readonly configProvider: ConfigurationProvider
  ) { }

  ngOnInit(): void {
    this.initializePcaPage();
  }

  ngOnChanges(): void {
    this.initializePCAGrid();
    this.loadFinancialPcaSetupListGrid();
  }

  private initializePCAGrid() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: [{ field: 'pcaCode', dir: 'asc' }]
    };
  }

  ngOnDestroy(): void {
    this.saveResponseSubscription.unsubscribe();
    this.searchSubject.complete();
  }

  searchColumnChangeHandler(value: string) {
    this.filter = [];
    if (this.searchText) {
      this.onPcaSearch(this.searchText);
    }
  }

  onPcaSearch(searchValue: any) {
    const isDateSearch = searchValue.includes('/');
    searchValue = this.formatSearchValue(searchValue, isDateSearch);
    if (isDateSearch && !searchValue) return;
    this.setFilterBy(false, searchValue, []);
    this.searchSubject.next(searchValue);
  }

  performPcaSearch(data: any) {
    this.defaultGridState();
    if(data == 'a'){
      data='';
    }
    else{
    data = this.selectedSearchColumn === 'appropriationYear' ? data.toLowerCase().replace(/^ay+/g, '') : data;
    }
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'pcaCode',
              operator: 'contains',
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
    this.loadFinancialPcaSetupListGrid();
  }
  restPcaGrid() {
    this.sortValue = 'pcaCode';
    this.sortType = 'asc';
    this.initializePCAGrid();
    this.sortColumn = 'pcaCode';
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : "";
    this.sortDir = this.sort[0]?.dir === 'desc' ? 'Descending' : "";
    this.filter = [];
    this.searchText = '';
    this.selectedSearchColumn = 'ALL';
    this.filteredByColumnDesc = '';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.columnChangeDesc = 'Default Columns';
    this.loadFinancialPcaSetupListGrid();
  }

  /* Public methods */
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
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.filter = stateData?.filter?.filters;
    this.setFilterBy(true, '', this.filter);
    this.loadFinancialPcaSetupListGrid();
  }

  private setFilterBy(isFromGrid: boolean, searchValue: any = '', filter: any = []) {
    this.filteredByColumnDesc = '';
    if (isFromGrid) {
      if (filter.length > 0) {
        const filteredColumns = this.filter?.map((f: any) => {
          const filteredColumns = f.filters?.filter((fld:any)=> fld.value)?.map((fld: any) =>
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

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadFinancialPcaSetupListGrid();
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  columnChange(event: ColumnVisibilityChangeEvent) {
    const columnsRemoved = event?.columns.filter(x => x.hidden).length
    this.columnChangeDesc = columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }

  onOpenAddPcaSetupClicked(template: TemplateRef<unknown>, pcaId?: string | null): void {
    this.loadAddOrEditPcaEvent.emit(pcaId);
    this.selectedPcaId = pcaId;
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

  onRemovePcaSetupClicked(template: TemplateRef<unknown>, pcaId: string, pcaDesc: string, fundingName: string): void {
    this.selectedPcaId = pcaId;
    this.selectedPcaDesc = pcaDesc;
    this.selectedFundingSource = fundingName;
    this.pcaSetupRemoveDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onCloseRemovePcaSetupClicked(result: any) {
    if (result) {
      this.isRemoveConfirmationClosed = false;
      this.pcaSetupRemoveDialogService.close();
    }
  }

  savePca(event: { pcaId?: string | null, pcaDetails: PcaDetails }) {
    this.savePcaEvent.emit(event);
  }

  removePca(pcaId: string) {
    this.removePcaEvent.emit(pcaId);
  }

  /* Private methods */
  private initializePcaPage() {
    this.loadFinancialPcaSetupListGrid();
    this.addActionResponseSubscription();
    this.addSearchSubjectSubscription();
  }

  private addActionResponseSubscription() {
    this.saveResponseSubscription = this.pcaActionIsSuccess$.subscribe((resp: any) => {
      if (resp === 'remove') {
        this.onCloseRemovePcaSetupClicked(true);
      }
      else if (resp === 'save') {
        this.onCloseAddEditPcaSetupClicked(true);
      }
      this.loadFinancialPcaSetupListGrid();
    });
  }

  private loadFinancialPcaSetupListGrid(): void {
    const param = new GridFilterParam(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      JSON.stringify(this.filter));
    this.loadFinancialPcaSetupListEvent.emit(param);
  }

  private addSearchSubjectSubscription() {
    this.searchSubject.pipe(debounceTime(300))
      .subscribe((searchValue) => {
        this.performPcaSearch(searchValue);
      });
  }

  private isValidDate = (searchValue: any) => isNaN(searchValue) && !isNaN(Date.parse(searchValue));

  private formatSearchValue(searchValue: any, isDateSearch: boolean) {
    if (isDateSearch) {
      if (this.isValidDate(searchValue)) {
        return this.intl.formatDate(new Date(searchValue), this.configProvider?.appSettings?.dateFormat);
      }
      else {
        return '';
      }
    }

    return searchValue;
  }

  isNotNumeric(num: any){
    return isNaN(num)
  }

}

