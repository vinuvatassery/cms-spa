/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ClientInsurancePlans, InsurancePremium, InsurancePremiumDetails, PolicyPremiumCoverage, FinancialPremiumsFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FilterService, GridDataResult, SelectableMode, SelectableSettings } from '@progress/kendo-angular-grid';
import {CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { BatchPremium } from 'libs/case-management/domain/src/lib/entities/financial-management/batch-premium';
import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs';
import { Legend } from '@progress/kendo-angular-charts';
@Component({
  selector: 'cms-financial-premiums-process-list',
  templateUrl: './financial-premiums-process-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsProcessListComponent implements OnChanges, OnDestroy {
  @ViewChild('batchPremiumsConfirmationDialogTemplate', { read: TemplateRef })
  batchPremiumsConfirmationDialogTemplate!: TemplateRef<any>;
  @ViewChild('removePremiumsConfirmationDialogTemplate', { read: TemplateRef })
  removePremiumsConfirmationDialogTemplate!: TemplateRef<any>;
  @ViewChild('editPremiumsDialogTemplate', { read: TemplateRef })
  editPremiumsDialogTemplate!: TemplateRef<any>;
  @ViewChild('addPremiumsDialogTemplate', { read: TemplateRef })
  addPremiumsDialogTemplate!: TemplateRef<any>;

  public formUiStyle: UIFormStyle = new UIFormStyle();
  private removePremiumsDialog: any;
  private batchConfirmPremiumsDialog: any;
  private editPremiumsFormDialog: any;
  private addPremiumsFormDialog: any;
  private addClientRecentPremiumsDialog: any;
  isRemoveBatchClosed = false;
  isBatchPremiumsClicked = false;
  isRemovePremiumsOption = false;
  isEditBatchClosed = false;
  isAddPremiumClosed = false;
  isSendReportOpened = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isProcessGridExpand = true;
  sendReportDialog: any;
  gridLoaderSubject = new BehaviorSubject(false);
  gridDataResult!: any;
  @Input() premiumsType: any;
  @Input() batchingPremium$: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() financialPremiumsProcessGridLists$: any;
  @Input() insurancePlans$!: Observable<ClientInsurancePlans[]>;
  @Input() insurancePlansLoader$: any;
  @Input() insuranceCoverageDates$: any;
  @Input() insuranceCoverageDatesLoader$: any;
  @Input() actionResponse$: any;
  @Input() existingPremiums$!: Observable<PolicyPremiumCoverage[]>;
  @Input() insurancePremium$!: Observable<InsurancePremiumDetails>;
  @Input() exportButtonShow$: any;
  @Output() clientChangeEvent = new EventEmitter<any>();
  @Output() premiumsExistValidationEvent = new EventEmitter<{ clientId: number, premiums: PolicyPremiumCoverage[] }>();
  @Output() savePremiumsEvent = new EventEmitter<InsurancePremium[]>();
  @Output() loadFinancialPremiumsProcessListEvent = new EventEmitter<any>();
  @Output() loadPremiumEvent = new EventEmitter<string>();
  @Output() updatePremiumEvent = new EventEmitter<any>();
  @Output() OnbatchClaimsClickedEvent = new EventEmitter<any>();
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();
  public state!: any;
  sortColumn = 'clientFullName';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn = 'ALL';
  columnName: string = '';
  public selectedProcessClaims: any[] = [];

  columns: any = {
    ALL: 'All Columns',
    clientFullName: "Client Name",
    insuranceName: "Name on Primary Insurance Card",
    clientId: "Client ID",
    insuranceVendor: "Insurance Vendor",
    premiumAmount: "Premium Amount",
    paymentMethodCode: "Payment Method",
    planName: "Plan Name",
    insuranceType: "Insurance Type",
    policyId: "Policy Id",
    groupId: "Group ID",
    paymentId: "Payment ID",
    paymentStatus: "Payment Status"
  };
  dropDowncolumns: any = [
    { columnCode: 'ALL', columnDesc: 'All Columns' },
    {
      columnCode: 'clientFullName',
      columnDesc: 'Client Name',
    },
    {
      columnCode: 'clientId',
      columnDesc: 'Client ID',
    },
    {
      columnCode: 'insuranceVendor',
      columnDesc: 'Insurance Vendor',
    },
    {
      columnCode: 'policyId',
      columnDesc: 'Policy ID',
    },


  ];

  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public gridFilter: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  isRemovePremiumGridOptionClosed = false;
  gridFinancialPremiumsProcessDataSubject = new Subject<any>();
  gridFinancialPremiumsProcessData$ =
    this.gridFinancialPremiumsProcessDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  vendorId: any;
  clientId: any;
  clientName: any = "";
  directRemoveClicked: any = false;
  medicalPremiumListSubject = new Subject<any>();
  medicalPremiumList$ = this.medicalPremiumListSubject.asObservable();
  sendReportCount: number = 0;
  isAllSelected = false;
  processGridDataList: any = [];
  selectAll: boolean = false;
  unCheckedProcessRequest: any = [];
  checkedAndUncheckedRecordsFromSelectAll: any = [];
  financialPremiumsProcessGridLists: any = [];
  currentPageRecords: any = [];
  selectedSendReportList!: any;
  isSendReportClicked = false;
  isPageCountChanged: boolean = false;
  premiumId!: string;
  isPageChanged: boolean = false;
  selectedDeletePremiumsList!: any;
  showExportLoader = false;
  public premiumsProcessMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'SEND REPORTS',
      icon: 'mail',
      click: (data: any): void => {
        if (!this.isSendReportOpened) {
          this.isSendReportOpened = true;
          this.selectAll = false;
          this.isRemoveBatchClosed = false;
          this.recordCountWhenSelectallClicked = this.totalGridRecordsCount;
          this.onBatchPremiumsGridSelectedClicked();
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'BATCH PREMIUMS',
      icon: 'check',
      click: (data: any): void => {
        if (!this.isBatchPremiumsClicked) {
          this.isBatchPremiumsClicked = true;
          this.onSplitBatchPremiumsClicked();
        }
      },
    },

    {
      buttonType: 'btn-h-danger',
      text: 'REMOVE PREMIUMS',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isRemoveBatchClosed) {
          this.isRemoveBatchClosed = true;
          this.directRemoveClicked = false;
          this.isSendReportOpened = false;
          this.selectAll = false;
          this.onBatchPremiumsGridSelectedClicked();
        }
      },
    },
  ];
  public processGridActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Premium',
      icon: 'edit',
      click: (data: any): void => {
        if (!this.isEditBatchClosed) {
          this.isEditBatchClosed = true;
          this.onEditPremiumsClick(data?.insurancePremiumId, data?.vendorId, data?.clientId, data.clientFullName, data?.paymentRequestId);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Remove Premium',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isRemovePremiumGridOptionClosed) {
          this.isRemovePremiumGridOptionClosed = true;
          this.directRemoveClicked = true;
          this.onSinglePremiumRemove(data);
          this.onRemovePremiumsOpenClicked(this.removePremiumsConfirmationDialogTemplate);
        }
      },
    },
  ];

  public selectableSettings: SelectableSettings;
  public checkboxOnly = true;
  public mode: SelectableMode = 'multiple';
  public drag = false;
  actionResponseSubscription = new Subscription;
  paymentRequestId: any;
  recordCountWhenSelectallClicked: number = 0;
  totalGridRecordsCount: number = 0;
  @Input() paymentMethodCode$: any
  @Input() paymentStatusCode$: any
  @Input() healthInsuranceTypeLov$: any
  @Input() premiumProcessListProfilePhoto$!: any;
  paymentMethodFilter = '';
  paymentTypeFilter = '';
  paymentStatusFilter = '';
  healthInsuranceValue = '';
  /** Constructor **/
  constructor(
    private financialPremiumsFacade: FinancialPremiumsFacade,
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private readonly route: Router,
    private readonly ref: ChangeDetectorRef,
  ) {

    this.selectableSettings = {
      checkboxOnly: this.checkboxOnly,
      mode: this.mode,
      drag: this.drag,
    };
  }

  ngOnInit(): void {
    this.premiumGridlistDataHandle();
    this.addActionRespSubscription();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromActionResponse();
  }

  onProviderNameClick(event: any) {
    this.onProviderNameClickEvent.emit(event);
  }

  premiumGridlistDataHandle() {
    this.financialPremiumsProcessGridLists$.subscribe((data: any) => {
      this.gridDataResult = data;
      this.gridFinancialPremiumsProcessDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.gridLoaderSubject.next(false);
      }
      this.financialPremiumsProcessGridLists = this.gridDataResult?.data;
      if(this.isSendReportOpened === false){
        this.recordCountWhenSelectallClicked = 0;
        this.totalGridRecordsCount = 0;
      }
      if(this.recordCountWhenSelectallClicked == 0){
        this.recordCountWhenSelectallClicked = this.gridDataResult?.acceptsReportsQueryCount;
        this.totalGridRecordsCount = this.gridDataResult?.acceptsReportsQueryCount;
      }
      if (!this.selectAll) {
        this.financialPremiumsProcessGridLists.forEach((item1: any) => {
          const matchingGridItem = this.checkedAndUncheckedRecordsFromSelectAll?.find((item2: any) => item2.paymentRequestId === item1.paymentRequestId && item2.selected);
          if (matchingGridItem) {
            item1.selected = true;
          } else {
            item1.selected = false;
          }
        });
      }
      this.currentPageRecords = this.financialPremiumsProcessGridLists;
      //If the user is selecting the individual check boxes and changing the page count
      this.handlePageCountSelectionChange();
      //If the user click on select all header and either changing the page number or page count
      this.pageNumberAndCountChangedInSelectAll();
    });
    this.ref.detectChanges();
  }



  pageNumberAndCountChangedInSelectAll() {
    //If selecte all header checked and either the page count or the page number changed
    if (this.selectAll && (this.isPageChanged || this.isPageCountChanged)) {
      this.selectedSendReportList = [];
      this.selectedSendReportList.SelectedSendReports = [];
      if (this.isSendReportOpened) {
        for (const item of this.financialPremiumsProcessGridLists) {
          // Check if the item is in the second list.
          const isItemInSecondList = this.unCheckedProcessRequest.find((item2: any) => item2.paymentRequestId === item.paymentRequestId);
          // If the item is in the second list, mark it as selected true.
          if (isItemInSecondList) {
            item.selected = false;
          } else {
            item.selected = true;
          }
        }
      }
      this.onCloseRemovePremiums();
      this.onSendReportClicked()
    }
  }
  onSendReportClicked() {
    if (this.isSendReportOpened) {
      if (this.unCheckedProcessRequest?.length > 0) {
        this.sendReportCount = this.totalGridRecordsCount - this.unCheckedProcessRequest?.length;
        this.recordCountWhenSelectallClicked = this.sendReportCount;
      } else {
        this.sendReportCount = this.recordCountWhenSelectallClicked;
      }
    } else {
      this.getSelectedReportCount(this.selectedSendReportList?.SelectedSendReports?.filter((item: any) => item.selected));
    }
  }

  onCloseRemovePremiums() {
    if (this.isRemoveBatchClosed) {
      this.selectedSendReportList.SelectedSendReports = this.financialPremiumsProcessGridLists;
      if (this.unCheckedProcessRequest?.length == 0 && this.isPageChanged) {
        this.markAsUnChecked(this.selectedSendReportList?.SelectedSendReports);
        this.markAsUnChecked(this.financialPremiumsProcessGridLists);
        this.markAsUnChecked(this.checkedAndUncheckedRecordsFromSelectAll);
        this.sendReportCount = 0;
        this.totalGridRecordsCount = 0;
        this.selectAll = false;
      } else {
        for (const item of this.checkedAndUncheckedRecordsFromSelectAll) {
          // Check if the item is in the second list.
          const isItemInSecondList = this.financialPremiumsProcessGridLists.find((item2: any) => item2.paymentRequestId === item.paymentRequestId);
          // If the item is in the second list, mark it as selected true.
          if (isItemInSecondList) {
            item.selected = true;
          } else {
            item.selected = false;
          }
        }
        this.selectAll = false;
      }
    }
  }

  handlePageCountSelectionChange() {
    if (!this.selectAll && this.isPageCountChanged) {
      if (this.isRemoveBatchClosed) {
        const idsToKeep: number[] = this.financialPremiumsProcessGridLists.map((item: any) => item.selected && item.paymentRequestId);
        const idsNotToKeep = this.financialPremiumsProcessGridLists.filter((item2: any) => !this.checkedAndUncheckedRecordsFromSelectAll.some((item1: any) => item1.paymentRequestId === item2.paymentRequestId && item2.selected));
        this.financialPremiumsProcessGridLists.forEach((item2: any) => {
          if (idsToKeep.includes(item2.paymentRequestId)) {
            // Mark records in list2 as selected: true if in list1
            item2.selected = true;
          } else {
            item2.selected = false;
          }
        });
        this.markAsUnChecked(idsNotToKeep);
      }
      this.getSelectedReportCount(this.checkedAndUncheckedRecordsFromSelectAll?.filter((item: any) => item.selected));
    }

    if (!this.selectAll && this.isPageChanged) {
      if (this.isRemoveBatchClosed) {
        this.selectAllAndPageChange();
      }
      this.getSelectedReportCount(this.checkedAndUncheckedRecordsFromSelectAll?.filter((item: any) => item.selected));
    }
  }

  selectAllAndPageChange() {
    const idsToKeep: number[] = this.financialPremiumsProcessGridLists.map((item: any) => item.selected && item.paymentRequestId);
    this.financialPremiumsProcessGridLists.forEach((item2: any) => {
      if (idsToKeep.includes(item2.paymentRequestId)) {
        // Mark records in list2 as selected: true if in list1
        item2.selected = true;
      } else {
        item2.selected = false;
      }
    });
  }

  onSinglePremiumRemove(selection: any) {
    this.selectedKeysChange(selection);
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,

    };
    this.loadFinancialPremiumsProcessListGrid();
  }

  private loadFinancialPremiumsProcessListGrid(): void {
    this.loadPremiumsProcess(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      this.filter
    );
  }
  loadPremiumsProcess(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string,
    filter: any
  ) {
    this.gridLoaderSubject.next(true);
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      filter: this.filter ? this.filter : null,
    };
    this.loadFinancialPremiumsProcessListEvent.emit(gridDataRefinerValue);
  }
  filterChange(filter: CompositeFilterDescriptor): void {
    this.gridFilter = filter;
  }

  onChange(data: any) {
    this.defaultGridState();
    let operator = 'contains';

    if (
      this.selectedColumn === 'clientId' ||
      this.selectedColumn === 'premiumAmount' ||
      this.selectedColumn === 'policyId' ||
      this.selectedColumn === 'groupId' ||
      this.selectedColumn === 'paymentId'
    ) {
      operator = 'eq';
    }

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'clientFullName',
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

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  dataStateChange(stateData: any): void {
    this.isPageChanged = true;
    this.isPageCountChanged = false;
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumn = this.columns[stateData.sort[0]?.field];

    if (stateData.filter?.filters.length > 0) {
      let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.filter = stateFilter.value;
      this.isFiltered = true;
      const filterList = [];
      for (const filter of stateData.filter.filters) {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.isFiltered = true;
      this.filteredBy = filterList.toString();
    }
    else {
      this.filter = '';
      this.isFiltered = false;
    }
    this.state = stateData;
    this.setGridState(stateData);
    this.loadFinancialPremiumsProcessListGrid();
    if (this.isRemoveBatchClosed) {
      this.premiumGridlistDataHandle();
    }
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
      this.isFiltered = false;
    }
  }
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.isPageCountChanged = true;
    this.isPageChanged = false;
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadFinancialPremiumsProcessListGrid();
    if (this.isRemoveBatchClosed) {
      this.premiumGridlistDataHandle();
    }
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


  public onBatchPremiumsClicked(template: TemplateRef<unknown>): void {
    this.batchConfirmPremiumsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onModalBatchPremiumsModalClose() {
    this.batchConfirmPremiumsDialog.close();
  }

  public onRemovePremiumsOpenClicked(template: TemplateRef<unknown>): void {
    this.removePremiumsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onModalRemovePremiumsModalClose(result: any) {
    if (result) {
      this.isRemovePremiumGridOptionClosed = false;
      this.removePremiumsDialog.close();
    }
  }

  onRemovingPremiums(result: boolean) {
    if (result) {
      this.state = {
        skip: 0,
        take: this.pageSizes[0]?.value,
        sort: this.sort,
      };
      this.loadFinancialPremiumsProcessListGrid();
      this.onBatchPremiumsGridSelectedCancelClicked();
    }
  }

  public onSendReportOpenClicked(template: TemplateRef<unknown>): void {
    this.sendReportDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onClickOpenEditPremiumsFromModal(template: TemplateRef<unknown>): void {
    this.editPremiumsFormDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-96full add_premiums_modal',
    });
  }
  modalCloseEditPremiumsFormModal(result: any) {
    if (result && this.editPremiumsFormDialog) {
      this.isEditBatchClosed = false;
      this.editPremiumsFormDialog.close();
    }
  }

  onClickOpenAddPremiumsFromModal(): void {
    if (!this.isAddPremiumClosed) {
      this.isAddPremiumClosed = true;
      this.addPremiumsFormDialog = this.dialogService.open({
        content: this.addPremiumsDialogTemplate,
        cssClass: 'app-c-modal app-c-modal-lg-100 app-c-modal-np',
      });
    }
  }
  modalCloseAddPremiumsFormModal(result: any) {
    if (result && this.addPremiumsFormDialog) {
      this.isAddPremiumClosed = false;
      this.addPremiumsFormDialog.close();
    }
  }
  onSplitBatchPremiumsClicked() {
    this.isBatchPremiumsClicked = true;
    this.onBatchPremiumsGridSelectedClicked();
  }
  onBatchPremiumsGridSelectedClicked() {
    this.isProcessGridExpand = false;
  }

  onBatchPremiumsGridSelectedCancelClicked() {
    this.isProcessGridExpand = true;
    this.isRemoveBatchClosed = false;
    this.isAddPremiumClosed = false;
    this.isBatchPremiumsClicked = false;
    this.selectedProcessClaims = [];
    this.isSendReportOpened = false;
    this.markAsUnChecked(this.selectedSendReportList?.SelectedSendReports);
    this.markAsUnChecked(this.financialPremiumsProcessGridLists);
    this.unCheckedProcessRequest = [];
    this.checkedAndUncheckedRecordsFromSelectAll = [];
    this.selectedSendReportList.SelectedSendReports = [];
    this.selectedSendReportList.UnSelectedSendReports = [];
    this.getSelectedReportCount(this.selectedSendReportList?.SelectedSendReports);
    this.selectAll = false;
    this.recordCountWhenSelectallClicked = 0;
    this.sendReportCount = 0;
    this.totalGridRecordsCount = 0;
    this.loadFinancialPremiumsProcessListGrid();
  }

  clientRecentPremiumsModalClicked(template: TemplateRef<unknown>, data: any): void {
    this.addClientRecentPremiumsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal  app-c-modal-bottom-up-modal',
      animation: {
        direction: 'up',
        type: 'slide',
        duration: 200
      }
    });
  }

  gridlistDataHandle() {
    this.medicalPremiumList$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
    });

  }
  closeRecentPremiumsModal(result: any) {
    if (result) {
      this.addClientRecentPremiumsDialog.close();
    }
  }

  onSendReportCloseClicked(result: any) {
    if (result) {
      this.sendReportDialog.close();
    }
  }

  getSelectedReportCount(selectedSendReportList: []) {
    this.sendReportCount = selectedSendReportList.length;
    this.cdr.detectChanges();
  }

  selectionChange(dataItem: any, selected: boolean) {
    if (!selected) {
      this.unCheckedProcessRequest.push({ 'paymentRequestId': dataItem.paymentRequestId, 'vendorAddressId': dataItem.vendorAddressId, 'selected': true });
      this.currentPageRecords?.forEach((element: any) => {
        if (element.paymentRequestId === dataItem.paymentRequestId) {
          element.selected = false;
        }
      });
      this.onSendReportRecordUncheckedOnSelectionChange(dataItem);
      this.onRemovePremiumsRecordUncheckedOnSelectionChange(dataItem);
    }
    else {
      this.unCheckedProcessRequest = this.unCheckedProcessRequest.filter((item: any) => item.paymentRequestId !== dataItem.paymentRequestId);
      this.currentPageRecords?.forEach((element: any) => {
        if (element.paymentRequestId === dataItem.paymentRequestId) {
          element.selected = true;
        }
      });
      this.onSendReportRecordUncheckedOnSelectAll(dataItem);
      this.onRemovePremiumsRecordUncheckedOnSelectAll(dataItem);
    }
    this.selectedSendReportList = {
      'selectAll': this.selectAll, 'UnSelectedSendReports': this.unCheckedProcessRequest,
      'SelectedSendReports': this.checkedAndUncheckedRecordsFromSelectAll, 'batchId': null, 'currentSendReportsGridFilter': JSON.stringify(this.state?.filter?.filters ?? [])
    }
    this.onSelectAllAndSendReportsOpened(selected);
    this.ref.detectChanges();
  }

  onSelectAllAndSendReportsOpened(selected: boolean) {
    if (this.selectAll && this.isSendReportOpened) {
      if (this.unCheckedProcessRequest?.length > 0) {
        this.sendReportCount = this.totalGridRecordsCount - this.unCheckedProcessRequest?.length;
        this.recordCountWhenSelectallClicked = this.sendReportCount;
      } else {
        this.recordCountWhenSelectallClicked = selected ? this.recordCountWhenSelectallClicked + 1 : this.recordCountWhenSelectallClicked - 1;
        this.sendReportCount = this.recordCountWhenSelectallClicked;
      }
    } else {
      this.sendReportCount = this.selectedSendReportList?.SelectedSendReports.filter((obj: any, index: any, self: any) =>
      index === self.findIndex((t: any) => ( t.vendorId === obj.vendorId ))).length;
      //this.sendReportCount = this.selectedSendReportList?.SelectedSendReports?.filter((item: any) => item.selected).length;
    }
  }

  onRemovePremiumsRecordUncheckedOnSelectAll(dataItem: any) {
    if (this.isRemoveBatchClosed) {
      this.checkedAndUncheckedRecordsFromSelectAll?.filter((element: any) => {
        if (element.paymentRequestId === dataItem.paymentRequestId) {
          element.selected = true;
        }
      });
      let exist = this.checkedAndUncheckedRecordsFromSelectAll?.filter((x: any) => x.paymentRequestId === dataItem.paymentRequestId);
      if (exist == 0) {
        this.checkedAndUncheckedRecordsFromSelectAll.push(
          { 'paymentRequestId': dataItem.paymentRequestId,
            'vendorAddressId': dataItem.vendorAddressId,
            'selected': true,
            'vendorId': dataItem.vendorId,
            'clientId': dataItem.clientId });
      }
    }
  }

  onSendReportRecordUncheckedOnSelectAll(dataItem: any) {
    if (this.isSendReportOpened) {
      let exist = this.checkedAndUncheckedRecordsFromSelectAll?.filter((x: any) => x.paymentRequestId === dataItem.paymentRequestId).length;
      if (exist === 0) {
        this.checkedAndUncheckedRecordsFromSelectAll.push(
          { 'paymentRequestId': dataItem.paymentRequestId,
            'vendorAddressId': dataItem.vendorAddressId,
            'selected': true,
            'vendorId': dataItem.vendorId,
            'clientId': dataItem.clientId,
            'vendorName': dataItem.insuranceVendor });
      } else {
        const recordIndex = this.checkedAndUncheckedRecordsFromSelectAll.findIndex((element: any) => element.paymentRequestId === dataItem.paymentRequestId);
        if (recordIndex !== -1) {
          this.checkedAndUncheckedRecordsFromSelectAll.splice(recordIndex, 1); // Remove the record at the found index
        }
      }
    }
  }

  onRemovePremiumsRecordUncheckedOnSelectionChange(dataItem: any) {
    if (this.isRemoveBatchClosed) {
      this.checkedAndUncheckedRecordsFromSelectAll?.forEach((element: any) => {
        if (element.paymentRequestId === dataItem.paymentRequestId) {
          element.selected = false;
        }
      });
    }
  }

  onSendReportRecordUncheckedOnSelectionChange(dataItem: any) {
    if (this.isSendReportOpened) {
      let exist = this.checkedAndUncheckedRecordsFromSelectAll?.filter((x: any) => x.paymentRequestId === dataItem.paymentRequestId).length;
      if (exist === 0) {
        this.checkedAndUncheckedRecordsFromSelectAll.push(
          { 'paymentRequestId': dataItem.paymentRequestId,
            'vendorAddressId': dataItem.vendorAddressId,
            'selected': true,
            'vendorId': dataItem.vendorId,
            'clientId': dataItem.clientId,
            'vendorName': dataItem.insuranceVendor });
      } else {
        const recordIndex = this.checkedAndUncheckedRecordsFromSelectAll.findIndex((element: any) => element.paymentRequestId === dataItem.paymentRequestId);
        if (recordIndex !== -1) {
          this.checkedAndUncheckedRecordsFromSelectAll.splice(recordIndex, 1); // Remove the record at the found index
        }
      }
    }
  }

  selectionAllChange() {
    this.unCheckedProcessRequest = [];
    this.checkedAndUncheckedRecordsFromSelectAll = [];
    if (this.selectAll) {
      this.markAsChecked(this.financialPremiumsProcessGridLists);
    }
    else {
      this.markAsUnChecked(this.financialPremiumsProcessGridLists);
    }
    this.selectedSendReportList = {
      'selectAll': this.selectAll, 'UnSelectedSendReports': this.unCheckedProcessRequest,
      'SelectedSendReports': this.checkedAndUncheckedRecordsFromSelectAll, 'batchId': null, 'currentSendReportsGridFilter': JSON.stringify(this.state?.filter?.filters ?? [])
    }
    if (this.selectAll && this.isSendReportOpened) {
      if (this.unCheckedProcessRequest?.length > 0) {
        this.sendReportCount = this.totalGridRecordsCount - this.unCheckedProcessRequest?.length;
        this.recordCountWhenSelectallClicked = this.sendReportCount;
      } else {
        this.sendReportCount = this.totalGridRecordsCount;
      }
    } else {
      this.getSelectedReportCount(this.selectedSendReportList?.SelectedSendReports);
    }
    this.ref.detectChanges();
  }

  markAsChecked(data: any) {
    data.forEach((element: any) => {
      if (this.selectAll) {
        element.selected = true;
      }
      else {
        element.selected = false;
      }
      this.checkedAndUncheckedRecordsFromSelectAll.push(element);
      if (this.unCheckedProcessRequest.length > 0 || this.checkedAndUncheckedRecordsFromSelectAll.length > 0) {
        let itemMarkedAsUnChecked = this.unCheckedProcessRequest.find((x: any) => x.paymentRequestId === element.paymentRequestId);
        //Unchecked records from select all result
        if (itemMarkedAsUnChecked !== null && itemMarkedAsUnChecked !== undefined) {
          element.selected = false;
        }
        let itemMarkedAsChecked = this.checkedAndUncheckedRecordsFromSelectAll.find((x: any) => x.paymentRequestId === element.paymentRequestId);
        //Checked records after unselecting a few unselected records
        if (itemMarkedAsChecked !== null && itemMarkedAsChecked !== undefined) {
          element.selected = true;
        }
      }
    });
  }

  markAsUnChecked(data: any) {
    data.forEach((element: any) => {
      element.selected = false;
    });
    if (!this.selectAll && this.isSendReportOpened) {
      this.sendReportCount = 0;
      this.selectAll = false;
    }
  }

  loadInsurancePlans(client: any) {
    this.clientChangeEvent.emit(client);
  }

  savePremiums(premiums: InsurancePremium[]) {
    this.savePremiumsEvent.emit(premiums);
  }

  premiumsExistValidation(data: { clientId: number, premiums: PolicyPremiumCoverage[] }) {
    this.premiumsExistValidationEvent.emit(data);
  }

  clientRecentClaimsModalClicked(
    template: TemplateRef<unknown>,
    dataItem: any
  ): void {
    this.addClientRecentPremiumsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal  app-c-modal-bottom-up-modal',
      animation: {
        direction: 'up',
        type: 'slide',
        duration: 200,
      },
    });
    this.vendorId = dataItem.vendorId;
    this.clientId = dataItem.clientId;
    this.clientName = dataItem.clientFullName;
    this.paymentRequestId = dataItem.paymentRequestId
  }

  onClientClicked(clientId: any) {
    this.route.navigate([`/case-management/cases/case360/${clientId}`]);
    this.closeRecentPremiumsModal(true);
  }

  onEditPremiumsClick(premiumId: string, vendorId: any, clientId: any, clientName: any, paymentRequestId: any) {
    this.vendorId = vendorId;
    this.clientId = clientId;
    this.clientName = clientName;
    this.premiumId = premiumId;
    this.paymentRequestId = paymentRequestId;
    this.onClickOpenEditPremiumsFromModal(this.editPremiumsDialogTemplate);
  }

  selectedKeysChange(selection: any) {
    this.selectedProcessClaims = selection;
    this.selectedSendReportList = selection;
    this.checkedAndUncheckedRecordsFromSelectAll = [];
    this.checkedAndUncheckedRecordsFromSelectAll.push(
      { 'paymentRequestId': selection.paymentRequestId,
            'vendorAddressId': selection.vendorAddressId,
            'selected': true,
            'vendorId': selection.vendorId,
            'clientId': selection.clientId,
            'vendorName': selection.insuranceVendor });
    this.selectedSendReportList = { 'SelectedSendReports': this.checkedAndUncheckedRecordsFromSelectAll };
    this.getSelectedReportCount(this.selectedSendReportList?.SelectedSendReports);
  }

  OnbatchClaimsClicked() {

    const input: BatchPremium = {
      managerId: '',
      PaymentRequestIds: this.selectedProcessClaims,
    };
    this.batchingPremium$.subscribe((_: any) => {
      this.onModalBatchPremiumsModalClose()
      this.loadFinancialPremiumsProcessListGrid()
      this.onBatchPremiumsGridSelectedCancelClicked()
    })
    this.OnbatchClaimsClickedEvent.emit(input)
  }

  loadPremium(premiumId: string) {
    this.loadPremiumEvent.emit(premiumId);
  }

  updatePremium(data: any) {
    this.updatePremiumEvent.emit(data);
  }

  private addActionRespSubscription() {
    this.actionResponseSubscription = this.actionResponse$.subscribe((resp: boolean) => {
      if (resp) {
        this.modalCloseAddPremiumsFormModal(true);
        this.modalCloseEditPremiumsFormModal(true);
        this.loadFinancialPremiumsProcessListGrid();
      }
    });
  }

  private unsubscribeFromActionResponse() {
    if (this.actionResponseSubscription) {
      this.actionResponseSubscription.unsubscribe();
    }
  }

  onClickedExport() {
    this.showExportLoader = true;
    this.exportGridDataEvent.emit();
    this.exportButtonShow$.subscribe((response: any) => {
      if (response) {
        this.showExportLoader = false;
        this.cdr.detectChanges();
      }
    });
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    if (field === 'paymentMethod') {
      this.paymentMethodFilter = value;
    } else if (field === 'paymentTypeCode') {
      this.paymentTypeFilter = value;
    } else if (field === 'paymentStatus') {
      this.paymentStatusFilter = value;
    } else if (field === 'insuranceType') {
      this.healthInsuranceValue = value;
    }
    filterService.filter({
      filters: [
        {
          field: field,
          operator: 'eq',
          value: value,
        },
      ],
      logic: 'or',
    });
    this.gridLoaderSubject.next(false);
  }
  searchColumnChangeHandler(data: any) {
    this.searchValue = '';
    this.onChange(data)
  }
  SendInsuranceVendorReports(result: any){
    if(result){
      this.financialPremiumsFacade.SendInsuranceVendorReports(this.selectedSendReportList?.SelectedSendReports);
    }
  }
}
