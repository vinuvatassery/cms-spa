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
  selector: 'cms-pharmacy-claims-process-list',
  templateUrl: './pharmacy-claims-process-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsProcessListComponent implements OnInit, OnChanges {
  @ViewChild('batchClaimsConfirmationDialog', { read: TemplateRef })
  batchClaimsConfirmationDialog!: TemplateRef<any>;
  @ViewChild('deleteClaimsConfirmationDialog', { read: TemplateRef })
  deleteClaimsConfirmationDialog!: TemplateRef<any>;
  @ViewChild('addEditClaimsDialog', { read: TemplateRef })
  addEditClaimsDialog!: TemplateRef<any>;

  public formUiStyle: UIFormStyle = new UIFormStyle();
  private deleteClaimsDialog: any;
  private batchConfirmClaimsDialog: any;
  private addEditClaimsFormDialog: any;
  private addClientRecentClaimsDialog: any;
  providerDetailsDialog: any;
  isDeleteBatchClosed = false;
  isDeleteBatchMoreOptionClosed = false;
  isAddEditClaimMoreClose = false;
  isBatchClaimsOption = false;
  isDeleteClaimsOption = false;
  isProcessBatchClosed = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isProcessGridExpand = true;
  isPharmacyClaimsProcessGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() pharmacyClaimsProcessGridLists$: any;

  @Input() addPharmacyClaim$: any;
  @Input() editPharmacyClaim$: any;
  @Input() getPharmacyClaim$: any;
  @Input() searchPharmacies$: any;
  @Input() searchClients$: any;
  @Input() searchDrugs$: any;
  @Input() searchPharmaciesLoader$: any;
  @Input() searchClientLoader$: any;
  @Input() searchDrugsLoader$: any;
  @Input() paymentRequestType$ : any
  @Input() deliveryMethodLov$ :any

  @Output() loadPharmacyClaimsProcessListEvent = new EventEmitter<any>();

  @Output() addPharmacyClaimEvent = new EventEmitter<any>();
  @Output() updatePharmacyClaimEvent = new EventEmitter<any>();
  @Output() getPharmacyClaimEvent = new EventEmitter<any>();
  @Output() searchPharmaciesEvent = new EventEmitter<any>();
  @Output() searchClientsEvent = new EventEmitter<any>();
  @Output() searchDrugEvent = new EventEmitter<any>();
  @Output() getCoPaymentRequestTypeLovEvent = new EventEmitter<any>();
  @Output() getDrugUnitTypeLovEvent = new EventEmitter<any>();

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

  gridPharmacyClaimsProcessDataSubject = new Subject<any>();
  gridPharmacyClaimsProcessData$ =
    this.gridPharmacyClaimsProcessDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public claimsProcessMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'Batch Claims',
      icon: 'check',
      click: (data: any): void => {
        if (!this.isProcessBatchClosed) {
          this.isProcessBatchClosed = true;
          this.onBatchClaimsGridSelectedClicked();
        }
      },
    },

    {
      buttonType: 'btn-h-danger',
      text: 'Delete Claims',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isDeleteBatchClosed) {
          this.isDeleteBatchClosed = true;
          this.onBatchClaimsGridSelectedClicked();
        }
      },
    },
  ];
  public processGridActions = [
    {
      buttonType: 'btn-h-primary',
      text: '',
      icon: 'edit',
      click: (data: any): void => {
        if (!this.isAddEditClaimMoreClose) {
          this.isAddEditClaimMoreClose = true;
          this.onClickOpenAddEditClaimsFromModal(this.addEditClaimsDialog);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Claim',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isDeleteBatchMoreOptionClosed) {
          this.isDeleteBatchMoreOptionClosed = true;
          this.onDeleteClaimsOpenClicked(this.deleteClaimsConfirmationDialog);
        }
      },
    },
  ];
  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadPharmacyClaimsProcessListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadPharmacyClaimsProcessListGrid();
  }

  private loadPharmacyClaimsProcessListGrid(): void {
    this.loadClaimsProcess(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadClaimsProcess(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isPharmacyClaimsProcessGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadPharmacyClaimsProcessListEvent.emit(gridDataRefinerValue);
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
    this.loadPharmacyClaimsProcessListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadPharmacyClaimsProcessListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.pharmacyClaimsProcessGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridPharmacyClaimsProcessDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isPharmacyClaimsProcessGridLoaderShow = false;
      }
    });
    this.isPharmacyClaimsProcessGridLoaderShow = false;
  }

  public onBatchClaimsClicked(template: TemplateRef<unknown>): void {
    this.batchConfirmClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onModalBatchClaimsModalClose(result: any) {
    if (result) {
      this.batchConfirmClaimsDialog.close();
    }
  }

  public onDeleteClaimsOpenClicked(template: TemplateRef<unknown>): void {
    this.deleteClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onModalDeleteClaimsModalClose(result: any) {
    if (result) {
      this.isDeleteBatchMoreOptionClosed = false;
      this.deleteClaimsDialog.close();
    }
  }

  onClickOpenAddEditClaimsFromModal(template: TemplateRef<unknown>): void {
    this.addEditClaimsFormDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-full add_claims_modal',
    });
  }
  modalCloseAddEditClaimsFormModal(result: any) {
    if (result) {
      this.isAddEditClaimMoreClose = false;
      this.addEditClaimsFormDialog.close();
    }
  }

  onBatchClaimsGridSelectedClicked() {
    this.isProcessGridExpand = false;
  }

  onBatchClaimsGridSelectedCancelClicked() {
    this.isProcessGridExpand = true;
    this.isDeleteBatchClosed = false;
    this.isProcessBatchClosed = false;
  }

  clientRecentClaimsModalClicked(
    template: TemplateRef<unknown> 
  ): void {
    this.addClientRecentClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal  app-c-modal-bottom-up-modal',
      animation: {
        direction: 'up',
        type: 'slide',
        duration: 200,
      },
    });
  }

  closeRecentClaimsModal(result: any) {
    if (result) {
      this.addClientRecentClaimsDialog.close();
    }
  }

  onViewProviderDetailClicked(template: TemplateRef<unknown>): void {
    this.providerDetailsDialog = this.dialogService.open({
      content: template,
      animation: {
        direction: 'left',
        type: 'slide',
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });
  }

  onCloseViewProviderDetailClicked(result: any) {
    if (result) {
      this.providerDetailsDialog.close();
    }
  }

  addPharmacyClaim(data: any) {
    this.addPharmacyClaimEvent.emit(data);
  }

  updatePharmacyClaim(data: any) {
    this.updatePharmacyClaimEvent.emit(data);
  }

  getPharmacyClaim(paymentRequestId: any) {
    this.getPharmacyClaimEvent.emit(paymentRequestId);
  }

  searchPharmacies(searchText: any) {
    this.searchPharmaciesEvent.emit(searchText);
  }

  searchClients(searchText: any) {
    this.searchClientsEvent.emit(searchText);
  }
  searchDrug(searchText: string) {
    this.searchDrugEvent.emit(searchText);
  }

  getCoPaymentRequestTypeLov()
  {
    this.getCoPaymentRequestTypeLovEvent.emit();
  }

  getDrugUnitTypeLov()
  {
    this.getDrugUnitTypeLovEvent.emit();
  }

}
