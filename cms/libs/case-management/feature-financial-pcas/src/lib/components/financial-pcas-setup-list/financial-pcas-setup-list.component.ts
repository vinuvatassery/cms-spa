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
import { DialogService } from '@progress/kendo-angular-dialog';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { Observable, Subject, Subscription } from 'rxjs';
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
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.loadFinancialPcaSetupListGrid();
    this.addActionResponseSubscription();
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadFinancialPcaSetupListGrid();
  }

  ngOnDestroy(): void {
    this.saveResponseSubscription.unsubscribe();
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

  onRemovePcaSetupClicked(template: TemplateRef<unknown>, pcaId:string, pcaDesc:string, fundingName: string): void {
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
  private addActionResponseSubscription() {
    this.saveResponseSubscription = this.pcaActionIsSuccess$.subscribe((resp: any) => {
      if (resp === 'remove') {
        this.onCloseRemovePcaSetupClicked(true);
      }
      else if(resp === 'save'){
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
}

