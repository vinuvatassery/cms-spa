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
  ViewChild
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
@Component({
  selector: 'cms-financial-pcas-assignment-report-list',
  templateUrl: './financial-pcas-assignment-report-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPcasAssignmentReportListComponent implements OnChanges
{
  @ViewChild('alertPcaReportDialogTemplate', { read: TemplateRef })
  alertPcaReportDialogTemplate!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isFinancialPcaReportGridLoaderShow = false;
  pcaReportAlertDialogService: any;
  PreviewSubmitPaymenttDialogService: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() financialPcaReportGridLists$: any;
  @Input() financialPcaSubReportGridLists$: any;
  @Output() loadFinancialPcaReportListEvent = new EventEmitter<any>();
  @Output() loadFinancialPcaSubReportListEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'pcaCode';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  columns : any = {
    status: "Status",
    pcaCode:"PCA #",
    objectName:"Object",
    objectCode:"Object Code",
    ay:"AY",
    openDate:"Open Date",
    closeDate:"Close Date",
    clientId:"Client ID",
    amountAssigned:"Amount Assigned",
    amountRemaining:"Amount Remaining",
    groupsCovered:"Groups Covered"
  }
  gridDataResult!: GridDataResult;

  gridFinancialPcaReportDataSubject = new Subject<any>();
  gridFinancialPcaReportData$ =
    this.gridFinancialPcaReportDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) {}

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadFinancialPcaReportListGrid();
  }

  private loadFinancialPcaReportListGrid(): void {
    this.loadPcaReport(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadPcaReport(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isFinancialPcaReportGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      filter: this.state?.['filter']?.['filters'] ?? [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'status',
              operator: 'eq',
              value: 'active',
            },
          ],
          logic: 'and',
        },
      ],
    };
    this.loadFinancialPcaReportListEvent.emit(gridDataRefinerValue);
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
              field: this.selectedColumn ?? 'PcaCode',
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
    this.sortDir = this.sortType === 'asc' ? 'Ascending' : 'Descending';

    this.sortColumn = this.columns[stateData.sort[0]?.field];

    if (stateData.filter?.filters.length > 0) {
      const stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.filter = stateFilter.value;
      this.isFiltered = true;
      const filterList = [];
      for (const filter of stateData.filter.filters) {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.filteredBy = filterList.toString();
    } else {
      this.filter = '';
      this.isFiltered = false;
      this.state.filter = undefined;
    }
    this.loadFinancialPcaReportListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadFinancialPcaReportListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.financialPcaReportGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridFinancialPcaReportDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isFinancialPcaReportGridLoaderShow = false;
      }
    });
    this.isFinancialPcaReportGridLoaderShow = false;
  }

  dropdownFilterChange(field:string, value: any, filterService: FilterService): void {
  filterService.filter({
      filters: [{
        field: field,
        operator: "eq",
        value:value
    }],
      logic: "and"
  });
}

setToDefault() {
  this.state = {
    skip: 0,
    take: this.pageSizes[0]?.value,
    sort: this.sort,
  };

  this.sortColumn = 'PCA #';
  this.sortDir = 'Ascending';
  this.filter = '';
  this.searchValue = '';
  this.isFiltered = false;
  this.columnsReordered = false;

  this.sortValue = 'pcaCode';
  this.sortType = 'asc';
  this.sort = this.sortColumn;

  this.loadFinancialPcaReportListGrid();
}

  onPcaReportAlertClicked(template: TemplateRef<unknown>): void {
    this.pcaReportAlertDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onClosePcaReportAlertClicked(result: any) {
    if (result) {
      this.pcaReportAlertDialogService.close();
    }
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

  loadFinancialPcaSubReportListGrid(data: any) {
    this.loadFinancialPcaSubReportListEvent.emit(data);
  }
}


