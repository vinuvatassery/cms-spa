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
import { DialogService } from '@progress/kendo-angular-dialog';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
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
  @Output() loadFinancialPcaSetupListEvent = new EventEmitter<GridFilterParam>();
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

  gridFinancialPcaSetupDataSubject = new Subject<any>();
  gridFinancialPcaSetupData$ =
    this.gridFinancialPcaSetupDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  gridMoreActions = [
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
      text: 'Remove',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isRemoveConfirmationClosed) {
          this.isRemoveConfirmationClosed = true;
          this.onRemovePcaSetupClicked(this.removePcaSetupDialogTemplate);
        }
      },
    },
  ];

  gridColumns: { [key: string]: string } = {
    isPcaAssigned: 'Assigned',
    pcaCode: 'PCA #',
    appropriationYear: 'AY',
    pcaDesc: 'Description',
    totalAmount: 'Amount',
    remainingAmount: 'Remaining',
    closeDate: 'Close Date',
    fundingDesc: 'Funding Name ',
    fundingSource: 'Funding Source'
  };

  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) { }

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
    const param = new GridFilterParam(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      JSON.stringify(this.filter));
    this.loadFinancialPcaSetupListEvent.emit(param);
  }

  onChange(data: any) {
    this.defaultGridState();

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'pcaCode',
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
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.filter = stateData?.filter?.filters;
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

  public rowClass = (args: any) => ({
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
      this.isRemoveConfirmationClosed = false;
      this.pcaSetupRemoveDialogService.close();
    }
  }


}

